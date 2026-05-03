/**
 * gscReports.js
 * Painel GSC — cadastra clientes, gera relatórios HTML e envia e-mails a cada 30 dias.
 *
 * GET  /gsc-admin              — painel admin (protegido externamente em index.js)
 * POST /gsc-admin/clients      — cadastrar cliente
 * POST /gsc-admin/send/:id     — enviar relatório manualmente
 * POST /gsc-admin/delete/:id   — remover cliente
 * GET  /relatorio-seo/:token   — relatório público (sem login)
 */

import { Router } from 'express';
import axios from 'axios';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

const BASE_URL = (process.env.APP_BASE_URL || 'https://winove.com.br').replace(/\/$/, '');
const GSC_CLIENT_ID = process.env.GSC_CLIENT_ID;
const GSC_CLIENT_SECRET = process.env.GSC_CLIENT_SECRET;
const GSC_REFRESH_TOKEN = process.env.GSC_REFRESH_TOKEN;

// ── DB ──────────────────────────────────────────────────────────────

async function ensureTable() {
  if (!pool) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS gsc_clients (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      site_url      VARCHAR(255) NOT NULL,
      client_name   VARCHAR(255) NOT NULL,
      client_email  VARCHAR(255) NOT NULL,
      report_token  VARCHAR(64)  NOT NULL UNIQUE,
      last_sent_at  DATETIME DEFAULT NULL,
      active        TINYINT(1) DEFAULT 1,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// ── GSC API ─────────────────────────────────────────────────────────

async function refreshAccessToken() {
  const r = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      client_id: GSC_CLIENT_ID,
      client_secret: GSC_CLIENT_SECRET,
      refresh_token: GSC_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    })
  );
  return r.data.access_token;
}

async function fetchGscData(accessToken, siteUrl) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const base = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

  const [queries, pages, countries] = await Promise.all([
    axios.post(base, { startDate, endDate, dimensions: ['query'],   rowLimit: 10 }, { headers }).catch(() => ({ data: { rows: [] } })),
    axios.post(base, { startDate, endDate, dimensions: ['page'],    rowLimit: 10 }, { headers }).catch(() => ({ data: { rows: [] } })),
    axios.post(base, { startDate, endDate, dimensions: ['country'], rowLimit: 5  }, { headers }).catch(() => ({ data: { rows: [] } })),
  ]);

  return {
    queries:   queries.data.rows   || [],
    pages:     pages.data.rows     || [],
    countries: countries.data.rows || [],
    dateRange: { start: startDate, end: endDate },
  };
}

// ── Report HTML ─────────────────────────────────────────────────────

function buildReportHtml(client, data, isEmail = false) {
  const { site_url, client_name, report_token } = client;
  const { queries, pages, countries, dateRange } = data;

  const totalClicks       = queries.reduce((s, r) => s + (r.clicks || 0), 0);
  const totalImpressions  = queries.reduce((s, r) => s + (r.impressions || 0), 0);
  const avgPosition       = queries.length
    ? (queries.reduce((s, r) => s + (r.position || 0), 0) / queries.length).toFixed(1)
    : '—';
  const avgCtr            = queries.length
    ? ((queries.reduce((s, r) => s + (r.ctr || 0), 0) / queries.length) * 100).toFixed(1) + '%'
    : '—';

  const tableRows = (rows, keyFn) => rows.length
    ? rows.map(r => `
        <tr>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;word-break:break-all;font-size:13px;">${keyFn(r)}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;">${(r.clicks||0).toLocaleString('pt-BR')}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;">${(r.impressions||0).toLocaleString('pt-BR')}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;">${((r.ctr||0)*100).toFixed(1)}%</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;">${(r.position||0).toFixed(1)}</td>
        </tr>`)
      .join('')
    : `<tr><td colspan="5" style="padding:16px;text-align:center;color:#aaa;font-size:13px;">Sem dados disponíveis no período</td></tr>`;

  const publicLink = `${BASE_URL}/api/relatorio-seo/${report_token}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Relatório SEO — ${client_name}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;background:#f0f2f5;color:#222}
  a{color:#6c63ff}
  .wrap{max-width:900px;margin:0 auto;padding:32px 16px}
  .header{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#fff;border-radius:12px;padding:32px;margin-bottom:28px}
  .logo{font-size:22px;font-weight:800;margin-bottom:18px;letter-spacing:-0.5px}
  .logo em{color:#6c63ff;font-style:normal}
  .header h1{margin:0 0 6px;font-size:22px;font-weight:700}
  .header p{margin:0;opacity:.65;font-size:13px}
  .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px}
  .kpi{background:#fff;border-radius:10px;padding:18px 20px;box-shadow:0 2px 8px rgba(0,0,0,.07)}
  .kpi .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
  .kpi .val{font-size:26px;font-weight:800;color:#1a1a2e;line-height:1}
  .section{background:#fff;border-radius:10px;padding:22px 24px;box-shadow:0 2px 8px rgba(0,0,0,.07);margin-bottom:20px}
  .section h2{margin:0 0 14px;font-size:15px;font-weight:700;color:#1a1a2e}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;padding:8px 12px;background:#f8f9fa;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px;font-weight:600}
  th:not(:first-child){text-align:right}
  .footer{text-align:center;font-size:12px;color:#aaa;padding:24px 0}
  ${isEmail ? '' : '@media print{.no-print{display:none}.wrap{padding:16px}}'}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">Win<em>ove</em></div>
    <h1>Relatório de Desempenho no Google</h1>
    <p>${client_name} &nbsp;·&nbsp; ${site_url} &nbsp;·&nbsp; ${dateRange.start} a ${dateRange.end}</p>
  </div>

  <div class="kpis">
    <div class="kpi"><div class="lbl">Cliques</div><div class="val">${totalClicks.toLocaleString('pt-BR')}</div></div>
    <div class="kpi"><div class="lbl">Impressões</div><div class="val">${totalImpressions.toLocaleString('pt-BR')}</div></div>
    <div class="kpi"><div class="lbl">CTR médio</div><div class="val">${avgCtr}</div></div>
    <div class="kpi"><div class="lbl">Posição média</div><div class="val">${avgPosition}</div></div>
  </div>

  <div class="section">
    <h2>🔍 Palavras-chave com Mais Cliques</h2>
    <table>
      <thead><tr><th>Palavra-chave</th><th>Cliques</th><th>Impressões</th><th>CTR</th><th>Posição</th></tr></thead>
      <tbody>${tableRows(queries, r => r.keys[0])}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>📄 Páginas com Mais Tráfego</h2>
    <table>
      <thead><tr><th>URL</th><th>Cliques</th><th>Impressões</th><th>CTR</th><th>Posição</th></tr></thead>
      <tbody>${tableRows(pages, r => r.keys[0])}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>🌎 Países de Origem</h2>
    <table>
      <thead><tr><th>País</th><th>Cliques</th><th>Impressões</th><th>CTR</th><th>Posição</th></tr></thead>
      <tbody>${tableRows(countries, r => r.keys[0])}</tbody>
    </table>
  </div>

  ${isEmail ? `<div style="text-align:center;margin:24px 0">
    <a href="${publicLink}" style="display:inline-block;padding:14px 28px;background:#6c63ff;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
      Ver Relatório Completo Online
    </a>
  </div>` : ''}

  <div class="footer">
    Relatório gerado automaticamente por <a href="https://winove.com.br">Winove</a> · Dados do Google Search Console<br>
    <small>Atualizado a cada 30 dias. <a href="${publicLink}">Link permanente do relatório</a></small>
  </div>
</div>
</body>
</html>`;
}

// ── Email ───────────────────────────────────────────────────────────

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.appuni.com.br',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

async function sendReportEmail(client, data) {
  const html = buildReportHtml(client, data, true);
  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Winove" <fernando@winove.com.br>',
    to: client.client_email,
    cc: 'fernando@winove.com.br',
    subject: `📊 Relatório SEO — ${client.client_name} (${data.dateRange.start} a ${data.dateRange.end})`,
    html,
  });
}

// ── Admin helpers ───────────────────────────────────────────────────

function adminHtml(clients, flash = '') {
  const rows = clients.map(c => `
    <tr>
      <td class="fw-semibold">${esc(c.client_name)}</td>
      <td><small class="text-muted">${esc(c.site_url)}</small></td>
      <td><small>${esc(c.client_email)}</small></td>
      <td><small>${c.last_sent_at ? new Date(c.last_sent_at).toLocaleDateString('pt-BR') : '<span class="text-muted">—</span>'}</small></td>
      <td>
        <a href="/api/relatorio-seo/${c.report_token}" target="_blank" class="btn btn-sm btn-outline-secondary me-1">Ver</a>
        <form method="POST" action="/api/gsc-admin/send/${c.id}" style="display:inline">
          <button class="btn btn-sm btn-success me-1">Enviar</button>
        </form>
        <form method="POST" action="/api/gsc-admin/delete/${c.id}" style="display:inline" onsubmit="return confirm('Remover este cliente?')">
          <button class="btn btn-sm btn-outline-danger">Remover</button>
        </form>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Painel GSC — Winove</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<style>
  body{background:#f0f2f5}
  .navbar{background:#1a1a2e!important}
  .navbar-brand{color:#fff!important;font-weight:800;font-size:18px;letter-spacing:-.3px}
  .navbar-brand em{color:#6c63ff;font-style:normal}
  .card{border:none;box-shadow:0 2px 12px rgba(0,0,0,.08);border-radius:12px}
  .card-header{border-radius:12px 12px 0 0!important;background:#fff!important}
</style>
</head>
<body>
<nav class="navbar px-4 mb-4"><span class="navbar-brand">Win<em>ove</em> · Painel GSC Reports</span></nav>
<div class="container-lg">
  ${flash ? `<div class="alert alert-success alert-dismissible fade show">${esc(flash)}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>` : ''}

  <div class="card mb-4">
    <div class="card-header py-3 fw-bold">Cadastrar Novo Cliente</div>
    <div class="card-body">
      <form method="POST" action="/api/gsc-admin/clients">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label fw-semibold">Nome do Cliente</label>
            <input name="client_name" class="form-control" placeholder="Ex: Acme Ltda" required>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold">URL no GSC</label>
            <input name="site_url" class="form-control" placeholder="sc-domain:dominio.com.br" required>
            <div class="form-text">Use o formato exato do Google Search Console</div>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold">E-mail do Cliente</label>
            <input name="client_email" type="email" class="form-control" placeholder="contato@cliente.com.br" required>
          </div>
          <div class="col-12">
            <button class="btn btn-primary px-4">Cadastrar</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="card">
    <div class="card-header py-3 d-flex justify-content-between align-items-center">
      <span class="fw-bold">Clientes Cadastrados <span class="badge bg-secondary ms-1">${clients.length}</span></span>
      <small class="text-muted">Envio automático a cada 30 dias</small>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr><th>Cliente</th><th>Site (GSC)</th><th>E-mail</th><th>Último Envio</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="5" class="text-center text-muted py-4">Nenhum cliente cadastrado ainda</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

function esc(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Routes ──────────────────────────────────────────────────────────

router.get('/api/gsc-admin', async (req, res) => {
  if (!pool) return res.status(503).send('Banco de dados não disponível');
  try {
    await ensureTable();
    const [clients] = await pool.execute('SELECT * FROM gsc_clients ORDER BY created_at DESC');
    res.send(adminHtml(clients, req.query.ok || ''));
  } catch (err) {
    console.error('[GSC Admin]', err);
    res.status(500).send('Erro interno');
  }
});

router.post('/api/gsc-admin/clients', async (req, res) => {
  if (!pool) return res.status(503).send('Banco de dados não disponível');
  const { site_url, client_name, client_email } = req.body || {};
  if (!site_url || !client_name || !client_email) return res.redirect('/api/gsc-admin');
  try {
    await ensureTable();
    const token = crypto.randomBytes(32).toString('hex');
    await pool.execute(
      'INSERT INTO gsc_clients (site_url, client_name, client_email, report_token) VALUES (?, ?, ?, ?)',
      [site_url.trim(), client_name.trim(), client_email.trim(), token]
    );
    res.redirect('/api/gsc-admin?ok=' + encodeURIComponent(`Cliente "${client_name}" cadastrado com sucesso!`));
  } catch (err) {
    console.error('[GSC Admin create]', err);
    res.status(500).send('Erro ao cadastrar');
  }
});

router.post('/api/gsc-admin/delete/:id', async (req, res) => {
  if (!pool) return res.status(503).send('Banco de dados não disponível');
  try {
    await pool.execute('DELETE FROM gsc_clients WHERE id = ?', [req.params.id]);
    res.redirect('/api/gsc-admin?ok=Cliente+removido.');
  } catch (err) {
    console.error('[GSC Admin delete]', err);
    res.status(500).send('Erro ao remover');
  }
});

router.post('/api/gsc-admin/send/:id', async (req, res) => {
  if (!pool) return res.status(503).send('Banco de dados não disponível');
  try {
    const [[client]] = await pool.execute('SELECT * FROM gsc_clients WHERE id = ?', [req.params.id]);
    if (!client) return res.redirect('/api/gsc-admin?ok=Cliente+não+encontrado.');
    const accessToken = await refreshAccessToken();
    const data = await fetchGscData(accessToken, client.site_url);
    await sendReportEmail(client, data);
    await pool.execute('UPDATE gsc_clients SET last_sent_at = NOW() WHERE id = ?', [client.id]);
    res.redirect('/api/gsc-admin?ok=' + encodeURIComponent(`Relatório enviado para ${client.client_email}!`));
  } catch (err) {
    console.error('[GSC Admin send]', err);
    res.redirect('/api/gsc-admin?ok=' + encodeURIComponent('Erro ao enviar: ' + err.message));
  }
});

// Public report via token
router.get('/api/relatorio-seo/:token', async (req, res) => {
  if (!pool) return res.status(503).send('Serviço temporariamente indisponível.');
  try {
    await ensureTable();
    const [[client]] = await pool.execute(
      'SELECT * FROM gsc_clients WHERE report_token = ? AND active = 1',
      [req.params.token]
    );
    if (!client) return res.status(404).send('<h2>Relatório não encontrado ou link expirado.</h2>');

    if (!GSC_CLIENT_ID || !GSC_REFRESH_TOKEN) {
      return res.status(500).send('Credenciais GSC não configuradas.');
    }

    const accessToken = await refreshAccessToken();
    const data = await fetchGscData(accessToken, client.site_url);
    res.send(buildReportHtml(client, data, false));
  } catch (err) {
    console.error('[GSC Public]', err);
    res.status(500).send('Erro ao carregar relatório: ' + err.message);
  }
});

// ── Cron: envio automático a cada 30 dias ──────────────────────────

async function sendPendingReports() {
  if (!pool || !GSC_REFRESH_TOKEN) return;
  try {
    const [clients] = await pool.execute(`
      SELECT * FROM gsc_clients
      WHERE active = 1
        AND (last_sent_at IS NULL OR last_sent_at < DATE_SUB(NOW(), INTERVAL 30 DAY))
    `);
    if (!clients.length) return;

    console.log(`[GSC Cron] ${clients.length} relatório(s) para enviar`);
    let accessToken;
    try { accessToken = await refreshAccessToken(); } catch (e) {
      console.error('[GSC Cron] Falha ao atualizar token:', e.message);
      return;
    }

    for (const client of clients) {
      try {
        const data = await fetchGscData(accessToken, client.site_url);
        await sendReportEmail(client, data);
        await pool.execute('UPDATE gsc_clients SET last_sent_at = NOW() WHERE id = ?', [client.id]);
        console.log(`[GSC Cron] Enviado para ${client.client_email} (${client.site_url})`);
      } catch (e) {
        console.error(`[GSC Cron] Erro no cliente ${client.id}:`, e.message);
      }
    }
  } catch (e) {
    console.error('[GSC Cron]', e.message);
  }
}

export function startGscCron() {
  // Run once at startup after 30s delay, then every 24h
  setTimeout(sendPendingReports, 30_000);
  setInterval(sendPendingReports, 24 * 60 * 60 * 1000);
  console.log('[GSC Cron] Agendado (verificação diária, envio a cada 30 dias)');
}

export default router;
