import { Router } from "express";
import mysql from "mysql2/promise";

const router = Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// GET /api/blog-posts?limit=10&offset=0
// Se ?all=1, retorna todos (evite em produção com muitos registros)
router.get("/blog-posts", async (req, res) => {
  try {
    const all = req.query.all === "1";
    const limit = Math.max(1, Number(req.query.limit || 10));
    const offset = Math.max(0, Number(req.query.offset || 0));

    const baseSql = `
      SELECT id, slug, title, excerpt, cover_url AS coverUrl,
             author, published_at AS publishedAt
      FROM blog_posts
      WHERE published = 1
      ORDER BY published_at DESC
    `;

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM blog_posts WHERE published = 1`
    );

    let rows;
    if (all) {
      [rows] = await pool.query(baseSql);
    } else {
      [rows] = await pool.query(`${baseSql} LIMIT ? OFFSET ?`, [limit, offset]);
    }

    res.json({
      total,
      items: rows,
      limit: all ? rows.length : limit,
      offset: all ? 0 : offset,
      hasMore: all ? false : offset + rows.length < total,
    });
  } catch (err) {
    console.error("GET /blog-posts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
