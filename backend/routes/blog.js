import { Router } from "express";
// Use o pool compartilhado com defaults em db.js. Isso evita erros 500 quando
// as variáveis de ambiente (DB_HOST, DB_USER, etc.) não estão definidas.
import { pool } from "../db.js";

const router = Router();

// Não crie um novo pool aqui. O pool em db.js já aplica valores padrão e
// manipula corretamente as variáveis de ambiente ausentes.

// Normaliza o formato para o frontend
function adapt(row) {
  const title = row.titulo ?? row.title ?? null;
  const excerpt = row.resumo ?? row.excerpt ?? null;
  const content = row.conteudo ?? row.content ?? null;
  const cover =
    row.imagem_destacada ?? row.coverUrl ?? row.coverImage ?? row.image ?? null;
  const author = row.autor ?? row.author ?? null;
  const publishedAt =
    row.data_publicacao ?? row.publishedAt ?? row.date ?? row.created_at ?? null;
  const category = row.categoria ?? row.category ?? null;

  return {
    ...row,
    titulo: row.titulo ?? title ?? undefined,
    title,
    resumo: row.resumo ?? excerpt ?? undefined,
    excerpt,
    conteudo: row.conteudo ?? content ?? undefined,
    content,
    imagem_destacada: row.imagem_destacada ?? cover ?? undefined,
    coverUrl: cover,
    coverImage: cover,
    data_publicacao: row.data_publicacao ?? publishedAt ?? undefined,
    publishedAt,
    date: publishedAt,
    autor: row.autor ?? author ?? undefined,
    author,
    categoria: row.categoria ?? category ?? undefined,
    category,
  };
}

const MAX_PAGE_SIZE = 50;

const parsePositiveInt = (value, fallback, { min = 1, max = MAX_PAGE_SIZE } = {}) => {
  if (Array.isArray(value)) {
    value = value[0];
  }

  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  const clamped = Math.max(min, max != null ? Math.min(parsed, max) : parsed);
  if (!Number.isFinite(clamped)) {
    return fallback;
  }

  return clamped;
};

const parseOffset = (value, fallback) => {
  if (Array.isArray(value)) {
    value = value[0];
  }

  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
};

const resolvePagination = (query, { defaultLimit = 10 } = {}) => {
  const limitFromQuery = parsePositiveInt(query.limit, null, { min: 1 });
  const pageSizeFromQuery = parsePositiveInt(query.pageSize, null, { min: 1 });
  const limit = limitFromQuery ?? pageSizeFromQuery ?? parsePositiveInt(undefined, defaultLimit, { min: 1 });

  const offsetFromQuery = parseOffset(query.offset, null);
  const pageFromQuery = parsePositiveInt(query.page, null, { min: 1, max: Number.MAX_SAFE_INTEGER });

  const offset = offsetFromQuery ?? (pageFromQuery ? (pageFromQuery - 1) * limit : 0);

  return { limit, offset };
};

// GET /api/blog-posts?limit=10&offset=0  | ?all=1 para tudo
router.get("/blog-posts", async (req, res) => {
  try {
    const all = req.query.all === "1";
    const { limit, offset } = resolvePagination(req.query);
    // Novo: aceita ?category=NomeDaCategoria (trim na string)
    const category =
      typeof req.query.category === "string" &&
      req.query.category.trim().length > 0
        ? req.query.category.trim()
        : null;

    // Se houver categoria, monte WHERE e parâmetros
    let whereClause = "";
    const params = [];
    if (category) {
      whereClause = "WHERE categoria = ?";
      params.push(category);
    }

    // Aplica o whereClause também na contagem
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM blog_posts ${whereClause}`,
      params
    );
    const total = countRows?.[0]?.total ?? 0;

    // Seleciona também a categoria
    let sql = `
      SELECT
        id,
        titulo,
        slug,
        resumo,
        conteudo,
        imagem_destacada,
        data_publicacao,
        autor,
        categoria
      FROM blog_posts
      ${whereClause}
      ORDER BY data_publicacao DESC, id DESC
    `;

    let rows;
    if (all) {
      // Quando todos, passa apenas params (se houver where)
      [rows] = await pool.query(sql, params);
    } else {
      sql += " LIMIT ? OFFSET ?";
      [rows] = await pool.query(sql, [...params, limit, offset]);
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

// GET /api/blog-posts/categories
router.get("/blog-posts/categories", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT categoria AS category, COUNT(*) AS count
       FROM blog_posts
       GROUP BY categoria
       ORDER BY count DESC`
    );

    const categories = (rows || []).map((row) => ({
      category: row.category || "Sem categoria",
      count: Number(row.count || 0),
    }));

    res.json(categories);
  } catch (err) {
    console.error("[BLOG] /api/blog-posts/categories error:", err?.code, err?.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/blog-posts/search
router.get("/blog-posts/search", async (req, res) => {
  try {
    const sanitize = (value) => (value || "").toString().trim();
    const qRaw = sanitize(req.query.q);
    const categoryRaw = sanitize(req.query.category);
    const { limit, offset } = resolvePagination(req.query);

    const whereParts = [];
    const params = [];

    if (qRaw) {
      const q = `%${qRaw}%`;
      whereParts.push("(titulo LIKE ? OR resumo LIKE ? OR conteudo LIKE ?)");
      params.push(q, q, q);
    }

    if (categoryRaw) {
      whereParts.push("categoria = ?");
      params.push(categoryRaw);
    }

    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM blog_posts ${where}`,
      params
    );
    const total = Number(countRows?.[0]?.total || 0);

    const [rows] = await pool.query(
      `SELECT
         id,
         titulo,
         slug,
         resumo,
         conteudo,
         imagem_destacada,
         data_publicacao,
         autor,
         categoria
       FROM blog_posts
       ${where}
       ORDER BY data_publicacao DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const items = (rows || []).map(adapt);

    res.json({
      total,
      items,
      limit,
      offset,
      hasMore: offset + items.length < total,
    });
  } catch (err) {
    console.error("[BLOG] /api/blog-posts/search error:", err?.code, err?.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/blog-posts/:slug
router.get("/blog-posts/:slug", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         titulo,
         slug,
         resumo,
         conteudo,
         imagem_destacada,
         data_publicacao,
         autor,
         categoria
       FROM blog_posts
       WHERE slug = ?
       LIMIT 1`,
      [req.params.slug]
    );

    if (!rows?.length) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    const post = adapt(rows[0]);
    res.json(post);
  } catch (err) {
    console.error("[BLOG] /api/blog-posts/:slug error:", err?.code, err?.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
