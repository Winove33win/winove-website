'use strict';

/**
 * Winove API server (AppUni edition)
 *
 * This Express server exposes three REST endpoints designed to be hosted on
 * AppUni/Plesk environments and consumed by GPT Actions:
 *   • GET    /templates  – list the available templates.
 *   • POST   /leads      – create a new lead entry in MySQL.
 *   • POST   /send-email – send a notification with lead details via SMTP.
 *
 * Usage:
 *   1. Create a `.env` file (see docs/winove_appuni_api.md) with database,
 *      SMTP and contact information.
 *   2. Install dependencies with:
 *        npm install express mysql2 nodemailer dotenv
 *   3. Start the server:
 *        node winove_api_appuni.js
 */

require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Helper to ensure required environment variables exist.
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.warn(`Warning: environment variable ${name} is not set.`);
  }
  return value;
}

const dbPool = mysql.createPool({
  host: requireEnv('DB_HOST'),
  port: Number(process.env.DB_PORT || 3306),
  user: requireEnv('DB_USER'),
  password: requireEnv('DB_PASS'),
  database: requireEnv('DB_NAME'),
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0
});

const mailTransporter = nodemailer.createTransport({
  host: requireEnv('MAIL_HOST'),
  port: Number(process.env.MAIL_PORT || 587),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: requireEnv('MAIL_USER'),
    pass: requireEnv('MAIL_PASS')
  }
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.get('/templates', async (_, res) => {
  try {
    const [rows] = await dbPool.query(
      'SELECT id, nome, descricao, preco, url_demo FROM templates'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Erro ao obter templates' });
  }
});

app.post('/leads', async (req, res) => {
  const { nome, email, telefone, interesse } = req.body || {};

  if (!email || !interesse) {
    return res
      .status(400)
      .json({ error: 'E-mail e interesse são obrigatórios' });
  }

  try {
    await dbPool.query(
      'INSERT INTO leads (nome, email, telefone, interesse, created_at) VALUES (?, ?, ?, ?, NOW())',
      [nome || null, email, telefone || null, interesse]
    );

    res.json({ message: 'Lead criado com sucesso' });
  } catch (error) {
    console.error('Error inserting lead:', error);
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

app.post('/send-email', async (req, res) => {
  const { nome, email, telefone, interesse } = req.body || {};

  if (!email || !interesse) {
    return res
      .status(400)
      .json({ error: 'E-mail e interesse são obrigatórios' });
  }

  const toAddress = requireEnv('CONTACT_EMAIL');

  if (!toAddress) {
    return res.status(500).json({ error: 'CONTACT_EMAIL não configurado' });
  }

  const message = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: toAddress,
    subject: process.env.MAIL_SUBJECT || 'Novo lead recebido',
    text:
      `Novo lead recebido\n\n` +
      `Nome: ${nome || '(não informado)'}\n` +
      `E-mail: ${email}\n` +
      `Telefone: ${telefone || '(não informado)'}\n` +
      `Interesse: ${interesse}\n\n` +
      'Mensagem automática do sistema Winove'
  };

  try {
    await mailTransporter.sendMail(message);
    res.json({ message: 'E-mail enviado com sucesso' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Winove API listening on port ${port}`);
});
