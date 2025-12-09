import mysql from 'mysql2/promise';

// Função para gerar slug a partir do título
function generateSlug(title, existingSlugs) {
  let slugBase = title
    .toLowerCase()
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = slugBase;
  let count = 1;

  while (existingSlugs.has(slug)) {
    slug = `${slugBase}-${count}`;
    count++;
  }

  existingSlugs.add(slug);
  return slug;
}

// Posts sem slug (será gerado)
const posts = [
  {
    titulo: 'Bem-vindo ao Blog',
    resumo: 'Post inaugural dando boas vindas ao blog.',
    conteudo: '<p>Este é o nosso primeiro post no blog!</p>',
    imagem: 'https://exemplo.com/post1.jpg',
    autor: 'Admin'
  },
  {
    titulo: 'Novidades da Plataforma',
    resumo: 'Veja o que mudou na última atualização.',
    conteudo: '<p>Muitas melhorias implementadas.</p>',
    imagem: 'https://exemplo.com/post2.jpg',
    autor: 'Admin'
  },
  {
    titulo: 'Dicas de Produtividade',
    resumo: 'Pequenas ações para melhorar seu dia a dia.',
    conteudo: '<p>Confira nossas dicas valiosas.</p>',
    imagem: 'https://exemplo.com/post3.jpg',
    autor: 'Equipe Winove'
  }
];

async function seedPosts() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const sql = `INSERT INTO posts (titulo, slug, resumo, conteudo, imagem_destacada, autor) VALUES (?, ?, ?, ?, ?, ?)`;

  const existingSlugs = new Set();

  try {
    for (const post of posts) {
      const slug = generateSlug(post.titulo, existingSlugs);
      await connection.execute(sql, [
        post.titulo,
        slug,
        post.resumo,
        post.conteudo,
        post.imagem,
        post.autor
      ]);
      console.log(`✅ Post inserido: ${post.titulo} (slug: ${slug})`);
    }
  } catch (error) {
    console.error('❌ Erro ao inserir posts:', error.message);
  } finally {
    await connection.end();
  }
}

seedPosts();
