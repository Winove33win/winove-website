import { normalizeImageUrl } from './utils';

export type TemplateContact = {
  whatsappIntl?: string;
  defaultMessage?: string;
};

export type TemplateCtaTexts = {
  buyTemplate?: string;
  hosting?: string;
  email?: string;
  bundle?: string;
};

export type TemplateAddon = {
  id?: string;
  name?: string;
  priceYear?: number;
  price?: number;
  storageGB?: number;
  panel?: string;
  quotaGB?: number;
  accounts?: number;
  description?: string;
};

export type TemplateBundle = {
  id?: string;
  name?: string;
  firstYear?: number;
  renewalYear?: number;
  includes?: string[];
};

export type Template = {
  slug: string;
  title: string;
  heading?: string;
  subheading?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  pages?: number;
  features: string[];
  includes: string[];
  tags: string[];
  demoUrl?: string;
  images: {
    cover: string;
    gallery: string[];
  };
  contact?: TemplateContact;
  ctaTexts?: TemplateCtaTexts;
  addons?: Record<string, TemplateAddon>;
  bundles?: TemplateBundle[];
  content?: string;
  created_at?: string;
  updated_at?: string;
};

const normalizeApiBase = (base: string): string => base.replace(/\/+$/, '');
const joinApiPath = (base: string, path: string): string => {
  if (!path) return base;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const API_BASE = normalizeApiBase(
  (import.meta.env.VITE_API_URL as string | undefined) || '/api'
);
export const LEGACY_API_BASE = normalizeApiBase(
  (import.meta.env.VITE_LEGACY_API_URL as string | undefined) || '/api'
);

type UnknownRecord = Record<string, unknown>;

export type BlogItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverUrl?: string;
  author?: string;
  category?: string;
  publishedAt?: string;
};

export type BlogCategory = {
  category: string;
  count: number;
};

export type FetchBlogPostsParams = {
  limit?: number;
  offset?: number;
  category?: string;
  all?: boolean;
  search?: string;
  signal?: AbortSignal;
};

export type BlogPostsResponse = {
  success: boolean;
  items: BlogItem[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  message?: string;
};

export const API_BASE_URL = API_BASE;

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
    } catch {
      return value ? value.split(',').map((part) => part.trim()).filter(Boolean) : [];
    }
  }
  return [];
};

const ensureRecord = (value: unknown): UnknownRecord => {
  return value && typeof value === 'object' ? (value as UnknownRecord) : {};
};

const toStringOrUndefined = (value: unknown): string | undefined => {
  return typeof value === 'string' && value.trim() ? value : undefined;
};

const toStringOrEmpty = (value: unknown): string => {
  return typeof value === 'string' ? value : '';
};

const parseAddon = (value: unknown): TemplateAddon => {
  const record = ensureRecord(value);
  return {
    id: typeof record.id === 'string' ? record.id : undefined,
    name: typeof record.name === 'string' ? record.name : undefined,
    priceYear: toOptionalNumber(record.priceYear),
    price: toOptionalNumber(record.price),
    storageGB: toOptionalNumber(record.storageGB),
    panel: typeof record.panel === 'string' ? record.panel : undefined,
    quotaGB: toOptionalNumber(record.quotaGB),
    accounts: toOptionalNumber(record.accounts),
    description: typeof record.description === 'string' ? record.description : undefined,
  };
};

const parseBundle = (value: unknown): TemplateBundle => {
  const record = ensureRecord(value);
  return {
    id: typeof record.id === 'string' ? record.id : undefined,
    name: typeof record.name === 'string' ? record.name : undefined,
    firstYear: toOptionalNumber(record.firstYear),
    renewalYear: toOptionalNumber(record.renewalYear),
    includes: toArray(record.includes),
  };
};

const parseTemplateMeta = (raw: UnknownRecord): UnknownRecord => {
  const metaRaw = raw.meta;
  if (typeof metaRaw === 'string') {
    try {
      return ensureRecord(JSON.parse(metaRaw));
    } catch {
      return {};
    }
  }
  return ensureRecord(metaRaw);
};

const parseTemplate = (raw: UnknownRecord): Template | null => {
  const slug = typeof raw.slug === 'string' ? raw.slug : '';
  const title = typeof raw.title === 'string' ? raw.title : '';
  if (!slug || !title) return null;

  const meta = parseTemplateMeta(raw);
  const imagesRaw = ensureRecord(raw.images);
  const imagesMeta = ensureRecord(meta.images as UnknownRecord);
  const images = Object.keys(imagesRaw).length ? imagesRaw : imagesMeta;
  const gallery = Array.isArray(imagesRaw.gallery)
    ? imagesRaw.gallery.map((item) => normalizeImageUrl(String(item)))
    : Array.isArray(imagesMeta.gallery)
      ? imagesMeta.gallery.map((item) => normalizeImageUrl(String(item)))
      : [];

  const description =
    typeof raw.description === 'string'
      ? raw.description
      : typeof meta.description === 'string'
        ? meta.description
        : undefined;
  const category =
    typeof raw.category === 'string'
      ? raw.category
      : typeof meta.category === 'string'
        ? meta.category
        : undefined;
  const difficulty =
    typeof raw.difficulty === 'string'
      ? raw.difficulty
      : typeof meta.difficulty === 'string'
        ? meta.difficulty
        : undefined;
  const heading =
    typeof raw.heading === 'string'
      ? raw.heading
      : typeof meta.heading === 'string'
        ? meta.heading
        : undefined;
  const subheading =
    typeof raw.subheading === 'string'
      ? raw.subheading
      : typeof meta.subheading === 'string'
        ? meta.subheading
        : undefined;
  const demoUrl =
    typeof raw.demoUrl === 'string'
      ? raw.demoUrl
      : typeof meta.demoUrl === 'string'
        ? meta.demoUrl
        : undefined;

  return {
    slug,
    title,
    heading,
    subheading,
    description,
    category,
    difficulty,
    price: toNumber(raw.price ?? meta.price),
    originalPrice: toOptionalNumber(raw.originalPrice ?? meta.originalPrice),
    currency: typeof raw.currency === 'string' ? raw.currency : typeof meta.currency === 'string' ? meta.currency : undefined,
    pages: toOptionalNumber(raw.pages ?? meta.pages),
    features: toArray(raw.features ?? meta.features),
    includes: toArray(raw.includes ?? meta.includes),
    tags: toArray(raw.tags ?? meta.tags),
    demoUrl,
    images: {
      cover: normalizeImageUrl(typeof images.cover === 'string' ? images.cover : ''),
      gallery,
    },
    contact: (Object.keys(ensureRecord(raw.contact)).length
      ? ensureRecord(raw.contact)
      : ensureRecord(meta.contact)) as TemplateContact,
    ctaTexts: (Object.keys(ensureRecord(raw.ctaTexts)).length
      ? ensureRecord(raw.ctaTexts)
      : ensureRecord(meta.ctaTexts)) as TemplateCtaTexts,
    addons: Object.fromEntries(
      Object.entries(
        Object.keys(ensureRecord(raw.addons)).length ? ensureRecord(raw.addons) : ensureRecord(meta.addons)
      ).map(([key, value]) => [key, parseAddon(value)])
    ),
    bundles: Array.isArray(raw.bundles)
      ? raw.bundles.map(parseBundle)
      : Array.isArray(meta.bundles)
        ? meta.bundles.map(parseBundle)
        : undefined,
    content: typeof raw.content === 'string' ? raw.content : undefined,
    created_at: typeof raw.created_at === 'string' ? raw.created_at : undefined,
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : undefined,
  };
};

const parseJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    throw new Error('Resposta vazia do servidor');
  }
  return JSON.parse(text) as T;
};

const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar dados (${response.status})`);
  }

  return parseJson<T>(response);
};

const parseBlogItem = (raw: UnknownRecord): BlogItem | null => {
  const id = toNumber(raw.id, 0);
  const slug = toStringOrEmpty(raw.slug);
  const title = toStringOrEmpty(raw.title || raw.titulo);
  if (!slug || !title) {
    return null;
  }

  const excerpt = toStringOrEmpty(raw.excerpt ?? raw.resumo);
  const content = toStringOrUndefined(raw.content ?? raw.conteudo);
  const coverRaw =
    toStringOrUndefined(raw.coverUrl) ||
    toStringOrUndefined(raw.coverImage) ||
    toStringOrUndefined(raw.imagem_destacada) ||
    toStringOrUndefined(raw.image);
  const coverUrl = coverRaw ? normalizeImageUrl(coverRaw) : undefined;
  const author = toStringOrUndefined(raw.author ?? raw.autor);
  const category = toStringOrUndefined(raw.category ?? raw.categoria);
  const publishedAt =
    toStringOrUndefined(raw.publishedAt ?? raw.data_publicacao) ||
    toStringOrUndefined(raw.date ?? raw.created_at);

  return {
    id,
    title,
    slug,
    excerpt,
    content,
    coverUrl,
    author,
    category,
    publishedAt,
  };
};

export async function fetchTemplates(): Promise<Template[]> {
  const primaryUrl = joinApiPath(API_BASE, 'templates');
  const legacyUrl = joinApiPath(LEGACY_API_BASE, 'templates.php');
  let data: unknown[];

  try {
    data = await fetchJson<unknown[]>(primaryUrl);
  } catch (_error) {
    data = await fetchJson<unknown[]>(legacyUrl);
  }
  const list = Array.isArray(data) ? data : [];
  const parsed = list
    .map((item) => (item && typeof item === 'object' ? parseTemplate(item as UnknownRecord) : null))
    .filter((item): item is Template => item !== null);

  return parsed;
}

export async function fetchTemplate(slug: string): Promise<Template | null> {
  if (!slug) return null;

  const primaryUrl = joinApiPath(API_BASE, `templates/${encodeURIComponent(slug)}`);
  const legacyUrl = joinApiPath(
    LEGACY_API_BASE,
    `templates-by-slug.php?slug=${encodeURIComponent(slug)}`
  );

  const fetchTemplateFromUrl = async (url: string): Promise<Template | null> => {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro ao carregar template (${response.status})`);
    }

    const data = await parseJson<UnknownRecord>(response);
    return parseTemplate(data);
  };

  try {
    return await fetchTemplateFromUrl(primaryUrl);
  } catch (_error) {
    return await fetchTemplateFromUrl(legacyUrl);
  }
}

export async function fetchBlogPosts(params: FetchBlogPostsParams = {}): Promise<BlogPostsResponse> {
  const query = new URLSearchParams();
  if (params.limit != null) query.set('limit', String(params.limit));
  if (params.offset != null) query.set('offset', String(params.offset));
  if (params.all) query.set('all', '1');
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('q', params.search);

  const qs = query.toString();
  const url = joinApiPath(API_BASE, `blog-posts${qs ? `?${qs}` : ''}`);

  try {
    const payload = ensureRecord(await fetchJson<UnknownRecord>(url, { signal: params.signal }));
    const itemsRaw = Array.isArray(payload.items) ? payload.items : [];
    const items = itemsRaw
      .map((item) => (item && typeof item === 'object' ? parseBlogItem(item as UnknownRecord) : null))
      .filter((item): item is BlogItem => item !== null);

    const total = toNumber(payload.total, items.length);
    const limit = toNumber(payload.limit, params.limit ?? items.length);
    const offset = toNumber(payload.offset, params.offset ?? 0);
    const hasMore = Boolean(payload.hasMore);

    return { success: true, items, total, limit, offset, hasMore };
  } catch (error) {
    try {
      const legacyBase = LEGACY_API_BASE;
      if (params.all) {
        const legacyAllUrl = joinApiPath(legacyBase, 'blog-posts.php');
        const legacyPosts = await fetchJson<unknown[]>(legacyAllUrl, { signal: params.signal });
        const rawList = Array.isArray(legacyPosts) ? legacyPosts : [];
        const parsed = rawList
          .map((item) => (item && typeof item === 'object' ? parseBlogItem(item as UnknownRecord) : null))
          .filter((item): item is BlogItem => item !== null);

        const filtered = parsed.filter((item) => {
          if (params.category && item.category !== params.category) return false;
          if (params.search) {
            const needle = params.search.toLowerCase();
            const haystack = `${item.title} ${item.excerpt} ${item.content || ''}`.toLowerCase();
            if (!haystack.includes(needle)) return false;
          }
          return true;
        });

        return {
          success: true,
          items: filtered,
          total: filtered.length,
          limit: filtered.length,
          offset: 0,
          hasMore: false,
        };
      }

      const limit = params.limit ?? 10;
      const offset = params.offset ?? 0;
      const page = Math.floor(offset / limit) + 1;
      const legacyQuery = new URLSearchParams();
      legacyQuery.set('page', String(page));
      legacyQuery.set('pageSize', String(limit));
      if (params.search) legacyQuery.set('q', params.search);
      if (params.category) legacyQuery.set('category', params.category);
      const legacyUrl = joinApiPath(legacyBase, `blog-posts-search.php?${legacyQuery.toString()}`);
      const legacyPayload = ensureRecord(
        await fetchJson<UnknownRecord>(legacyUrl, { signal: params.signal })
      );
      const itemsRaw = Array.isArray(legacyPayload.items) ? legacyPayload.items : [];
      const items = itemsRaw
        .map((item) => (item && typeof item === 'object' ? parseBlogItem(item as UnknownRecord) : null))
        .filter((item): item is BlogItem => item !== null);
      const total = toNumber(legacyPayload.total, items.length);
      const hasMore = offset + items.length < total;

      return {
        success: true,
        items,
        total,
        limit,
        offset,
        hasMore,
      };
    } catch (legacyError) {
      const message = legacyError instanceof Error ? legacyError.message : 'Erro ao carregar posts';
      return {
        success: false,
        items: [],
        total: 0,
        limit: params.limit ?? 0,
        offset: params.offset ?? 0,
        hasMore: false,
        message,
      };
    }
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogItem | null> {
  if (!slug) return null;

  const primaryUrl = joinApiPath(API_BASE, `blog-posts/${encodeURIComponent(slug)}`);
  const legacyUrl = joinApiPath(
    LEGACY_API_BASE,
    `blog-posts-by-slug.php?slug=${encodeURIComponent(slug)}`
  );

  const fetchBlogItem = async (url: string): Promise<BlogItem | null> => {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro ao carregar post (${response.status})`);
    }

    const data = await parseJson<UnknownRecord>(response);
    return data && typeof data === 'object' ? parseBlogItem(data) : null;
  };

  try {
    return await fetchBlogItem(primaryUrl);
  } catch (_error) {
    return await fetchBlogItem(legacyUrl);
  }
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const primaryUrl = joinApiPath(API_BASE, 'blog-posts/categories');
  const legacyUrl = joinApiPath(LEGACY_API_BASE, 'blog-posts-categories.php');
  let data: unknown[];

  try {
    data = await fetchJson<unknown[]>(primaryUrl);
  } catch (_error) {
    data = await fetchJson<unknown[]>(legacyUrl);
  }
  const list = Array.isArray(data) ? data : [];
  return list.map((item) => {
    const record = ensureRecord(item);
    const categoryValue = record.category ?? record.nome ?? record.name ?? 'Sem categoria';
    return {
      category: toStringOrEmpty(categoryValue),
      count: toNumber(record.count, 0),
    };
  });
}
