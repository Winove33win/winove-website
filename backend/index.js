import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { isDbConfigured, missingDbEnv, pool } from './db.js';
import sitemapRoute from './routes/sitemap.js';
import blogRoute from './routes/blog.js';
import casesRoute from './routes/cases.js';
import setupPortfolioRoute from './routes/setupPortfolio.js';
import templatesRoute from './routes/templates.js';
import leadsRoutes from './routes/leads.js';
import postSeoRoute from './routes/postSeo.js';
import proposalsRoute from './routes/proposals.js';
import sistemaPropostasRoute from './routes/sistemaPropostas.js';
import {
  ensureTemplateIsFresh,
  getBaseTemplate,
  renderTemplateWithMeta,
} from './utils/htmlTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Env vars
const envPaths = [path.join(__dirname, '.env'), path.join(__dirname, '../.env')];
const envResults = envPaths.map((envPath) => dotenv.config({ path: envPath }));
const envLoaded = envResults.some((result) => !result.error);

if (!envLoaded) {
  const defaultResult = dotenv.config();
  if (defaultResult.error) {
    console.warn(
      'Nenhum arquivo .env encontrado em backend/.env ou ../.env; prosseguindo apenas com variáveis de ambiente já definidas.'
    );
  }
}

// Express setup
const app = express();

const BASE_URL = (process.env.APP_BASE_URL || 'https://winove.com.br').replace(/\/$/, '');
let canonicalUrl;
try {
  canonicalUrl = new URL(BASE_URL.includes('://') ? BASE_URL : `https://${BASE_URL}`);
} catch (_err) {
  canonicalUrl = new URL('https://winove.com.br');
}
const canonicalHostname = canonicalUrl.hostname.toLowerCase();
const canonicalPort = canonicalUrl.port;
const canonicalProtocol = canonicalUrl.protocol.replace(':', '');

const getTemplate = () => {
  const initial = getBaseTemplate();
  const fresh = ensureTemplateIsFresh();
  return fresh || initial;
};

const sendHtml = (res, html, cacheControl = 'public, max-age=300, s-maxage=300') => {
  res
    .status(200)
    .set('Content-Type', 'text/html; charset=UTF-8')
    .set('Cache-Control', cacheControl)
    .send(html);
};

const commercialPanelPassword = process.env.COMMERCIAL_PANEL_PASSWORD;
const commercialPanelUser = process.env.COMMERCIAL_PANEL_USERNAME || 'comercial';
const commercialPanelRealm = 'Painel Comercial';

const sendCommercialAuthChallenge = (res) => {
  res.setHeader('WWW-Authenticate', `Basic realm="${commercialPanelRealm}", charset="UTF-8"`);
  return res.status(401).send('Autenticação necessária');
};

const requireCommercialProposalAuth = (req, res, next) => {
  if (!commercialPanelPassword) {
    return res.status(404).end();
  }

  const authHeader = req.headers.authorization || '';
  const [scheme, encoded] = authHeader.split(' ');

  if (scheme?.toLowerCase() === 'basic' && encoded) {
    try {
      const decoded = Buffer.from(encoded, 'base64').toString('utf8');
      const separatorIndex = decoded.indexOf(':');
      const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : '';
      const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

      if (username === commercialPanelUser && password === commercialPanelPassword) {
        return next();
      }
    } catch (error) {
      console.error('Erro ao validar autenticação básica do painel comercial:', error);
      return sendCommercialAuthChallenge(res);
    }
  }

  return sendCommercialAuthChallenge(res);
};

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Sitemap must be served before static middlewares
const isLocalRequest = (host) => {
  if (!host) return true;
  const hostname = host.split(':')[0]?.toLowerCase() || '';
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  );
};

app.use((req, res, next) => {
  const hostHeader = req.headers.host || '';
  if (isLocalRequest(hostHeader) || process.env.NODE_ENV === 'development') {
    return next();
  }

  const [requestHost, requestPort] = hostHeader.toLowerCase().split(':');
  const forwardedProto = (req.headers['x-forwarded-proto'] || req.protocol || canonicalProtocol).toLowerCase();
  const needsHostRedirect =
    requestHost !== canonicalHostname ||
    (!!canonicalPort && requestPort !== canonicalPort) ||
    (!canonicalPort && !!requestPort);

  if (needsHostRedirect || forwardedProto !== canonicalProtocol) {
    const redirectUrl = `${canonicalUrl.protocol}//${canonicalUrl.host}${req.originalUrl}`;
    return res.redirect(301, redirectUrl);
  }

  next();
});

app.use((req, res, next) => {
  const { path: pathname } = req;
  if (!pathname.startsWith('/blog')) {
    return next();
  }

  if (pathname === '/blog') {
    const queryIndex = req.url.indexOf('?');
    const query = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    return res.redirect(301, `/blog/${query}`);
  }

  if (/^\/blog\/[^/.]+$/.test(pathname)) {
    const queryIndex = req.url.indexOf('?');
    const query = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    return res.redirect(301, `${pathname}/${query}`);
  }

  next();
});

app.use('/', sitemapRoute);

// Basic CSP for production
app.use((_req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://winove.com.br https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://winove.com.br https://www.winove.com.br https://images.unsplash.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://winove.com.br https://www.google-analytics.com https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
    ].join('; ')
  );
  next();
});

const distPath = path.join(__dirname, '../frontend/dist');
// Serve frontend build from ../frontend/dist
app.use(
  '/assets',
  express.static(path.join(distPath, 'assets'), {
    immutable: true,
    maxAge: '1y',
  })
);
app.use(express.static(distPath));
app.use('/comercial-propostas', requireCommercialProposalAuth);

const HOME_DESCRIPTION =
  'A Winove entrega soluções digitais que transformam negócios. Descubra nossos cases de sucesso, serviços e portfólio.';
const BLOG_DESCRIPTION =
  'Conteúdos exclusivos, tendências e estratégias para manter seu negócio sempre à frente no mundo digital';
const DEFAULT_IMAGE = 'https://www.winove.com.br/imagem-de-compartilhamento.png';

// ── SSR pages metadata ────────────────────────────────────────────────────────
const SSR_PAGES = [
  {
    path: '/servicos',
    title: 'Serviços Digitais | Criação de Sites, SEO, Automação e IA – Winove',
    description: 'Criação de sites profissionais, lojas virtuais, SEO avançado, automação de processos e inteligência artificial para empresas que querem crescer no digital.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Serviços Digitais – Winove',
      url: `${BASE_URL}/servicos`,
      description: 'Serviços de criação de sites, SEO, automação e IA para empresas.',
      provider: { '@type': 'Organization', name: 'Winove', url: BASE_URL },
    },
  },
  {
    path: '/templates',
    title: 'Templates Wix Studio Profissionais | Winove',
    description: 'Acelere seu projeto com templates Wix Studio prontos, responsivos e otimizados para SEO. Design moderno, conversão alta e fácil personalização.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Templates Wix Studio – Winove',
      url: `${BASE_URL}/templates`,
      description: 'Templates Wix Studio prontos para uso com design profissional.',
    },
  },
  {
    path: '/chat-whatsapp',
    title: 'CRM para WhatsApp com Automação e IA | Winove',
    description: 'Transforme seu WhatsApp em uma central profissional de atendimento, vendas e automação com CRM, chatbot e inteligência artificial integrada.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'CRM para WhatsApp com Automação e IA',
      provider: { '@type': 'Organization', name: 'Winove', url: BASE_URL },
      serviceType: 'Atendimento WhatsApp para empresas',
      url: `${BASE_URL}/chat-whatsapp`,
    },
  },
  {
    path: '/email-corporativo',
    title: 'E-mail Corporativo Profissional com Domínio Próprio | Winove',
    description: 'Configure e-mail corporativo com seu domínio, Google Workspace, Microsoft 365 ou Titan Mail. Segurança, confiabilidade e suporte especializado.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'E-mail Corporativo Profissional',
      provider: { '@type': 'Organization', name: 'Winove', url: BASE_URL },
      serviceType: 'E-mail Corporativo',
      url: `${BASE_URL}/email-corporativo`,
    },
  },
  {
    path: '/sistema-gestao-documental',
    title: 'Sistema de Gestão Documental (ECM) em Nuvem | Winove',
    description: 'Organize, digitalize, localize e automatize documentos com nosso sistema ECM em nuvem. Conformidade legal, assinatura digital e busca inteligente por IA.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Sistema de Gestão Documental ECM em Nuvem',
      provider: { '@type': 'Organization', name: 'Winove', url: BASE_URL },
      serviceType: 'Gestão Documental',
      url: `${BASE_URL}/sistema-gestao-documental`,
    },
  },
  {
    path: '/cases',
    title: 'Cases de Sucesso | Projetos Reais e Resultados Mensuráveis – Winove',
    description: 'Conheça os cases de sucesso da Winove: projetos reais com resultados mensuráveis em criação de sites, SEO, automação e crescimento digital para empresas.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Cases de Sucesso – Winove',
      url: `${BASE_URL}/cases`,
      description: 'Cases de sucesso com resultados reais em marketing digital e criação de sites.',
    },
  },
  {
    path: '/cursos',
    title: 'Curso Wix Studio Completo – Crie Sites Profissionais do Zero | Winove',
    description: 'Aprenda Wix Studio do zero ao avançado com Fernando Souza. Módulos práticos, projetos reais, certificado e acesso vitalício. Para iniciantes e profissionais.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Curso Wix Studio Completo',
      description: 'Aprenda Wix Studio do zero ao avançado com projetos reais e certificado.',
      provider: { '@type': 'Organization', name: 'Winove', url: BASE_URL },
      url: `${BASE_URL}/cursos`,
      inLanguage: 'pt-BR',
    },
  },
  {
    path: '/promocoes',
    title: 'Promoções e Ofertas Especiais | Winove – Até 20% de Desconto',
    description: 'Aproveite as promoções e ofertas especiais da Winove em criação de sites, templates, cursos e automação digital. Descontos por tempo limitado.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Promoções e Ofertas Especiais – Winove',
      url: `${BASE_URL}/promocoes`,
      description: 'Promoções e descontos em serviços digitais da Winove.',
    },
  },
  {
    path: '/sobre-fernando-souza',
    title: 'Fernando Souza | Especialista em SEO, Wix Studio e Estratégia Digital',
    description: 'Conheça Fernando Souza, fundador da Winove, especialista em SEO técnico, Wix Studio e estratégia digital com mais de 10 anos de experiência.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Fernando Souza',
      jobTitle: 'Especialista em SEO, Wix Studio e Estratégia Digital',
      worksFor: { '@type': 'Organization', name: 'Winove', url: BASE_URL },
      url: `${BASE_URL}/sobre-fernando-souza`,
    },
  },
  {
    path: '/central-atendimento',
    title: 'Central de Atendimento WhatsApp com Funil de Vendas | Winove',
    description: 'Gerencie todos os atendimentos do WhatsApp em um único painel kanban. Funil de vendas visual, automação de fluxos e métricas em tempo real para sua equipe.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Central de Atendimento WhatsApp com Funil de Vendas',
      provider: { '@type': 'Organization', name: 'Winove', url: BASE_URL },
      serviceType: 'Software de Atendimento',
      url: `${BASE_URL}/central-atendimento`,
    },
  },
  {
    path: '/politica-de-privacidade',
    title: 'Política de Privacidade | Winove – LGPD',
    description: 'Leia a Política de Privacidade da Winove. Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Política de Privacidade – Winove',
      url: `${BASE_URL}/politica-de-privacidade`,
    },
  },
  {
    path: '/termos-de-uso',
    title: 'Termos de Uso | Winove',
    description: 'Leia os Termos de Uso da Winove. Condições de contratação, propriedade intelectual, responsabilidades e regras de uso dos serviços e plataformas Winove.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Termos de Uso – Winove',
      url: `${BASE_URL}/termos-de-uso`,
    },
  },
  {
    path: '/politica-de-cookies',
    title: 'Política de Cookies | Winove',
    description: 'Saiba como a Winove utiliza cookies para melhorar sua experiência de navegação, análise de tráfego e personalização de conteúdo. Gerencie suas preferências.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Política de Cookies – Winove',
      url: `${BASE_URL}/politica-de-cookies`,
    },
  },
];

app.get('/blog/', (req, res, next) => {
  const template = getTemplate();
  if (!template) return next();
  const canonical = `${BASE_URL}/blog/`;
  const title = 'Blog Winove | Marketing Digital, Wix, SEO e Tecnologia';
  const html = renderTemplateWithMeta(template, {
    title,
    description: BLOG_DESCRIPTION,
    canonical,
    openGraph: { 'og:type': 'website', 'og:title': title, 'og:description': BLOG_DESCRIPTION, 'og:image': DEFAULT_IMAGE },
    twitter: { 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': BLOG_DESCRIPTION, 'twitter:image': DEFAULT_IMAGE },
    jsonLd: { '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog Winove', description: BLOG_DESCRIPTION, url: canonical },
  });
  if (!html) return next();
  sendHtml(res, html);
});

// ── SSR for all static pages ─────────────────────────────────────────────────
for (const page of SSR_PAGES) {
  app.get(page.path, (req, res, next) => {
    const template = getTemplate();
    if (!template) return next();
    const canonical = `${BASE_URL}${page.path}`;
    const html = renderTemplateWithMeta(template, {
      title: page.title,
      description: page.description,
      canonical,
      openGraph: { 'og:type': 'website', 'og:title': page.title, 'og:description': page.description, 'og:image': DEFAULT_IMAGE },
      twitter: { 'twitter:card': 'summary_large_image', 'twitter:title': page.title, 'twitter:description': page.description, 'twitter:image': DEFAULT_IMAGE },
      jsonLd: page.jsonLd,
    });
    if (!html) return next();
    sendHtml(res, html);
  });
}

// Debug rota temporária — remove após diagnóstico
app.get('/api/debug-db', (req, res) => {
  const vars = ['DB_HOST','DB_PORT','DB_USER','DB_PASSWORD','DB_NAME'];
  const env = {};
  vars.forEach(v => { env[v] = process.env[v] ? '✅ set' : '❌ missing'; });
  res.json({ pool: pool ? '✅ pool ok' : '❌ pool null', isDbConfigured, missingDbEnv, env });
});

// API routes
app.use('/api', blogRoute);
app.use('/api/cases', casesRoute);
app.use('/api', setupPortfolioRoute);
app.use('/api/templates', templatesRoute);
app.use('/api/leads', leadsRoutes);
app.use('/api/propostas', requireCommercialProposalAuth, proposalsRoute);
app.use(sistemaPropostasRoute);
app.use('/', postSeoRoute);

app.get('/', (req, res, next) => {
  const template = getTemplate();
  if (!template) {
    return next();
  }

  const canonical = `${BASE_URL}/`;
  const html = renderTemplateWithMeta(template, {
    title: 'Winove - Soluções Criativas e Resultados Reais',
    description: HOME_DESCRIPTION,
    canonical,
    openGraph: {
      'og:type': 'website',
      'og:title': 'Winove - Soluções Criativas e Resultados Reais',
      'og:description': HOME_DESCRIPTION,
      'og:image': DEFAULT_IMAGE,
    },
    twitter: {
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Winove - Soluções Criativas e Resultados Reais',
      'twitter:description': HOME_DESCRIPTION,
      'twitter:image': DEFAULT_IMAGE,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Início - Winove',
      url: canonical,
      description: HOME_DESCRIPTION,
    },
  });

  if (!html) {
    return next();
  }

  sendHtml(res, html);
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'production' });
});

app.get('/api/health/db', (_req, res) => {
  res.json({
    ok: true,
    configured: isDbConfigured,
    poolReady: Boolean(pool),
    missingEnv: missingDbEnv,
  });
});

// API 404
app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

// Global error handler: sempre retorna JSON para evitar que proxies/host gerem
// páginas HTML em respostas de erro (ex.: 500). Deve ficar após as rotas API.
app.use((err, req, res, next) => {
  console.error('Unhandled error (global handler):', err?.stack || err);
  if (res.headersSent) return next(err);
  const statusCode = err && err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err && err.message ? String(err.message) : 'Internal server error';
  res.status(statusCode).json({ error: 'internal_error', message });
});

// SPA fallback for React Router
app.get('*', (req, res) => {
  if (req.path.includes('.')) return res.status(404).end();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server (Plesk sets PORT)
const port = Number(process.env.PORT || 3333);
app.listen(port, () => {
  console.log(`API + Frontend running on port ${port}`);
});
