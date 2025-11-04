import { Router } from "express";
// Use o pool compartilhado com defaults em db.js. Isso evita erros 500 quando
// as variáveis de ambiente (DB_HOST, DB_USER, etc.) não estão definidas.
import { pool } from "../db.js";

const router = Router();

// Não crie um novo pool aqui. O pool em db.js já aplica valores padrão e
// manipula corretamente as variáveis de ambiente ausentes.

// Normaliza o formato para o frontend
function adapt(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    excerpt: row.resumo ?? null,
    coverUrl: row.imagem_destacada ?? null,
    author: row.autor ?? null,
    publishedAt: row.data_publicacao,
  };
}

// GET /api/blog-posts?limit=10&offset=0  | ?all=1 para tudo
router.get("/blog-posts", async (req, res) => {
  try {
    const all = req.query.all === "1";
    const limit = Math.max(1, Number(req.query.limit || 10));
    const offset = Math.max(0, Number(req.query.offset || 0));

    const countSql = "SELECT COUNT(*) AS total FROM blog_posts";
    const [countRows] = await pool.query(countSql);
    const total = countRows?.[0]?.total ?? 0;

    let sql = `
      SELECT id, titulo, slug, resumo, conteudo, imagem_destacada, data_publicacao, autor
      FROM blog_posts
      ORDER BY data_publicacao DESC, id DESC
    `;

    let rows;
    if (all) {
      [rows] = await pool.query(sql);
    } else {
      sql += " LIMIT ? OFFSET ?";
      [rows] = await pool.query(sql, [limit, offset]);
    }

    const items = rows.map(adapt);

    res.json({
      total,
      items,
      limit: all ? items.length : limit,
      offset: all ? 0 : offset,
      hasMore: all ? false : offset + items.length < total,
    });
  } catch (err) {
    console.error("[BLOG] /api/blog-posts error:", err?.code, err?.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
