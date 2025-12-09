import mysql from 'mysql2/promise';

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const createPostsTable = `
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      resumo TEXT,
      conteudo LONGTEXT,
      imagem_destacada TEXT,
      data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      autor VARCHAR(255),
      categoria VARCHAR(255)
    );
  `;

  const createCasesTable = `
    CREATE TABLE IF NOT EXISTS cases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT,
      coverImage TEXT,
      tags JSON,
      metrics JSON,
      gallery JSON,
      content LONGTEXT,
      client VARCHAR(255),
      category VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await connection.execute(createPostsTable);
    console.log("✅ Tabela 'blog_posts' criada com sucesso.");

    await connection.execute(createCasesTable);
    console.log("✅ Tabela 'cases' criada com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error.message);
  } finally {
    await connection.end();
  }
}

setupDatabase();
