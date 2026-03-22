/**
 * dump-blog-fallback.mjs
 * Exports all blog_posts rows from the database to backend/data/blog_posts.json
 * (the fallback file used when the production server cannot reach the DB).
 *
 * Usage: node backend/scripts/dump-blog-fallback.mjs
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';
import fs from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const OUTPUT = path.join(__dirname, '../data/blog_posts.json');

const pool = createPool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT || 3306),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 3,
});

const [rows] = await pool.query(
  `SELECT id, slug, titulo, resumo, conteudo, imagem_destacada,
          meta_description, data_publicacao, autor, Categoria AS categoria
   FROM blog_posts
   ORDER BY data_publicacao DESC`
);

await pool.end();

const dump = [{ type: 'table', name: 'blog_posts', data: rows }];
await fs.writeFile(OUTPUT, JSON.stringify(dump, null, 2), 'utf8');

console.log(`✓ ${rows.length} posts exportados para ${OUTPUT}`);
