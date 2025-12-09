import mysql from 'mysql2/promise';

async function seedData() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'winove',
    password: '9*19avmU0',
    database: 'fernando_winove_com_br_'
  });

  // Sample blog posts
  const samplePosts = [
    {
      titulo: "Como o SEO Transformou o E-commerce da TechStore",
      slug: "seo-transformou-ecommerce-techstore",
      resumo: "Descubra como implementamos uma estratégia de SEO que aumentou o tráfego orgânico em 340% em apenas 6 meses.",
      conteudo: `
        <h2>O Desafio</h2>
        <p>A TechStore enfrentava baixa visibilidade nos mecanismos de busca e dependia principalmente de tráfego pago para gerar vendas.</p>
        
        <h2>Nossa Estratégia</h2>
        <p>Desenvolvemos uma estratégia abrangente de SEO focada em:</p>
        <ul>
          <li>Otimização técnica do site</li>
          <li>Criação de conteúdo relevante</li>
          <li>Link building estratégico</li>
          <li>Otimização da experiência do usuário</li>
        </ul>
        
        <h2>Resultados Alcançados</h2>
        <p>Em 6 meses, conseguimos:</p>
        <ul>
          <li>340% de aumento no tráfego orgânico</li>
          <li>250% de aumento nas conversões</li>
          <li>Posicionamento na primeira página para 50+ palavras-chave</li>
        </ul>
      `,
      imagem_destacada: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      autor: "Fernando Silva"
    },
    {
      titulo: "Estratégias de Google Ads que Geram ROI Real",
      slug: "estrategias-google-ads-roi-real",
      resumo: "Aprenda as táticas avançadas que usamos para otimizar campanhas e maximizar o retorno sobre investimento.",
      conteudo: `
        <h2>A Importância do ROI em Google Ads</h2>
        <p>Muitas empresas gastam milhares em Google Ads sem ver retorno real. Nossa abordagem foca em resultados mensuráveis.</p>
        
        <h2>Nossas Estratégias Comprovadas</h2>
        <p>Utilizamos uma metodologia testada que inclui:</p>
        <ul>
          <li>Pesquisa avançada de palavras-chave</li>
          <li>Segmentação precisa de audiência</li>
          <li>Testes A/B contínuos</li>
          <li>Otimização de landing pages</li>
        </ul>
        
        <h2>Casos de Sucesso</h2>
        <p>Nossos clientes têm alcançado resultados excepcionais com nossa metodologia.</p>
      `,
      imagem_destacada: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
      autor: "Fernando Silva"
    },
    {
      titulo: "Branding Digital: Construindo Marcas Memoráveis",
      slug: "branding-digital-marcas-memoraveis",
      resumo: "Como criamos identidades visuais que conectam emocionalmente com o público e geram resultados de negócio.",
      conteudo: `
        <h2>O Poder do Branding Digital</h2>
        <p>Uma marca forte não é apenas um logo bonito - é uma experiência completa que gera conexão emocional.</p>
        
        <h2>Nosso Processo de Branding</h2>
        <p>Desenvolvemos marcas através de um processo estruturado:</p>
        <ol>
          <li>Pesquisa e análise de mercado</li>
          <li>Definição de posicionamento</li>
          <li>Criação da identidade visual</li>
          <li>Implementação digital</li>
        </ol>
        
        <h2>Impacto nos Negócios</h2>
        <p>Marcas bem posicionadas geram maior valor percebido e fidelização de clientes.</p>
      `,
      imagem_destacada: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=400&fit=crop",
      autor: "Fernando Silva"
    }
  ];

  // Sample cases
  const sampleCases = [
    {
      title: "E-commerce TechStore - Crescimento de 340%",
      slug: "ecommerce-techstore-crescimento",
      excerpt: "Transformação digital completa que resultou em 340% de aumento no tráfego orgânico e 250% nas vendas.",
      coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      tags: JSON.stringify(["E-commerce", "SEO", "Google Ads"]),
      metrics: JSON.stringify([
        { label: "Tráfego Orgânico", value: "+340%" },
        { label: "Conversões", value: "+250%" },
        { label: "ROI", value: "450%" }
      ]),
      client: "TechStore",
      challenge: "Baixa visibilidade online e dependência de tráfego pago",
      solution: "Estratégia integrada de SEO, Google Ads e otimização de conversão",
      results: "Crescimento exponencial em todos os KPIs principais",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
      ])
    },
    {
      title: "Startup FinTech - Rebranding Completo",
      slug: "startup-fintech-rebranding",
      excerpt: "Reposicionamento de marca que elevou a percepção de valor em 200% e atraiu investidores estratégicos.",
      coverImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
      tags: JSON.stringify(["Branding", "Design", "Estratégia"]),
      metrics: JSON.stringify([
        { label: "Percepção de Valor", value: "+200%" },
        { label: "Engajamento", value: "+180%" },
        { label: "Captação", value: "R$ 2M" }
      ]),
      client: "PayFlow",
      challenge: "Marca sem diferenciação e baixa credibilidade no mercado",
      solution: "Rebranding completo com foco em confiança e inovação",
      results: "Nova identidade atraiu investidores e clientes premium",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=600&h=400&fit=crop"
      ])
    }
  ];

  try {
    // Insert blog posts
    for (const post of samplePosts) {
      await connection.execute(
        'INSERT IGNORE INTO posts (titulo, slug, resumo, conteudo, imagem_destacada, autor) VALUES (?, ?, ?, ?, ?, ?)',
        [post.titulo, post.slug, post.resumo, post.conteudo, post.imagem_destacada, post.autor]
      );
    }
    console.log(`✅ ${samplePosts.length} posts de exemplo inseridos.`);

    // Insert cases
    for (const case_ of sampleCases) {
      await connection.execute(
        'INSERT IGNORE INTO cases (title, slug, excerpt, coverImage, tags, metrics, client, challenge, solution, results, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [case_.title, case_.slug, case_.excerpt, case_.coverImage, case_.tags, case_.metrics, case_.client, case_.challenge, case_.solution, case_.results, case_.gallery]
      );
    }
    console.log(`✅ ${sampleCases.length} cases de exemplo inseridos.`);

  } catch (error) {
    console.error("❌ Erro ao inserir dados:", error.message);
  } finally {
    await connection.end();
  }
}

seedData();