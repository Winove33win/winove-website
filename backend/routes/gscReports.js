/**
 * gscReports.js — Painel GSC Reports (rotas sob /api/ para passar pelo Nginx→Passenger)
 *
 * GET  /api/gsc-admin              — painel admin (Basic Auth)
 * POST /api/gsc-admin/clients      — cadastrar cliente
 * POST /api/gsc-admin/send/:id     — enviar relatório manualmente
 * POST /api/gsc-admin/delete/:id   — remover cliente
 * GET  /api/relatorio-seo/:token   — relatório público (sem login)
 */

import { Router } from 'express';
import axios from 'axios';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

const BASE_URL = (process.env.APP_BASE_URL || 'https://winove.com.br').replace(/\/$/, '');
const GSC_CLIENT_ID     = process.env.GSC_CLIENT_ID;
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
      client_id:     GSC_CLIENT_ID,
      client_secret: GSC_CLIENT_SECRET,
      refresh_token: GSC_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    })
  );
  return r.data.access_token;
}

async function fetchGscSites(accessToken) {
  const r = await axios.get('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return (r.data.siteEntry || [])
    .filter(s => s.permissionLevel !== 'siteUnverifiedUser')
    .map(s => s.siteUrl)
    .sort();
}

async function fetchGscData(accessToken, siteUrl) {
  const endDate   = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const base    = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
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

  const totalClicks      = queries.reduce((s, r) => s + (r.clicks || 0), 0);
  const totalImpressions = queries.reduce((s, r) => s + (r.impressions || 0), 0);
  const avgPosition      = queries.length
    ? (queries.reduce((s, r) => s + (r.position || 0), 0) / queries.length).toFixed(1) : '—';
  const avgCtr           = queries.length
    ? ((queries.reduce((s, r) => s + (r.ctr || 0), 0) / queries.length) * 100).toFixed(1) + '%' : '—';

  const tableRows = (rows, keyFn) => rows.length
    ? rows.map(r => `
        <tr>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;word-break:break-all;font-size:13px;">${esc(keyFn(r))}</td>
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
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Relatório SEO — ${esc(client_name)}</title>
<style>
*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;background:#f0f2f5;color:#222}a{color:#6c63ff}
.wrap{max-width:900px;margin:0 auto;padding:32px 16px}
.header{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#fff;border-radius:12px;padding:32px;margin-bottom:28px}
.logo{font-size:22px;font-weight:800;margin-bottom:18px;letter-spacing:-.5px}.logo em{color:#6c63ff;font-style:normal}
.header h1{margin:0 0 6px;font-size:22px;font-weight:700}.header p{margin:0;opacity:.65;font-size:13px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px}
.kpi{background:#fff;border-radius:10px;padding:18px 20px;box-shadow:0 2px 8px rgba(0,0,0,.07)}
.kpi .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.kpi .val{font-size:26px;font-weight:800;color:#1a1a2e;line-height:1}
.section{background:#fff;border-radius:10px;padding:22px 24px;box-shadow:0 2px 8px rgba(0,0,0,.07);margin-bottom:20px}
.section h2{margin:0 0 14px;font-size:15px;font-weight:700;color:#1a1a2e}
table{width:100%;border-collapse:collapse}th{text-align:left;padding:8px 12px;background:#f8f9fa;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px;font-weight:600}
th:not(:first-child){text-align:right}.footer{text-align:center;font-size:12px;color:#aaa;padding:24px 0}
</style>
</head>
<body><div class="wrap">
  <div class="header">
    <div class="logo">Win<em>ove</em></div>
    <h1>Relatório de Desempenho no Google</h1>
    <p>${esc(client_name)} &nbsp;·&nbsp; ${esc(site_url)} &nbsp;·&nbsp; ${dateRange.start} a ${dateRange.end}</p>
  </div>
  <div class="kpis">
    <div class="kpi"><div class="lbl">Cliques</div><div class="val">${totalClicks.toLocaleString('pt-BR')}</div></div>
    <div class="kpi"><div class="lbl">Impressões</div><div class="val">${totalImpressions.toLocaleString('pt-BR')}</div></div>
    <div class="kpi"><div class="lbl">CTR médio</div><div class="val">${avgCtr}</div></div>
    <div class="kpi"><div class="lbl">Posição média</div><div class="val">${avgPosition}</div></div>
  </div>
  <div class="section"><h2>🔍 Palavras-chave com Mais Cliques</h2>
    <table><thead><tr><th>Palavra-chave</th><th>Cliques</th><th>Impressões</th><th>CTR</th><th>Posição</th></tr></thead>
    <tbody>${tableRows(queries, r => r.keys[0])}</tbody></table></div>
  <div class="section"><h2>📄 Páginas com Mais Tráfego</h2>
    <table><thead><tr><th>URL</th><th>Cliques</th><th>Impressões</th><th>CTR</th><th>Posição</th></tr></thead>
    <tbody>${tableRows(pages, r => r.keys[0])}</tbody></table></div>
  <div class="section"><h2>🌎 Países de Origem</h2>
    <table><thead><tr><th>País</th><th>Cliques</th><th>Impressões</th><th>CTR</th><th>Posição</th></tr></thead>
    <tbody>${tableRows(countries, r => r.keys[0])}</tbody></table></div>
  ${isEmail ? `<div style="text-align:center;margin:24px 0">
    <a href="${publicLink}" style="display:inline-block;padding:14px 28px;background:#6c63ff;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Ver Relatório Completo Online</a>
  </div>` : ''}
  <div class="footer">Relatório gerado por <a href="https://winove.com.br">Winove</a> · Dados do Google Search Console<br>
    <small>Atualizado a cada 30 dias. <a href="${publicLink}">Link permanente do relatório</a></small></div>
</div></body></html>`;
}

// ── Email ────────────────────────────────────────────────────────────

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.appuni.com.br',
    port: 465, secure: true,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });
}

async function sendReportEmail(client, data) {
  const html = buildReportHtml(client, data, true);
  await createTransport().sendMail({
    from:    process.env.MAIL_FROM || '"Winove" <fernando@winove.com.br>',
    to:      client.client_email,
    cc:      'fernando@winove.com.br',
    subject: `📊 Relatório SEO — ${client.client_name} (${data.dateRange.start} a ${data.dateRange.end})`,
    html,
  });
}

// ── Admin HTML (CSS inline — sem CDN externo) ────────────────────────

function adminHtml(clients, gscSites = [], flash = '', flashType = 'success') {
  const siteOptions = gscSites.map(s =>
    `<option value="${esc(s)}">${esc(s)}</option>`
  ).join('');

  const rows = clients.map(c => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-weight:600">${esc(c.client_name)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0"><span style="font-size:12px;color:#666;word-break:break-all">${esc(c.site_url)}</span></td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0"><span style="font-size:13px">${esc(c.client_email)}</span></td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#888">${c.last_sent_at ? new Date(c.last_sent_at).toLocaleDateString('pt-BR') : '—'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;white-space:nowrap">
        <a href="/api/relatorio-seo/${c.report_token}" target="_blank" style="${BTN}background:#f0f0f0;color:#333">Ver</a>
        <form method="POST" action="/api/gsc-admin/send/${c.id}" style="display:inline">
          <button type="submit" style="${BTN}background:#22c55e;color:#fff">Enviar</button>
        </form>
        <form method="POST" action="/api/gsc-admin/delete/${c.id}" style="display:inline" onsubmit="return confirm('Remover este cliente?')">
          <button type="submit" style="${BTN}background:#fff;color:#ef4444;border:1px solid #ef4444">Remover</button>
        </form>
      </td>
    </tr>`).join('');

  const flashHtml = flash
    ? `<div style="margin-bottom:20px;padding:14px 18px;border-radius:8px;background:${flashType === 'error' ? '#fef2f2' : '#f0fdf4'};color:${flashType === 'error' ? '#991b1b' : '#166534'};border:1px solid ${flashType === 'error' ? '#fecaca' : '#bbf7d0'};font-size:14px">${esc(flash)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Painel GSC — Winove</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f0f2f5;color:#222;min-height:100vh}
.topbar{background:#1a1a2e;padding:0 32px;height:56px;display:flex;align-items:center;gap:8px}
.topbar .logo{font-size:18px;font-weight:800;color:#fff;letter-spacing:-.3px}.topbar .logo em{color:#6c63ff;font-style:normal}
.topbar .sep{color:#444;font-size:18px}.topbar .title{color:#aaa;font-size:14px}
.page{max-width:1100px;margin:0 auto;padding:28px 20px}
.card{background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.08);margin-bottom:24px;overflow:hidden}
.card-header{padding:18px 24px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center}
.card-header h2{font-size:15px;font-weight:700;color:#1a1a2e}
.card-header small{font-size:12px;color:#aaa}
.card-body{padding:24px}
.form-grid{display:grid;grid-template-columns:1fr 1.5fr 1.5fr auto;gap:16px;align-items:end}
@media(max-width:768px){.form-grid{grid-template-columns:1fr}}
.form-group label{display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;text-transform:uppercase;letter-spacing:.3px}
.form-group input,.form-group select{width:100%;padding:10px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;color:#222;background:#fff;outline:none;transition:border-color .15s}
.form-group input:focus,.form-group select:focus{border-color:#6c63ff}
.form-group .hint{font-size:11px;color:#aaa;margin-top:4px}
.btn-primary{padding:10px 24px;background:#6c63ff;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s}
.btn-primary:hover{background:#5b52e8}
table{width:100%;border-collapse:collapse}
thead th{text-align:left;padding:10px 16px;background:#f8f9fa;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.4px}
tbody tr:hover{background:#fafafa}
.empty{padding:40px;text-align:center;color:#aaa;font-size:14px}
.badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;background:#e0e7ff;color:#4f46e5}
</style>
</head>
<body>
<div class="topbar">
  <span class="logo">Win<em>ove</em></span>
  <span class="sep">·</span>
  <span class="title">Painel GSC Reports</span>
</div>
<div class="page">
  ${flashHtml}

  <div class="card">
    <div class="card-header"><h2>Cadastrar Novo Cliente</h2></div>
    <div class="card-body">
      <form method="POST" action="/api/gsc-admin/clients">
        <div class="form-grid">
          <div class="form-group">
            <label>Nome do Cliente</label>
            <input name="client_name" placeholder="Ex: Acme Ltda" required>
          </div>
          <div class="form-group">
            <label>Site no GSC</label>
            ${gscSites.length
              ? `<select name="site_url" required>
                   <option value="">— Selecione o site —</option>
                   ${siteOptions}
                 </select>`
              : `<input name="site_url" placeholder="sc-domain:dominio.com.br" required>`
            }
            <div class="hint">Formato exato do Google Search Console</div>
          </div>
          <div class="form-group">
            <label>E-mail do Cliente</label>
            <input name="client_email" type="email" placeholder="contato@cliente.com.br" required>
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <button class="btn-primary" type="submit">Cadastrar</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h2>Clientes Cadastrados <span class="badge">${clients.length}</span></h2>
      <small>Envio automático a cada 30 dias</small>
    </div>
    <div style="overflow-x:auto">
      <table>
        <thead><tr><th>Cliente</th><th>Site (GSC)</th><th>E-mail</th><th>Último Envio</th><th>Ações</th></tr></thead>
        <tbody>
          ${rows || `<tr><td colspan="5" class="empty">Nenhum cliente cadastrado ainda</td></tr>`}
        </tbody>
      </table>
    </div>
  </div>
</div>
</body>
</html>`;
}

const BTN = 'display:inline-block;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:none;margin-right:4px;text-decoration:none;';

function esc(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// ── Routes ───────────────────────────────────────────────────────────

router.get('/api/gsc-admin', async (req, res) => {
  if (!pool) return res.status(503).send('Banco de dados não disponível');
  try {
    await ensureTable();
    const [clients] = await pool.execute('SELECT * FROM gsc_clients ORDER BY created_at DESC');

    let gscSites = [];
    if (GSC_REFRESH_TOKEN) {
      try {
        const accessToken = await refreshAccessToken();
        gscSites = await fetchGscSites(accessToken);
      } catch (e) {
        console.warn('[GSC Admin] Falha ao buscar sites GSC:', e.message);
      }
    }

    res.send(adminHtml(clients, gscSites, req.query.ok || '', req.query.err ? 'error' : 'success'));
  } catch (err) {
    console.error('[GSC Admin]', err);
    res.status(500).send('Erro interno: ' + err.message);
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
    res.redirect('/api/gsc-admin?err=' + encodeURIComponent('Erro ao cadastrar: ' + err.message));
  }
});

router.post('/api/gsc-admin/delete/:id', async (req, res) => {
  if (!pool) return res.status(503).send('Banco de dados não disponível');
  try {
    await pool.execute('DELETE FROM gsc_clients WHERE id = ?', [req.params.id]);
    res.redirect('/api/gsc-admin?ok=Cliente+removido+com+sucesso.');
  } catch (err) {
    console.error('[GSC Admin delete]', err);
    res.redirect('/api/gsc-admin?err=' + encodeURIComponent('Erro ao remover: ' + err.message));
  }
});

router.post('/api/gsc-admin/send/:id', async (req, res) => {
  if (!pool) return res.status(503).send('Banco de dados não disponível');
  try {
    const [[client]] = await pool.execute('SELECT * FROM gsc_clients WHERE id = ?', [req.params.id]);
    if (!client) return res.redirect('/api/gsc-admin?err=Cliente+não+encontrado.');
    const accessToken = await refreshAccessToken();
    const data        = await fetchGscData(accessToken, client.site_url);
    await sendReportEmail(client, data);
    await pool.execute('UPDATE gsc_clients SET last_sent_at = NOW() WHERE id = ?', [client.id]);
    res.redirect('/api/gsc-admin?ok=' + encodeURIComponent(`Relatório enviado para ${client.client_email}!`));
  } catch (err) {
    console.error('[GSC Admin send]', err);
    res.redirect('/api/gsc-admin?err=' + encodeURIComponent('Erro ao enviar: ' + err.message));
  }
});

// Relatório público via token
router.get('/api/relatorio-seo/:token', async (req, res) => {
  if (!pool) return res.status(503).send('Serviço temporariamente indisponível.');
  try {
    await ensureTable();
    const [[client]] = await pool.execute(
      'SELECT * FROM gsc_clients WHERE report_token = ? AND active = 1',
      [req.params.token]
    );
    if (!client) return res.status(404).send('<h2 style="font-family:sans-serif;padding:40px">Relatório não encontrado ou link expirado.</h2>');
    if (!GSC_CLIENT_ID || !GSC_REFRESH_TOKEN) return res.status(500).send('Credenciais GSC não configuradas.');

    const accessToken = await refreshAccessToken();
    const data        = await fetchGscData(accessToken, client.site_url);
    res.send(buildReportHtml(client, data, false));
  } catch (err) {
    console.error('[GSC Public]', err);
    res.status(500).send('Erro ao carregar relatório: ' + err.message);
  }
});

// ── Cron: envio automático a cada 30 dias ───────────────────────────

async function sendPendingReports() {
  if (!pool || !GSC_REFRESH_TOKEN) return;
  try {
    const [clients] = await pool.execute(`
      SELECT * FROM gsc_clients
      WHERE active = 1
        AND (last_sent_at IS NULL OR last_sent_at < DATE_SUB(NOW(), INTERVAL 30 DAY))
    `);
    if (!clients.length) return;

    console.log(`[GSC Cron] ${clients.length} relatório(s) pendente(s)`);
    let accessToken;
    try { accessToken = await refreshAccessToken(); } catch (e) {
      console.error('[GSC Cron] Token refresh falhou:', e.message); return;
    }

    for (const client of clients) {
      try {
        const data = await fetchGscData(accessToken, client.site_url);
        await sendReportEmail(client, data);
        await pool.execute('UPDATE gsc_clients SET last_sent_at = NOW() WHERE id = ?', [client.id]);
        console.log(`[GSC Cron] Enviado → ${client.client_email} (${client.site_url})`);
      } catch (e) {
        console.error(`[GSC Cron] Erro cliente ${client.id}:`, e.message);
      }
    }
  } catch (e) {
    console.error('[GSC Cron]', e.message);
  }
}

export function startGscCron() {
  setTimeout(sendPendingReports, 30_000);
  setInterval(sendPendingReports, 24 * 60 * 60 * 1000);
  console.log('[GSC Cron] Agendado (verificação diária, envio a cada 30 dias)');
}

export default router;
