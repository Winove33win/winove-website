import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load env vars before validating DB config (Plesk may start outside /backend)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env'), override: false });

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Valores padrão usados no ambiente de Plesk/produção. Se as variáveis não estiverem
// presentes, usamos estes defaults para permitir que as rotas /api/templates e
// /api/blog-posts se conectem ao banco imediatamente após o deploy.
const connectionConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: toNumber(process.env.DB_PORT, 3306),
  user: process.env.DB_USER || 'winove',
  password: process.env.DB_PASSWORD || '9*19avmU0',
  database: process.env.DB_NAME || 'fernando_winove_com_br_',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
};

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.warn(
    '[DB] Variáveis ausentes; usando configuração padrão para tentar conexão ao banco (recomenda-se definir via ambiente).'
  );
}

export const pool = mysql.createPool(connectionConfig);
