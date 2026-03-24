import express from 'express';
import { pool } from '../db.js';
import { getFallbackBlogPosts, getFallbackTemplates } from '../fallbackData.js';

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

const fmtDate = (value) => {
  if (!value) return null;
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch {
    return null;
  }
};

const toUrlXml = ({ loc, changefreq, priority, lastmod }) => {
  const lastmodLine = fmtDate(lastmod) ? `\n    <lastmod>${fmtDate(lastmod)}</lastmod>` : '';
  return `  <url>\n    <loc>${loc}</loc>${lastmodLine}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
};

const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const urlsetClose = '</urlset>';

async function fetchPosts() {
  // Try DB first
  if (pool) {
    try {
      const [rows] = await pool.query(
        `SELECT slug, data_publicacao
         FROM blog_posts
         WHERE slug IS NOT NULL AND slug <> ''
         ORDER BY data_publicacao DESC
         LIMIT 5000`
      );
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.error('[sitemap] DB posts error:', err?.message || err);
    }
  }
  // Fallback to static/dump data
  try {
    const posts = await getFallbackBlogPosts();
    return (posts || []).map(p => ({
      slug: p.slug,
      data_publicacao: p.data_publicacao ?? p.publishedAt ?? p.date ?? null,
    }));
  } catch {
    return [];
  }
}

async function fetchTemplates() {
  // Try DB first
  if (pool) {
    try {
      const [rows] = await pool.query(
        `SELECT slug, updated_at, created_at
         FROM templates
         WHERE slug IS NOT NULL AND slug <> ''
         ORDER BY COALESCE(updated_at, created_at) DESC
         LIMIT 5000`
      );
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.error('[sitemap] DB templates error:', err?.message || err);
    }
  }
  // Fallback to static/dump data
  try {
    const templates = await getFallbackTemplates();
    return (templates || []).map(t => ({
      slug: t.slug,
      updated_at: t.updated_at ?? null,
      created_at: t.created_at ?? null,
    }));
  } catch {
    return [];
  }
}

const xmlResponse = (res, xml) => {
  res.set('Content-Type', 'application/xml; charset=UTF-8');
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
};

// ── /sitemap.xml — static pages + templates ──────────────────────────────────
router.get('/sitemap.xml', async (_req, res) => {
  try {
    const templates = await fetchTemplates();

    const latestTemplateDate = templates.reduce((latest, t) => {
      const d = t.updated_at || t.created_at;
      if (!d) return latest;
      return !latest || new Date(d) > new Date(latest) ? d : latest;
    }, null);

    const pagesXml = staticPageUrls.map(toUrlXml).join('\n');

    const templatesXml = templates.map(t =>
      toUrlXml({
        loc: `${BASE}/templates/${t.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: t.updated_at || t.created_at,
      })
    ).join('\n');

    const parts = [xmlHeader, urlsetOpen, pagesXml];
    if (templates.length > 0) {
      parts.push(
        toUrlXml({ loc: `${BASE}/templates`, changefreq: 'weekly', priority: '0.9', lastmod: latestTemplateDate })
      );
      parts.push(templatesXml);
    }
    parts.push(urlsetClose);

    xmlResponse(res, parts.join('\n'));
  } catch (e) {
    console.error('[sitemap] fatal:', e?.message || e);
    xmlResponse(res, [xmlHeader, urlsetOpen, staticPageUrls.map(toUrlXml).join('\n'), urlsetClose].join('\n'));
  }
});

// ── /post-sitemap.xml — blog posts only ──────────────────────────────────────
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
      postsXml || '  <!-- nenhum post encontrado -->',
      urlsetClose,
    ].join('\n');

    xmlResponse(res, xml);
  } catch (e) {
    console.error('[post-sitemap] fatal:', e?.message || e);
    xmlResponse(res, [xmlHeader, urlsetOpen, urlsetClose].join('\n'));
  }
});

// ── /sitemap_index.xml — index pointing to sub-sitemaps ──────────────────────
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
  xmlResponse(res, xml);
});

export default router;
