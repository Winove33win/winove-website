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

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '/api';
export const LEGACY_API_BASE =
  (import.meta.env.VITE_LEGACY_API_URL as string | undefined) || '/api';

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

const parseTemplate = (raw: UnknownRecord): Template | null => {
  const slug = typeof raw.slug === 'string' ? raw.slug : '';
  const title = typeof raw.title === 'string' ? raw.title : '';
  if (!slug || !title) return null;

  const imagesRaw = ensureRecord(raw.images);
  const gallery = Array.isArray(imagesRaw.gallery)
    ? imagesRaw.gallery.map((item) => normalizeImageUrl(String(item)))
    : [];

  return {
    slug,
    title,
    heading: typeof raw.heading === 'string' ? raw.heading : undefined,
    subheading: typeof raw.subheading === 'string' ? raw.subheading : undefined,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    category: typeof raw.category === 'string' ? raw.category : undefined,
    difficulty: typeof raw.difficulty === 'string' ? raw.difficulty : undefined,
    price: toNumber(raw.price),
    originalPrice: toOptionalNumber(raw.originalPrice),
    currency: typeof raw.currency === 'string' ? raw.currency : undefined,
    pages: toOptionalNumber(raw.pages),
    features: toArray(raw.features),
    includes: toArray(raw.includes),
    tags: toArray(raw.tags),
    demoUrl: typeof raw.demoUrl === 'string' ? raw.demoUrl : undefined,
    images: {
      cover: normalizeImageUrl(typeof imagesRaw.cover === 'string' ? imagesRaw.cover : ''),
      gallery,
    },
    contact: ensureRecord(raw.contact) as TemplateContact,
    ctaTexts: ensureRecord(raw.ctaTexts) as TemplateCtaTexts,
    addons: Object.fromEntries(
      Object.entries(ensureRecord(raw.addons)).map(([key, value]) => [key, parseAddon(value)])
    ),
    bundles: Array.isArray(raw.bundles) ? raw.bundles.map(parseBundle) : undefined,
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
  const response = await fetch(`${API_BASE}/templates`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar templates (${response.status})`);
  }

  const data = await parseJson<unknown[]>(response);
  const list = Array.isArray(data) ? data : [];
  const parsed = list
    .map((item) => (item && typeof item === 'object' ? parseTemplate(item as UnknownRecord) : null))
    .filter((item): item is Template => item !== null);

  return parsed;
}

export async function fetchTemplate(slug: string): Promise<Template | null> {
  if (!slug) return null;

  const response = await fetch(`${API_BASE}/templates/${encodeURIComponent(slug)}`, {
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
  const parsed = parseTemplate(data);
  return parsed;
}

export async function fetchBlogPosts(params: FetchBlogPostsParams = {}): Promise<BlogPostsResponse> {
  const query = new URLSearchParams();
  if (params.limit != null) query.set('limit', String(params.limit));
  if (params.offset != null) query.set('offset', String(params.offset));
  if (params.all) query.set('all', '1');
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('q', params.search);

  const qs = query.toString();
  const url = `${API_BASE}/blog-posts${qs ? `?${qs}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal: params.signal,
    });

    if (!response.ok) {
      throw new Error(`Erro ao carregar posts (${response.status})`);
    }

    const payload = ensureRecord(await parseJson<UnknownRecord>(response));
    const itemsRaw = Array.isArray(payload.items) ? payload.items : [];
    const items = itemsRaw
      .map((item) => (item && typeof item === 'object' ? parseBlogItem(item as UnknownRecord) : null))
      .filter((item): item is BlogItem => item !== null);

    const total = toNumber(payload.total, items.length);
    const limit = toNumber(payload.limit, params.limit ?? items.length);
    const offset = toNumber(payload.offset, params.offset ?? 0);
    const hasMore = Boolean(payload.hasMore);

    return {
      success: true,
      items,
      total,
      limit,
      offset,
      hasMore,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar posts';
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

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const response = await fetch(`${API_BASE}/blog-posts/categories`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar categorias (${response.status})`);
  }

  const data = await parseJson<unknown[]>(response);
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
