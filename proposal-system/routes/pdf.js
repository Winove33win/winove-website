const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/proposals/:id/pdf', requireAuth, async (req, res) => {
  let browser;
  try {
    const [rows] = await db.query('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Proposta não encontrada');

    const proposal = parseJsonFields(rows[0]);
    const [companyRows] = await db.query('SELECT * FROM company_settings WHERE id = 1');
    const company = companyRows[0] || {};

    // Resolve logo para base64 (evita problemas de path no PDF)
    let logoBase64 = '';
    if (company.logo_path) {
      const logoFile = path.join(__dirname, '../public', company.logo_path);
      if (fs.existsSync(logoFile)) {
        const ext = path.extname(company.logo_path).slice(1).toLowerCase();
        const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
        logoBase64 = `data:${mime};base64,${fs.readFileSync(logoFile).toString('base64')}`;
      }
    }

    const templatePath = path.join(__dirname, '../templates/proposal-pdf.ejs');
    const html = await ejs.renderFile(templatePath, {
      proposal,
      company,
      logoBase64,
      formatDate,
      formatCurrency,
      formatCNPJ
    });

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '15mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="font-size:8px;color:#999;width:100%;text-align:center;padding:0 15mm;">
          ${company.company_name || ''} — Proposta ${proposal.proposal_number} — Página <span class="pageNumber"></span> de <span class="totalPages"></span>
        </div>
      `
    });

    const filename = `Proposta_${proposal.proposal_number}_${(proposal.client_company || 'cliente').replace(/\s/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF] Erro ao gerar PDF:', err);
    res.status(500).send('Erro ao gerar PDF. Verifique se o Puppeteer está instalado corretamente.');
  } finally {
    if (browser) await browser.close();
  }
});

// Pré-visualização do PDF no navegador
router.get('/proposals/:id/preview', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Proposta não encontrada');

    const proposal = parseJsonFields(rows[0]);
    const [companyRows] = await db.query('SELECT * FROM company_settings WHERE id = 1');
    const company = companyRows[0] || {};

    const templatePath = path.join(__dirname, '../templates/proposal-pdf.ejs');
    const html = await ejs.renderFile(templatePath, {
      proposal, company, logoBase64: '',
      formatDate, formatCurrency, formatCNPJ
    });

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar prévia');
  }
});

function parseJsonFields(p) {
  try { p.technologies = JSON.parse(p.technologies || '[]'); } catch { p.technologies = []; }
  try { p.deliverables = JSON.parse(p.deliverables || '[]'); } catch { p.deliverables = []; }
  try { p.timeline = JSON.parse(p.timeline || '[]'); } catch { p.timeline = []; }
  return p;
}

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

function formatCNPJ(cnpj) {
  if (!cnpj) return '';
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

module.exports = router;
