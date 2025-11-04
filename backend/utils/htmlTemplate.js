import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_IMAGE = 'https://www.winove.com.br/imagem-de-compartilhamento.png';

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
const escapeAttribute = (value) => escapeHtml(value).replace(/"/g, '&quot;');

const BACKEND_ROOT = path.join(__dirname, '..');

const resolveCandidatePath = (value) => {
  if (!value) {
    return null;
  }
  if (path.isAbsolute(value)) {
    return value;
  }
  return path.join(BACKEND_ROOT, value);
};

const candidateIndexPaths = Array.from(
  new Set(
    [
      resolveCandidatePath(process.env.SSR_INDEX_FILE),
      path.join(__dirname, '../dist/index.html'),
      path.join(__dirname, '../../frontend/dist/index.html'),
      path.join(__dirname, '../../dist/index.html'),
      path.join(__dirname, '../../frontend/index.html'),
    ].filter(Boolean)
  )
);

let cachedBaseTemplate = null;
let cachedTemplateMtime = null;

const readTemplateFile = () => {
  for (const filePath of candidateIndexPaths) {
    try {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        cachedTemplateMtime = stats.mtimeMs;
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch (err) {
      // continue to next candidate
    }
  }
  return null;
};

export const getBaseTemplate = () => {
  if (!cachedBaseTemplate) {
    cachedBaseTemplate = readTemplateFile();
  }
  return cachedBaseTemplate;
};

export const refreshBaseTemplate = () => {
  cachedBaseTemplate = readTemplateFile();
  return cachedBaseTemplate;
};

export const ensureTemplateIsFresh = () => {
  for (const filePath of candidateIndexPaths) {
    try {
      const stats = fs.statSync(filePath);
      if (stats.isFile() && stats.mtimeMs !== cachedTemplateMtime) {
        cachedTemplateMtime = stats.mtimeMs;
        cachedBaseTemplate = fs.readFileSync(filePath, 'utf8');
        return cachedBaseTemplate;
      }
    } catch (err) {
      // ignore
    }
  }
  return cachedBaseTemplate;
};

const upsertMetaTag = (html, attrName, attrValue, content) => {
  if (!attrValue) {
    return html;
  }
  const safeContent = escapeAttribute(content ?? '');
  const tag = `<meta ${attrName}="${attrValue}" content="${safeContent}" />`;
  const regex = new RegExp(`<meta\\s+${attrName}="${escapeRegExp(attrValue)}"[^>]*>`, 'i');
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `  ${tag}\n</head>`);
};

const upsertLinkTag = (html, rel, href) => {
  if (!rel || !href) {
    return html;
  }
  const safeHref = escapeAttribute(href);
  const tag = `<link rel="${rel}" href="${safeHref}" />`;
  const regex = new RegExp(`<link\\s+rel="${escapeRegExp(rel)}"[^>]*>`, 'i');
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `  ${tag}\n</head>`);
};

const appendJsonLd = (html, data) => {
  if (!data) {
    return html;
  }
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const script = `<script type="application/ld+json">${json}</script>`;
  return html.replace('</head>', `  ${script}\n</head>`);
};

const normaliseDescription = (value) => {
  if (!value) {
    return '';
  }
  return String(value).replace(/\s+/g, ' ').trim().slice(0, 300);
};

export const renderTemplateWithMeta = (baseHtml, {
  title,
  description,
  canonical,
  openGraph = {},
  twitter = {},
  jsonLd,
} = {}) => {
  if (!baseHtml) {
    return null;
  }
  let html = `${baseHtml}`;
  if (title) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  }
  if (description) {
    html = upsertMetaTag(html, 'name', 'description', normaliseDescription(description));
  }
  if (canonical) {
    html = upsertLinkTag(html, 'canonical', canonical);
  }

  const ogData = { ...openGraph };
  const twitterData = { ...twitter };
  if (canonical && !ogData['og:url']) {
    ogData['og:url'] = canonical;
  }
  if (canonical && !twitterData['twitter:url']) {
    twitterData['twitter:url'] = canonical;
  }

  const ogEntries = Object.entries(ogData).filter(([, value]) => value);
  for (const [property, value] of ogEntries) {
    html = upsertMetaTag(html, 'property', property, value);
  }

  const twitterEntries = Object.entries(twitterData).filter(([, value]) => value);
  for (const [name, value] of twitterEntries) {
    html = upsertMetaTag(html, 'name', name, value);
  }

  if (jsonLd) {
    html = appendJsonLd(html, jsonLd);
  }

  // Ensure there's always an og:image available
  if (!ogData['og:image']) {
    html = upsertMetaTag(html, 'property', 'og:image', DEFAULT_IMAGE);
  }
  if (!twitterData['twitter:image']) {
    html = upsertMetaTag(html, 'name', 'twitter:image', DEFAULT_IMAGE);
  }

  return html;
};

export const absoluteUrl = (baseUrl, value) => {
  if (!value) {
    return DEFAULT_IMAGE;
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  const normalised = String(value).replace(/^\/+/, '');
  return `${baseUrl}/${normalised}`;
};
