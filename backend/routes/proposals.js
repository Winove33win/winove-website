import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import { pool } from '../db.js';
import {
  getProposalReadiness,
  PANEL_TO_DB_MAPPING,
} from '../utils/proposalSchema.js';

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

const ensureSchemaIsReady = async () => getProposalReadiness();

const buildMappingNotes = (validationMessage) => ({
  nome_cliente: PANEL_TO_DB_MAPPING.nome,
  empresa: PANEL_TO_DB_MAPPING.empresa,
  email: PANEL_TO_DB_MAPPING.email,
  portfolio: PANEL_TO_DB_MAPPING.portfolio,
  descricao: `${PANEL_TO_DB_MAPPING.descricao_objetivos} + ${PANEL_TO_DB_MAPPING.descricao_escopo}`,
  servicos: `${PANEL_TO_DB_MAPPING.servicos_incluidos} + ${PANEL_TO_DB_MAPPING.servicos_detalhados}`,
  valores: PANEL_TO_DB_MAPPING.servicos_detalhados,
  prazo_entrega: PANEL_TO_DB_MAPPING.prazo,
  termos_condicoes: PANEL_TO_DB_MAPPING.termos_condicoes,
  assinatura: PANEL_TO_DB_MAPPING.assinatura,
  aceite_digital: PANEL_TO_DB_MAPPING.aceite_digital,
  pdf_download_url: PANEL_TO_DB_MAPPING.pdf_download,
  pdf_storage_info: PANEL_TO_DB_MAPPING.pdf_blob,
  observacao_validacao: validationMessage,
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
  doc.text(`Portfólio: ${proposalData.cliente.portfolio}`);
  doc.moveDown();

  doc.fontSize(14).text('Projeto');
  doc.fontSize(12);
  doc.text(`Descrição: ${proposalData.projeto.descricao}`);
  doc.text(`Prazo de entrega: ${proposalData.projeto.prazo_entrega}`);
  doc.moveDown();

  doc.fontSize(13).text('Serviços propostos');
  proposalData.projeto.servicos.forEach((servico, index) => {
    const valor = proposalData.projeto.valores[index]?.valor || '-';
    doc.text(`- ${servico} (Valor: ${valor})`);
  });
  doc.moveDown();

  doc.fontSize(13).text('Termos e condições');
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

router.get('/schema', async (_req, res) => {
  const status = await ensureSchemaIsReady();
  if (!status.ok) {
    return res.status(503).json({
      erro_mapeamento: 'Ambiente ou schema inválido para propostas.',
      campo_problematico: status.envStatus?.ok ? 'propostas_comerciais.schema' : 'variaveis_de_ambiente',
      detalhes_checagem: status,
    });
  }
  return res.json({ ok: true, columns: status.schemaStatus.columnNames, ambiente: status.envStatus });
});

router.get('/status', async (_req, res) => {
  const status = await ensureSchemaIsReady();
  if (!status.ok) {
    return res.status(503).json({
      erro_mapeamento: 'Pré-condições do painel não atendidas.',
      campo_problematico: status.envStatus?.ok ? 'propostas_comerciais.schema' : 'variaveis_de_ambiente',
      detalhes_checagem: status,
    });
  }

  return res.json({ ok: true, detalhes_checagem: status });
});

router.get('/:id/pdf', async (req, res) => {
  const status = await ensureSchemaIsReady();
  if (!status.ok) {
    return res.status(503).json({
      erro_mapeamento: 'Ambiente ou schema inválido para propostas.',
      campo_problematico: status.envStatus?.ok ? 'propostas_comerciais.schema' : 'variaveis_de_ambiente',
      detalhes_checagem: status,
    });
  }

  const proposalId = Number(req.params.id);
  if (!Number.isInteger(proposalId) || proposalId <= 0) {
    return res.status(400).json({ error: 'id_invalido' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT pdf_blob FROM propostas_comerciais WHERE id = ? LIMIT 1',
      [proposalId]
    );

    if (!rows.length || !rows[0].pdf_blob) {
      return res.status(404).json({ error: 'pdf_nao_encontrado' });
    }

    res
      .status(200)
      .set('Content-Type', 'application/pdf')
      .set('Content-Disposition', `attachment; filename="proposta-${proposalId}.pdf"`)
      .send(rows[0].pdf_blob);
  } catch (error) {
    console.error('Erro ao recuperar PDF da proposta:', error);
    res.status(500).json({ error: 'falha_ao_recuperar_pdf' });
  }
});

router.post('/', async (req, res) => {
  const status = await ensureSchemaIsReady();
  if (!status.ok) {
    const missingStep = status.envStatus?.ok ? 'propostas_comerciais.schema' : 'variaveis_de_ambiente';
    return res.status(503).json({
      erro_mapeamento:
        'Pré-condições obrigatórias ausentes. Ajuste .env/Plesk, aplique a migração 006_create_propostas_comerciais.sql e reinicie o Node.',
      campo_problematico: missingStep,
      detalhes_checagem: status,
    });
  }

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

  const schemaColumns = new Set(status.schemaStatus?.columnNames || []);
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
      erro_mapeamento: 'Lista de serviços inválida.',
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
      return res.status(400).json({ erro_mapeamento: 'Schema incompatível para inserção.' });
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

    const mappingObservation =
      `Schema validado com ${status.schemaStatus?.columnNames?.length || 0} colunas; ` +
      'valores sanitizados, checklist de env aplicado e PDF armazenado em pdf_blob.';

    const mapeamentoDetalhado = {
      nome_cliente: { coluna: PANEL_TO_DB_MAPPING.nome, valor: sanitizedNome },
      empresa: { coluna: PANEL_TO_DB_MAPPING.empresa, valor: sanitizedEmpresa },
      email: { coluna: PANEL_TO_DB_MAPPING.email, valor: sanitizedEmail },
      portfolio: { coluna: PANEL_TO_DB_MAPPING.portfolio, valor: sanitizeString(portfolio) },
      descricao: { coluna: `${PANEL_TO_DB_MAPPING.descricao_objetivos} + ${PANEL_TO_DB_MAPPING.descricao_escopo}`, valor: sanitizeString(descricao) },
      servicos: { coluna: `${PANEL_TO_DB_MAPPING.servicos_incluidos} + ${PANEL_TO_DB_MAPPING.servicos_detalhados}`, valor: servicos },
      valores: { coluna: PANEL_TO_DB_MAPPING.servicos_detalhados, valor: servicos },
      prazo_entrega: { coluna: PANEL_TO_DB_MAPPING.prazo, valor: sanitizeString(prazo) },
      termos_condicoes: { coluna: PANEL_TO_DB_MAPPING.termos_condicoes, valor: sanitizeString(termos) },
      assinatura: { coluna: PANEL_TO_DB_MAPPING.assinatura, valor: assinaturaDigital },
      aceite_digital: { coluna: PANEL_TO_DB_MAPPING.aceite_digital, valor: aceiteDigital },
      pdf_download_url: { coluna: PANEL_TO_DB_MAPPING.pdf_download, valor: `/api/propostas/${proposalId}/pdf` },
      pdf_storage_info: { coluna: PANEL_TO_DB_MAPPING.pdf_blob, valor: 'pdf_blob' },
      observacao_validacao: mappingObservation,
      checklist_ambiente: status.envStatus,
      checklist_schema: status.schemaStatus,
    };

    return res.status(201).json({
      ...proposalJson,
      pdf_download_url: `/api/propostas/${proposalId}/pdf`,
      pdf_storage_info: 'pdf_blob',
      mapeamento_indexacao: { ...buildMappingNotes(mappingObservation), ...mapeamentoDetalhado },
      email_enviado: emailSent,
      id: proposalId,
    });
  } catch (error) {
    console.error('Erro ao salvar proposta comercial:', error);
    return res.status(500).json({ error: 'falha_ao_registrar_proposta' });
  }
});

export default router;
