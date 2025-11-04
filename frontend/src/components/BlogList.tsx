import { useEffect, useState } from "react";
import { fetchBlogPosts, type BlogItem } from "@/lib/api";

const PAGE_SIZE = 10;

export default function BlogList() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMore(nextOffset = 0) {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBlogPosts({ limit: PAGE_SIZE, offset: nextOffset });
      setItems(prev => nextOffset === 0 ? data.items : [...prev, ...data.items]);
      setTotal(data.total);
      setOffset(nextOffset + data.items.length);
      setHasMore(data.hasMore);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMore(0);
  }, []);

  return (
    <section className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(post => (
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
            {items.length === 0 ? "Nenhum post encontrado." : "Todos os posts foram carregados."}
          </p>
        )}
      </div>

      <p className="text-center text-xs opacity-60">
        Exibindo {items.length} de {total}
      </p>
    </section>
  );
}
