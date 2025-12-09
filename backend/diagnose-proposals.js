#!/usr/bin/env node

/**
 * Script de Diagnóstico para /api/propostas
 * Executa verificações de:
 * - Variáveis de ambiente obrigatórias
 * - Conexão ao banco de dados
 * - Schema da tabela propostas_comerciais
 * 
 * Uso: node diagnose-proposals.js
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { getProposalSchemaStatus, validateEnvForProposals, PANEL_TO_DB_MAPPING } from './utils/proposalSchema.js';

// Carregar .env
dotenv.config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ${colors.reset}`),
  ok: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

const checkEnvVars = () => {
  log.header('1. Variáveis de Ambiente');

  const required = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'COMMERCIAL_PANEL_PASSWORD',
  ];

  const optional = [
    'COMMERCIAL_PANEL_USERNAME',
    'MAIL_HOST',
    'MAIL_PORT',
    'MAIL_USER',
    'MAIL_PASS',
    'CONTACT_EMAIL',
  ];

  let allGood = true;

  required.forEach((key) => {
    const val = process.env[key];
    if (val) {
      log.ok(`${key} definida`);
    } else {
      log.error(`${key} NÃO definida`);
      allGood = false;
    }
  });

  optional.forEach((key) => {
    const val = process.env[key];
    if (val) {
      log.ok(`${key} definida (opcional)`);
    } else {
      log.warn(`${key} não definida (opcional)`);
    }
  });

  return allGood;
};

const testDatabaseConnection = async () => {
  log.header('2. Conexão ao Banco de Dados');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'winove',
      password: process.env.DB_PASSWORD || '9*19avmU0',
      database: process.env.DB_NAME || 'fernando_winove_com_br_',
    });

    log.ok(`Conectado com sucesso a ${process.env.DB_NAME || 'fernando_winove_com_br_'}`);
    await connection.end();
    return true;
  } catch (error) {
    log.error(`Falha ao conectar: ${error?.message}`);
    if (error?.code === 'ECONNREFUSED') {
      log.info(`O MySQL pode estar desligado ou a porta ${process.env.DB_PORT || 3306} está fechada.`);
    }
    if (error?.code === 'ER_ACCESS_DENIED_FOR_USER') {
      log.info('Credenciais (usuário/senha) inválidas.');
    }
    if (error?.code === 'ER_BAD_DB_ERROR') {
      log.info(`Base de dados "${process.env.DB_NAME}" não existe.`);
    }
    return false;
  }
};

const checkSchema = async () => {
  log.header('3. Schema da Tabela propostas_comerciais');

  const schemaStatus = await getProposalSchemaStatus();

  if (!schemaStatus.ok) {
    log.error(`Schema inválido: ${schemaStatus.message}`);
    if (schemaStatus.missingRequired && schemaStatus.missingRequired.length) {
      log.info(`Colunas obrigatórias faltando: ${schemaStatus.missingRequired.join(', ')}`);
      log.info('Execute: node scripts/migrate.mjs ou carregue backend/migrations/006_create_propostas_comerciais.sql');
    }
    return false;
  }

  log.ok(`Schema válido (${schemaStatus.columnNames?.length || 0} colunas)`);
  log.info(`Colunas presentes: ${schemaStatus.columnNames?.slice(0, 5).join(', ')} ...`);
  return true;
};

const checkPanelAuth = () => {
  log.header('4. Autenticação do Painel Comercial');

  const envStatus = validateEnvForProposals();

  if (!envStatus.ok) {
    log.error(`Painel bloqueado: ${envStatus.message}`);
    log.info('Defina COMMERCIAL_PANEL_PASSWORD (qualquer valor não vazio) no Plesk ou em .env');
    return false;
  }

  log.ok('Painel comercial desbloqueado');
  return true;
};

const checkMailConfig = () => {
  log.header('5. Configuração de E-mail (Opcional)');

  const required = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'CONTACT_EMAIL'];
  const missing = required.filter((k) => !process.env[k]);

  if (missing.length === required.length) {
    log.warn('E-mail não configurado. Propostas serão salvas, mas notificações não serão enviadas.');
    return false;
  }

  if (missing.length) {
    log.warn(`Configuração de e-mail incompleta. Faltam: ${missing.join(', ')}`);
    return false;
  }

  log.ok('E-mail configurado');
  return true;
};

const main = async () => {
  console.log('\n🔍 DIAGNÓSTICO DE /api/propostas\n');

  const envOk = checkEnvVars();
  const dbOk = await testDatabaseConnection();
  const schemaOk = await checkSchema();
  const authOk = checkPanelAuth();
  checkMailConfig();

  log.header('Resumo Final');

  if (envOk && dbOk && schemaOk && authOk) {
    log.ok('Todas as verificações passaram! A rota /api/propostas deve funcionar.');
    console.log('\n📝 Próximos passos:');
    console.log('  1. Reinicie o serviço Node no Plesk (ou PM2/systemd)');
    console.log('  2. Teste: GET https://winove.com.br/api/propostas/schema (Basic Auth: comercial:<sua_senha>)');
    console.log('  3. Se ok, teste: POST https://winove.com.br/api/propostas com payload válido\n');
  } else {
    log.error('Algumas verificações falharam. Veja acima o que precisa ser corrigido.');
    console.log('\n💡 Dicas:');
    console.log('  - Se "Conexão ao Banco" falhar, verifique host/porta/credenciais');
    console.log('  - Se "Schema" falhar, execute: node scripts/migrate.mjs');
    console.log('  - Se variáveis faltam, atualize .env ou configure no Plesk e reinicie\n');
  }
};

main().catch((err) => {
  log.error(`Erro inesperado: ${err?.message}`);
  console.error(err);
  process.exit(1);
});
