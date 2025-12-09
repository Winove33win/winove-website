import mysql from 'mysql2/promise';

async function truncatePosts() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  try {
    await connection.execute('TRUNCATE TABLE posts;');
    console.log('✅ Tabela `posts` foi esvaziada com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao truncar tabela:', error.message);
  } finally {
    await connection.end();
  }
}

truncatePosts();
