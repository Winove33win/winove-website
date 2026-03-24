import express from 'express';
import { pool } from '../db.js';
import { getFallbackBlogPosts, getFallbackTemplates } from '../fallbackData.js';

const router = express.Router();

const BASE = 'https://www.winove.com.br';

// Static pages (excluding /templates — added dynamically with lastmod)
const STATIC_PAGES = [
  { loc: `${BASE}/`,                          changefreq: 'weekly',  priority: '1.0' },
  { loc: `${BASE}/servicos`,                  changefreq: 'monthly', priority: '0.9' },
  { loc: `${BASE}/chat-whatsapp`,             changefreq: 'monthly', priority: '0.9' },
  { loc: `${BASE}/email-corporativo`,         changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE}/sistema-gestao-documental`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE}/blog/`,                     changefreq: 'daily',   priority: '0.8' },
  { loc: `${BASE}/cases`,                     changefreq: 'weekly',  priority: '0.8' },
  { loc: `${BASE}/cursos`,                    changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE}/promocoes`,                 changefreq: 'weekly',  priority: '0.7' },
  { loc: `${BASE}/sobre-fernando-souza`,      changefreq: 'monthly', priority: '0.6' },
  { loc: `${BASE}/central-atendimento`,       changefreq: 'monthly', priority: '0.6' },
  { loc: `${BASE}/politica-de-privacidade`,   changefreq: 'yearly',  priority: '0.3' },
  { loc: `${BASE}/termos-de-uso`,             changefreq: 'yearly',  priority: '0.3' },
  { loc: `${BASE}/politica-de-cookies`,       changefreq: 'yearly',  priority: '0.3' },
];

const fmtDate = (value) => {
  if (!value) return null;
  try { return new Date(value).toISOString().split('T')[0]; } catch { return null; }
};

const urlTag = ({ loc, changefreq, priority, lastmod }) => {
  const d = fmtDate(lastmod);
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    d ? `    <lastmod>${d}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
};

const XML_HEADER   = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_OPEN  = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const URLSET_CLOSE = '</urlset>';

// ── DB helpers with fallback ──────────────────────────────────────────────────

async function getPosts() {
  if (pool) {
    try {
      const [rows] = await pool.query(
        `SELECT slug, data_publicacao FROM blog_posts
         WHERE slug IS NOT NULL AND slug <> ''
         ORDER BY data_publicacao DESC LIMIT 5000`
      );
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.error('[sitemap] DB posts error:', err?.message);
    }
  }
  const fallback = await getFallbackBlogPosts().catch(() => []);
  return (fallback || []).map(p => ({
    slug: p.slug,
    data_publicacao: p.data_publicacao ?? p.publishedAt ?? p.date ?? null,
  })).filter(p => p.slug);
}

async function getTemplates() {
  if (pool) {
    try {
      const [rows] = await pool.query(
        `SELECT slug, updated_at, created_at FROM templates
         WHERE slug IS NOT NULL AND slug <> ''
         ORDER BY COALESCE(updated_at, created_at) DESC LIMIT 5000`
      );
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.error('[sitemap] DB templates error:', err?.message);
    }
  }
  const fallback = await getFallbackTemplates().catch(() => []);
  return (fallback || []).map(t => ({
    slug: t.slug,
    updated_at: t.updated_at ?? null,
    created_at: t.created_at ?? null,
  })).filter(t => t.slug);
}

const send = (res, xml) => {
  res.set('Content-Type', 'application/xml; charset=UTF-8');
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
};

// ── /sitemap.xml  ─  all pages + templates + blog posts ──────────────────────
router.get('/sitemap.xml', async (_req, res) => {
  try {
    const [templates, posts] = await Promise.all([getTemplates(), getPosts()]);

    const latestTemplate = templates.reduce((best, t) => {
      const d = t.updated_at || t.created_at;
      return d && (!best || new Date(d) > new Date(best)) ? d : best;
    }, null);

    const lines = [
      XML_HEADER,
      URLSET_OPEN,
      ...STATIC_PAGES.map(urlTag),
      // Templates list page
      urlTag({ loc: `${BASE}/templates`, changefreq: 'weekly', priority: '0.9', lastmod: latestTemplate }),
      // Individual template pages
      ...templates.map(t => urlTag({
        loc: `${BASE}/templates/${t.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: t.updated_at || t.created_at,
      })),
      // Blog posts
      ...posts.map(p => urlTag({
        loc: `${BASE}/blog/${p.slug}/`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: p.data_publicacao,
      })),
      URLSET_CLOSE,
    ];

    send(res, lines.join('\n'));
  } catch (e) {
    console.error('[sitemap] fatal:', e?.message);
    const fallback = [XML_HEADER, URLSET_OPEN, ...STATIC_PAGES.map(urlTag), URLSET_CLOSE].join('\n');
    send(res, fallback);
  }
});

// ── /post-sitemap.xml  ─  blog posts only ────────────────────────────────────
router.get('/post-sitemap.xml', async (_req, res) => {
  try {
    const posts = await getPosts();
    const lines = [
      XML_HEADER,
      URLSET_OPEN,
      ...posts.map(p => urlTag({
        loc: `${BASE}/blog/${p.slug}/`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: p.data_publicacao,
      })),
      URLSET_CLOSE,
    ];
    send(res, lines.join('\n'));
  } catch (e) {
    console.error('[post-sitemap] fatal:', e?.message);
    send(res, [XML_HEADER, URLSET_OPEN, URLSET_CLOSE].join('\n'));
  }
});

// ── /sitemap_index.xml  ─  index ─────────────────────────────────────────────
router.get('/sitemap_index.xml', async (_req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const xml = `${XML_HEADER}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/post-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
  send(res, xml);
});

export default router;
