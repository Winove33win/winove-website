import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const VISIBLE = 3; // cards visible at once (desktop)

export const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;
  const maxIndex = total - VISIBLE;

  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };

  // Visible slice (wraps around)
  const visible = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (index + i) % total;
    return testimonials[idx];
  });

  return (
    <section className="py-24 bg-gradient-navy relative overflow-hidden">
      {/* Dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-14 reveal-on-scroll">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
            Depoimentos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            O que nossos{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              clientes dizem
            </span>
          </h2>
          {/* Star strip */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
            <span className="ml-2 text-muted-foreground text-sm font-medium">
              5,0 · 40 avaliações verificadas
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Cards — 3 columns on lg, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((t, i) => (
              <article
                key={`${t.id}-${i}`}
                className="glass rounded-2xl p-6 flex flex-col gap-4 border border-white/5 hover:border-primary/20 transition-all duration-300"
              >
                {/* Quote icon */}
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Quote className="w-4 h-4 text-primary" />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  "{t.content}"
                </p>

                {/* Author */}
                <div className="pt-3 border-t border-white/5">
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-primary/80 mt-0.5">{t.service}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.date}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:border-primary/40 transition-all duration-300 group"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => { setIndex(i); resetTimer(); }}
                  aria-label={`Ir para ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Próximo"
              className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:border-primary/40 transition-all duration-300 group"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
