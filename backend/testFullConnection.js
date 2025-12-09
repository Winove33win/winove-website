// testFullConnection.js
import mysql from 'mysql2/promise';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// 🔧 Configurações do banco - podem ser sobrescritas por variáveis de ambiente
const HOST = process.env.DB_HOST || '127.0.0.1';
const PORT = Number(process.env.DB_PORT) || 3306;
const USER = process.env.DB_USER || 'winove';
const PASSWORD = process.env.DB_PASSWORD || '9*19avmU0';
const DATABASE = process.env.DB_NAME || 'fernando_winove_com_br_';

async function diagnosticoRede() {
  console.log('\n🔎 Iniciando diagnóstico de rede...\n');

  try {
    const { stdout: ip } = await execAsync('curl -s ifconfig.me');
    console.log('🌐 IP público do ambiente:', ip.trim());
  } catch (err) {
    console.warn('⚠️ Não foi possível obter o IP público:', err.stderr || err.message);
  }

  try {
    const { stdout: pingOut } = await execAsync(`ping -c 2 ${HOST}`);
    console.log('✅ Ping:', pingOut);
  } catch (err) {
    console.warn('⚠️ Ping falhou:', err.stderr || err.message);
  }

  try {
    const { stdout: nsOut } = await execAsync(`nslookup ${HOST}`);
    console.log('✅ NSLookup:', nsOut);
  } catch (err) {
    console.warn('⚠️ NSLookup falhou:', err.stderr || err.message);
  }

  try {
    const { stdout: telnetOut } = await execAsync(`timeout 5 bash -c "</dev/tcp/${HOST}/${PORT}" && echo ✅ Porta ${PORT} aberta || echo ❌ Porta ${PORT} inacessível`);
    console.log('✅ Telnet (porta):', telnetOut);
  } catch (err) {
    console.warn('⚠️ Teste de porta falhou:', err.stderr || err.message);
  }

  console.log('\n🔗 Tentando conectar ao banco de dados...\n');
}

async function conectarDB() {
  try {
    const connection = await mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
      port: PORT
    });

    console.log('✅ Conectado com sucesso ao banco de dados!');
    await connection.end();
  } catch (error) {
    console.error("❌ Falha ao conectar ao banco de dados:", error.message);
  }
}

(async () => {
  await diagnosticoRede();
  await conectarDB();
})();
