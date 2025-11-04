import { Router } from 'express';
import { pool } from '../db.js';
import {
  absoluteUrl,
  ensureTemplateIsFresh,
  getBaseTemplate,
  renderTemplateWithMeta,
} from '../utils/htmlTemplate.js';

const router = Router();

const BASE_URL = (process.env.APP_BASE_URL || 'https://winove.com.br').replace(/\/$/, '');
const DEFAULT_AUTHOR = process.env.DEFAULT_POST_AUTHOR || 'Equipe Winove';
const PUBLISHER_NAME = process.env.PUBLISHER_NAME || 'Winove';
const PUBLISHER_LOGO =
  process.env.PUBLISHER_LOGO || `${BASE_URL}/assets/images/logo-winove-512.png`;
const DEFAULT_SHARE_IMAGE =
  process.env.DEFAULT_SHARE_IMAGE || 'https://www.winove.com.br/imagem-de-compartilhamento.png';

const toISODate = (value) => {
  try {
    return value ? new Date(value).toISOString() : undefined;
  } catch (err) {
    return undefined;
  }
};

const ensureAbsoluteUrl = (value) => absoluteUrl(BASE_URL, value);

router.get('/blog/:slug([^/.]+)/?', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT
         slug,
         titulo,
         resumo,
         imagem_destacada,
         data_publicacao,
         autor,
         categoria,
         data_publicacao AS updated_at,
         data_publicacao AS created_at
       FROM blog_posts
       WHERE slug = ?
       LIMIT 1`,
      [slug]
    );

    if (!rows?.length) {
      return res.status(404).send('Post não encontrado');
    }

    let template = ensureTemplateIsFresh() || getBaseTemplate();
    if (!template) {
      return next();
    }

    const post = rows[0];
    const canonical = `${BASE_URL}/blog/${post.slug}/`;
    const postTitle = (post.title || post.titulo || '').trim();
    const title = postTitle ? `${postTitle} | Winove` : 'Post do Blog | Winove';
    const summary = (post.summary || post.resumo || '').trim();
    const description = summary || 'Confira este conteúdo exclusivo no blog da Winove.';
    const image = ensureAbsoluteUrl(post.image || post.imagem_destacada) || DEFAULT_SHARE_IMAGE;
    const publishedAtRaw = post.data_publicacao || post.created_at;
    const updatedAtRaw = post.updated_at || publishedAtRaw;
    const datePublished = toISODate(publishedAtRaw) || new Date().toISOString();
    const dateModified = toISODate(updatedAtRaw) || datePublished;
    const authorName = (post.author || post.autor || DEFAULT_AUTHOR).trim() || DEFAULT_AUTHOR;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: postTitle || title,
      description,
      image: [image],
      author: { '@type': 'Person', name: authorName },
      publisher: {
        '@type': 'Organization',
        name: PUBLISHER_NAME,
        logo: {
          '@type': 'ImageObject',
          url: ensureAbsoluteUrl(post.publisher_logo || PUBLISHER_LOGO),
        },
      },
      datePublished,
      dateModified,
      mainEntityOfPage: canonical,
    };

    const html = renderTemplateWithMeta(template, {
      title,
      description,
      canonical,
      openGraph: {
        'og:type': 'article',
        'og:title': title,
        'og:description': description,
        'og:image': image,
        'article:author': authorName,
        'article:published_time': datePublished,
        'article:modified_time': dateModified,
      },
      twitter: {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': image,
      },
      jsonLd,
    });

    if (!html) {
      return next();
    }

    res
      .status(200)
      .set('Content-Type', 'text/html; charset=UTF-8')
      .set('Cache-Control', 'public, max-age=300, s-maxage=300')
      .send(html);
  } catch (err) {
    console.error('GET /blog/:slug ->', err);
    next(err);
  }
});

router.get('/api/post/:slug/seo', async (req, res) => {
  try {
    const { slug } = req.params;

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
         categoria,
         data_publicacao AS updated_at,
         data_publicacao AS created_at
       FROM blog_posts
       WHERE slug = ?
       LIMIT 1`,
      [slug]
    );
    if (!rows?.length) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const post = rows[0];
    const title = post.title || post.titulo || '';
    const summary = post.summary || post.resumo || '';
    const image = ensureAbsoluteUrl(post.image || post.imagem_destacada);
    const author = post.author || post.autor || DEFAULT_AUTHOR;
    const createdAtRaw = post.created_at || post.data_publicacao || post.updated_at;
    const updatedAtRaw = post.updated_at || post.data_publicacao || post.created_at;

    const datePublished = toISODate(createdAtRaw) || new Date().toISOString();
    const dateModified = toISODate(updatedAtRaw) || datePublished;
    const canonical = `${BASE_URL}/blog/${post.slug}/`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: summary,
      image,
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: PUBLISHER_NAME,
        logo: {
          '@type': 'ImageObject',
          url: ensureAbsoluteUrl(post.publisher_logo || PUBLISHER_LOGO),
        },
      },
      datePublished,
      dateModified,
      mainEntityOfPage: canonical,
    };

    const meta = {
      title,
      description: summary,
      canonical,
      openGraph: {
        'og:type': 'article',
        'og:url': canonical,
        'og:title': title,
        'og:description': summary,
        'og:image': image,
        'article:published_time': datePublished,
        'article:modified_time': dateModified,
      },
      twitter: {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': summary,
        'twitter:image': image,
        'twitter:url': canonical,
      },
    };

    return res.json({ slug: post.slug, jsonLd, meta });
  } catch (err) {
    console.error('GET /api/post/:slug/seo ->', err);
    return res.status(500).json({ error: 'Erro ao gerar metadados' });
  }
});

export default router;
