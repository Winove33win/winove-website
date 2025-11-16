import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const requiredMailEnv = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
const missingEnv = requiredMailEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.warn(
    `⚠️  Variáveis de ambiente ausentes para SMTP: ${missingEnv.join(', ')}. ` +
      'O envio de e-mail de propostas falhará até que sejam definidas.'
  );
}

const mailTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const formatAdditionalServices = (value) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return 'Nenhum';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value);
};

router.post('/', async (req, res) => {
  const { lead_id, template_id, servicos_adicionais, nome, email, interesse } = req.body || {};

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    console.error('CONTACT_EMAIL não configurado para envio de propostas.');
    return res.status(500).json({ error: 'falha_ao_enviar_email' });
  }

  const subject = 'Nova solicitação de proposta recebida';
  const textLines = [
    'Uma nova solicitação de proposta chegou pelo site da Winove.',
    '',
    `Lead ID: ${lead_id || '-'}`,
    `Template selecionado: ${template_id || '-'}`,
    `Serviços adicionais: ${formatAdditionalServices(servicos_adicionais)}`,
    '',
    `Nome: ${nome || '-'}`,
    `E-mail: ${email || '-'}`,
    `Interesse: ${interesse || '-'}`,
    '',
    'Mensagem automática do site da Winove.',
  ];

  const message = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text: textLines.join('\n'),
  };

  try {
    await mailTransport.sendMail(message);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Erro ao enviar e-mail de proposta:', error);
    return res.status(500).json({ error: 'falha_ao_enviar_email' });
  }
});

export default router;
