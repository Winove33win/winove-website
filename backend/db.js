import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que backend/.env seja carregado mesmo quando o processo inicia em outro diretório
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env'), override: false });

const REQUIRED_DB_VARS = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

const missingDbEnv = REQUIRED_DB_VARS.filter((key) => !process.env[key]);

if (missingDbEnv.length) {
  console.error(
    `Missing required database environment variables: ${missingDbEnv.join(', ')}. ` +
      'Configure o .env ou as variáveis do Plesk antes de iniciar o app.'
  );
}

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const pool = missingDbEnv.length
  ? null
  : mysql.createPool({
      host: process.env.DB_HOST,
      port: toNumber(process.env.DB_PORT, 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: toNumber(process.env.DB_CONN_LIMIT, 10),
      queueLimit: 0,
    });

export { pool, missingDbEnv };
