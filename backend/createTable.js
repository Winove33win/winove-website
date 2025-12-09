import mysql from 'mysql2/promise';

async function createTable() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const sql = `
    CREATE TABLE IF NOT EXISTS pagamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100),
      valor DECIMAL(10,2),
      data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await connection.execute(sql);
  console.log("✅ Tabela 'pagamentos' criada com sucesso.");
  await connection.end();
}

createTable();
