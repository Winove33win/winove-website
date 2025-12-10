// backend/routes/templates.js
import { Router } from 'express';
import { missingDbEnv, pool } from '../db.js';
import { getFallbackTemplates } from '../fallbackData.js';

const router = Router();

const sendDbUnavailable = (res) =>
  res.status(503).json({
    error: 'db_config_invalida',
    message:
      'Variáveis de banco ausentes. Verifique DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.',
    missing: missingDbEnv,
  });

/** Normaliza qualquer valor possivelmente string/JSON para array */
const toArray = (value) => {
  if (!value) return [];
  try {
    const v = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

/** Garante URL absoluta para imagens locais em /assets */
const ABS = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = process.env.PUBLIC_BASE_URL || 'https://winove.com.br';
  const clean = url.startsWith('/assets') ? url : url.replace(/^assets\//, '/assets/');
  return `${base}${clean.startsWith('/') ? '' : '/'}${clean}`;
};

/** Converte a linha do banco no formato esperado pelo frontend */
const normalize = (row) => {
  let meta = {};
  try {
    meta = typeof row.meta === 'string' ? JSON.parse(row.meta) : row.meta || {};
  } catch {
    meta = {};
  }

  const images = meta.images || {};
  const gallery = Array.isArray(images.gallery) ? images.gallery.map(ABS) : [];

  return {
    slug: row.slug,
    title: row.title,

    // --- campos de texto/SEO jÇ­ existentes ---
    heading: meta.heading || '',
    subheading: meta.subheading || '',
    description: meta.description || '',
    category: meta.category || 'Outros',
    difficulty: meta.difficulty || 'Iniciante',

    // --- preÇõos/infos principais ---
    price: Number(meta.price || 0),
    originalPrice: meta.originalPrice != null ? Number(meta.originalPrice) : undefined,
    pages: Number(meta.pages || 0),

    // --- listas ---
    features: toArray(meta.features),
    includes: toArray(meta.includes),
    tags: toArray(meta.tags),

    // --- mÇðdia/demo ---
    demoUrl: meta.demoUrl || '',
    images: {
      cover: ABS(images.cover || ''),
      gallery: gallery,
    },

    // ====== NOVOS CAMPOS EXPOSTOS AO FRONT ======
    currency: meta.currency || 'BRL',
    contact: meta.contact || {}, // { whatsappIntl, defaultMessage }
    ctaTexts: meta.ctaTexts || {}, // { buyTemplate, hosting, email, bundle }
    addons: meta.addons || {}, // { hosting: {...}, email: {...} }
    bundles: Array.isArray(meta.bundles) ? meta.bundles : [],

    // --- conteÇ§do HTML e metadados do registro ---
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

const sendFallbackList = async (res) => {
  const fallbacks = await getFallbackTemplates();
  if (fallbacks?.length) {
    return res.status(200).setHeader('X-Data-Source', 'fallback').json(fallbacks.map(normalize));
  }
  return res.status(500).json({ error: 'Erro ao listar templates' });
};

const sendFallbackItem = async (res, slug) => {
  const fallbacks = await getFallbackTemplates();
  if (fallbacks?.length) {
    const match = fallbacks.find((tpl) => tpl.slug === slug);
    if (match) {
      return res.status(200).setHeader('X-Data-Source', 'fallback').json(normalize(match));
    }
    return res.status(404).json({ error: 'Template nÇœo encontrado' });
  }
  return res.status(500).json({ error: 'Erro ao carregar template' });
};

/** GET /api/templates */
router.get('/', async (_req, res) => {
  if (!pool) return sendDbUnavailable(res);

  try {
    const [rows] = await pool.query(`
      SELECT id, slug, title, content, meta, created_at, updated_at
      FROM templates
      ORDER BY created_at DESC
    `);
    const data = (rows || []).map(normalize);
    if (!data.length) {
      return sendFallbackList(res);
    }
    res.json(data);
  } catch (err) {
    console.error('GET /api/templates ->', err);
    return sendFallbackList(res);
  }
});

/** GET /api/templates/:slug */
router.get('/:slug', async (req, res) => {
  if (!pool) return sendDbUnavailable(res);

  try {
    const [rows] = await pool.query(
      'SELECT id, slug, title, content, meta, created_at, updated_at FROM templates WHERE slug = ? LIMIT 1',
      [req.params.slug]
    );
    if (!rows?.length) {
      return sendFallbackItem(res, req.params.slug);
    }
    res.json(normalize(rows[0]));
  } catch (err) {
    console.error('GET /api/templates/:slug ->', err);
    return sendFallbackItem(res, req.params.slug);
  }
});

export default router;
