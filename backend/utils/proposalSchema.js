import { missingDbEnv, pool } from '../db.js';
const MIN_COLUMNS = 46;

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

export const REQUIRED_COLUMNS = [
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

const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'COMMERCIAL_PANEL_USERNAME',
  'COMMERCIAL_PANEL_PASSWORD',
];

let cachedSchema;
let checkingPromise;

export const getCommercialPanelPassword = () => process.env.COMMERCIAL_PANEL_PASSWORD || '';

export const isCommercialPasswordValid = () => Boolean(getCommercialPanelPassword().trim());

export const validateEnvForProposals = () => {
  const missingEnv = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  const passwordOk = isCommercialPasswordValid();
  const failures = missingEnv.concat(!passwordOk ? ['COMMERCIAL_PANEL_PASSWORD'] : []);

  if (missingDbEnv.length) {
    failures.push(...missingDbEnv);
  }

  if (failures.length) {
    return {
      ok: false,
      message: !passwordOk
        ? 'Variavel COMMERCIAL_PANEL_PASSWORD ausente ou vazia. Defina uma senha no ambiente para habilitar o painel.'
        : `Variaveis de ambiente ausentes: ${[...new Set(failures)].join(', ')}.`,
      missingRequired: [...new Set(failures)],
    };
  }

  return { ok: true, missingRequired: [] };
};

export const getProposalSchemaStatus = async () => {
  if (cachedSchema) return cachedSchema;
  if (missingDbEnv.length || !pool) {
    return {
      ok: false,
      columnNames: [],
      missingRequired: REQUIRED_COLUMNS,
      message:
        'Variáveis de banco ausentes ou inválidas. Verifique DB_HOST, DB_PORT, DB_USER, DB_PASSWORD e DB_NAME no ambiente.',
    };
  }
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
            : `Schema incompleto: faltam ${missingRequired.join(', ')}. Ajuste a tabela propostas_comerciais conforme o checklist antes de continuar.`,
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

export const invalidateProposalSchemaCache = () => {
  cachedSchema = undefined;
};
