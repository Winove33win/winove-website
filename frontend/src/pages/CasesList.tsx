import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, TrendingUp } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { CaseItem, Metric, safeArray } from "@/lib/caseUtils";
import { SEO } from "@/lib/seo";

export const CasesList = () => {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const API = import.meta.env.VITE_API_URL || "/api";
        const res = await fetch(`${API}/cases`);
        if (!res.ok) {
          throw new Error(`Erro ao carregar cases (${res.status})`);
        }
        const text = await res.text();
        if (!text) throw new Error("Resposta vazia do servidor");
        const data = JSON.parse(text) as Array<Record<string, unknown>>;
        const parsed: CaseItem[] = data.map((item) => ({
          ...(item as Omit<CaseItem, "tags" | "gallery" | "metrics">),
          tags: safeArray<string>(item.tags as string[] | string | null | undefined),
          gallery: safeArray<string>(item.gallery as string[] | string | null | undefined),
          metrics: safeArray<Metric>(item.metrics as Metric[] | string | null | undefined),
        }));
        setItems(parsed);
      } catch (err) {
        console.error('fetch cases', err);
        setItems([]);
        setError(err instanceof Error ? err.message : 'Erro ao carregar cases');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const safeItems = Array.isArray(items) ? items : [];

  const casesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cases de Sucesso",
    url: "https://www.winove.com.br/cases",
    hasPart: safeItems.map((c) => ({
      "@type": "CaseStudy",
      name: c.title,
      url: `https://www.winove.com.br/cases/${c.slug}`,
    })),
  };

  return (
    <>
      <SEO
        title="Cases de Sucesso | Winove"
        description="Projetos que transformaram negócios e geraram resultados excepcionais para nossos clientes"
        canonical="https://www.winove.com.br/cases"
        jsonLd={casesJsonLd}
      />
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="section--first pb-16 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Cases de Sucesso
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Projetos que transformaram negócios e geraram resultados excepcionais para nossos clientes
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              {[
                { number: "150+", label: "Projetos Concluídos" },
                { number: "98%", label: "Taxa de Satisfação" },
                { number: "300%", label: "ROI Médio" },
                { number: "50+", label: "Clientes Ativos" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center glass rounded-2xl p-6 hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-16 bg-gradient-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {loading && (
                <p className="md:col-span-2 text-center text-sm opacity-70">Carregando cases...</p>
              )}

              {!loading && safeItems.length === 0 && (
                <p className="md:col-span-2 text-center text-sm opacity-70">
                  {error || 'Nenhum case disponível no momento.'}
                </p>
              )}

              {!loading && safeItems.length > 0 && (
                safeItems.map((caseItem, index) => (
                  <article
                    key={caseItem.slug}
                    className="glass rounded-2xl overflow-hidden hover-lift group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Case Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={caseItem.coverImage}
                        alt={caseItem.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-primary/20 glass flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Case Content */}
                    <div className="p-8">
                      {/* Client */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {caseItem.client}
                      </div>

                      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                        {caseItem.title}
                      </h3>

                      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                        {caseItem.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {caseItem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Key Metric */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span className="text-primary font-semibold">
                            {caseItem.metrics[0]?.value} {caseItem.metrics[0]?.label}
                          </span>
                        </div>
                        <Link
                          to={`/cases/${caseItem.slug}`}
                          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium group/btn"
                        >
                          Ver Case Completo
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Pronto para ser o próximo case de sucesso?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Vamos conversar sobre como podemos transformar seus desafios em resultados extraordinários
            </p>
            <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer" className="btn-primary text-lg px-8 py-4">
              Iniciar Projeto
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};