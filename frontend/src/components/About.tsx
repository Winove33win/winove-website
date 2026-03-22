import { BrainCircuit, Handshake, Network, Workflow } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Diagnóstico",
    description:
      "Entendemos o momento do seu negócio e a necessidade real por trás do projeto.",
  },
  {
    n: "02",
    title: "Estruturação",
    description:
      "Definimos a melhor solução entre site, automação, CRM, IA e integrações.",
  },
  {
    n: "03",
    title: "Implementação",
    description:
      "Desenvolvemos e colocamos tudo em operação com agilidade e qualidade.",
  },
  {
    n: "04",
    title: "Evolução",
    description:
      "Acompanhamos crescimento, melhorias e expansão da sua estrutura digital.",
  },
];

const differentials = [
  {
    icon: Handshake,
    title: "Parceria oficial",
    text: "Parceiro oficial de ecossistemas líderes como o Wix Studio.",
  },
  {
    icon: Network,
    title: "Experiência full-stack",
    text: "Wix, automação, IA, APIs e infraestrutura sob o mesmo teto.",
  },
  {
    icon: Workflow,
    title: "Foco em negócio",
    text: "Projetos pensados para gerar resultado real, não apenas bom design.",
  },
  {
    icon: BrainCircuit,
    title: "Crescimento contínuo",
    text: "Acompanhamos e evoluímos a solução com você após a entrega.",
  },
];

export const About = () => (
  <section id="about" className="py-24 bg-gradient-navy relative overflow-hidden">
    {/* Dividers */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

    {/* Ambient glow */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
    </div>

    <div className="container mx-auto px-4 relative z-10 max-w-6xl">

      {/* ── Process section ── */}
      <div className="text-center mb-16 reveal-on-scroll">
        <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
          Processo
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Como construímos{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            sua solução
          </span>
        </h2>
      </div>

      {/* Steps */}
      <div className="relative mb-24">
        {/* Connecting line (desktop) */}
        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/0 via-primary/25 to-primary/0" />

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="flex flex-col items-center text-center gap-4 reveal-on-scroll"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Number badge */}
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 hover:scale-105">
                <span className="text-2xl font-extrabold text-primary">
                  {step.n}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Differentials section ── */}
      <div className="text-center mb-10 reveal-on-scroll">
        <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
          Diferenciais
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-foreground">
          Por que a{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Winove
          </span>
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {differentials.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="glass rounded-2xl p-6 flex items-start gap-4 border border-transparent hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 reveal-on-scroll"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-primary/25">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
