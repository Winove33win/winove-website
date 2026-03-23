import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchBlogPosts,
  type BlogItem,
  fetchBlogCategories,
  type BlogCategory,
} from "@/lib/api";
import { ArrowRight, Calendar, Clock, Tag, User, ChevronRight, Layers } from "lucide-react";

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const PAGE_SIZE = 9;

function readingTime(text = ""): string {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min de leitura`;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Skeletons ─────────────────────────────────────────────────────────── */

function SkeletonFeatured() {
  return (
    <div className="animate-pulse rounded-3xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="aspect-[16/10] lg:aspect-auto bg-muted/30 min-h-64" />
        <div className="p-8 space-y-4">
          <div className="h-4 w-24 rounded-full bg-muted/30" />
          <div className="h-8 w-3/4 rounded-lg bg-muted/30" />
          <div className="h-4 w-full rounded bg-muted/20" />
          <div className="h-4 w-5/6 rounded bg-muted/20" />
          <div className="h-4 w-2/3 rounded bg-muted/20" />
          <div className="h-10 w-36 rounded-full bg-muted/30 mt-4" />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="aspect-[16/10] bg-muted/30" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 rounded-full bg-muted/30" />
        <div className="h-5 w-4/5 rounded bg-muted/30" />
        <div className="h-4 w-full rounded bg-muted/20" />
        <div className="h-4 w-3/4 rounded bg-muted/20" />
        <div className="flex gap-2 pt-2">
          <div className="h-3 w-16 rounded bg-muted/20" />
          <div className="h-3 w-12 rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
}

/* ─── Featured post ─────────────────────────────────────────────────────── */

function FeaturedPost({ post }: { post: BlogItem }) {
  return (
    <Link
      to={`/blog/${post.slug}/`}
      className="group block rounded-3xl border border-white/8 bg-card/60 backdrop-blur overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
    >
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        {/* Image */}
        <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden min-h-52">
          {post.coverUrl ? (
            <img
              src={post.coverUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-primary/5 flex items-center justify-center">
              <Layers className="w-12 h-12 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent lg:hidden" />

          {/* Latest badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
            Mais recente
          </div>
        </div>

        {/* Info */}
        <div className="p-7 md:p-10 flex flex-col justify-center gap-5">
          {/* Meta top */}
          <div className="flex flex-wrap gap-2">
            {post.category && (
              <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full px-3 py-1">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-muted-foreground text-xs rounded-full px-3 py-1">
              <Clock className="w-3 h-3" />
              {readingTime(post.excerpt)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm md:text-base">
            {post.excerpt}
          </p>

          {/* Meta bottom */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-primary font-semibold text-sm mt-auto">
            Ler artigo completo
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Post card ─────────────────────────────────────────────────────────── */

function PostCard({ post }: { post: BlogItem }) {
  return (
    <Link
      to={`/blog/${post.slug}/`}
      className="group flex flex-col rounded-2xl border border-white/8 bg-card/60 backdrop-blur overflow-hidden hover:border-primary/35 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <Layers className="w-8 h-8 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {post.category && (
          <div className="absolute top-3 left-3 bg-primary/85 backdrop-blur-sm text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">
            {post.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 text-base">
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/6 mt-auto">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {readingTime(post.excerpt)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-primary text-xs font-semibold">
          Ler artigo
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 duration-200" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */

interface BlogListProps {
  NewsletterSlot?: React.ReactNode;
}

export default function BlogList({ NewsletterSlot }: BlogListProps) {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const safeItems = Array.isArray(items) ? items : [];

  const loadMore = useCallback(
    async (nextOffset = 0) => {
      try {
        setLoading(true);
        setError(null);
        if (nextOffset === 0) setOffset(0);

        const data = await fetchBlogPosts({
          limit: PAGE_SIZE,
          offset: nextOffset,
          category: selectedCategory ?? undefined,
        });

        if (!data.success) {
          if (nextOffset === 0) { setItems([]); setTotal(0); }
          setHasMore(false);
          setError(data.message || "Erro ao carregar posts");
          return;
        }

        const incoming = Array.isArray(data.items) ? data.items : [];
        setItems((prev) => nextOffset === 0 ? incoming : [...prev, ...incoming]);
        setTotal(typeof data.total === "number" ? data.total : incoming.length + nextOffset);
        setOffset(nextOffset + incoming.length);
        setHasMore(Boolean(data.hasMore) && incoming.length > 0);
      } catch (err) {
        if (nextOffset === 0) { setItems([]); setTotal(0); }
        setHasMore(false);
        setError(err instanceof Error ? err.message : "Erro ao carregar posts");
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBlogCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch { /* silent */ }
    })();
  }, []);

  useEffect(() => { loadMore(0); }, [loadMore]);

  const loadingInitial = loading && safeItems.length === 0;
  const [featured, ...rest] = safeItems;

  return (
    <div className="space-y-10">

      {/* ── Category filter ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_hsl(var(--primary)/0.3)]"
                : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory((p) => p === cat.category ? null : cat.category)}
              className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedCategory === cat.category
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_hsl(var(--primary)/0.3)]"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat.category}
              <span className="ml-1.5 opacity-60 text-xs">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
          <span className="glass border border-white/10 rounded-full px-3 py-1">
            {total > 0 ? `${total} artigo${total === 1 ? "" : "s"}` : "Carregando…"}
          </span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Limpar filtro ×
            </button>
          )}
        </div>
      </div>

      {/* ── Featured post ─────────────────────────────────────────── */}
      {loadingInitial ? (
        <SkeletonFeatured />
      ) : featured ? (
        <FeaturedPost post={featured} />
      ) : null}

      {/* ── Grid ──────────────────────────────────────────────────── */}
      {(loadingInitial || rest.length > 0) && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {selectedCategory ? `Artigos em "${selectedCategory}"` : "Todos os artigos"}
            </h2>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {loadingInitial
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : rest.map((post) => <PostCard key={post.id} post={post} />)
            }
          </div>
        </div>
      )}

      {/* ── Newsletter slot (after first batch) ───────────────────── */}
      {!loadingInitial && safeItems.length > 0 && NewsletterSlot && (
        <div className="py-2">{NewsletterSlot}</div>
      )}

      {/* ── Error ─────────────────────────────────────────────────── */}
      {error && (
        <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {!loading && safeItems.length === 0 && !error && (
        <div className="glass rounded-2xl border border-white/8 px-6 py-12 text-center">
          <Layers className="w-10 h-10 text-primary/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum post disponível no momento.</p>
        </div>
      )}

      {/* ── Load more ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-2 pt-2">
        {hasMore ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => loadMore(offset)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-8 py-3 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_24px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_32px_hsl(var(--primary)/0.4)]"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Carregando…
              </>
            ) : (
              <>
                Carregar mais artigos
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          !loadingInitial && safeItems.length > 0 && (
            <p className="text-sm text-muted-foreground">Você viu todos os {total} artigos.</p>
          )
        )}
        {safeItems.length > 0 && (
          <p className="text-xs text-muted-foreground/50">
            Exibindo {safeItems.length} de {total}
          </p>
        )}
      </div>
    </div>
  );
}
