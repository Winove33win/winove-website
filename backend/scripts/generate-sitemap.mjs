import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';

const BASE_URL = (process.env.PUBLIC_BASE_URL || 'https://winove.com.br').replace(/\/$/, '');
const OUTPUT_PATH = process.env.SITEMAP_OUTPUT || '/var/www/vhosts/winove.com.br/httpdocs/sitemap.xml';

const dbConfig = {
  host: process.env.DB_HOST || 'lweb03.appuni.com.br',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'winove',
  password: process.env.DB_PASSWORD || '9*19avmU0',
  database: process.env.DB_NAME || 'fernando_winove_com_br_',
  waitForConnections: true,
  connectionLimit: 10,
};

const staticRoutes = [
  '/',
  '/sobre',
  '/servicos',
  '/blog',
  '/contato',
  '/cases',
];

function formatDate(value, fallback = null) {
  const date = value ? new Date(value) : fallback ? new Date(fallback) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

function buildSitemapXml(urls) {
  const urlset = urls
    .map((url) => {
      return `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
}

async function getBlogUrls(pool) {
  const [rows] = await pool.execute(
    `SELECT slug, data_publicacao
     FROM blog_posts
     WHERE slug IS NOT NULL AND slug <> ''
     ORDER BY data_publicacao DESC
     LIMIT 5000`
  );

  return rows.map((row) => ({
    loc: `${BASE_URL}/blog/${row.slug}`,
    lastmod: formatDate(row.data_publicacao),
    changefreq: 'weekly',
    priority: '0.8',
  }));
}

async function getTemplateUrls(pool) {
  const [rows] = await pool.execute(
    `SELECT slug, updated_at, created_at
     FROM templates
     WHERE slug IS NOT NULL AND slug <> ''
     ORDER BY COALESCE(updated_at, created_at) DESC
     LIMIT 5000`
  );

  return rows.map((row) => ({
    loc: `${BASE_URL}/templates/${row.slug}`,
    lastmod: formatDate(row.updated_at || row.created_at),
    changefreq: 'weekly',
    priority: '0.8',
  }));
}

async function writeSitemap(xml) {
  const destination = path.isAbsolute(OUTPUT_PATH)
    ? OUTPUT_PATH
    : path.resolve(process.cwd(), OUTPUT_PATH);

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, xml, 'utf8');

  return destination;
}

async function main() {
  const pool = mysql.createPool(dbConfig);
  const today = formatDate(new Date());

  try {
    const staticUrls = staticRoutes.map((route, index) => ({
      loc: `${BASE_URL}${route}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: route === '/' ? '1.0' : index <= 2 ? '0.9' : '0.8',
    }));

    const [blogUrls, templateUrls] = await Promise.all([
      getBlogUrls(pool),
      getTemplateUrls(pool),
    ]);

    const latestTemplateUpdate = formatDate(
      templateUrls.reduce((latest, current) => {
        if (!current.lastmod) return latest;
        return !latest || new Date(current.lastmod) > new Date(latest)
          ? current.lastmod
          : latest;
      }, null)
    );

    const urls = [
      ...staticUrls,
      {
        loc: `${BASE_URL}/templates/`,
        lastmod: latestTemplateUpdate || today,
        changefreq: 'weekly',
        priority: '0.9',
      },
      ...blogUrls,
      ...templateUrls,
    ];

    const xml = buildSitemapXml(urls);
    const destination = await writeSitemap(xml);

    console.log(`✅ Sitemap escrito em ${destination} com ${urls.length} URLs`);
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
