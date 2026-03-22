import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTemplates, type Template } from "@/lib/api";

export const TemplatesCarousel = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const total = templates.length;

  const resetTimer = (fn: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(fn, 4500);
  };

  useEffect(() => {
    if (!total) return;
    const advance = () => setIndex((i) => (i + 1) % total);
    resetTimer(advance);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (loading) return null;
  if (!total) return null;

  const prev = () => {
    setIndex((i) => (i - 1 + total) % total);
    const advance = () => setIndex((i) => (i + 1) % total);
    resetTimer(advance);
  };

  const next = () => {
    setIndex((i) => (i + 1) % total);
    const advance = () => setIndex((i) => (i + 1) % total);
    resetTimer(advance);
  };

  const tpl = templates[index];
  const cover = tpl?.images?.cover || tpl?.coverUrl || "";

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal-on-scroll">
          <div>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
              Templates
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Sites prontos para{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                decolar
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Templates profissionais em Wix Studio, com design moderno e estrutura otimizada para conversão.
            </p>
          </div>
          <a href="/templates" className="flex-shrink-0">
            <Button variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/60 gap-2 transition-all duration-300">
              Ver todos os templates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Main carousel */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Image panel */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
            {cover ? (
              <img
                key={tpl.slug}
                src={cover}
                alt={tpl.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Sem imagem</span>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

            {/* Nav arrows over image */}
            <button
              onClick={prev}
              aria-label="Template anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:border-primary/50 hover:bg-background/90 transition-all duration-300 group/btn"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo template"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:border-primary/50 hover:bg-background/90 transition-all duration-300 group/btn"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
            </button>

            {/* Counter badge */}
            <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-muted-foreground border border-white/10">
              {index + 1} / {total}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-5">
            {/* Category + difficulty */}
            <div className="flex gap-2 flex-wrap">
              {tpl.category && (
                <span className="text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                  {tpl.category}
                </span>
              )}
              {tpl.difficulty && (
                <span className="text-xs font-semibold bg-white/5 text-muted-foreground border border-white/10 rounded-full px-3 py-1">
                  {tpl.difficulty}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-foreground leading-tight">
              {tpl.heading || tpl.title}
            </h3>

            {/* Description */}
            {(tpl.subheading || tpl.description) && (
              <p className="text-muted-foreground leading-relaxed">
                {tpl.subheading || tpl.description}
              </p>
            )}

            {/* Features */}
            {tpl.features && tpl.features.length > 0 && (
              <ul className="grid grid-cols-1 gap-1.5">
                {tpl.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Price + CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              {tpl.price > 0 && (
                <div>
                  {tpl.originalPrice && tpl.originalPrice > tpl.price && (
                    <p className="text-xs text-muted-foreground line-through">
                      R$ {tpl.originalPrice.toLocaleString("pt-BR")}
                    </p>
                  )}
                  <p className="text-2xl font-extrabold text-primary">
                    R$ {tpl.price.toLocaleString("pt-BR")}
                  </p>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                {tpl.demoUrl && (
                  <a href={tpl.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-1.5 transition-all duration-300">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver demo
                    </Button>
                  </a>
                )}
                <a href={`/templates/${tpl.slug}`}>
                  <Button size="sm" className="btn-primary gap-1.5">
                    Ver detalhes
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-2">
              {templates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Template ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
