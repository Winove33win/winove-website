import mysql from 'mysql2/promise';

async function selectData() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const [rows] = await connection.execute(`SELECT * FROM pagamentos`);
  console.log("📄 Registros encontrados:", rows);
  await connection.end();
}

selectData();
