const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

router.post('/proposals/:id/send-email', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Proposta não encontrada' });

    const proposal = rows[0];
    const [companyRows] = await db.query('SELECT * FROM company_settings WHERE id = 1');
    const company = companyRows[0] || {};

    const { to_email, to_name, message } = req.body;
    const pdfUrl = `${process.env.BASE_URL}/proposals/${proposal.id}/pdf`;
    const viewUrl = `${process.env.BASE_URL}/proposals/${proposal.id}/preview`;

    const emailBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <div style="border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:20px">
    ${company.logo_path ? `<img src="${process.env.BASE_URL}${company.logo_path}" height="50" alt="${company.company_name}">` : `<h2>${company.company_name}</h2>`}
  </div>

  <p>Olá, <strong>${to_name || proposal.client_name}</strong>,</p>

  <p>Segue a proposta comercial <strong>${proposal.proposal_number}</strong> — <em>${proposal.proposal_title}</em>.</p>

  ${message ? `<p>${message.replace(/\n/g, '<br>')}</p>` : ''}

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0">
    <h3 style="margin-top:0;color:#1e40af">Resumo da Proposta</h3>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:4px 0;color:#64748b">Número:</td><td><strong>${proposal.proposal_number}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#64748b">Projeto:</td><td>${proposal.proposal_title}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b">Valor:</td><td><strong>${new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(proposal.final_value)}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#64748b">Validade:</td><td>${new Date(proposal.valid_until).toLocaleDateString('pt-BR')}</td></tr>
    </table>
  </div>

  <div style="text-align:center;margin:30px 0">
    <a href="${pdfUrl}" style="background:#2563eb;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:bold;margin-right:10px">
      Baixar PDF
    </a>
  </div>

  <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0">
  <p style="font-size:12px;color:#64748b">
    ${company.company_name} | ${company.phone || ''} | ${company.email || ''}<br>
    ${company.address || ''} ${company.city ? '— ' + company.city + '/' + company.state : ''}
  </p>
</body>
</html>`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: to_email || proposal.client_email,
      subject: `Proposta Comercial ${proposal.proposal_number} — ${company.company_name}`,
      html: emailBody
    });

    // Atualiza status para enviada
    await db.query(
      'UPDATE proposals SET status = "enviada", sent_at = NOW() WHERE id = ? AND status = "rascunho"',
      [proposal.id]
    );

    res.json({ success: true, message: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('[Email] Erro:', err);
    res.status(500).json({ error: 'Erro ao enviar e-mail: ' + err.message });
  }
});

module.exports = router;
