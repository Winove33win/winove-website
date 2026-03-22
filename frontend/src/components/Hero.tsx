import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const ROTATING_WORDS = [
  "Sites de Alta Conversão",
  "Automações Inteligentes",
  "IA Aplicada ao Negócio",
  "Integrações e CRMs",
];

const STATS = [
  { label: "Leads orgânicos", value: "+180%", bar: 78 },
  { label: "Redução de tarefas via automação", value: "−65%", bar: 65 },
  { label: "Projetos entregues com sucesso", value: "100+", bar: 90 },
];

const TRUST = [
  { label: "Parceiro Wix oficial" },
  { label: "Projetos sob medida" },
  { label: "Suporte contínuo" },
];

export const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="section--first relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/97 via-background/85 to-background/60" />

      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-float" />
        <div
          className="absolute -bottom-20 right-0 w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "3s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(210 40% 98%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-7 animate-fade-in-up">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm text-primary font-semibold">
                Estrutura digital que gera resultado
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.07] mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-foreground">Construímos</span>
              <br />
              <span
                className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
              <br />
              <span className="text-foreground">que vendem.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Da presença digital à operação com IA — a Winove entrega soluções
              sob medida para empresas que querem crescer com tecnologia.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href="https://api.whatsapp.com/send?phone=5519982403845"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="btn-primary text-base px-8 py-5 w-full sm:w-auto gap-2"
                >
                  Falar com especialista
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-5 border-white/15 text-foreground hover:bg-white/5 hover:border-primary/40 w-full sm:w-auto transition-all duration-300"
                >
                  Ver soluções
                </Button>
              </a>
            </div>

            {/* Trust badges */}
            <div
              className="flex flex-wrap gap-5 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {TRUST.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — Results card ── */}
          <div
            className="hidden lg:block animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative">
              {/* Card */}
              <div className="glass rounded-3xl p-8 border border-primary/10 shadow-[0_0_60px_hsl(25_95%_53%/0.08)]">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                  Resultados reais de clientes
                </p>

                <div className="space-y-5 mb-8">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-muted-foreground">
                          {stat.label}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {stat.value}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full"
                          style={{ width: `${stat.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                  {[
                    { n: "100+", label: "Projetos" },
                    { n: "5+", label: "Anos" },
                    { n: "98%", label: "Satisfação" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl font-extrabold text-primary">
                        {s.n}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-primary rounded-2xl px-4 py-2.5 shadow-lg shadow-primary/30">
                <p className="text-xs font-bold text-primary-foreground leading-tight">
                  Parceiro Oficial
                </p>
                <p className="text-[10px] text-primary-foreground/80">
                  Wix Studio
                </p>
              </div>

              {/* Floating notification */}
              <div className="absolute -bottom-5 -left-5 glass rounded-2xl px-4 py-3 border border-primary/15 flex items-center gap-3 shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    Novo projeto iniciado
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    há 2 minutos
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
