import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_VARS = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

async function checkAndCreateTables() {
  let connection;

  const missingEnv = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missingEnv.length) {
    console.error(
      `❌ Variáveis de ambiente do banco ausentes: ${missingEnv.join(", ")}. ` +
        'Defina-as antes de rodar o checkDatabaseAndCreateTables.'
    );
    process.exit(1);
  }

  const dbPort = Number(process.env.DB_PORT);
  if (Number.isNaN(dbPort)) {
    console.error('❌ DB_PORT deve ser um número válido.');
    process.exit(1);
  }

  try {
    // Test connection usando apenas variáveis de ambiente válidas
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: dbPort,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

    // Check if blog_posts table exists
    const [blogTableExists] = await connection.execute(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'blog_posts'",
      [process.env.DB_NAME]
    );

    if (blogTableExists[0].count === 0) {
      console.log('📝 Criando tabela blog_posts...');
      await connection.execute(`
        CREATE TABLE blog_posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          resumo TEXT,
          conteudo LONGTEXT,
          imagem_destacada VARCHAR(500),
          data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          autor VARCHAR(100) DEFAULT 'Winove',
          categoria VARCHAR(255)
        )
      `);
      
      // Insert sample data
        await connection.execute(`
          INSERT INTO blog_posts (titulo, slug, resumo, conteudo, imagem_destacada, autor, categoria) VALUES
          ('Transformação Digital: O Futuro dos Negócios', 'transformacao-digital-futuro-negocios', 'Descubra como a transformação digital está revolucionando o mundo dos negócios e como sua empresa pode se adaptar.', '<h2>A Era da Transformação Digital</h2><p>A transformação digital não é mais uma opção, mas uma necessidade para empresas que desejam se manter competitivas no mercado atual.</p><h3>Principais Benefícios</h3><ul><li>Maior eficiência operacional</li><li>Melhor experiência do cliente</li><li>Redução de custos</li><li>Inovação constante</li></ul>', 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 'Winove', 'Inovação'),
          ('Marketing Digital: Estratégias Que Funcionam', 'marketing-digital-estrategias-funcionam', 'Conheça as estratégias de marketing digital mais eficazes para aumentar sua presença online e gerar mais leads.', '<h2>Marketing Digital Eficaz</h2><p>O marketing digital evoluiu drasticamente nos últimos anos. Entenda as melhores práticas para 2024.</p><h3>Estratégias Essenciais</h3><ul><li>SEO e otimização de conteúdo</li><li>Marketing de conteúdo</li><li>Redes sociais estratégicas</li><li>Email marketing personalizado</li></ul>', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80', 'Winove', 'Marketing'),
          ('Design Responsivo: A Importância da Experiência Mobile', 'design-responsivo-experiencia-mobile', 'Saiba por que o design responsivo é fundamental para o sucesso do seu site e como implementá-lo corretamente.', '<h2>A Era Mobile First</h2><p>Com mais de 60% dos acessos à internet sendo feitos via dispositivos móveis, o design responsivo tornou-se obrigatório.</p><h3>Vantagens do Design Responsivo</h3><ul><li>Melhor experiência do usuário</li><li>Melhor ranking no Google</li><li>Maior taxa de conversão</li><li>Redução de custos de desenvolvimento</li></ul>', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 'Winove', 'Design')
        `);
      
      console.log('✅ Tabela blog_posts criada e dados inseridos!');
    } else {
      console.log('✅ Tabela blog_posts já existe');
    }

    // Check if cases table exists
    const [casesTableExists] = await connection.execute(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'cases'",
      [process.env.DB_NAME]
    );

    if (casesTableExists[0].count === 0) {
      console.log('📝 Criando tabela cases...');
      await connection.execute(`
        CREATE TABLE cases (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          excerpt TEXT,
          coverImage VARCHAR(500),
          tags JSON,
          metrics JSON,
          gallery JSON,
          content LONGTEXT,
          client VARCHAR(255),
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert sample data
      await connection.execute(`
        INSERT INTO cases (title, slug, excerpt, coverImage, tags, metrics, gallery, content, client, category) VALUES
        ('E-commerce Moderno para Moda', 'ecommerce-moderno-moda', 'Desenvolvimento de plataforma e-commerce completa com foco em conversão e experiência do usuário.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', '["E-commerce", "UX/UI", "Desenvolvimento"]', '{"conversao": "+250%", "vendas": "+180%", "usuarios": "50k+"}', '[]', '<p>Projeto completo de e-commerce para marca de moda...</p>', 'FashionBrand', 'E-commerce'),
        ('App Mobile para Delivery', 'app-mobile-delivery', 'Aplicativo mobile nativo para delivery de comida com sistema de rastreamento em tempo real.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', '["Mobile", "React Native", "Backend"]', '{"downloads": "100k+", "rating": "4.8", "pedidos": "10k+"}', '[]', '<p>Desenvolvimento de aplicativo mobile completo...</p>', 'DeliveryApp', 'Mobile'),
        ('Sistema SaaS para Gestão', 'sistema-saas-gestao', 'Plataforma SaaS completa para gestão empresarial com dashboard em tempo real e relatórios avançados.', 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', '["SaaS", "Dashboard", "Analytics"]', '{"usuarios": "5k+", "uptime": "99.9%", "satisfacao": "95%"}', '[]', '<p>Sistema SaaS completo para gestão empresarial...</p>', 'GestãoPro', 'SaaS')
      `);
      
      console.log('✅ Tabela cases criada e dados inseridos!');
    } else {
      console.log('✅ Tabela cases já existe');
    }

    // Test queries
    console.log('\n🔍 Testando consultas...');
    
    const [blogPosts] = await connection.execute('SELECT COUNT(*) as count FROM blog_posts');
    console.log(`📊 Posts no blog: ${blogPosts[0].count}`);
    
    const [cases] = await connection.execute('SELECT COUNT(*) as count FROM cases');
    console.log(`📊 Cases disponíveis: ${cases[0].count}`);

    console.log('\n✅ Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkAndCreateTables();