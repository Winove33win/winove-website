import { useCallback, useEffect, useState } from "react";
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

  const loadMore = useCallback(
    async (nextOffset = 0) => {
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
        setTotal(
          typeof data.total === "number"
            ? data.total
            : incomingItems.length + nextOffset
        );
        setOffset(nextOffset + incomingItems.length);
        setHasMore(Boolean(data.hasMore) && incomingItems.length > 0);
      } catch (error) {
        if (nextOffset === 0) {
          setItems([]);
          setTotal(0);
        }
        setHasMore(false);
        const message =
          error instanceof Error ? error.message : "Erro ao carregar posts";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );

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
  }, [loadMore]);

  const loadingInitial = loading && safeItems.length === 0;
  const categoryLabel = selectedCategory
    ? `Resultados filtrados por "${selectedCategory}"`
    : "Todos os conteúdos publicados";

  return (
    <section aria-labelledby="blog-list-heading" className="space-y-10">
      <header className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-[0_20px_60px_rgba(9,9,11,0.35)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="blog-list-heading" className="text-2xl font-semibold sm:text-3xl">
                Últimos artigos
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">{categoryLabel}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-1.5 font-medium text-foreground/80">
                {total > 0 ? `${total} conteúdo${total === 1 ? "" : "s"}` : "Sem resultados"}
              </span>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-medium text-primary transition hover:text-primary/80"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
            {categories?.length > 0 ? (
              <nav className="flex flex-wrap gap-3 lg:flex-nowrap lg:overflow-x-auto lg:pb-1 lg:[scrollbar-width:none]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? "border-primary/60 bg-primary text-primary-foreground shadow"
                      : "border-border/70 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                  aria-pressed={selectedCategory === null}
                >
                  Todos
                </button>
                {categories.map((cat) => {
                  const active = selectedCategory === cat.category;
                  return (
                    <button
                      type="button"
                      key={cat.category || "__empty"}
                      onClick={() =>
                        setSelectedCategory((prev) =>
                          prev === cat.category ? null : cat.category
                        )
                      }
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-primary/60 bg-primary text-primary-foreground shadow"
                          : "border-border/70 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                      aria-pressed={active}
                    >
                      {cat.category} <span className="opacity-70">({cat.count})</span>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada.</p>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-8">
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {loadingInitial
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/50"
                >
                  <div className="aspect-[16/10] w-full bg-muted/30" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-3/4 rounded bg-muted/30" />
                    <div className="h-4 w-full rounded bg-muted/20" />
                    <div className="h-4 w-2/3 rounded bg-muted/20" />
                    <div className="h-10 w-32 rounded-full bg-muted/30" />
                  </div>
                </div>
              ))
            : safeItems.map((post) => (
                <article
                  key={post.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_25px_70px_rgba(15,23,42,0.45)]"
                >
                  <a href={`/blog/${post.slug}/`} className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                    {post.coverUrl ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={post.coverUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/30 to-transparent" />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-muted/10 text-sm text-muted-foreground">
                        Imagem indisponível
                      </div>
                    )}

                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="line-clamp-3 text-sm text-muted-foreground/90">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground/80">
                        <span>{post.author || "Winove"}</span>
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                          </time>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                        Ler artigo
                        <svg
                          aria-hidden="true"
                          className="h-4 w-4 translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </article>
              ))}
        </div>

        {error && (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && safeItems.length === 0 && !error && (
          <p className="rounded-2xl border border-border/60 bg-card/60 px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhum post disponível.
          </p>
        )}

        <div className="flex flex-col items-center gap-3 text-center">
          {hasMore ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => loadMore(offset)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">
              {safeItems.length === 0 ? "Nenhum post encontrado." : "Você já viu todos os conteúdos."}
            </p>
          )}
          <p className="text-xs text-muted-foreground/70">
            Exibindo {safeItems.length} de {total}
          </p>
        </div>
      </div>
    </section>
  );
}
