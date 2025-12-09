import mysql from 'mysql2/promise';

async function insertPost(titulo, slug, resumo, conteudo, imagem, autor) {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const sql = `
    INSERT INTO posts (titulo, slug, resumo, conteudo, imagem_destacada, autor)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    await connection.execute(sql, [titulo, slug, resumo, conteudo, imagem, autor]);
    console.log("✅ Post inserido com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao inserir post:", error.message);
  } finally {
    await connection.end();
  }
}

// Exemplo de uso
insertPost(
  "Título do post",
  "titulo-do-post",
  "Um breve resumo...",
  "<p>Conteúdo HTML ou texto</p>",
  "https://exemplo.com/imagem.jpg",
  "Admin"
);
