import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load env vars before validating DB config (Plesk may start outside /backend)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env'), override: false });

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
const dbPort = Number(process.env.DB_PORT);

// Fallback pool: rejects queries but allows server to start and rotas a aplicar fallbacks
const makeFailingPool = (reason) => {
  const reject = () => Promise.reject(new Error(reason));
  return { query: reject, execute: reject };
};

let resolvedPool;

if (missingVars.length) {
  console.warn(
    `[DB] Variaveis ausentes: ${missingVars.join(', ')}. Usando pool de fallback (consultas serao rejeitadas).`
  );
  resolvedPool = makeFailingPool('Database env vars missing');
} else if (Number.isNaN(dbPort)) {
  console.warn('[DB] DB_PORT invalido. Usando pool de fallback (consultas serao rejeitadas).');
  resolvedPool = makeFailingPool('DB_PORT invalid');
} else {
  resolvedPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: dbPort,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
    queueLimit: 0,
  });
}

export const pool = resolvedPool;
