import mysql from 'mysql2/promise';

const HOST = process.env.DB_HOST || '127.0.0.1';
const PORT = Number(process.env.DB_PORT) || 3306;
const USER = process.env.DB_USER || 'winove';
const PASSWORD = process.env.DB_PASSWORD || '9*19avmU0';
const DATABASE = process.env.DB_NAME || 'fernando_winove_com_br_';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: HOST,
      port: PORT,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });

    console.log('✅ Conectado com sucesso ao banco de dados!');
    await connection.end();
  } catch (error) {
    console.error('❌ Falha ao conectar ao banco de dados:');
    console.error('* Código:', error.code, '\n* Mensagem:', error.message);
    if (error.address) console.error('* Host:', error.address);
    if (error.port) console.error('* Porta:', error.port);
  }
}

testConnection();
