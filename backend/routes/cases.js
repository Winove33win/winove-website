import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const toArray = (value) => {
  if (!value) return [];
  try {
    const v = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

// Garante URL absoluta para imagens locais do /assets
const ABS = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  const base = process.env.PUBLIC_BASE_URL || 'https://winove.com.br';
  const normalized = url.startsWith('/assets')
    ? url
    : `/${url.replace(/^\/?/, '').replace(/^assets\//, 'assets/')}`;

  try {
    return new URL(normalized, base).href;
  } catch {
    const safeBase = base.replace(/\/$/, '');
    const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
    return `${safeBase}${encodeURI(path)}`;
  }
};

router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(req.query.pageSize, 10) || 10, 1);
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        slug,
        excerpt,
        coverImage,
        tags,
        metrics,
        gallery,
        content,
        client,
        category,
        created_at
      FROM cases
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `,
      [pageSize, offset]
    );

    const data = (rows || []).map((r) => ({
      ...r,
      // normalização defensiva
      tags: toArray(r.tags),
      metrics: toArray(r.metrics),
      gallery: toArray(r.gallery).map(ABS),
      coverImage: ABS(r.coverImage),
    }));

    // Front-end espera um array simples de cases
    res.json(data);
  } catch (err) {
    console.error('GET /api/cases ->', err);
    res.status(500).json({ error: 'Erro ao carregar cases' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        slug,
        excerpt,
        coverImage,
        tags,
        metrics,
        gallery,
        content,
        client,
        category,
        created_at
      FROM cases
      WHERE slug = ?
      LIMIT 1
    `,
      [req.params.slug]
    );

    if (!rows?.length) return res.status(404).json({ error: 'Case não encontrado' });

    const r = rows[0];
    const payload = {
      ...r,
      tags: toArray(r.tags),
      metrics: toArray(r.metrics),
      gallery: toArray(r.gallery).map(ABS),
      coverImage: ABS(r.coverImage),
    };

    res.json(payload);
  } catch (err) {
    console.error('GET /api/cases/:slug ->', err);
    res.status(500).json({ error: 'Erro ao carregar case' });
  }
});

export default router;
