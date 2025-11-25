import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'lweb03.appuni.com.br',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'winove',
  password: process.env.DB_PASSWORD || '9*19avmU0',
  database: process.env.DB_NAME || 'fernando_winove_com_br_',
  waitForConnections: true,
  connectionLimit: 10,
});

const BASE = 'https://winove.com.br';

const staticUrls = [
  { loc: `${BASE}/`,          changefreq: 'weekly',  priority: '1.0' },
  { loc: `${BASE}/blog/`,     changefreq: 'weekly',  priority: '0.9' },
  { loc: `${BASE}/cases`,     changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE}/servicos`,  changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE}/contato`,   changefreq: 'monthly', priority: '0.6' },
];

const toUrlXml = ({ loc, changefreq, priority, lastmod }) => `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`.trim();

router.get('/sitemap.xml', async (req, res) => {
  try {
    let posts = [];
    let templates = [];
    try {
      // Atenção: nomes de colunas iguais aos da sua tabela
      const [rows] = await pool.query(
        `SELECT slug, data_publicacao
         FROM blog_posts
         WHERE slug IS NOT NULL AND slug <> ''
         ORDER BY data_publicacao DESC
         LIMIT 5000`
      );
      posts = rows || [];
    } catch (dbErr) {
      console.error('[sitemap] DB error:', dbErr?.message || dbErr);
    }

    try {
      const [rows] = await pool.query(
        `SELECT slug, updated_at, created_at
         FROM templates
         WHERE slug IS NOT NULL AND slug <> ''
         ORDER BY COALESCE(updated_at, created_at) DESC
         LIMIT 5000`
      );
      templates = rows || [];
    } catch (dbErr) {
      console.error('[sitemap] DB templates error:', dbErr?.message || dbErr);
    }

    const staticXml = staticUrls.map(u => toUrlXml(u)).join('');
    const postsXml = posts.map(p =>
      toUrlXml({
        loc: `${BASE}/blog/${p.slug}/`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: p.data_publicacao || new Date(),
      })
    ).join('');

    const latestTemplateDate = templates.reduce((latest, tpl) => {
      const lastmod = tpl.updated_at || tpl.created_at;
      if (!lastmod) return latest;
      return !latest || new Date(lastmod) > new Date(latest) ? lastmod : latest;
    }, null);

    const templatesListXml = toUrlXml({
      loc: `${BASE}/templates/`,
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
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticXml}
  ${templatesListXml}
  ${postsXml}
  ${templatesXml}
  ${posts.length === 0 ? '<!-- fallback: sem posts (verifique conexão/colunas) -->' : ''}
</urlset>`;

    res.set('Content-Type', 'application/xml; charset=UTF-8');
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.status(200).send(xml);
  } catch (e) {
    console.error('[sitemap] fatal:', e?.message || e);
    // Nunca retorna 500 — entrega estático
    res
      .status(200)
      .set('Content-Type', 'application/xml; charset=UTF-8')
      .send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.map(u => toUrlXml(u)).join('')}
  <!-- erro fatal ao gerar dinamicamente; entregando versão estática -->
</urlset>`);
  }
});

export default router;
