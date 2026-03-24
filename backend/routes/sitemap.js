import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

const BASE = 'https://www.winove.com.br';

const staticPageUrls = [
  { loc: `${BASE}/`,                          changefreq: 'weekly',  priority: '1.0' },
  { loc: `${BASE}/servicos`,                  changefreq: 'monthly', priority: '0.9' },
  { loc: `${BASE}/templates`,                 changefreq: 'weekly',  priority: '0.9' },
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

const toUrlXml = ({ loc, changefreq, priority, lastmod }) => `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const urlsetClose = '</urlset>';

async function fetchPosts() {
  try {
    const [rows] = await pool.query(
      `SELECT slug, data_publicacao
       FROM blog_posts
       WHERE slug IS NOT NULL AND slug <> '' AND publicado = 1
       ORDER BY data_publicacao DESC
       LIMIT 5000`
    );
    return rows || [];
  } catch (err) {
    console.error('[sitemap] DB posts error:', err?.message || err);
    return [];
  }
}

async function fetchTemplates() {
  try {
    const [rows] = await pool.query(
      `SELECT slug, updated_at, created_at
       FROM templates
       WHERE slug IS NOT NULL AND slug <> ''
       ORDER BY COALESCE(updated_at, created_at) DESC
       LIMIT 5000`
    );
    return rows || [];
  } catch (err) {
    console.error('[sitemap] DB templates error:', err?.message || err);
    return [];
  }
}

// ── /sitemap.xml — all static pages + templates ─────────────────────────────
router.get('/sitemap.xml', async (_req, res) => {
  try {
    const templates = await fetchTemplates();

    const latestTemplateDate = templates.reduce((latest, tpl) => {
      const d = tpl.updated_at || tpl.created_at;
      if (!d) return latest;
      return !latest || new Date(d) > new Date(latest) ? d : latest;
    }, null);

    const pagesXml = staticPageUrls.map(u => toUrlXml(u)).join('\n');

    const templatesListXml = toUrlXml({
      loc: `${BASE}/templates`,
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: latestTemplateDate,
    });

    const templatesXml = templates.map(t =>
      toUrlXml({
        loc: `${BASE}/templates/${t.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: t.updated_at || t.created_at,
      })
    ).join('\n');

    const xml = [
      xmlHeader,
      urlsetOpen,
      pagesXml,
      templatesXml ? `\n  <!-- Templates -->\n${templatesListXml}\n${templatesXml}` : '',
      urlsetClose,
    ].join('\n');

    res.set('Content-Type', 'application/xml; charset=UTF-8');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(xml);
  } catch (e) {
    console.error('[sitemap] fatal:', e?.message || e);
    const fallbackXml = [
      xmlHeader,
      urlsetOpen,
      staticPageUrls.map(u => toUrlXml(u)).join('\n'),
      urlsetClose,
    ].join('\n');
    res.status(200).set('Content-Type', 'application/xml; charset=UTF-8').send(fallbackXml);
  }
});

// ── /post-sitemap.xml — only blog posts ──────────────────────────────────────
router.get('/post-sitemap.xml', async (_req, res) => {
  try {
    const posts = await fetchPosts();

    const postsXml = posts.map(p =>
      toUrlXml({
        loc: `${BASE}/blog/${p.slug}/`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: p.data_publicacao,
      })
    ).join('\n');

    const xml = [
      xmlHeader,
      urlsetOpen,
      postsXml || '  <!-- sem posts publicados -->',
      urlsetClose,
    ].join('\n');

    res.set('Content-Type', 'application/xml; charset=UTF-8');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(xml);
  } catch (e) {
    console.error('[post-sitemap] fatal:', e?.message || e);
    const fallback = [xmlHeader, urlsetOpen, urlsetClose].join('\n');
    res.status(200).set('Content-Type', 'application/xml; charset=UTF-8').send(fallback);
  }
});

// ── /sitemap_index.xml — sitemap index pointing to sub-sitemaps ───────────────
router.get('/sitemap_index.xml', async (_req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const xml = `${xmlHeader}
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

  res.set('Content-Type', 'application/xml; charset=UTF-8');
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
});

export default router;
