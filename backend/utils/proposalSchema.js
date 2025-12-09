import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { pool } from '../db.js';

const REQUIRED_PASSWORD = 'VfY9KO';
const MIN_COLUMNS = 46;

const REQUIRED_ENV_VALUES = {
  DB_HOST: '127.0.0.1',
  DB_PORT: '3306',
  DB_NAME: 'fernando_winove_com_br_',
  DB_USER: 'winove',
  DB_PASSWORD: '9*19avmU0',
  COMMERCIAL_PANEL_USERNAME: 'comercial',
  COMMERCIAL_PANEL_PASSWORD: REQUIRED_PASSWORD,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

// Ensure the environment variable is always populated with the required password value
process.env.COMMERCIAL_PANEL_PASSWORD = process.env.COMMERCIAL_PANEL_PASSWORD || REQUIRED_PASSWORD;

export const getCommercialPanelPassword = () => process.env.COMMERCIAL_PANEL_PASSWORD || REQUIRED_PASSWORD;

export const PANEL_TO_DB_MAPPING = {
  nome: 'nome',
  empresa: 'empresa',
  email: 'email',
  portfolio: 'experiencia_referencias',
  descricao_objetivos: 'objetivos_projeto',
  descricao_escopo: 'escopo',
  servicos_incluidos: 'servicos_incluidos',
  servicos_detalhados: 'entregaveis',
  prazo: 'prazo_entrega',
  termos_condicoes: 'condicoes_pagamento',
  assinatura: 'assinatura_digital',
  aceite_digital: 'aceite_termos',
  pdf_blob: 'pdf_blob',
  pdf_download: 'pdf_download_url',
};

const REQUIRED_COLUMNS = [
  'id',
  'lead_id',
  'template_id',
  'status',
  'nome',
  'email',
  'telefone',
  'empresa',
  'cnpj',
  'area_de_negocio',
  'numero_de_funcionarios',
  'setor',
  'faturamento_anual',
  'funcionarios_total',
  'objetivos_projeto',
  'escopo',
  'servicos_incluidos',
  'entregaveis',
  'metodologia',
  'cronograma',
  'prazo_entrega',
  'prazos_etapas',
  'equipe_responsavel',
  'experiencia_referencias',
  'garantia',
  'manutencao_suporte',
  'treinamento',
  'ferramenta_tecnologias',
  'propriedade_intelectual',
  'confiabilidade_seguranca',
  'escopo_limite',
  'fora_do_escopo',
  'fluxos_aprovacao',
  'canais_suporte',
  'sla',
  'forma_pagamento',
  'valor_total',
  'condicoes_pagamento',
  'reajuste',
  'impostos',
  'datas_importantes',
  'responsavel',
  'revisao',
  'assinatura_digital',
  'aceite_termos',
  'data_envio',
  'data_resposta',
  'data_assinatura',
  'obs_internas',
  'pdf_blob',
  'pdf_download_url',
];

let cachedSchema;
let checkingPromise;
let cachedEnvStatus;
let checkingEnvPromise;

export const isCommercialPasswordValid = () => getCommercialPanelPassword() === REQUIRED_PASSWORD;

const buildEnvStep = (key, value, expected) => {
  const matchesExpected = value === expected;
  const isPasswordKey = key === 'COMMERCIAL_PANEL_PASSWORD';
  const ok = Boolean(value) && (!isPasswordKey || matchesExpected);

  return {
    key,
    expected,
    value: value || null,
    ok,
    matchesExpected,
    action: ok
      ? 'Variável carregada.'
      : `Defina ${key} com o valor ${expected} no .env ou no Plesk e reinicie o Node para aplicar.`,
  };
};

const getEnvStatus = async () => {
  if (cachedEnvStatus) return cachedEnvStatus;

  if (!checkingEnvPromise) {
    checkingEnvPromise = fs
      .access(envPath)
      .then(() => true)
      .catch(() => false)
      .then((envFileExists) => {
        const steps = Object.entries(REQUIRED_ENV_VALUES).map(([key, expected]) =>
          buildEnvStep(key, process.env[key], expected)
        );

        const envValuesLoaded = steps.every((step) => Boolean(step.value));
        const passwordOk = steps.find((step) => step.key === 'COMMERCIAL_PANEL_PASSWORD')?.ok ?? false;
        const ok = (envFileExists || envValuesLoaded) && passwordOk;

        cachedEnvStatus = {
          ok,
          envFileExists,
          steps,
          message: ok
            ? 'Variáveis de ambiente carregadas e senha validada.'
            : 'Configure o arquivo .env (ou variáveis no Plesk) com os valores exigidos antes de registrar propostas.',
        };

        checkingEnvPromise = null;
        return cachedEnvStatus;
      })
      .catch((error) => {
        cachedEnvStatus = {
          ok: false,
          envFileExists: false,
          steps: [],
          message: `Falha ao validar variáveis de ambiente: ${error.message}`,
        };
        checkingEnvPromise = null;
        return cachedEnvStatus;
      });
  }

  return checkingEnvPromise;
};

export const getProposalSchemaStatus = async () => {
  if (cachedSchema) return cachedSchema;
  if (!checkingPromise) {
    checkingPromise = pool
      .query(
        `SELECT COLUMN_NAME, DATA_TYPE FROM information_schema.columns WHERE table_schema = ? AND table_name = 'propostas_comerciais'`,
        [process.env.DB_NAME || 'fernando_winove_com_br_']
      )
      .then(([rows]) => {
        const names = rows.map((row) => row.COLUMN_NAME);
        const columnSet = new Set(names);
        const missingRequired = REQUIRED_COLUMNS.filter((column) => !columnSet.has(column));
        const ok = rows.length >= MIN_COLUMNS && missingRequired.length === 0;

        cachedSchema = {
          ok,
          columnNames: names,
          missingRequired,
          message: ok
            ? 'Schema validado com sucesso.'
            : `Schema incompleto: faltam ${missingRequired.join(', ')}. É necessário alinhar a tabela propostas_comerciais com o schema JSON do phpMyAdmin antes de continuar.`,
        };
        checkingPromise = null;
        return cachedSchema;
      })
      .catch((error) => {
        cachedSchema = {
          ok: false,
          columnNames: [],
          missingRequired: REQUIRED_COLUMNS,
          message: `Falha ao validar schema de propostas: ${error.message}`,
        };
        checkingPromise = null;
        return cachedSchema;
      });
  }

  return checkingPromise;
};

export const getProposalReadiness = async () => {
  const [envStatus, schemaStatus] = await Promise.all([getEnvStatus(), getProposalSchemaStatus()]);

  return {
    ok: envStatus.ok && schemaStatus.ok,
    envStatus,
    schemaStatus,
  };
};

export const invalidateProposalSchemaCache = () => {
  cachedSchema = undefined;
  cachedEnvStatus = undefined;
};
