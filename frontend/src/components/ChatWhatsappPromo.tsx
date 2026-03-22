import { ArrowRight, Bot, Users, Zap, MessagesSquare, Cpu, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Multiusuário no mesmo número",
    description: "Vários atendentes operando simultâneamente, com filas, permissões e auditoria.",
  },
  {
    icon: Bot,
    title: "Chatbot & Automações",
    description: "Fluxos automáticos por palavra-chave, horário e qualificação de leads.",
  },
  {
    icon: Cpu,
    title: "Inteligência Artificial",
    description: "Integração com ChatGPT, Claude e Gemini para respostas e atendimento inteligente.",
  },
  {
    icon: MessagesSquare,
    title: "Histórico Completo",
    description: "Todas as conversas organizadas por contato, atendente e etapa do funil.",
  },
  {
    icon: CalendarClock,
    title: "CRM com Funil e Métricas",
    description: "Gerencie leads, tarefas e oportunidades diretamente no WhatsApp.",
  },
  {
    icon: Zap,
    title: "API Oficial do WhatsApp",
    description: "Operação estável, escalável e profissional para empresas de qualquer porte.",
  },
];

export const ChatWhatsappPromo = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[180px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-14 reveal-on-scroll">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
            Chat WhatsApp
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transforme seu WhatsApp em{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              central profissional
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Atendimento multiusuário, automações, chatbot com IA e CRM — tudo integrado ao seu WhatsApp.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/25 transition-all duration-300 hover:-translate-y-1 reveal-on-scroll"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal-on-scroll">
          <a href="/chat-whatsapp">
            <Button size="lg" className="btn-primary gap-2 text-base px-8">
              Conhecer a ferramenta
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=5519982403845"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/60 gap-2 text-base px-8 transition-all duration-300"
            >
              Falar com especialista
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
