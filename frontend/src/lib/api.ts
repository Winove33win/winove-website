import axios from 'axios';

export interface Template {
  slug: string;
  category?: string;
  difficulty?: string;
  title: string;
  description?: string;
  tags?: string[];
  images: {
    cover: string;
  };
  price: number;
  originalPrice?: number;
  pages?: number;
}

// In Vite, env vars come from import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: BASE_URL, // empty -> use same-origin relative /api
  timeout: 5000,
});

export const fetchTemplate = async (slug: string): Promise<Template> => {
  const res = await api.get<Template>(`/api/templates/${slug}`);
  return res.data;
};

export const fetchTemplates = async (): Promise<Template[]> => {
  const res = await api.get<Template[]>(`/api/templates`);
  return res.data;
};

export type BlogItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl?: string | null;
  author?: string | null;
  publishedAt: string;
  category?: string | null;
};

export type BlogResponse = {
  total: number;
  items: BlogItem[];
  limit: number;
  offset: number;
  hasMore: boolean;
  success: boolean;
  message?: string;
};

// Representa cada categoria (tag) com sua contagem
export type BlogCategory = {
  category: string;
  count: number;
};

const API = import.meta.env.VITE_API_URL || '/api';

export async function fetchBlogPosts(params: { limit?: number; offset?: number; category?: string } = {}): Promise<BlogResponse> {
  const { limit = 10, offset = 0, category } = params;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  const url = new URL(`${API}/blog-posts`, origin);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  if (category) {
    url.searchParams.set('category', category);
  }

  const fallback: BlogResponse = {
    total: 0,
    items: [],
    limit,
    offset,
    hasMore: false,
    success: false,
    message: 'Falha ao carregar posts',
  };

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      const message = `Erro ao carregar posts (${res.status})`;
      return { ...fallback, message };
    }

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    const total = typeof data?.total === 'number' ? data.total : items.length;
    const response: BlogResponse = {
      total,
      items,
      limit: typeof data?.limit === 'number' ? data.limit : limit,
      offset: typeof data?.offset === 'number' ? data.offset : offset,
      hasMore: Boolean(data?.hasMore) && items.length + offset < total,
      success: true,
    };

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : fallback.message;
    return { ...fallback, message };
  }
}

// Busca categorias disponíveis para filtragem
export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  const url = new URL(`${API}/blog-posts/categories`, origin);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Erro ao carregar categorias (${res.status})`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
