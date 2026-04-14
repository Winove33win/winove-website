const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-03:00',
  charset: 'utf8mb4'
});

pool.getConnection()
  .then(conn => {
    console.log('[DB] Conectado ao MariaDB com sucesso');
    conn.release();
  })
  .catch(err => {
    console.error('[DB] Erro ao conectar:', err.message);
    process.exit(1);
  });

module.exports = pool;
