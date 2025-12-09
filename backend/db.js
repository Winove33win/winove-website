import mysql from 'mysql2/promise';

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  throw new Error(
    `Missing required database environment variables: ${missingVars.join(', ')}. ` +
      'Set them in your deployment environment or a local .env file before starting the server.'
  );
}

const dbPort = Number(process.env.DB_PORT);

if (Number.isNaN(dbPort)) {
  throw new Error('DB_PORT must be a valid number.');
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: dbPort,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
});
