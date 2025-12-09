import mysql from 'mysql2/promise';

const casers = [
  {
    titulo: 'Loja Virtual XYZ',
    cliente: 'XYZ E-commerce',
    descricao: 'Implementação completa de loja virtual.',
    resultados: 'Aumento de 50% nas vendas.',
    imagem: 'https://exemplo.com/caser1.jpg'
  },
  {
    titulo: 'App de Entregas Rápidas',
    cliente: 'Delivery Express',
    descricao: 'Plataforma móvel para entregas.',
    resultados: 'Redução de 30% no tempo de entrega.',
    imagem: 'https://exemplo.com/caser2.jpg'
  },
  {
    titulo: 'Portal Educacional',
    cliente: 'Universidade ABC',
    descricao: 'Criação de portal para alunos e professores.',
    resultados: 'Acesso facilitado ao conteúdo.',
    imagem: 'https://exemplo.com/caser3.jpg'
  },
  {
    titulo: 'Sistema de Reservas',
    cliente: 'Hotelaria Plus',
    descricao: 'Sistema integrado para reservas de hotéis.',
    resultados: 'Taxa de ocupação aumentou 20%.',
    imagem: 'https://exemplo.com/caser4.jpg'
  },
  {
    titulo: 'Campanha de Marketing Digital',
    cliente: 'Marca Famosa',
    descricao: 'Gestão completa de anúncios online.',
    resultados: 'Engajamento dobrou.',
    imagem: 'https://exemplo.com/caser5.jpg'
  },
  {
    titulo: 'Plataforma de Streaming',
    cliente: 'Stream Master',
    descricao: 'Desenvolvimento de serviço de streaming.',
    resultados: 'Milhares de novos assinantes.',
    imagem: 'https://exemplo.com/caser6.jpg'
  },
  {
    titulo: 'Automação de Processos',
    cliente: 'Indústria Tech',
    descricao: 'Automatização de etapas produtivas.',
    resultados: 'Produtividade +40%.',
    imagem: 'https://exemplo.com/caser7.jpg'
  },
  {
    titulo: 'Site Institucional Moderno',
    cliente: 'Corporação 123',
    descricao: 'Reformulação completa de site.',
    resultados: 'Melhor visibilidade online.',
    imagem: 'https://exemplo.com/caser8.jpg'
  },
  {
    titulo: 'Ferramenta de Analytics',
    cliente: 'Data Insights',
    descricao: 'Solução para análise de dados.',
    resultados: 'Decisões mais informadas.',
    imagem: 'https://exemplo.com/caser9.jpg'
  },
  {
    titulo: 'Portal de Vagas',
    cliente: 'RH Solutions',
    descricao: 'Portal para anúncio e gestão de vagas.',
    resultados: 'Contratações mais ágeis.',
    imagem: 'https://exemplo.com/caser10.jpg'
  }
];

async function seedCasers() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  const sql = `INSERT INTO casers (titulo, cliente, descricao, resultados, imagem_capa) VALUES (?, ?, ?, ?, ?)`;

  try {
    for (const caser of casers) {
      await connection.execute(sql, [caser.titulo, caser.cliente, caser.descricao, caser.resultados, caser.imagem]);
    }
    console.log('✅ 10 casers de exemplo inseridos.');
  } catch (error) {
    console.error('❌ Erro ao inserir casers:', error.message);
  } finally {
    await connection.end();
  }
}

seedCasers();
