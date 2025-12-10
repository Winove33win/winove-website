import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Simple fallback datasets for templates and blog posts
// Used when database connectivity fails so the frontend still receives content.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const readFirstExistingJson = async (paths) => {
  for (const candidate of paths) {
    try {
      const content = await fs.readFile(candidate, 'utf8');
      return { content, path: candidate };
    } catch (err) {
      if (err?.code !== 'ENOENT') {
        console.error('[fallbackData] Falha ao ler', candidate, err?.message);
      }
    }
  }
  return null;
};

const pickTableData = (parsed, tableName) => {
  if (Array.isArray(parsed)) {
    const tableEntry = parsed.find((item) => item?.type === 'table' && (!tableName || item?.name === tableName));
    if (Array.isArray(tableEntry?.data)) return tableEntry.data;
  }
  if (Array.isArray(parsed?.data)) return parsed.data;
  return null;
};

const normalizeKeys = (row) => {
  if (!row || typeof row !== 'object') return {};
  return Object.entries(row).reduce((acc, [key, value]) => {
    acc[key] = value;
    if (typeof key === 'string') {
      const lower = key.toLowerCase();
      if (!(lower in acc)) acc[lower] = value;
    }
    return acc;
  }, {});
};

const cached = {
  templates: null,
  blog: null,
};

const loadDumpTable = async (tableName, filenames) => {
  const candidates = filenames.map((file) => path.join(__dirname, 'data', file));
  const found = await readFirstExistingJson(candidates);
  if (!found) return null;

  try {
    const parsed = JSON.parse(found.content);
    const rows = pickTableData(parsed, tableName);
    if (!Array.isArray(rows)) return null;
    return rows.map(normalizeKeys);
  } catch (err) {
    console.error(`[fallbackData] Erro ao parsear ${tableName} de ${found.path}:`, err?.message);
    return null;
  }
};

export const fallbackTemplates = [
  {
    id: 1,
    slug: 'agencia-digital',
    title: 'AgÇ¦ncia Digital',
    content: '<p>Template focado em agÇ¦ncias com foco em performance e branding.</p>',
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
    meta: {
      heading: 'Landing page completa para agÇ¦ncias',
      subheading: 'Estrutura pensada para captar leads e apresentar portfÇülio.',
      description:
        'Template otimizado para conversÇœo, com blocos de depoimentos, serviÇõos, portfÇülio e CTA para WhatsApp.',
      category: 'AgÇ¦ncia',
      difficulty: 'IntermediÇ­rio',
      price: 490,
      originalPrice: 790,
      pages: 6,
      features: ['SEO tÇ¸cnico otimizado', 'FormulÇ­rios integrados', 'SeÇõÇœo de cases'],
      includes: ['Arquivos editÇ­veis', 'Guia de publicaÇõÇœo', 'ConfiguraÇõÇœo inicial'],
      tags: ['agÇ¦ncia', 'marketing', 'vendas'],
      demoUrl: 'https://demo.winove.com.br/agencia',
      images: {
        cover: '/assets/templates/agencia/cover.webp',
        gallery: ['/assets/templates/agencia/1.webp', '/assets/templates/agencia/2.webp'],
      },
      currency: 'BRL',
      contact: { whatsappIntl: '+55 47 99673-9013', defaultMessage: 'Quero conhecer o template AgÇ¦ncia Digital' },
      ctaTexts: {
        buyTemplate: 'Comprar template',
        hosting: 'Quero com hospedagem',
        email: 'Preciso de e-mail profissional',
        bundle: 'Fazer pacote completo',
      },
      addons: {
        hosting: { name: 'Hospedagem otimizada', price: 149 },
        email: { name: 'E-mail corporativo', price: 69 },
      },
      bundles: [
        { name: 'Template + PublicaÇõÇœo', price: 690 },
        { name: 'Template + SEO', price: 990 },
      ],
    },
  },
  {
    id: 2,
    slug: 'consultoria',
    title: 'Consultoria Empresarial',
    content: '<p>Estrutura para consultorias e escritÇürios apresentarem serviÇõos.</p>',
    created_at: '2024-01-05',
    updated_at: '2024-01-05',
    meta: {
      heading: 'Site elegante para consultorias',
      subheading: 'Transmita autoridade e gere reuniÇæes qualificadas.',
      description: 'Blocos de diferenciais, depoimentos, agenda integrada e CTA para contato.',
      category: 'Consultoria',
      difficulty: 'Iniciante',
      price: 420,
      pages: 5,
      features: ['Agenda integrada', 'Depoimentos em carrossel', 'SessÇœo de FAQ'],
      includes: ['Onboarding', 'Manual de ediÇõÇœo'],
      tags: ['consultoria', 'b2b'],
      demoUrl: 'https://demo.winove.com.br/consultoria',
      images: {
        cover: '/assets/templates/consultoria/cover.webp',
        gallery: ['/assets/templates/consultoria/1.webp'],
      },
      currency: 'BRL',
      contact: { whatsappIntl: '+55 47 99673-9013', defaultMessage: 'Gostei do template de consultoria' },
      ctaTexts: {},
      addons: {},
      bundles: [],
    },
  },
  {
    id: 3,
    slug: 'ecommerce-minimal',
    title: 'E-commerce Minimal',
    content: '<p>Layout minimalista pensado para lojas de moda e acessÇürios.</p>',
    created_at: '2024-01-03',
    updated_at: '2024-01-03',
    meta: {
      heading: 'Loja virtual pronta para vender',
      subheading: 'Interface moderna com foco em velocidade e UX.',
      description: 'Inclui pÇ­gina de produto detalhada, lista de desejos e carrinho otimizado.',
      category: 'E-commerce',
      difficulty: 'AvanÇõado',
      price: 790,
      pages: 8,
      features: ['Checkout otimizado', 'Lista de desejos', 'AvaliaÇõÇæes de produto'],
      includes: ['Setup inicial', 'Manual de coleÇõÇœo'],
      tags: ['loja', 'ecommerce', 'moda'],
      demoUrl: 'https://demo.winove.com.br/ecommerce',
      images: {
        cover: '/assets/templates/ecommerce/cover.webp',
        gallery: ['/assets/templates/ecommerce/1.webp', '/assets/templates/ecommerce/2.webp'],
      },
      currency: 'BRL',
      contact: { whatsappIntl: '+55 47 99673-9013', defaultMessage: 'Quero o template E-commerce Minimal' },
      ctaTexts: {},
      addons: {},
      bundles: [],
    },
  },
];

export const fallbackBlogPosts = [
  {
    id: 101,
    slug: 'tendencias-marketing-2024',
    titulo: '5 TendÇ¦ncias de Marketing Digital para 2024',
    resumo: 'Descubra as principais apostas para performance e marca no prÇüximo ano.',
    conteudo:
      '<p>AutomaÇõÇœo com IA, first-party data, UX focada em acessibilidade e outras tendÇ¦ncias que vÇœo ditar o ritmo em 2024.</p>',
    imagem_destacada: '/assets/blog/marketing-2024.webp',
    data_publicacao: '2024-01-12',
    autor: 'Equipe Winove',
    categoria: 'Marketing Digital',
  },
  {
    id: 102,
    slug: 'guia-templates-wix-studio',
    titulo: 'Como escolher o template Wix Studio ideal',
    resumo: 'Checklist prÇ­tico para selecionar o tema certo para seu projeto.',
    conteudo:
      '<p>Veja como avaliar velocidade, SEO, blocos reutilizÇ­veis e integraÇõÇæes antes de decidir pelo template.</p>',
    imagem_destacada: '/assets/blog/templates-wix.webp',
    data_publicacao: '2024-01-08',
    autor: 'Equipe Winove',
    categoria: 'Templates',
  },
  {
    id: 103,
    slug: 'cases-automatizacao-whatsapp',
    titulo: '3 cases de automaÇõÇœo no WhatsApp que aumentaram conversÇæes',
    resumo: 'Campanhas reais que usaram bots e fluxos para escalar atendimento.',
    conteudo:
      '<p>Como estruturamos jornadas de atendimento, qualificamos leads e reduzimos o tempo de resposta com automaÇõÇæes.</p>',
    imagem_destacada: '/assets/blog/whatsapp-cases.webp',
    data_publicacao: '2024-01-03',
    autor: 'Equipe Winove',
    categoria: 'AutomaÇõÇœo',
  },
];

export const getFallbackTemplates = async () => {
  if (cached.templates) return cached.templates;

  const dump = await loadDumpTable('templates', ['templates.json', 'templates.dump.json', 'templates-data.json']);
  if (Array.isArray(dump) && dump.length) {
    cached.templates = dump;
    return cached.templates;
  }

  cached.templates = fallbackTemplates;
  return cached.templates;
};

export const getFallbackBlogPosts = async () => {
  if (cached.blog) return cached.blog;

  const dump = await loadDumpTable('blog_posts', ['blog_posts.json', 'blog-posts.json', 'blog-posts.dump.json']);
  if (Array.isArray(dump) && dump.length) {
    cached.blog = dump;
    return cached.blog;
  }

  cached.blog = fallbackBlogPosts;
  return cached.blog;
};
