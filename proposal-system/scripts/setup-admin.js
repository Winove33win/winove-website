/**
 * Script de configuração inicial — cria o usuário admin
 * Execute uma vez após rodar o schema SQL:
 *   node scripts/setup-admin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const name = process.env.ADMIN_NAME || 'Fernando';
  const email = process.env.ADMIN_EMAIL || 'fernando@winove.com.br';
  const password = process.env.ADMIN_PASSWORD || 'VfY9KO';

  const hash = await bcrypt.hash(password, 12);

  await conn.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
    [name, email, hash, hash]
  );

  console.log(`✅ Admin criado/atualizado com sucesso!`);
  console.log(`   E-mail: ${email}`);
  console.log(`   Senha: ${password}`);
  console.log(`\n   Acesse: ${process.env.BASE_URL || 'http://localhost:' + (process.env.PORT || 3333)}/login`);

  await conn.end();
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
