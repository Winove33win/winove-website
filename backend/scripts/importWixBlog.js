// /backend/scripts/importWixBlog.js
// Lê sitemap do Wix, coleta posts e insere/atualiza na tabela blog_posts (MySQL)

import axios from "axios";
import * as cheerio from "cheerio";
import mysql from "mysql2/promise";
import slugify from "slugify";
import { htmlToText } from "html-to-text";

const SITEMAP_URL = "https://winove.wixsite.com/meusite-6/sitemap.xml";

// === SUA CONEXÃO PADRÃO (mantida conforme seu projeto) ===
const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'winove',
  password: '9*19avmU0',
  database: 'fernando_winove_com_br_'
};

// Helpers
const toSlug = (str) =>
  slugify((str || "").trim(), { lower: true, strict: true, locale: "pt" });

function smartTrim(str, max = 280) {
  if (!str) return "";
  const clean = str.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trim() + "…";
}

/**
 * Tenta encontrar os principais elementos do HTML do post (robusto a variações do Wix).
 * Retorna { titulo, data_publicacao, resumo, conteudoHtml, imagem_destacada, autor, categoria }
 */
function extractPost($, url) {
  // Título
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const h1 = $('h1').first().text();
  const titulo = (ogTitle || h1 || "").trim();

  // Data de publicação
  let data_publicacao =
    $('meta[property="article:published_time"]').attr('content') ||
    $('time[datetime]').attr('datetime') ||
    $('meta[itemprop="datePublished"]').attr('content') || "";

  // Resumo (meta description ou primeiro parágrafo)
  let resumo =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    smartTrim($('article p, [data-hook="post-content"] p, main p').first().text(), 240);

  resumo = smartTrim(resumo, 240);

  // Imagem destacada
  const imagem_destacada =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') || "";

  // Autor
  const autor =
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    $('[itemprop="author"], .author, .post-author').first().text().trim() ||
    "Winove";

  // Conteúdo (HTML) – tenta alguns seletores comuns do Wix Blog
  let conteudoHtml =
    $('[data-hook="post-content"]').html() ||
    $('article').html() ||
    $('main').html() ||
    $('body').html() ||
    "";

  // Categoria (se existir em breadcrumb/tags) – senão "blog"
  const categoria =
    $('.breadcrumbs a').last().text().trim() ||
    $('[data-hook="category"]').text().trim() ||
    "blog";

  // Slug a partir da URL
  const urlObj = new URL(url);
  const parts = urlObj.pathname.split('/').filter(Boolean);
  // pega último segmento que não seja "blog"
  let slug = toSlug(parts.reverse().find(p => p && p.toLowerCase() !== 'blog') || titulo || urlObj.pathname);

  // Se ainda ficou vazio, tenta do título
  if (!slug) slug = toSlug(titulo);

  // Fallback de data para agora se vier vazia
  if (!data_publicacao) data_publicacao = new Date().toISOString();

  return { titulo, data_publicacao, resumo, conteudoHtml, imagem_destacada, autor, categoria, slug };
}

async function fetchSitemapUrls() {
  const { data } = await axios.get(SITEMAP_URL, { timeout: 30000 });
  const $ = cheerio.load(data, { xmlMode: true });
  const urls = $('url > loc')
    .map((_, el) => $(el).text().trim())
    .get();

  // Mantém apenas URLs que parecem posts de blog
  return urls.filter(u =>
    /\/blog\//i.test(u) && // caminho contém /blog/
    !/\/tag\//i.test(u) && // ignora páginas de tag
    !/\/category\//i.test(u) // ignora categorias, se houver
  );
}

async function fetchAndParse(url) {
  const { data } = await axios.get(url, { timeout: 30000 });
  const $ = cheerio.load(data);
  return extractPost($, url);
}

async function ensureTable(conn) {
  // Cria tabela se não existir (igual ao que está no seu phpMyAdmin)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      Categoria         varchar(255) COLLATE utf8mb3_general_ci DEFAULT NULL,
      id                int(11) NOT NULL AUTO_INCREMENT,
      titulo            varchar(255) COLLATE utf8mb3_general_ci DEFAULT NULL,
      slug              varchar(255) COLLATE utf8mb3_general_ci DEFAULT NULL,
      resumo            text COLLATE utf8mb3_general_ci,
      conteudo          longtext COLLATE utf8mb3_general_ci NOT NULL,
      imagem_destacada  text COLLATE utf8mb3_general_ci,
      data_publicacao   datetime DEFAULT CURRENT_TIMESTAMP,
      autor             varchar(255) COLLATE utf8mb3_general_ci DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
  `);
}

async function main() {
  const conn = await mysql.createConnection(DB_CONFIG);
  try {
    await ensureTable(conn);

    const urls = await fetchSitemapUrls();
    console.log(`🔎 Encontradas ${urls.length} URLs de blog no sitemap.`);

    const insertSql = `
      INSERT INTO blog_posts
      (Categoria, titulo, slug, resumo, conteudo, imagem_destacada, data_publicacao, autor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Categoria = VALUES(Categoria),
        titulo = VALUES(titulo),
        resumo = VALUES(resumo),
        conteudo = VALUES(conteudo),
        imagem_destacada = VALUES(imagem_destacada),
        data_publicacao = VALUES(data_publicacao),
        autor = VALUES(autor)
    `;

    let ok = 0, fail = 0;

    for (const url of urls) {
      try {
        const p = await fetchAndParse(url);

        // se o resumo vier muito vazio, cria um a partir do texto do conteúdo
        if (!p.resumo || p.resumo.length < 15) {
          const txt = htmlToText(p.conteudoHtml || "", { wordwrap: 120, selectors: [{ selector: 'a', options: { ignoreHref: true } }] });
          p.resumo = smartTrim(txt, 240);
        }

        await conn.execute(insertSql, [
          p.categoria || "blog",
          p.titulo || "Sem título",
          p.slug,
          p.resumo || null,
          p.conteudoHtml || "",
          p.imagem_destacada || null,
          // normaliza data para DATETIME
          new Date(p.data_publicacao),
          p.autor || "Winove"
        ]);

        ok++;
        console.log(`✅ ${p.slug} — inserido/atualizado`);
      } catch (e) {
        fail++;
        console.error(`❌ Falha em ${url}:`, e.message);
      }
    }

    console.log(`\n🎉 Finalizado. Sucesso: ${ok} | Falhas: ${fail}`);
  } finally {
    await conn.end();
  }
}

main().catch(err => {
  console.error("Erro geral:", err);
  process.exit(1);
});
