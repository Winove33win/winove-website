import { useEffect, useState } from "react";
import {
  fetchBlogPosts,
  type BlogItem,
  fetchBlogCategories,
  type BlogCategory,
} from "@/lib/api";

const PAGE_SIZE = 10;

export default function BlogList() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estado para categorias e categoria selecionada
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const safeItems = Array.isArray(items) ? items : [];

  async function loadMore(nextOffset = 0) {
    try {
      setLoading(true);
      setError(null);
      if (nextOffset === 0) {
        setOffset(0);
      }
      const data = await fetchBlogPosts({
        limit: PAGE_SIZE,
        offset: nextOffset,
        category: selectedCategory ?? undefined,
      });

      if (!data.success) {
        if (nextOffset === 0) {
          setItems([]);
          setTotal(0);
        }
        setHasMore(false);
        setError(data.message || "Erro ao carregar posts");
        return;
      }

      const incomingItems = Array.isArray(data.items) ? data.items : [];
      setItems((prev) =>
        nextOffset === 0 ? incomingItems : [...prev, ...incomingItems]
      );
      setTotal(typeof data.total === 'number' ? data.total : incomingItems.length + nextOffset);
      setOffset(nextOffset + incomingItems.length);
      setHasMore(Boolean(data.hasMore) && incomingItems.length > 0);
    } catch (e: any) {
      if (nextOffset === 0) {
        setItems([]);
        setTotal(0);
      }
      setHasMore(false);
      setError(e?.message || "Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  }

  // Carrega categorias apenas uma vez
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBlogCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Não foi possível carregar categorias", err);
      }
    })();
  }, []);

  // Sempre que a categoria selecionada mudar, reinicia a lista
  useEffect(() => {
    loadMore(0);
  }, [selectedCategory]);

  return (
    <section className="space-y-6">
      {/* Filtros de categoria/tags */}
      {categories?.length > 0 ? (
        <div className="flex gap-2 my-4 overflow-x-auto py-2 scrollbar-thin">
          {categories.map((cat) => {
            const active = selectedCategory === cat.category;
            return (
              <button
                key={cat.category || "__empty"}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === cat.category ? null : cat.category
                  )
                }
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm border ${
                  active
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--text)] hover:bg-[var(--border)]"
                }`}
              >
                {cat.category} ({cat.count})
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm opacity-60 my-4">Nenhuma categoria encontrada.</p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {safeItems.map(post => (
          <li key={post.id} className="rounded-2xl border border-[var(--border,#26262a)] bg-[var(--card,#1C1C1F)] p-4">
            {post.coverUrl && (
              <img
                src={post.coverUrl}
                alt=""
                className="mb-3 aspect-[16/9] w-full rounded-xl object-cover"
                loading="lazy"
              />
            )}
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="mt-2 text-sm opacity-80">{post.excerpt}</p>
            <a
              href={`/blog/${post.slug}`}
              className="mt-3 inline-block rounded-full border px-4 py-2 text-sm"
            >
              Ler mais
            </a>
          </li>
        ))}
      </ul>

      {error && <p className="text-red-500">{error}</p>}
      {!loading && safeItems.length === 0 && !error && (
        <p className="text-center text-sm opacity-70">Nenhum post disponível.</p>
      )}

      <div className="flex items-center justify-center">
        {hasMore ? (
          <button
            disabled={loading}
            onClick={() => loadMore(offset)}
            className="rounded-full bg-[var(--accent,#e11d48)] px-5 py-3 text-sm font-medium text-white"
          >
            {loading ? "Carregando..." : "Ver mais"}
          </button>
        ) : (
          <p className="text-sm opacity-70">
            {safeItems.length === 0 ? "Nenhum post encontrado." : "Todos os posts foram carregados."}
          </p>
        )}
      </div>

      <p className="text-center text-xs opacity-60">
        Exibindo {safeItems.length} de {total}
      </p>
    </section>
  );
}
