import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import { missingDbEnv, pool } from '../db.js';
import {
  getProposalSchemaStatus,
  PANEL_TO_DB_MAPPING,
  validateEnvForProposals,
} from '../utils/proposalSchema.js';

dotenv.config();

const router = Router();

const requiredMailEnv = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
const missingMailEnv = requiredMailEnv.filter((key) => !process.env[key]);
if (missingMailEnv.length) {
  console.warn(
    `Variaveis de ambiente ausentes para SMTP: ${missingMailEnv.join(', ')}. ` +
      'O envio de e-mail de propostas falhara ate que sejam definidas.'
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
      const serviceName = sanitizeString(item?.servico) || 'Servico';
      const value = sanitizeString(item?.valor) || 'Valor nao informado';
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

const ensureSchemaIsReady = async () => {
  const envStatus = validateEnvForProposals();
  if (!envStatus.ok) {
    return {
      ok: false,
      reason: 'environment',
      message: envStatus.message,
      missingRequired: envStatus.missingRequired,
    };
  }

  const schemaStatus = await getProposalSchemaStatus();
  if (!schemaStatus.ok) {
    return {
      ok: false,
      reason: 'schema',
      message: schemaStatus.message,
      missingRequired: schemaStatus.missingRequired,
    };
  }

  return {
    ok: true,
    columns: schemaStatus.columnNames,
    message: schemaStatus.message,
  };
};

const buildMappingNotes = (proposalJson, validationMessage) => ({
  nome_cliente: PANEL_TO_DB_MAPPING.nome,
  empresa: PANEL_TO_DB_MAPPING.empresa,
  email: PANEL_TO_DB_MAPPING.email,
  portfolio: PANEL_TO_DB_MAPPING.portfolio,
  descricao_objetivos: PANEL_TO_DB_MAPPING.descricao_objetivos,
  descricao_escopo: PANEL_TO_DB_MAPPING.descricao_escopo,
  servicos_incluidos: PANEL_TO_DB_MAPPING.servicos_incluidos,
  servicos_detalhados: PANEL_TO_DB_MAPPING.servicos_detalhados,
  prazo_entrega: PANEL_TO_DB_MAPPING.prazo,
  termos_condicoes: PANEL_TO_DB_MAPPING.termos_condicoes,
  assinatura: PANEL_TO_DB_MAPPING.assinatura,
  aceite_digital: PANEL_TO_DB_MAPPING.aceite_digital,
  pdf_download_url: PANEL_TO_DB_MAPPING.pdf_download,
  pdf_storage_info: PANEL_TO_DB_MAPPING.pdf_blob,
  observacao_validacao: validationMessage,
  checklist_campos: {
    cliente: proposalJson.cliente,
    projeto: proposalJson.projeto,
    termos_condicoes: proposalJson.termos_condicoes,
    assinatura: proposalJson.assinatura,
  },
});

const generateProposalPdf = async (proposalId, proposalData) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(20).text('Proposta Comercial', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`ID do registro: ${proposalId}`);
  doc.moveDown();

  doc.fontSize(14).text('Cliente');
  doc.fontSize(12);
  doc.text(`Nome: ${proposalData.cliente.nome}`);
  doc.text(`Empresa: ${proposalData.cliente.empresa}`);
  doc.text(`E-mail: ${proposalData.cliente.email}`);
  doc.text(`Portfolio: ${proposalData.cliente.portfolio}`);
  doc.moveDown();

  doc.fontSize(14).text('Projeto');
  doc.fontSize(12);
  doc.text(`Descricao: ${proposalData.projeto.descricao}`);
  doc.text(`Prazo de entrega: ${proposalData.projeto.prazo_entrega}`);
  doc.moveDown();

  doc.fontSize(13).text('Servicos propostos');
  proposalData.projeto.servicos.forEach((servico, index) => {
    const valor = proposalData.projeto.valores[index]?.valor || '-';
    doc.text(`- ${servico} (Valor: ${valor})`);
  });
  doc.moveDown();

  doc.fontSize(13).text('Termos e condicoes');
  doc.fontSize(12).text(proposalData.termos_condicoes);
  doc.moveDown();

  doc.fontSize(13).text('Assinatura');
  doc.fontSize(12).text(proposalData.assinatura);

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
};

const sendEnvOrSchemaError = (res, status) =>
  res.status(503).json({
    error: 'schema_invalido',
    message: status.message,
    missing: status.missingRequired,
  });

const sendDbUnavailable = (res) =>
  res.status(503).json({
    error: 'db_config_invalida',
    message: 'Variáveis de banco ausentes. Verifique DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.',
    missing: missingDbEnv,
  });

router.get('/schema', async (_req, res) => {
  const status = await ensureSchemaIsReady();
  if (!status.ok) return sendEnvOrSchemaError(res, status);
  return res.json({ ok: true, columns: status.columns });
});

router.get('/:id/pdf', async (req, res) => {
  const status = await ensureSchemaIsReady();
  if (!status.ok) return sendEnvOrSchemaError(res, status);
  if (!pool) return sendDbUnavailable(res);

  const proposalId = Number(req.params.id);
  if (!Number.isInteger(proposalId) || proposalId <= 0) {
    return res.status(400).json({ erro_mapeamento: 'id_invalido', campo_problematico: 'id' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT pdf_blob FROM propostas_comerciais WHERE id = ? LIMIT 1',
      [proposalId]
    );

    if (!rows.length || !rows[0].pdf_blob) {
      return res.status(404).json({ erro_mapeamento: 'pdf_nao_encontrado', campo_problematico: 'pdf_blob' });
    }

    res
      .status(200)
      .set('Content-Type', 'application/pdf')
      .set('Content-Disposition', `attachment; filename="proposta-${proposalId}.pdf"`)
      .send(rows[0].pdf_blob);
  } catch (error) {
    console.error('Erro ao recuperar PDF da proposta:', error);
    res.status(500).json({ erro_mapeamento: 'falha_ao_recuperar_pdf', campo_problematico: 'pdf_blob' });
  }
});

router.post('/', async (req, res) => {
  const status = await ensureSchemaIsReady();
  if (!status.ok) return sendEnvOrSchemaError(res, status);
  if (!pool) return sendDbUnavailable(res);

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
    return res.status(400).json({
      erro_mapeamento: 'Campos obrigatorios ausentes.',
      campo_problematico: ['nome', 'email', 'empresa'].filter((field) => !sanitizeString(req.body?.[field])),
    });
  }

  const schemaColumns = new Set(status.columns || []);
  const missingFields = Object.values(PANEL_TO_DB_MAPPING).filter((column) => !schemaColumns.has(column));
  if (missingFields.length) {
    return res.status(400).json({
      erro_mapeamento: 'Campos do painel sem coluna correspondente no banco.',
      campo_problematico: missingFields,
    });
  }

  const { included: servicosIncluidos, detailed: entregaveis } = stringifyServices(servicos);
  const assinaturaDigital = sanitizeString(assinaturaNome)
    ? `${sanitizeString(assinaturaNome)} (aceite digital)`
    : null;

  const proposalJson = {
    cliente: {
      nome: sanitizedNome,
      empresa: sanitizedEmpresa,
      email: sanitizedEmail,
      portfolio: sanitizeString(portfolio) || '',
    },
    projeto: {
      descricao: sanitizeString(descricao) || '',
      servicos: servicos?.map((s) => sanitizeString(s?.servico) || '').filter(Boolean) || [],
      valores:
        servicos?.map((s) => ({
          servico: sanitizeString(s?.servico) || '',
          valor: sanitizeString(s?.valor) || '',
        })) || [],
      prazo_entrega: sanitizeString(prazo) || '',
    },
    termos_condicoes: sanitizeString(termos) || '',
    assinatura: assinaturaDigital || '',
  };

  if (!proposalJson.projeto.servicos.length || !proposalJson.projeto.valores.length) {
    return res.status(400).json({
      erro_mapeamento: 'Lista de servicos invalida.',
      campo_problematico: 'servicos',
    });
  }

  try {
    const insertPayload = {
      lead_id: lead_id ?? null,
      template_id: template_id ?? null,
      status: 'criada_via_site',
      nome: sanitizedNome,
      email: sanitizedEmail,
      telefone: sanitizeString(telefone),
      empresa: sanitizedEmpresa,
      cnpj: sanitizeString(cnpj),
      area_de_negocio: sanitizeString(area_de_negocio),
      numero_de_funcionarios: sanitizeString(numero_de_funcionarios),
      setor: sanitizeString(setor),
      faturamento_anual: sanitizeString(faturamento_anual),
      funcionarios_total: sanitizeString(funcionarios_total),
      objetivos_projeto: sanitizeString(descricao),
      escopo: sanitizeString(descricao),
      servicos_incluidos: servicosIncluidos,
      entregaveis,
      prazo_entrega: sanitizeString(prazo),
      experiencia_referencias: sanitizeString(portfolio),
      condicoes_pagamento: sanitizeString(termos),
      assinatura_digital: assinaturaDigital,
      aceite_termos: aceiteDigital ? 1 : 0,
      data_envio: new Date(),
    };

    const columns = Object.keys(insertPayload).filter((column) => schemaColumns.has(column));
    const values = columns.map((key) => insertPayload[key]);

    if (columns.length < 10) {
      return res.status(400).json({ erro_mapeamento: 'Schema incompativel para insercao.', campo_problematico: columns });
    }

    const placeholders = columns.map(() => '?').join(',');
    const insertQuery = `INSERT INTO propostas_comerciais (${columns.join(',')}) VALUES (${placeholders})`;

    const [result] = await pool.execute(insertQuery, values);
    const proposalId = result?.insertId;

    const pdfBuffer = await generateProposalPdf(proposalId, proposalJson);

    await pool.execute(
      'UPDATE propostas_comerciais SET pdf_blob = ?, pdf_download_url = ? WHERE id = ?',
      [pdfBuffer, `/api/propostas/${proposalId}/pdf`, proposalId]
    );

    const to = process.env.CONTACT_EMAIL;
    let emailSent = false;

    if (to && !missingMailEnv.length) {
      const subject = 'Nova solicitacao de proposta recebida';
      const textLines = [
        'Uma nova solicitacao de proposta chegou pelo site da Winove.',
        '',
        `Lead ID: ${lead_id || '-'}`,
        `Template selecionado: ${template_id || '-'}`,
        `Servicos selecionados: ${servicosIncluidos || 'Nenhum'}`,
        '',
        `Nome: ${sanitizedNome}`,
        `E-mail: ${sanitizedEmail}`,
        `Empresa: ${sanitizedEmpresa}`,
        `Interesse: ${sanitizeString(descricao) || '-'}`,
        '',
        'Mensagem automatica do site da Winove.',
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

    const mappingObservation =
      `Schema validado com ${status.columns?.length || 0} colunas; ` +
      'campos foram cruzados com as colunas correspondentes e o PDF foi salvo em pdf_blob.';

    return res.status(201).json({
      ...proposalJson,
      pdf_download_url: `/api/propostas/${proposalId}/pdf`,
      pdf_storage_info: 'pdf_blob',
      mapeamento_indexacao: buildMappingNotes(proposalJson, mappingObservation),
      email_enviado: emailSent,
      id: proposalId,
    });
  } catch (error) {
    console.error('Erro ao salvar proposta comercial:', error?.stack || error);
    const detalhe = typeof error?.message === 'string' ? error.message : String(error);
    return res
      .status(500)
      .json({ erro_mapeamento: 'falha_ao_registrar_proposta', campo_problematico: 'banco', detalhe });
  }
});

export default router;
