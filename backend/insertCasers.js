import mysql from 'mysql2/promise';

async function insertCasers(titulo, cliente, descricao, resultados, imagem) {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const sql = `
    INSERT INTO casers (titulo, cliente, descricao, resultados, imagem_capa)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await connection.execute(sql, [titulo, cliente, descricao, resultados, imagem]);
    console.log("✅ Caser inserido com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao inserir caser:", error.message);
  } finally {
    await connection.end();
  }
}

// Exemplo de uso
insertCasers(
  "Estudo de Caso Winove",
  "Cliente Exemplo",
  "Desafio enfrentado...",
  "Resultados alcançados...",
  "https://exemplo.com/capa.jpg"
);
