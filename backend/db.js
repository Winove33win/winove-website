import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// ------------------------------------------------------------
// Load environment variables early
//
// Quando a aplicação é executada em ambientes como Plesk/Passenger,
// o diretório de trabalho pode não ser o root do projeto. Módulos
// importados antes da inicialização do servidor (como este pool de
// banco) verificam as variáveis assim que o arquivo é avaliado.
// Se nenhuma .env tiver sido carregada ainda, essas verificações falham
// e o servidor encerra com “Missing required database environment variables”.
//
// Para prevenir isso, carregamos os arquivos .env aqui. Tentamos primeiro
// backend/.env e depois fallback para ../.env (um nível acima), de forma
// semelhante ao `index.js`, garantindo que as variáveis estejam disponíveis
// durante a inicialização do módulo.
dotenv.config({ path: new URL('./.env', import.meta.url).pathname });
dotenv.config({ path: new URL('../.env', import.meta.url).pathname, override: false });

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
