import { Button } from "@/components/ui/button";
import { Layers, LineChart, Rocket } from "lucide-react";

export const Services = () => {
  const plans = [
    {
      icon: Layers,
      title: "Iniciante",
      audience: "Para empresas que precisam entrar no digital com estrutura profissional.",
      idealFor: "Negócios que precisam de presença digital confiável e bem posicionada.",
      includes: [
        "Site profissional em Wix",
        "Páginas institucionais",
        "Integração com WhatsApp",
        "Formulário de contato",
        "SEO básico",
        "Publicação e configuração inicial",
      ],
      outcome: "Uma presença digital profissional, clara e pronta para atender clientes.",
      cta: "Quero começar",
    },
    {
      icon: LineChart,
      title: "Crescimento",
      audience: "Para empresas que querem transformar o site em canal de geração de leads.",
      idealFor: "Negócios que já validaram sua operação e querem captar mais oportunidades.",
      includes: [
        "Tudo do Iniciante",
        "Páginas estratégicas de conversão",
        "Integração com CRM",
        "Automação básica",
        "Captação e organização de leads",
        "Estrutura orientada para vendas",
      ],
      outcome: "Mais organização comercial e mais oportunidades chegando pelo digital.",
      cta: "Quero crescer",
    },
    {
      icon: Rocket,
      title: "Escala",
      audience: "Para empresas que precisam de sistemas, lógica personalizada e automação inteligente.",
      idealFor: "Negócios que querem operação digital mais robusta, com eficiência e inteligência.",
      includes: [
        "Tudo do Crescimento",
        "Desenvolvimento com lógica personalizada",
        "Integrações e APIs",
        "Dashboards",
        "Automações avançadas",
        "IA aplicada ao atendimento e operação",
        "Treinamento e suporte",
      ],
      outcome: "Uma estrutura digital que sustenta crescimento com menos dependência operacional.",
      cta: "Quero escalar",
    },
  ];

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Soluções Winove para cada estágio do seu negócio
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Projetos sob medida para cada estágio do negócio. Atendemos desde estruturas de entrada até projetos avançados com sistemas, automação e IA.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <article key={plan.title} className="glass rounded-2xl p-8 flex flex-col gap-5">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{plan.title}</h3>
                <p className="text-muted-foreground">{plan.audience}</p>

                <div>
                  <p className="font-semibold mb-1 text-foreground">Ideal para</p>
                  <p className="text-muted-foreground">{plan.idealFor}</p>
                </div>

                <div>
                  <p className="font-semibold mb-2 text-foreground">Inclui</p>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {plan.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <p className="font-semibold mb-1 text-foreground">Resultado esperado</p>
                  <p className="text-muted-foreground mb-5">{plan.outcome}</p>
                  <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full btn-primary">{plan.cta}</Button>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
