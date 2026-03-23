import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, TrendingUp, Target, Lightbulb, Trophy, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CaseItem, Metric, safeArray } from "@/lib/caseUtils";
import { SEO } from "@/lib/seo";

export const CaseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseItem, setCaseItem] = useState<CaseItem | null>(null);
  const [relatedCases, setRelatedCases] = useState<CaseItem[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        const API = import.meta.env.VITE_API_URL || "/api";
        const res = await fetch(`${API}/cases/${slug}`);
        if (res.ok) {
          const text = await res.text();
          if (!text) throw new Error("Resposta vazia do servidor");
          const data = JSON.parse(text) as Record<string, unknown>;
          const parsed: CaseItem = {
            ...(data as Omit<CaseItem, "tags" | "gallery" | "metrics">),
            tags: safeArray<string>(data.tags as string[] | string | null | undefined),
            gallery: safeArray<string>(data.gallery as string[] | string | null | undefined),
            metrics: safeArray<Metric>(data.metrics as Metric[] | string | null | undefined),
          };
          setCaseItem(parsed);
          const relRes = await fetch(`${API}/cases`);
          if (relRes.ok) {
            const relText = await relRes.text();
            if (!relText) throw new Error("Resposta vazia do servidor");
            const rawCases = JSON.parse(relText) as Array<Record<string, unknown>>;
            const all: CaseItem[] = rawCases.map((c) => ({
              ...(c as Omit<CaseItem, "tags" | "gallery" | "metrics">),
              tags: safeArray<string>(c.tags as string[] | string | null | undefined),
              gallery: safeArray<string>(c.gallery as string[] | string | null | undefined),
              metrics: safeArray<Metric>(c.metrics as Metric[] | string | null | undefined),
            }));
            setRelatedCases(all.filter((c) => c.slug !== parsed.slug).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('fetch case', err);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  if (!caseItem) {
    return (
      <>
        <SEO
          title="Case | Winove"
          description="Conheça os projetos e resultados entregues pela Winove."
          canonical="https://www.winove.com.br/cases"
          noindex
        />
        <div className="min-h-screen bg-background">
          <div className="section--first pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">Case não encontrado</h1>
                <p className="text-muted-foreground mb-8">O case que você está procurando não existe.</p>
                <Link to="/cases" className="btn-primary">
                  Voltar aos Cases
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <SEO
        title={`${caseItem.title} | Case de Sucesso | Winove`}
        description={caseItem.excerpt || ""}
        canonical={`https://www.winove.com.br/cases/${caseItem.slug}`}
        image={caseItem.coverImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CaseStudy",
          name: caseItem.title,
          description: caseItem.excerpt,
          datePublished: caseItem.date,
          author: { "@type": "Organization", name: "Winove" },
          url: `https://www.winove.com.br/cases/${caseItem.slug}`,
          image: caseItem.coverImage,
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
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/cases"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Cases
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Client Badge */}
                <div className="mb-6">
                  <span className="px-4 py-2 rounded-full bg-primary/20 glass text-primary border border-primary/30 text-sm font-medium">
                    {caseItem.client}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                  {caseItem.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-muted-foreground mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(caseItem.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Tags */}
                {caseItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {caseItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Image */}
              <div className="relative h-64 md:h-96 overflow-hidden rounded-2xl">
                <img
                  src={caseItem.coverImage}
                  alt={caseItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      {caseItem.metrics.length > 0 && (
        <section className="py-16 bg-gradient-navy">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {caseItem.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="glass rounded-2xl p-6 text-center hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {typeof metric === 'string' ? (
                      <div className="text-foreground font-semibold">{metric}</div>
                    ) : (
                      <>
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                          {metric.value}
                        </div>
                        <div className="text-foreground font-semibold mb-1">
                          {metric.label}
                        </div>
                        {metric.description && (
                          <div className="text-xs text-muted-foreground">
                            {metric.description}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Case Details */}
      <section className="py-16 bg-gradient-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Challenge */}
              <div className="glass rounded-2xl p-8 hover-lift">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Desafio</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {caseItem.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="glass rounded-2xl p-8 hover-lift">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Solução</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {caseItem.solution}
                </p>
              </div>

              {/* Results */}
              <div className="glass rounded-2xl p-8 hover-lift">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Resultados</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {caseItem.results}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {caseItem.gallery.length > 0 && (
        <section className="py-16 bg-gradient-navy">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Galeria do Projeto
                </span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseItem.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-64 overflow-hidden rounded-2xl hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={image}
                      alt={`${caseItem.title} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Cases */}
      {relatedCases.length > 0 && (
        <section className="py-16 bg-gradient-navy">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Outros Cases de Sucesso
                </span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedCases.map((relatedCase) => (
                  <article key={relatedCase.slug} className="glass rounded-2xl overflow-hidden hover-lift group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedCase.coverImage}
                        alt={relatedCase.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {relatedCase.client}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {relatedCase.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {relatedCase.excerpt}
                      </p>
                      <Link 
                        to={`/cases/${relatedCase.slug}`}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium group/btn"
                      >
                        Ver Case
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Vamos criar o próximo case de sucesso juntos?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubra como podemos transformar seus desafios em resultados extraordinários
            </p>
            <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer" className="btn-primary text-lg px-8 py-4">
              Iniciar Conversa
            </a>
          </div>
        </div>
      </section>

    </div>
    </>
  );
};