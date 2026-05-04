/**
 * sistemaPropostas.js
 * Rota do backend da Winove para venda do Sistema de Propostas Comerciais.
 *
 * POST /api/sistema-proposta/checkout   — cria link InfinitePay e salva venda pendente
 * POST /api/sistema-proposta/webhook    — webhook InfinitePay confirma pagamento →
 *                                         cria usuário + envia e-mail de acesso
 */

import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';

const router = express.Router();

/* ── Planos ─────────────────────────────────────────────────────── */
const PLANS = {
  monthly: {
    name: 'Mensal',
    priceTotal: 39900,    // R$ 399/mês — cobrado mensalmente
    label: 'R$ 399/mês',
    billingLabel: 'Mensal',
  },
  quarterly: {
    name: 'Trimestral',
    priceTotal: 89700,    // R$ 897/trimestre (R$ 299/mês — 10% off)
    label: 'R$ 299/mês',
    billingLabel: 'Trimestral',
  },
  annual: {
    name: 'Anual',
    priceTotal: 298800,   // R$ 2.988/ano (R$ 249/mês — 25% off)
    label: 'R$ 249/mês',
    billingLabel: 'Anual',
  },
};

const IP_URL    = 'https://api.infinitepay.io/invoices/public/checkout/links';
const IP_HANDLE = process.env.IP_HANDLE || 'winove-online';
const BASE_URL  = process.env.APP_BASE_URL || 'https://winove.com.br';
const ADMIN_EMAIL = process.env.CONTACT_EMAIL || 'fernando@winove.com.br';

/* ── Garante tabelas e colunas ──────────────────────────────────── */
async function ensureTable() {
  if (!pool) return;

  // Tabela de vendas
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS sistema_proposta_vendas (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      order_id      VARCHAR(64) UNIQUE NOT NULL,
      plan          VARCHAR(50) NOT NULL,
      billing       ENUM('monthly','quarterly','annual','yearly') DEFAULT 'monthly',
      amount_cents  INT NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_company VARCHAR(255) DEFAULT '',
      customer_phone VARCHAR(50) DEFAULT '',
      payment_link  VARCHAR(1000) DEFAULT '',
      payment_slug  VARCHAR(255) DEFAULT '',
      status        ENUM('pending','paid','cancelled') DEFAULT 'pending',
      paid_at       TIMESTAMP NULL,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  // Garante que a tabela users existe (cria se não existir)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(255) NOT NULL,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          ENUM('admin','user') DEFAULT 'admin',
      active        TINYINT(1) DEFAULT 1,
      is_trial      TINYINT(1) DEFAULT 0,
      trial_expires_at TIMESTAMP NULL,
      plan          VARCHAR(50) DEFAULT '',
      payment_link  VARCHAR(1000) DEFAULT '',
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  // Garante colunas extras caso a tabela já exista sem elas (sem AFTER para evitar falha)
  const alterStmts = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS role             ENUM('admin','user') DEFAULT 'admin'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS active           TINYINT(1)    DEFAULT 1`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_trial         TINYINT(1)    DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMP     NULL`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS plan             VARCHAR(50)   DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_link     VARCHAR(1000) DEFAULT ''`,
  ];
  for (const stmt of alterStmts) {
    try { await pool.execute(stmt); } catch { /* coluna já existe — ok */ }
  }
}
ensureTable().catch(e => console.warn('[SistemaPropostas] ensureTable:', e.message));

/* ── GET /api/sistema-proposta/debug (temporário) ───────────────── */
router.get('/api/sistema-proposta/debug', async (req, res) => {
  // quick transporter test (sem enviar email)
  let transporterStatus = null;
  try {
    const t = makeTransporter();
    await t.verify();
    transporterStatus = 'ok';
  } catch (e) {
    transporterStatus = e.message;
  }

  const result = { pool: !!pool, tables: {}, env: {} };
  result.env = {
    IP_HANDLE: process.env.IP_HANDLE || '(não definido)',
    COMERCIAL_URL: process.env.COMERCIAL_URL || '(não definido)',
    MAIL_HOST: process.env.MAIL_HOST || '(não definido)',
    MAIL_PORT: process.env.MAIL_PORT || '(não definido)',
    MAIL_USER: process.env.MAIL_USER || '(não definido)',
  };
  result.mailer = transporterStatus;
  if (pool) {
    try {
      await pool.execute('SELECT 1 FROM users LIMIT 1');
      result.tables.users = '✅ existe';
    } catch (e) { result.tables.users = '❌ ' + e.message; }
    try {
      await pool.execute('SELECT 1 FROM sistema_proposta_vendas LIMIT 1');
      result.tables.sistema_proposta_vendas = '✅ existe';
    } catch (e) { result.tables.sistema_proposta_vendas = '❌ ' + e.message; }
    try {
      const [cols] = await pool.execute(`SHOW COLUMNS FROM users LIKE 'payment_link'`);
      result.tables.users_payment_link_col = cols.length ? '✅ existe' : '❌ não existe';
    } catch (e) { result.tables.users_payment_link_col = '❌ ' + e.message; }
  }
  res.json(result);
});

/* ── Mailer ─────────────────────────────────────────────────────── */
function makeTransporter() {
  // Porta 587 bloqueada no servidor — usar 465 (SSL) obrigatório
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
  });
}

async function sendEmail(opts) {
  const t = makeTransporter();
  return t.sendMail({
    from: process.env.MAIL_FROM || `Winove <${process.env.MAIL_USER}>`,
    ...opts,
  });
}

/* ── HTML do e-mail de boas-vindas ──────────────────────────────── */
function welcomeEmailHtml({ name, email, password, plan, loginUrl, paymentLink, payDue }) {
  const payBlock = paymentLink ? `
    <div style="background:#fffbeb;border:2px solid #f59e0b;border-radius:10px;padding:20px;margin:24px 0">
      <p style="margin:0 0 12px;font-size:14px;font-weight:bold;color:#92400e">
        ⏰ Pague em até 7 dias para manter o acesso
      </p>
      <p style="margin:0 0 16px;font-size:13px;color:#78350f">
        Seu acesso está ativo agora. A cobrança do <strong>Plano ${plan}</strong> vence em <strong>${payDue || '7 dias'}</strong>.
        Se não pagar até lá, a conta será suspensa automaticamente.
      </p>
      <div style="text-align:center">
        <a href="${paymentLink}" style="background:#f59e0b;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
          Pagar agora →
        </a>
      </div>
    </div>` : '';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc">
  <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 4px rgba(0,0,0,.07)">
    <div style="border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:24px">
      <h2 style="margin:0;color:#1e40af;font-size:22px">🎉 Acesso liberado — Sistema de Propostas!</h2>
    </div>
    <p style="font-size:15px">Olá, <strong>${name}</strong>!</p>
    <p style="font-size:14px;line-height:1.7;color:#334155">
      Seu acesso ao <strong>Plano ${plan}</strong> está ativo.<br>
      Use os dados abaixo para fazer seu primeiro login:
    </p>
    <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:24px 0;font-family:monospace">
      <div style="margin-bottom:8px"><strong>URL:</strong> <a href="${loginUrl}" style="color:#2563eb">${loginUrl}</a></div>
      <div style="margin-bottom:8px"><strong>E-mail:</strong> ${email}</div>
      <div><strong>Senha:</strong> ${password}</div>
    </div>
    ${payBlock}
    <p style="font-size:13px;color:#64748b">
      ⚠️ Altere sua senha assim que fizer o primeiro login em <strong>Configurações → Senha</strong>.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${loginUrl}" style="background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
        Acessar o sistema →
      </a>
    </div>
    <p style="font-size:13px;color:#94a3b8">
      Dúvidas? Fale conosco pelo WhatsApp ou responda este e-mail.<br>
      Equipe Winove
    </p>
  </div>
</body></html>`;
}

/* ── HTML do e-mail de lembrete de pagamento ─────────────────── */
function reminderEmailHtml({ name, paymentLink, daysLeft, plan }) {
  const urgency = daysLeft <= 1
    ? { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', icon: '🔴', label: daysLeft <= 0 ? 'Último dia!' : `${daysLeft} dia restante` }
    : { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏰', label: `${daysLeft} dias restantes` };

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc">
  <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 4px rgba(0,0,0,.07)">
    <div style="background:${urgency.bg};border:2px solid ${urgency.border};border-radius:10px;padding:20px;margin-bottom:24px">
      <h2 style="margin:0 0 8px;color:${urgency.color};font-size:20px">${urgency.icon} Lembrete de pagamento — ${urgency.label}</h2>
      <p style="margin:0;font-size:14px;color:${urgency.color}">
        Seu acesso ao <strong>Plano ${plan}</strong> será <strong>suspenso automaticamente</strong> quando o prazo acabar.
      </p>
    </div>
    <p style="font-size:15px">Olá, <strong>${name}</strong>!</p>
    <p style="font-size:14px;line-height:1.7;color:#334155">
      Você está usando o Sistema de Propostas Winove. Para manter o acesso sem interrupção, complete o pagamento agora.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${paymentLink}" style="background:${urgency.color};color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
        Pagar agora →
      </a>
    </div>
    <p style="font-size:13px;color:#94a3b8">
      Dúvidas? Fale conosco no WhatsApp. Equipe Winove.
    </p>
  </div>
</body></html>`;
}

/* ── POST /api/sistema-proposta/checkout ────────────────────────── */
router.post('/api/sistema-proposta/checkout', async (req, res) => {
  try {
    const { plan, billing = 'monthly', name, email, company = '', phone = '' } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Plano inválido.' });
    }
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName  = name.trim();
    const planData   = PLANS[plan];
    const amountCents = planData.priceTotal;
    const orderId    = 'SP-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // Verifica se já tem conta
    if (pool) {
      const [existing] = await pool.execute(
        'SELECT id, is_trial, active FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      );
      if (existing.length && !existing[0].is_trial) {
        return res.status(400).json({ error: 'Este e-mail já possui uma conta ativa. Acesse pelo login.' });
      }
    }

    // Cria link InfinitePay
    const ipPayload = {
      handle: IP_HANDLE,
      items: [{
        quantity: 1,
        price: amountCents,
        description: `Sistema de Propostas — Plano ${planData.name} (${planData.billingLabel})`,
      }],
      order_nsu: orderId,
      redirect_url: `${BASE_URL}/sistema-proposta-comercial?compra=sucesso&order=${orderId}`,
      webhook_url: `${BASE_URL}/api/sistema-proposta/webhook`,
      customer: {
        name: cleanName,
        email: cleanEmail,
        ...(phone && { phone_number: '+55' + phone.replace(/\D/g, '') }),
      },
    };

    let paymentLink = '';
    let paymentSlug = '';

    try {
      const ipRes = await fetch(IP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ipPayload),
      });
      const data = await ipRes.json();
      if (ipRes.ok) {
        paymentLink = data.url || data.payment_url || data.link || data.checkout_url || '';
        paymentSlug = data.slug || data.invoice_slug || '';
      } else {
        console.warn('[SistemaPropostas] InfinitePay erro:', data);
      }
    } catch (e) {
      console.warn('[SistemaPropostas] InfinitePay fetch error:', e.message);
    }

    // Fallback: link do WhatsApp se InfinitePay falhar
    if (!paymentLink) {
      const waMsg = encodeURIComponent(
        `Olá! Quero contratar o Sistema de Propostas — Plano ${planData.name}.\nNome: ${cleanName}\nE-mail: ${cleanEmail}`
      );
      paymentLink = `https://api.whatsapp.com/send?phone=5519982403845&text=${waMsg}`;
    }

    // Gera senha temporária e cria conta imediatamente
    const tmpPassword  = crypto.randomBytes(5).toString('hex');
    const trialExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 dias
    const payDueStr    = trialExpires.toLocaleDateString('pt-BR');
    const loginUrl     = process.env.COMERCIAL_URL || 'https://comercial.winove.com.br/login';

    if (pool) {
      const hash   = await bcrypt.hash(tmpPassword, 12);

      // Upsert: cria ou atualiza conta existente (trial anterior com mesmo e-mail)
      await pool.execute(
        `INSERT INTO users (name, email, password_hash, role, active, is_trial, trial_expires_at, plan, payment_link)
         VALUES (?, ?, ?, 'admin', 1, 1, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name=VALUES(name), password_hash=VALUES(password_hash),
           active=1, is_trial=1, trial_expires_at=VALUES(trial_expires_at),
           plan=VALUES(plan), payment_link=VALUES(payment_link)`,
        [cleanName, cleanEmail, hash, trialExpires, plan, paymentLink]
      );

      // Salva venda pendente
      await pool.execute(
        `INSERT INTO sistema_proposta_vendas
           (order_id, plan, billing, amount_cents, customer_name, customer_email, customer_company, customer_phone, payment_link, payment_slug)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE payment_link=VALUES(payment_link)`,
        [orderId, plan, billing, amountCents, cleanName, cleanEmail,
         company.trim(), phone.trim(), paymentLink, paymentSlug]
      );
    }

    // E-mail com credenciais + link de pagamento
    try {
      await sendEmail({
        to: cleanEmail,
        subject: `🎉 Acesso liberado — Sistema de Propostas ${planData.name}`,
        html: welcomeEmailHtml({
          name: cleanName, email: cleanEmail,
          password: tmpPassword, plan: planData.name,
          loginUrl, paymentLink, payDue: payDueStr,
        }),
      });
    } catch (e) {
      console.warn('[SistemaPropostas] Erro ao enviar e-mail:', e.message);
    }

    // Notificação admin
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `🛒 Novo cadastro — Plano ${planData.name} — ${cleanName}`,
        html: `<p><strong>Novo cadastro (acesso liberado, aguardando pagamento):</strong></p>
        <ul>
          <li><strong>Plano:</strong> ${planData.name} (${billing})</li>
          <li><strong>Nome:</strong> ${cleanName}</li>
          <li><strong>Empresa:</strong> ${company || '—'}</li>
          <li><strong>E-mail:</strong> ${cleanEmail}</li>
          <li><strong>Telefone:</strong> ${phone || '—'}</li>
          <li><strong>Pedido:</strong> ${orderId}</li>
          <li><strong>Valor:</strong> R$ ${(amountCents / 100).toFixed(2)}</li>
          <li><strong>Vence em:</strong> ${payDueStr}</li>
        </ul>`,
      });
    } catch (e) { /* silencioso */ }

    res.json({ ok: true, orderId });
  } catch (err) {
    console.error('[SistemaPropostas] checkout error:', err);
    res.status(500).json({ error: 'Erro interno. Tente novamente.', _detail: err.message });
  }
});

/* ── POST /api/sistema-proposta/webhook ─────────────────────────── */
router.post('/api/sistema-proposta/webhook', async (req, res) => {
  try {
    res.json({ received: true });

    const body = req.body;
    const orderId = body.order_nsu || body.metadata?.order_nsu;
    const status  = (body.status || body.payment_status || '').toLowerCase();

    const isPaid = ['paid', 'approved', 'captured', 'completed', 'succeeded'].includes(status);
    if (!isPaid || !orderId || !pool) return;

    // Busca a venda
    const [rows] = await pool.execute(
      "SELECT * FROM sistema_proposta_vendas WHERE order_id = ? AND status != 'paid'",
      [orderId]
    );
    if (!rows.length) return;

    const sale = rows[0];

    // Marca como pago
    await pool.execute(
      "UPDATE sistema_proposta_vendas SET status='paid', paid_at=NOW() WHERE order_id=?",
      [orderId]
    );

    const planName = PLANS[sale.plan]?.name || sale.plan;
    const loginUrl = process.env.COMERCIAL_URL || 'https://comercial.winove.com.br/login';

    // Pagamento confirmado: ativa conta permanentemente (remove trial/payment_link)
    try {
      await pool.execute(
        `UPDATE users SET is_trial=0, active=1, trial_expires_at=NULL, payment_link='', plan=?
         WHERE email=?`,
        [sale.plan, sale.customer_email]
      );
    } catch (e) {
      console.warn('[SistemaPropostas] Erro ao ativar usuário:', e.message);
    }

    // Envia e-mail de confirmação de pagamento
    try {
      await sendEmail({
        to: sale.customer_email,
        subject: `✅ Pagamento confirmado — Sistema de Propostas ${planName}`,
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc">
  <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 4px rgba(0,0,0,.07)">
    <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:20px;margin-bottom:24px">
      <h2 style="margin:0;color:#166534;font-size:20px">✅ Pagamento confirmado!</h2>
    </div>
    <p style="font-size:15px">Olá, <strong>${sale.customer_name}</strong>!</p>
    <p style="font-size:14px;line-height:1.7;color:#334155">
      Seu pagamento do <strong>Plano ${planName}</strong> foi confirmado.
      Seu acesso está ativo permanentemente — continue usando normalmente.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${loginUrl}" style="background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
        Acessar o sistema →
      </a>
    </div>
    <p style="font-size:13px;color:#94a3b8">Equipe Winove</p>
  </div>
</body></html>`,
      });
    } catch (e) {
      console.warn('[SistemaPropostas] Erro ao enviar e-mail de confirmação:', e.message);
    }

    // Notificação para o admin
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `🎉 Pagamento confirmado — Plano ${planName} — ${sale.customer_name}`,
        html: `<p><strong>Pagamento confirmado!</strong></p>
        <ul>
          <li><strong>Plano:</strong> ${planName} (${sale.billing})</li>
          <li><strong>Cliente:</strong> ${sale.customer_name}</li>
          <li><strong>Empresa:</strong> ${sale.customer_company || '—'}</li>
          <li><strong>E-mail:</strong> ${sale.customer_email}</li>
          <li><strong>Pedido:</strong> ${orderId}</li>
          <li><strong>Valor:</strong> R$ ${(sale.amount_cents / 100).toFixed(2)}</li>
        </ul>`,
      });
    } catch (e) {
      console.warn('[SistemaPropostas] Erro ao notificar admin:', e.message);
    }
  } catch (err) {
    console.error('[SistemaPropostas] webhook error:', err);
  }
});

/* ── POST /api/sistema-proposta/trial ───────────────────────────── */
router.post('/api/sistema-proposta/trial', async (req, res) => {
  try {
    const { name, email, company = '', phone = '' } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName  = name.trim();

    // Verifica se já tem trial/conta
    if (pool) {
      const [existing] = await pool.execute(
        'SELECT id, is_trial, active FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      );
      if (existing.length) {
        const u = existing[0];
        if (!u.is_trial) {
          return res.status(400).json({ error: 'Este e-mail já possui uma conta ativa. Use a página de login.' });
        }
        // Trial já existe — reenviar credenciais
        return res.json({ ok: true, alreadyExists: true, message: 'Você já possui um trial ativo. Verifique seu e-mail.' });
      }
    }

    // Gera senha temporária
    const tmpPassword = crypto.randomBytes(5).toString('hex');
    const trialExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 dias

    // Cria usuário trial
    if (pool) {
      const hash = await bcrypt.hash(tmpPassword, 12);
      await pool.execute(
        `INSERT INTO users (name, email, password_hash, role, active, is_trial, trial_expires_at, plan)
         VALUES (?, ?, ?, 'admin', 1, 1, ?, 'trial')`,
        [cleanName, cleanEmail, hash, trialExpires]
      );

      // Salva no log de vendas como trial
      await pool.execute(
        `INSERT INTO sistema_proposta_vendas
           (order_id, plan, billing, amount_cents, customer_name, customer_email, customer_company, customer_phone, status)
         VALUES (?, 'trial', 'monthly', 0, ?, ?, ?, ?, 'paid')`,
        [`TRIAL-${Date.now()}`, cleanName, cleanEmail, company.trim(), phone.trim()]
      ).catch(() => {}); // não bloqueia se tabela não existir ainda
    }

    const loginUrl = process.env.COMERCIAL_URL || 'https://comercial.winove.com.br/login';
    const expiresStr = trialExpires.toLocaleDateString('pt-BR');

    // E-mail de boas-vindas ao usuário
    try {
      await sendEmail({
        to: cleanEmail,
        subject: '🎁 Seu trial gratuito está ativo — Sistema de Propostas',
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc">
  <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 4px rgba(0,0,0,.07)">
    <div style="border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:24px">
      <h2 style="margin:0;color:#1e40af;font-size:22px">🎁 Trial de 7 dias ativado!</h2>
    </div>
    <p style="font-size:15px">Olá, <strong>${cleanName}</strong>!</p>
    <p style="font-size:14px;line-height:1.7;color:#334155">
      Seu trial gratuito de 7 dias do <strong>Sistema de Propostas Winove</strong> está ativo.<br>
      Você tem acesso completo até <strong>${expiresStr}</strong>.
    </p>
    <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:24px 0;font-family:monospace">
      <div style="margin-bottom:8px"><strong>URL:</strong> <a href="${loginUrl}" style="color:#2563eb">${loginUrl}</a></div>
      <div style="margin-bottom:8px"><strong>E-mail:</strong> ${cleanEmail}</div>
      <div><strong>Senha:</strong> ${tmpPassword}</div>
    </div>
    <p style="font-size:13px;color:#64748b">⚠️ Altere sua senha em Configurações → Senha após o primeiro acesso.</p>
    <div style="text-align:center;margin:32px 0">
      <a href="${loginUrl}" style="background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
        Acessar agora →
      </a>
    </div>
    <div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:16px;font-size:13px;color:#713f12">
      <strong>⏰ Lembrete:</strong> Seu trial expira em 7 dias (${expiresStr}).<br>
      Para continuar sem interrupção, <a href="${process.env.APP_BASE_URL || 'https://winove.com.br'}/sistema-proposta-comercial#planos" style="color:#713f12;font-weight:600">assine um plano antes da expiração</a>.
    </div>
    <p style="font-size:13px;color:#94a3b8;margin-top:24px">
      Dúvidas? Fale conosco pelo WhatsApp.<br>Equipe Winove
    </p>
  </div>
</body></html>`,
      });
    } catch (e) {
      console.warn('[Trial] Erro ao enviar e-mail:', e.message);
    }

    // Notificação para o admin
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `🎁 Novo trial — ${cleanName} (${cleanEmail})`,
        html: `<p><strong>Novo trial iniciado:</strong></p>
        <ul>
          <li><strong>Nome:</strong> ${cleanName}</li>
          <li><strong>E-mail:</strong> ${cleanEmail}</li>
          <li><strong>Empresa:</strong> ${company || '—'}</li>
          <li><strong>Expira em:</strong> ${expiresStr}</li>
        </ul>`,
      });
    } catch (e) { /* silencioso */ }

    res.json({ ok: true, message: 'Trial criado! Verifique seu e-mail para acessar.' });
  } catch (err) {
    console.error('[Trial] Erro:', err);
    res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});


export default router;
