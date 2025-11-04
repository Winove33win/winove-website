import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { BlogItem } from "@/lib/api";
import { fetchBlogPosts } from "@/lib/api";

export const Blog = () => {
  const [articles, setArticles] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogPosts({ limit: 6, offset: 0 });

        if (!data.success) {
          setArticles([]);
          setError(data.message || "Erro ao carregar posts");
          return;
        }

        const incoming = Array.isArray(data.items) ? data.items : [];
        setArticles(incoming);
      } catch (err) {
        console.error("fetch blog-posts", err);
        setArticles([]);
        setError(err instanceof Error ? err.message : "Erro ao carregar posts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const safeArticles = Array.isArray(articles) ? articles : [];

  return (
    <section id="blog" className="py-24 bg-gradient-navy relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Blog & Insights
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Conteúdos exclusivos, tendências e estratégias para manter seu negócio sempre à frente
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p>Carregando...</p>
            ) : safeArticles.length === 0 ? (
              <p>{error || "Nenhum post disponível no momento"}</p>
            ) : (
              safeArticles.map((article, index) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="block"
                >
                  <article
                    className="glass rounded-2xl overflow-hidden hover-lift group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                      {article.coverUrl ? (
                        <img
                          src={article.coverUrl}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/10 text-sm text-muted-foreground">
                          Sem imagem
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>

                    {/* Article Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {article.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{article.author || "Winove"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium group/btn">
                        Ler artigo
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>

          {error && safeArticles.length > 0 && (
            <p className="mt-4 text-center text-sm text-red-400">{error}</p>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/blog" className="btn-secondary px-8 py-4 text-lg">
              Ver Todos os Artigos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
