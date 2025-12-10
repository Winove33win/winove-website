import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { pool } from '../db.js';

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

const sanitizeString = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).replace(/[<>]/g, '').trim();
  return normalized.length ? normalized : null;
};

const stringifyServices = (services) => {
  if (!Array.isArray(services)) return { included: null, detailed: null };

  const included = services
    .map((item) => sanitizeString(item?.servico))
    .filter(Boolean)
    .join(', ');

  const detailed = services
    .map((item) => {
      const serviceName = sanitizeString(item?.servico) || 'Serviço';
      const value = sanitizeString(item?.valor) || 'Valor não informado';
      if (!sanitizeString(item?.servico) && !sanitizeString(item?.valor)) return null;
      return `${serviceName}: ${value}`;
    })
    .filter(Boolean)
    .join(' | ');

  return {
    included: included || null,
    detailed: detailed || null,
  };
};

router.post('/', async (req, res) => {
  const {
    lead_id,
    template_id,
    nome,
    email,
    empresa,
    telefone,
    cnpj,
    area_de_negocio,
    numero_de_funcionarios,
    setor,
    faturamento_anual,
    funcionarios_total,
    descricao,
    servicos,
    prazo,
    termos,
    assinaturaNome,
    aceiteDigital,
    portfolio,
  } = req.body || {};

  const sanitizedNome = sanitizeString(nome);
  const sanitizedEmail = sanitizeString(email);
  const sanitizedEmpresa = sanitizeString(empresa);

  if (!sanitizedNome || !sanitizedEmail || !sanitizedEmpresa) {
    return res.status(400).json({ error: 'nome, email e empresa são obrigatórios' });
  }

  const { included: servicosIncluidos, detailed: entregaveis } = stringifyServices(servicos);
  const assinaturaDigital = sanitizeString(assinaturaNome)
    ? `${sanitizeString(assinaturaNome)} (aceite digital)`
    : null;

  try {
    const insertQuery = `
      INSERT INTO propostas_comerciais (
        lead_id, template_id, status, nome, email, telefone, empresa, cnpj, area_de_negocio,
        numero_de_funcionarios, setor, faturamento_anual, funcionarios_total, objetivos_projeto, escopo,
        servicos_incluidos, entregaveis, metodologia, cronograma, prazo_entrega, prazos_etapas, equipe_responsavel,
        experiencia_referencias, garantia, manutencao_suporte, treinamento, ferramenta_tecnologias, propriedade_intelectual,
        confiabilidade_seguranca, escopo_limite, fora_do_escopo, fluxos_aprovacao, canais_suporte, sla, forma_pagamento,
        valor_total, condicoes_pagamento, reajuste, impostos, datas_importantes, responsavel, revisao, assinatura_digital,
        aceite_termos, data_envio, data_resposta, data_assinatura, obs_internas
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const insertValues = [
      lead_id ?? null,
      template_id ?? null,
      'criada_via_site',
      sanitizedNome,
      sanitizedEmail,
      sanitizeString(telefone),
      sanitizedEmpresa,
      sanitizeString(cnpj),
      sanitizeString(area_de_negocio),
      sanitizeString(numero_de_funcionarios),
      sanitizeString(setor),
      sanitizeString(faturamento_anual),
      sanitizeString(funcionarios_total),
      sanitizeString(descricao),
      sanitizeString(descricao),
      servicosIncluidos,
      entregaveis,
      null,
      null,
      sanitizeString(prazo),
      null,
      null,
      sanitizeString(portfolio),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      sanitizeString(termos),
      null,
      null,
      null,
      null,
      null,
      assinaturaDigital,
      aceiteDigital ? 1 : 0,
      new Date(),
      null,
      null,
      null,
    ];

    const [result] = await pool.execute(insertQuery, insertValues);

    const to = process.env.CONTACT_EMAIL;
    let emailSent = false;

    if (to && !missingEnv.length) {
      const subject = 'Nova solicitação de proposta recebida';
      const textLines = [
        'Uma nova solicitação de proposta chegou pelo site da Winove.',
        '',
        `Lead ID: ${lead_id || '-'}`,
        `Template selecionado: ${template_id || '-'}`,
        `Serviços selecionados: ${servicosIncluidos || 'Nenhum'}`,
        '',
        `Nome: ${sanitizedNome}`,
        `E-mail: ${sanitizedEmail}`,
        `Empresa: ${sanitizedEmpresa}`,
        `Interesse: ${sanitizeString(descricao) || '-'}`,
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
        emailSent = true;
      } catch (error) {
        console.error('Erro ao enviar e-mail de proposta:', error);
      }
    }

    return res.status(201).json({ ok: true, id: result?.insertId, emailSent });
  } catch (error) {
    console.error('Erro ao salvar proposta comercial:', error);
    return res.status(500).json({ error: 'falha_ao_registrar_proposta' });
  }
});

export default router;
