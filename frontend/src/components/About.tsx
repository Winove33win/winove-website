import { BrainCircuit, Handshake, Network, Workflow } from "lucide-react";

export const About = () => {
  const steps = [
    {
      title: "1. Diagnóstico",
      description: "Entendemos o momento do seu negócio e a necessidade real.",
    },
    {
      title: "2. Estruturação",
      description: "Definimos a melhor solução entre site, automação, CRM, IA e integrações.",
    },
    {
      title: "3. Implementação",
      description: "Desenvolvemos e colocamos tudo em operação com agilidade.",
    },
    {
      title: "4. Evolução",
      description: "Acompanhamos crescimento, melhorias e expansão da estrutura digital.",
    },
  ];

  const differentials = [
    { icon: Handshake, text: "Parceria oficial com ecossistemas líderes." },
    { icon: Network, text: "Experiência em Wix, automação, IA e infraestrutura." },
    { icon: Workflow, text: "Projetos pensados para negócio, não apenas para design." },
    { icon: BrainCircuit, text: "Foco em crescimento, eficiência e recorrência." },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-navy relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Como construímos sua solução
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => (
            <div key={step.title} className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold mb-2 text-foreground">Por que a Winove</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {differentials.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
