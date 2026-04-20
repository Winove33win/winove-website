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
import { pool } from '../db.js';

const router = express.Router();

/* ── Planos ─────────────────────────────────────────────────────── */
const PLANS = {
  start: {
    name: 'Start',
    priceMonthly: 9700,       // centavos
    priceYearly:  97000,
    label: 'R$ 97/mês',
  },
  pro: {
    name: 'Pro',
    priceMonthly: 19700,
    priceYearly:  197000,
    label: 'R$ 197/mês',
  },
  agency: {
    name: 'Agency',
    priceMonthly: 39700,
    priceYearly:  397000,
    label: 'R$ 397/mês',
  },
};

const IP_URL    = 'https://api.infinitepay.io/invoices/public/checkout/links';
const IP_HANDLE = process.env.IP_HANDLE || 'winove-online';
const BASE_URL  = process.env.APP_BASE_URL || 'https://winove.com.br';
const ADMIN_EMAIL = process.env.CONTACT_EMAIL || 'fernando@winove.com.br';

/* ── Garante tabela ─────────────────────────────────────────────── */
async function ensureTable() {
  if (!pool) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS sistema_proposta_vendas (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      order_id      VARCHAR(64) UNIQUE NOT NULL,
      plan          VARCHAR(50) NOT NULL,
      billing       ENUM('monthly','yearly') DEFAULT 'monthly',
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
}
ensureTable().catch(e => console.warn('[SistemaPropostas] ensureTable:', e.message));

/* ── Mailer ─────────────────────────────────────────────────────── */
function makeTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT) || 587,
    secure: false,
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
function welcomeEmailHtml({ name, email, password, plan, loginUrl }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc">
  <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 4px rgba(0,0,0,.07)">
    <div style="border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:24px">
      <h2 style="margin:0;color:#1e40af;font-size:22px">🎉 Bem-vindo ao Sistema de Propostas!</h2>
    </div>
    <p style="font-size:15px">Olá, <strong>${name}</strong>!</p>
    <p style="font-size:14px;line-height:1.7;color:#334155">
      Seu pagamento foi confirmado e seu acesso ao <strong>Plano ${plan}</strong> já está ativo!<br>
      Use os dados abaixo para fazer seu primeiro login:
    </p>
    <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:24px 0;font-family:monospace">
      <div style="margin-bottom:8px"><strong>URL:</strong> <a href="${loginUrl}" style="color:#2563eb">${loginUrl}</a></div>
      <div style="margin-bottom:8px"><strong>E-mail:</strong> ${email}</div>
      <div><strong>Senha:</strong> ${password}</div>
    </div>
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

    const planData = PLANS[plan];
    const amountCents = billing === 'yearly' ? planData.priceYearly : planData.priceMonthly;
    const orderId = 'SP-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // Cria link InfinitePay
    const payload = {
      handle: IP_HANDLE,
      items: [{
        quantity: 1,
        price: amountCents,
        description: `Sistema de Propostas — Plano ${planData.name} (${billing === 'yearly' ? 'Anual' : 'Mensal'})`,
      }],
      order_nsu: orderId,
      redirect_url: `${BASE_URL}/sistema-proposta-comercial?compra=sucesso&order=${orderId}`,
      webhook_url: `${BASE_URL}/api/sistema-proposta/webhook`,
      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        ...(phone && { phone_number: '+55' + phone.replace(/\D/g, '') }),
      },
    };

    let paymentLink = '';
    let paymentSlug = '';

    try {
      const ipRes = await fetch(IP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

    // Salva venda pendente no banco
    if (pool) {
      await pool.execute(
        `INSERT INTO sistema_proposta_vendas
           (order_id, plan, billing, amount_cents, customer_name, customer_email, customer_company, customer_phone, payment_link, payment_slug)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE payment_link=VALUES(payment_link)`,
        [orderId, plan, billing, amountCents, name.trim(), email.trim().toLowerCase(),
         company.trim(), phone.trim(), paymentLink, paymentSlug]
      );
    }

    if (!paymentLink) {
      // Fallback: redireciona pro WhatsApp se InfinitePay falhar
      const waMsg = encodeURIComponent(
        `Olá! Quero contratar o Sistema de Propostas — Plano ${planData.name}.\nNome: ${name}\nE-mail: ${email}`
      );
      return res.json({
        ok: true,
        fallback: true,
        redirectUrl: `https://api.whatsapp.com/send?phone=5519982403845&text=${waMsg}`,
        orderId,
      });
    }

    res.json({ ok: true, redirectUrl: paymentLink, orderId });
  } catch (err) {
    console.error('[SistemaPropostas] checkout error:', err);
    res.status(500).json({ error: 'Erro interno. Tente novamente.' });
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

    // Gera senha temporária
    const tmpPassword = crypto.randomBytes(5).toString('hex'); // ex: a3f9c2e1b0
    const planName = PLANS[sale.plan]?.name || sale.plan;

    // Cria usuário no sistema de propostas (mesma DB)
    let userCreated = false;
    try {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.default.hash(tmpPassword, 12);
      await pool.execute(
        `INSERT INTO users (name, email, password_hash, role, active)
         VALUES (?, ?, ?, 'admin', 1)
         ON DUPLICATE KEY UPDATE active=1`,
        [sale.customer_name, sale.customer_email, hash]
      );
      userCreated = true;
    } catch (e) {
      console.warn('[SistemaPropostas] Erro ao criar usuário:', e.message);
    }

    const loginUrl = process.env.COMERCIAL_URL || 'https://comercial.winove.com.br/login';

    // E-mail para o cliente
    if (userCreated) {
      try {
        await sendEmail({
          to: sale.customer_email,
          subject: `✅ Acesso liberado — Sistema de Propostas ${planName}`,
          html: welcomeEmailHtml({
            name: sale.customer_name,
            email: sale.customer_email,
            password: tmpPassword,
            plan: planName,
            loginUrl,
          }),
        });
        console.log(`[SistemaPropostas] ✅ Boas-vindas enviado para ${sale.customer_email}`);
      } catch (e) {
        console.warn('[SistemaPropostas] Erro ao enviar e-mail cliente:', e.message);
      }
    }

    // Notificação para o admin
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `🎉 Nova venda — Plano ${planName} — ${sale.customer_name}`,
        html: `<p><strong>Nova venda confirmada!</strong></p>
        <ul>
          <li><strong>Plano:</strong> ${planName} (${sale.billing})</li>
          <li><strong>Cliente:</strong> ${sale.customer_name}</li>
          <li><strong>Empresa:</strong> ${sale.customer_company || '—'}</li>
          <li><strong>E-mail:</strong> ${sale.customer_email}</li>
          <li><strong>Telefone:</strong> ${sale.customer_phone || '—'}</li>
          <li><strong>Pedido:</strong> ${orderId}</li>
          <li><strong>Valor:</strong> R$ ${(sale.amount_cents / 100).toFixed(2)}</li>
          <li><strong>Usuário criado automaticamente:</strong> ${userCreated ? 'Sim ✅' : 'Não ⚠️ — criar manualmente'}</li>
          ${userCreated ? `<li><strong>Senha temporária enviada:</strong> ${tmpPassword}</li>` : ''}
        </ul>`,
      });
    } catch (e) {
      console.warn('[SistemaPropostas] Erro ao notificar admin:', e.message);
    }
  } catch (err) {
    console.error('[SistemaPropostas] webhook error:', err);
  }
});

export default router;
