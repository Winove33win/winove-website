import mysql from 'mysql2/promise';

async function insertData() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const sql = `INSERT INTO pagamentos (nome, valor) VALUES (?, ?)`;
  const values = ['Fernando Winove', 199.90];

  await connection.execute(sql, values);
  console.log("✅ Registro inserido com sucesso.");
  await connection.end();
}

insertData();
