// /backend/routes/blog.js
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

let blogCols = null;
async function loadBlogCols() {
  if (blogCols) return blogCols;
  const [rows] = await pool.query("SHOW COLUMNS FROM blog_posts");
  blogCols = new Set(rows.map(r => r.Field));
  return blogCols;
}
function has(col) {
  return blogCols && blogCols.has(col);
}
function pickOrderBy() {
  if (has("published_at")) return "published_at";
  if (has("created_at")) return "created_at";
  if (has("updated_at")) return "updated_at";
  return "id";
}
function pickWherePublished() {
  // só aplica filtro se a coluna existir; senão, não filtra
  return has("published") ? "WHERE published = 1" : "";
}
function toItem(row) {
  const id = row.id;
  const slug = row.slug || row.permalink || String(id);
  const title = row.title || row.name || `Post ${id}`;
  const excerpt =
    row.excerpt ||
    (row.content ? String(row.content).slice(0, 180) : null) ||
    null;
  const coverUrl = row.cover_url || row.coverUrl || row.image || row.thumbnail || null;
  const author = row.author || row.author_name || null;
  const publishedAt =
    row.published_at || row.created_at || row.updated_at || null;

  return { id, slug, title, excerpt, coverUrl, author, publishedAt };
}

// GET /api/blog-posts?limit=10&offset=0  | ?all=1 para tudo (cuidado com payload grande)
router.get("/blog-posts", async (req, res) => {
  try {
    await loadBlogCols();

    const all = req.query.all === "1";
    const limit = Math.max(1, Number(req.query.limit || 10));
    const offset = Math.max(0, Number(req.query.offset || 0));

    const where = pickWherePublished();
    const orderBy = pickOrderBy();

    // Count total (resiliente ao WHERE condicional)
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM blog_posts ${where}`
    );
    const total = countRows?.[0]?.total ?? 0;

    let rows = [];
    if (all) {
      const [r] = await pool.query(
        `SELECT * FROM blog_posts ${where} ORDER BY ${orderBy} DESC`
      );
      rows = r;
    } else {
      const [r] = await pool.query(
        `SELECT * FROM blog_posts ${where} ORDER BY ${orderBy} DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      rows = r;
    }

    const items = Array.isArray(rows) ? rows.map(toItem) : [];

    res.json({
      total,
      items,
      limit: all ? items.length : limit,
      offset: all ? 0 : offset,
      hasMore: all ? false : offset + items.length < total,
    });
  } catch (err) {
    console.error("[BLOG] /api/blog-posts error:", {
      code: err?.code,
      message: err?.message,
      stack: err?.stack,
    });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
