import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { SEO } from "@/lib/seo";
import { fetchBlogPosts, type BlogItem } from "@/lib/api";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  category: string;
}

type RelatedPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  date: string;
  author?: string | null;
};

const mapItemToRelated = (item: BlogItem): RelatedPost => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  excerpt: item.excerpt,
  coverImage: item.coverUrl ?? null,
  date: item.publishedAt,
  author: item.author ?? null,
});

const mapLegacyToRelated = (item: any): RelatedPost => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  excerpt: item.excerpt,
  coverImage: item.coverImage ?? item.coverUrl ?? null,
  date: item.date ?? item.publishedAt ?? "",
  author: item.author ?? null,
});

function calcReadingTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))}`;
}

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    const fetchJsonFallback = async <T,>(urls: string[]): Promise<T | null> => {
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) return (await res.json()) as T;
        } catch (_) {}
      }
      return null;
    };

    const loadRelatedFromApi = async (currentSlug: string): Promise<RelatedPost[]> => {
      try {
        let offset = 0;
        let hasMore = true;
        const collected: RelatedPost[] = [];
        while (hasMore && collected.length < 3) {
          const data = await fetchBlogPosts({ limit: 10, offset });
          const candidates = data.items
            .filter((item) => item.slug !== currentSlug)
            .map(mapItemToRelated);
          for (const candidate of candidates) {
            if (candidate.slug === currentSlug) continue;
            if (collected.some((existing) => existing.slug === candidate.slug)) continue;
            collected.push(candidate);
            if (collected.length >= 3) break;
          }
          hasMore = data.hasMore && collected.length < 3;
          offset = data.offset + data.items.length;
          if (!data.hasMore) break;
        }
        return collected.slice(0, 3);
      } catch (err) {
        console.error("fetch related posts", err);
        return [];
      }
    };

    const normalizeList = (input: any): any[] => {
      if (Array.isArray(input)) return input;
      if (input && Array.isArray(input.items)) return input.items;
      return [];
    };

    const load = async () => {
      if (!slug) return;
      const API = import.meta.env.VITE_API_URL || "/api";
      try {
        const data = await fetchJsonFallback<BlogPost>([
          `${API}/blog-posts/${slug}`,
          `/api/blog-posts-by-slug.php?slug=${encodeURIComponent(slug)}`,
        ]);
        let postData = data;
        if (!postData) {
          const all = normalizeList(
            await fetchJsonFallback<any>([
              `${API}/blog-posts`,
              `/api/blog-posts.php`,
              `/assets/blog-fallback.json`,
            ])
          );
          postData = all.find((p: any) => p.slug === slug) || null;
          if (!postData) return;
        }
        setPost(postData);

        let related = await loadRelatedFromApi(postData.slug);
        if (related.length === 0) {
          const fallbackList = normalizeList(
            await fetchJsonFallback<any>([
              `${API}/blog-posts`,
              `/api/blog-posts.php`,
              `/assets/blog-fallback.json`,
            ])
          );
          related = fallbackList
            .filter((p: any) => p.slug !== postData.slug)
            .slice(0, 3)
            .map(mapLegacyToRelated);
        }
        setRelatedPosts(related);
      } catch (err) {
        console.error('fetch blog-post', err);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <>
        <SEO
          title="Blog Winove"
          description="Conteúdos exclusivos sobre marketing, vendas e tecnologia para impulsionar seu negócio."
          canonical="https://www.winove.com.br/blog/"
          noindex
        />
        <div className="min-h-screen bg-background">
          <div className="section--first pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">Post não encontrado</h1>
                <p className="text-muted-foreground mb-8">O post que você está procurando não existe.</p>
                <Link to="/blog/" className="btn-primary">
                  Voltar ao Blog
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} | Blog Winove`}
        description={post.excerpt || ""}
        canonical={`https://www.winove.com.br/blog/${post.slug}/`}
        image={post.coverImage}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || "",
          image: post.coverImage,
          author: { "@type": "Person", name: post.author },
          publisher: {
            "@type": "Organization",
            name: "Winove",
            logo: {
              "@type": "ImageObject",
              url: "https://winove.com.br/logo.png",
            },
          },
          datePublished: post.date,
          dateModified: post.date,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.winove.com.br/blog/${post.slug}/`,
          },
          url: `https://www.winove.com.br/blog/${post.slug}/`,
        }}
      />
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="section--first pb-16 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to="/blog/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </Link>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <span className="px-3 py-1 text-xs font-medium rounded-full glass border border-border/20 text-muted-foreground">
                {post.category}
              </span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{`${calcReadingTime(post.content)} min`} de leitura</span>
              </div>
            </div>

            {/* Share Button */}
            <div className="mb-8">
              <button className="flex items-center gap-2 px-4 py-2 glass rounded-full text-muted-foreground hover:text-primary transition-colors duration-300">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-0 bg-gradient-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-64 md:h-96 overflow-hidden rounded-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gradient-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gradient-navy">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Posts Relacionados
                </span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.slug} className="glass rounded-2xl overflow-hidden hover-lift group">
                    <div className="relative h-48 overflow-hidden">
                      {relatedPost.coverImage ? (
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/10 text-sm text-muted-foreground">
                          Sem imagem
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {relatedPost.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <Link
                        to={`/blog/${relatedPost.slug}/`}
                        className="text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium"
                      >
                        Ler mais →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
    </>
  );
};
