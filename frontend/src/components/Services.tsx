import { Button } from "@/components/ui/button";
import { Check, Layers, LineChart, Rocket } from "lucide-react";

const plans = [
  {
    icon: Layers,
    title: "Iniciante",
    tag: null,
    audience:
      "Para empresas que precisam entrar no digital com estrutura profissional.",
    includes: [
      "Site profissional em Wix",
      "Páginas institucionais",
      "Integração com WhatsApp",
      "Formulário de contato",
      "SEO básico",
      "Publicação e configuração inicial",
    ],
    outcome: "Presença digital profissional, clara e pronta para atender clientes.",
    cta: "Quero começar",
    highlight: false,
  },
  {
    icon: LineChart,
    title: "Crescimento",
    tag: "Mais procurado",
    audience:
      "Para empresas que querem transformar o site em canal de geração de leads.",
    includes: [
      "Tudo do Iniciante",
      "Páginas estratégicas de conversão",
      "Integração com CRM",
      "Automação básica",
      "Captação e organização de leads",
      "Estrutura orientada para vendas",
    ],
    outcome:
      "Mais organização comercial e mais oportunidades chegando pelo digital.",
    cta: "Quero crescer",
    highlight: true,
  },
  {
    icon: Rocket,
    title: "Escala",
    tag: null,
    audience:
      "Para empresas que precisam de sistemas, lógica personalizada e IA.",
    includes: [
      "Tudo do Crescimento",
      "Desenvolvimento com lógica personalizada",
      "Integrações e APIs",
      "Dashboards",
      "Automações avançadas",
      "IA aplicada ao atendimento e operação",
      "Treinamento e suporte",
    ],
    outcome:
      "Estrutura digital que sustenta crescimento com menos dependência operacional.",
    cta: "Quero escalar",
    highlight: false,
  },
];

export const Services = () => (
  <section id="services" className="py-24 bg-background relative overflow-hidden">
    {/* Top divider */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

    <div className="container mx-auto px-4 relative z-10">
      {/* Section header */}
      <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
        <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
          Soluções
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Para cada estágio do{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            seu negócio
          </span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Desde a presença digital até operações com IA — construímos com você.
        </p>
      </div>

      {/* Cards */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <article
              key={plan.title}
              className={`relative rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-2 ${
                plan.highlight
                  ? "bg-primary/5 border-2 border-primary/40 shadow-[0_0_50px_hsl(25_95%_53%/0.12)]"
                  : "glass border border-white/5 hover:border-primary/25 hover:shadow-[0_0_30px_hsl(25_95%_53%/0.06)]"
              }`}
            >
              {/* Badge */}
              {plan.tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-primary/30">
                    {plan.tag}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  plan.highlight ? "bg-primary/25" : "bg-primary/15"
                }`}
              >
                <Icon className="w-7 h-7 text-primary" />
              </div>

              {/* Title + audience */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {plan.title}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.audience}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="pt-5 border-t border-white/5">
                <p className="text-xs text-muted-foreground italic mb-4 leading-relaxed">
                  {plan.outcome}
                </p>
                <a
                  href="https://api.whatsapp.com/send?phone=5519982403845"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className={`w-full transition-all duration-300 ${
                      plan.highlight
                        ? "btn-primary"
                        : "border border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/60"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
