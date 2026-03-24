"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Bot,
  CalendarClock,
  Check,
  ChevronDown,
  Cpu,
  MessagesSquare,
  ShieldCheck,
  Users,
  X,
  Zap,
  BarChart3,
  Send,
  Headphones,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const stats = [
  { value: "500+", label: "Empresas atendidas" },
  { value: "10×", label: "Mais produtividade" },
  { value: "98%", label: "Satisfação dos clientes" },
  { value: "24/7", label: "Automações ativas" },
];

const features = [
  {
    icon: Users,
    title: "Atendimento multiusuário",
    description:
      "Vários atendentes no mesmo número. Filas inteligentes, distribuição automática e auditoria completa por operador.",
  },
  {
    icon: Bot,
    title: "Chatbot & Automações",
    description:
      "Fluxos automáticos por palavra-chave, horário e perfil do lead. Triagem, roteamento e scripts de vendas no piloto automático.",
  },
  {
    icon: Cpu,
    title: "IA integrada",
    description:
      "ChatGPT, Claude e Gemini para respostas inteligentes, sugestões de resposta e automações avançadas.",
  },
  {
    icon: MessagesSquare,
    title: "Histórico completo",
    description:
      "Todas as conversas organizadas por contato, atendente e etapa. Nunca perca o contexto de um lead.",
  },
  {
    icon: BarChart3,
    title: "CRM com funil e métricas",
    description:
      "Pipeline Kanban, tarefas, conversão por etapa e produtividade do time — tudo dentro do WhatsApp.",
  },
  {
    icon: Send,
    title: "Campanhas e disparos",
    description:
      "Envios segmentados, reativação de clientes e campanhas automatizadas com relatórios de entrega.",
  },
  {
    icon: Headphones,
    title: "Central de suporte",
    description:
      "Abertura de chamados, SLA, escalada automática e satisfação do cliente medida em tempo real.",
  },
  {
    icon: Layers,
    title: "Integrações e API",
    description:
      "API oficial do WhatsApp, webhooks, n8n, Zapier e conexão com seu ERP, CRM ou e-commerce.",
  },
];

const comparisonRows = [
  {
    normal: "1 atendente por número",
    profissional: "Atendimento multiusuário ilimitado",
  },
  {
    normal: "Conversas perdidas e sem histórico",
    profissional: "Histórico completo por contato e equipe",
  },
  {
    normal: "Sem automação",
    profissional: "Chatbot, automações e IA integrada",
  },
  {
    normal: "Sem funil comercial",
    profissional: "CRM WhatsApp com pipeline e métricas",
  },
  {
    normal: "Sem relatórios",
    profissional: "Dashboard de produtividade e conversão",
  },
];

const segments = [
  { label: "Clínicas & Saúde", icon: "🏥" },
  { label: "Varejo & E-commerce", icon: "🛍️" },
  { label: "Imobiliárias", icon: "🏠" },
  { label: "Escritórios & Advocacia", icon: "⚖️" },
  { label: "Indústria & Distribuidoras", icon: "🏭" },
  { label: "Educação & Cursos", icon: "🎓" },
  { label: "Serviços em geral", icon: "🔧" },
  { label: "Startups & Agências", icon: "🚀" },
];

const faqs = [
  {
    question: "O que é CRM para WhatsApp?",
    answer:
      "É uma plataforma que organiza contatos, histórico, tarefas e funil comercial para transformar o WhatsApp em canal profissional de atendimento e vendas. Em vez de um app pessoal, você passa a ter uma operação estruturada com dashboards e relatórios.",
  },
  {
    question: "Como funciona a automação no WhatsApp?",
    answer:
      "Você cria fluxos com regras de horário, palavras-chave, qualificação de leads e distribuição automática para a equipe. O chatbot responde fora do horário comercial, qualifica o lead e encaminha para o atendente certo — sem intervenção manual.",
  },
  {
    question: "Posso usar com vários atendentes?",
    answer:
      "Sim. A solução permite múltiplos atendentes no mesmo número, com permissões individuais, filas de espera, auditoria de atividades e indicadores de desempenho por operador.",
  },
  {
    question: "A integração com API do WhatsApp é oficial?",
    answer:
      "A Winove trabalha com integração via API oficial do WhatsApp para garantir estabilidade, escalabilidade e conformidade com os termos de uso. Isso evita bloqueios de conta e garante operação profissional.",
  },
  {
    question: "Posso integrar com ChatGPT e outros modelos de IA?",
    answer:
      "Sim. É possível integrar com ChatGPT, Claude, Gemini e outros modelos via conectores nativos. A IA pode sugerir respostas, automatizar atendimentos de nível 1 e gerar relatórios a partir das conversas.",
  },
  {
    question: "Quanto tempo leva para implantar?",
    answer:
      "A implantação básica leva de 3 a 7 dias úteis. Fluxos de automação mais complexos e integrações com sistemas externos podem levar de 2 a 4 semanas dependendo da complexidade.",
  },
];

const WA_LINK = "https://api.whatsapp.com/send?phone=5519982403845";

/* ─── Sub-components ────────────────────────────────────────────────────── */

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground text-sm md:text-base">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* Floating mock WhatsApp chat */
function MockChat() {
  const [step, setStep] = useState(0);
  const messages = [
    { from: "user", text: "Oi, quero saber sobre planos!" },
    { from: "bot", text: "Olá! 👋 Sou o assistente da empresa. Pode escolher uma opção:" },
    { from: "bot", text: "1️⃣ Planos   2️⃣ Suporte   3️⃣ Falar com vendas" },
    { from: "user", text: "3" },
    { from: "bot", text: "Perfeito! Conectando com um especialista... ⚡" },
  ];

  useEffect(() => {
    if (step >= messages.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 800 : 1200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="relative w-full max-w-[320px] mx-auto animate-float">
      {/* Phone frame */}
      <div className="rounded-[2.5rem] border-4 border-white/10 bg-[#0a0f1a] shadow-2xl overflow-hidden">
        {/* Status bar */}
        <div className="bg-[#111827] px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-green-400 text-sm">W</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Suporte Winove</p>
            <p className="text-[10px] text-green-400">● online</p>
          </div>
        </div>
        {/* Chat area */}
        <div className="bg-[#070d18] px-3 py-4 h-64 flex flex-col gap-2 overflow-hidden">
          {messages.slice(0, step).map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              style={{ animation: "fadeInUp 0.35s ease-out both" }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-snug ${
                  msg.from === "user"
                    ? "bg-primary/80 text-white rounded-br-sm"
                    : "bg-white/8 text-muted-foreground rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {step < messages.length && (
            <div className="flex justify-start">
              <div className="bg-white/8 rounded-2xl rounded-bl-sm px-3 py-2">
                <span className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
                      style={{ animation: `float 1s ease-in-out ${d * 0.2}s infinite` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Input bar */}
        <div className="bg-[#111827] px-3 py-2 flex items-center gap-2">
          <div className="flex-1 bg-white/5 rounded-full px-3 py-1.5 text-[10px] text-muted-foreground/40">
            Mensagem…
          </div>
          <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center">
            <Send className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
      {/* Glow behind phone */}
      <div className="absolute inset-0 -z-10 bg-primary/20 blur-[60px] rounded-full scale-75" />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function ChatWhatsapp() {
  useScrollReveal();

  return (
    <>
      <SEO
        title="CRM para WhatsApp com Automação e IA | Winove"
        description="Transforme seu WhatsApp em uma central profissional de atendimento, vendas e automação com CRM, chatbot e inteligência artificial."
        canonical="https://www.winove.com.br/chat-whatsapp"
        keywords={["crm whatsapp", "whatsapp para empresas", "chatbot whatsapp", "automação whatsapp", "atendimento whatsapp", "ia whatsapp", "whatsapp business api", "crm para pequenas empresas"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "CRM para WhatsApp com automação e IA",
            provider: { "@type": "Organization", name: "Winove" },
            serviceType: "Atendimento WhatsApp para empresas",
            url: "https://www.winove.com.br/chat-whatsapp",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]}
      />

      <div className="min-h-screen bg-background text-foreground font-inter overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="section--first pb-20 relative overflow-hidden">
          {/* Ambient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-primary/6 rounded-full blur-[160px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-green-500/4 rounded-full blur-[140px]" />
          </div>
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left: text */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                    CRM WhatsApp para empresas
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                  WhatsApp{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    profissional
                  </span>{" "}
                  com IA e automação
                </h1>

                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
                  Atendimento multiusuário, chatbot, CRM e inteligência artificial — tudo integrado ao
                  seu WhatsApp. Venda mais e atenda melhor sem mudar de canal.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="btn-primary gap-2 text-base">
                      <Zap className="w-4 h-4" />
                      Solicitar demonstração
                    </Button>
                  </a>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-2 transition-all duration-300"
                    >
                      <CalendarClock className="w-4 h-4" />
                      Agendar demo
                    </Button>
                  </a>
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {[
                    "API oficial do WhatsApp",
                    "Implantação em até 7 dias",
                    "Suporte especializado",
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: mock chat */}
              <div className="flex justify-center lg:justify-end">
                <MockChat />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────── */}
        <div className="border-y border-white/6 bg-white/[0.02]">
          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label} className="reveal-on-scroll">
                  <p className="text-3xl md:text-4xl font-extrabold text-primary mb-1">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PROBLEM SECTION ──────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Pain points */}
              <div className="reveal-on-scroll">
                <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                  O problema
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Seu WhatsApp está{" "}
                  <span className="bg-gradient-to-r from-destructive to-red-400 bg-clip-text text-transparent">
                    te custando clientes
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    "Mensagens se perdem e leads somem",
                    "Um único atendente para toda a demanda",
                    "Sem histórico — cliente precisa repetir tudo",
                    "Nenhuma automação fora do horário",
                    "Impossível medir produtividade da equipe",
                  ].map((pain) => (
                    <div key={pain} className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/5">
                      <X className="w-4 h-4 text-destructive flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{pain}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution */}
              <div className="reveal-on-scroll">
                <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                  A solução
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  WhatsApp como{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    central profissional
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    "Histórico completo por cliente e equipe",
                    "Múltiplos atendentes com filas e permissões",
                    "Chatbot ativo 24/7 para capturar leads",
                    "IA integrada para respostas inteligentes",
                    "Dashboard com métricas e produtividade",
                  ].map((sol) => (
                    <div
                      key={sol}
                      className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-primary/15 hover:border-primary/30 transition-colors duration-300"
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{sol}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ────────────────────────────────────────────── */}
        <section className="py-24 bg-gradient-navy relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-14 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Recursos</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Tudo que sua empresa{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  precisa
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Uma plataforma completa para atendimento, vendas e automação via WhatsApp.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feat, i) => (
                <div
                  key={feat.title}
                  className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/25 transition-all duration-300 hover:-translate-y-1 reveal-on-scroll"
                  style={{ transitionDelay: `${(i % 4) * 70}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <feat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ─────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Comparativo</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                WhatsApp comum{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  vs Profissional
                </span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto reveal-on-scroll">
              {/* Header */}
              <div className="grid grid-cols-2 mb-2 px-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive/60" />
                  <span className="text-sm font-semibold text-muted-foreground">WhatsApp normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-foreground">Plataforma Profissional</span>
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/8 overflow-hidden">
                {comparisonRows.map((row, i) => (
                  <div
                    key={row.normal}
                    className={`grid grid-cols-2 ${i < comparisonRows.length - 1 ? "border-b border-white/6" : ""}`}
                  >
                    <div className="p-4 flex items-center gap-3 border-r border-white/6">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-destructive" />
                      </div>
                      <span className="text-sm text-muted-foreground">{row.normal}</span>
                    </div>
                    <div className="p-4 flex items-center gap-3 bg-primary/[0.03]">
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground font-medium">{row.profissional}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO USES IT ──────────────────────────────────────────────── */}
        <section className="py-20 bg-gradient-navy relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Segmentos</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Quem usa{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  CRM para WhatsApp
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {segments.map((seg, i) => (
                <div
                  key={seg.label}
                  className="glass border border-white/8 hover:border-primary/30 rounded-2xl px-5 py-3 flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 reveal-on-scroll"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <span className="text-xl">{seg.icon}</span>
                  <span className="text-sm font-medium text-foreground">{seg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">FAQ</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Perguntas{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  frequentes
                </span>
              </h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <div key={faq.question} className="reveal-on-scroll" style={{ transitionDelay: `${i * 60}ms` }}>
                  <FaqItem question={faq.question} answer={faq.answer} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="py-20 pb-28 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-primary/[0.04]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center reveal-on-scroll">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                Implantação em até 7 dias
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Transforme seu WhatsApp em{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                máquina de vendas
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Implante CRM, automação e atendimento profissional. Comece a vender mais pelo WhatsApp em
              poucos dias.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="btn-primary gap-2 text-base px-8">
                  <Zap className="w-4 h-4" />
                  Solicitar integração
                </Button>
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-2 transition-all duration-300"
                >
                  <CalendarClock className="w-4 h-4" />
                  Agendar demonstração
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm text-muted-foreground">
              {["Sem fidelidade obrigatória", "Suporte pós-implantação", "API oficial do WhatsApp"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-primary" />
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
