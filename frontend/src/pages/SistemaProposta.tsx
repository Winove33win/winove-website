"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  Mail,
  MessageSquare,
  Package,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
  TrendingUp,
  Eye,
  CreditCard,
  Bell,
  Layers,
  CheckCircle2,
  X,
  Clock,
  Target,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const stats = [
  { value: "4×", label: "Mais propostas fechadas" },
  { value: "10min", label: "Para gerar uma proposta" },
  { value: "100%", label: "Online, sem papel" },
  { value: "24/7", label: "Acessível para seus clientes" },
];

const features = [
  {
    icon: FileText,
    title: "Propostas profissionais em minutos",
    description:
      "Crie propostas comerciais completas com escopo, cronograma, produtos, condições e valor final. Numeração automática, layout impecável, pronto para enviar.",
  },
  {
    icon: Users,
    title: "CRM de clientes e leads",
    description:
      "Cadastre clientes, organize por status (Lead, Ativo, VIP) e acompanhe o histórico de propostas, valor fechado e relacionamento em um único painel.",
  },
  {
    icon: ClipboardList,
    title: "Triagem automática de leads",
    description:
      "Envie um formulário inteligente ao cliente antes de montar a proposta. Ele responde online e você já parte com as informações certas — sem reunião inicial.",
  },
  {
    icon: Package,
    title: "Catálogo de produtos e serviços",
    description:
      "Monte seu catálogo com preços, descrições e features. Adicione itens às propostas com um clique e o valor é calculado automaticamente.",
  },
  {
    icon: Eye,
    title: "Proposta online para o cliente",
    description:
      "Cada proposta gera um link público exclusivo. O cliente visualiza tudo formatado, no celular ou desktop, sem precisar abrir PDF.",
  },
  {
    icon: CreditCard,
    title: "Link de pagamento integrado",
    description:
      "Gere links de pagamento InfinitePay direto na proposta. O cliente aprova e já paga — tudo no mesmo fluxo, sem sair do sistema.",
  },
  {
    icon: Mail,
    title: "Envio por e-mail automático",
    description:
      "Envie propostas e triagens por e-mail com template profissional da sua empresa. Notificações automáticas quando o cliente visualizar ou responder.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de performance",
    description:
      "Acompanhe em tempo real: total de propostas, taxa de aprovação, valor em negociação e receita fechada. Dados para tomar decisões comerciais.",
  },
  {
    icon: MessageSquare,
    title: "Integração WhatsApp",
    description:
      "Envie o link da proposta direto pelo WhatsApp. Acompanhe quando foi visualizado e siga com o fechamento sem sair do fluxo.",
  },
];

const comparisonRows = [
  {
    normal: "Propostas no Word ou PowerPoint",
    profissional: "Proposta profissional gerada em minutos",
  },
  {
    normal: "Envia PDF por e-mail e espera",
    profissional: "Link online rastreável com status em tempo real",
  },
  {
    normal: "Sem controle de leads e histórico",
    profissional: "CRM completo com pipeline e valor fechado",
  },
  {
    normal: "Reúne informações por telefone ou WhatsApp",
    profissional: "Triagem automática — cliente preenche antes da proposta",
  },
  {
    normal: "Pagamento por fora, separado",
    profissional: "Link de pagamento integrado na proposta",
  },
  {
    normal: "Sem visibilidade do funil comercial",
    profissional: "Dashboard com conversão, valor e performance",
  },
];

const workflow = [
  {
    step: "01",
    icon: Users,
    title: "Cadastre o cliente",
    desc: "Adicione o lead com nome, empresa, e-mail e origem. O sistema já cria o perfil e histórico.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Envie a triagem",
    desc: "Com um clique, o sistema envia um formulário ao cliente. Ele responde online e você recebe todas as informações.",
  },
  {
    step: "03",
    icon: FileText,
    title: "Monte a proposta",
    desc: "Selecione produtos do catálogo, defina escopo, prazo, valor e condições. A numeração e layout já estão prontos.",
  },
  {
    step: "04",
    icon: Send,
    title: "Envie e feche",
    desc: "Envie por e-mail ou WhatsApp. O cliente visualiza online, aprova e paga — tudo no mesmo sistema.",
  },
];

const segments = [
  { label: "Agências Digitais", icon: "🚀" },
  { label: "Consultores & Freelancers", icon: "💼" },
  { label: "Empresas de Software", icon: "💻" },
  { label: "Prestadores de Serviço", icon: "🔧" },
  { label: "Escritórios de Arquitetura", icon: "🏛️" },
  { label: "Gráficas & Produtoras", icon: "🎨" },
  { label: "Treinamentos & Educação", icon: "🎓" },
  { label: "Qualquer negócio B2B", icon: "🤝" },
];

const faqs = [
  {
    question: "O sistema substitui planilha e PDF de proposta?",
    answer:
      "Sim. O sistema gera propostas completas e formatadas com todos os campos que você precisa: escopo, cronograma, deliverables, condições de pagamento e produtos. O cliente recebe um link online, sem precisar abrir PDF.",
  },
  {
    question: "Como funciona a triagem automática?",
    answer:
      "Você cadastra o cliente e clica em 'Enviar Triagem'. O sistema dispara um e-mail com um formulário exclusivo. O cliente preenche nome, objetivo do projeto, prazo, referências e mais. Você já monta a proposta com as informações certas — sem reunião inicial.",
  },
  {
    question: "Posso adicionar meus próprios produtos e serviços?",
    answer:
      "Sim. Você cadastra seu catálogo com nome, categoria, descrição, preço e features. Na hora de criar a proposta, basta selecionar os itens e o valor total é calculado automaticamente.",
  },
  {
    question: "O cliente precisa criar conta para ver a proposta?",
    answer:
      "Não. Cada proposta gera um link único e público. O cliente clica no link, visualiza tudo no navegador com design profissional, e pode aprovar ou entrar em contato — sem nenhum cadastro.",
  },
  {
    question: "Posso receber pagamento direto pelo sistema?",
    answer:
      "Sim. O sistema integra com InfinitePay para geração de links de pagamento. Você inclui o link na proposta e o cliente paga na hora — por PIX, cartão de crédito ou boleto, sem sair do fluxo.",
  },
  {
    question: "Como é feita a implantação?",
    answer:
      "O sistema já vem configurado com sua marca, logo e dados da empresa. A implantação leva entre 1 e 3 dias úteis. Oferecemos treinamento e suporte via WhatsApp para você e sua equipe.",
  },
  {
    question: "Funciona para equipes?",
    answer:
      "Sim. O sistema suporta múltiplos usuários com acesso simultâneo. Cada membro da equipe pode criar e gerenciar suas próprias propostas, e o gestor acompanha tudo no dashboard centralizado.",
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
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* Animated proposal dashboard mockup */
function MockDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Dashboard", "Propostas", "Clientes"];

  const proposals = [
    { num: "PROP-2026-012", client: "TechStart Ltda", value: "R$ 8.500", status: "aprovada", color: "text-green-400", bg: "bg-green-400/10" },
    { num: "PROP-2026-011", client: "Digital Agency", value: "R$ 14.200", status: "enviada", color: "text-primary", bg: "bg-primary/10" },
    { num: "PROP-2026-010", client: "Grupo Alpha", value: "R$ 5.900", status: "aprovada", color: "text-green-400", bg: "bg-green-400/10" },
    { num: "PROP-2026-009", client: "MarketPro", value: "R$ 22.000", status: "enviada", color: "text-primary", bg: "bg-primary/10" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveTab((a) => (a + 1) % tabs.length), 3000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Browser chrome */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1a] shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="bg-[#111827] px-4 py-3 flex items-center gap-3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-[10px] text-muted-foreground/50 text-center">
            comercial.winove.com.br
          </div>
        </div>

        {/* Sidebar + content */}
        <div className="flex h-72">
          {/* Mini sidebar */}
          <div className="w-12 bg-[#070d18] border-r border-white/5 flex flex-col items-center py-3 gap-3">
            {[BarChart3, FileText, Users, Package, ClipboardList].map((Icon, i) => (
              <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${i === activeTab ? "bg-primary/20" : "hover:bg-white/5"}`}>
                <Icon className={`w-3.5 h-3.5 ${i === activeTab ? "text-primary" : "text-muted-foreground/50"}`} />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 bg-[#080e1b] p-3 overflow-hidden">
            {activeTab === 0 && (
              <div className="animate-in fade-in duration-300">
                <p className="text-[10px] text-muted-foreground/60 mb-2 font-medium uppercase tracking-wider">Dashboard</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: "Propostas", value: "34", sub: "este mês", color: "text-primary" },
                    { label: "Aprovadas", value: "18", sub: "53% taxa", color: "text-green-400" },
                    { label: "Em aberto", value: "R$ 87k", sub: "em negoc.", color: "text-yellow-400" },
                    { label: "Fechado", value: "R$ 142k", sub: "acumulado", color: "text-green-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/4 rounded-xl p-2.5">
                      <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] text-muted-foreground/60">{s.label}</p>
                      <p className="text-[8px] text-muted-foreground/40">{s.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Mini bar chart */}
                <div className="bg-white/3 rounded-xl p-2.5">
                  <p className="text-[9px] text-muted-foreground/50 mb-2">Propostas — últimas semanas</p>
                  <div className="flex items-end gap-1.5 h-10">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-primary/30 hover:bg-primary/50 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="animate-in fade-in duration-300">
                <p className="text-[10px] text-muted-foreground/60 mb-2 font-medium uppercase tracking-wider">Propostas Recentes</p>
                <div className="space-y-1.5">
                  {proposals.map((p) => (
                    <div key={p.num} className="flex items-center justify-between bg-white/4 rounded-xl px-2.5 py-2">
                      <div>
                        <p className="text-[10px] font-mono text-primary/80">{p.num}</p>
                        <p className="text-[9px] text-muted-foreground/60">{p.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-foreground">{p.value}</p>
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${p.bg} ${p.color}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="animate-in fade-in duration-300">
                <p className="text-[10px] text-muted-foreground/60 mb-2 font-medium uppercase tracking-wider">Clientes</p>
                {[
                  { name: "TechStart Ltda", tag: "VIP", tagColor: "text-yellow-400 bg-yellow-400/10", proposals: 4, value: "R$ 28k" },
                  { name: "Digital Agency", tag: "Ativo", tagColor: "text-green-400 bg-green-400/10", proposals: 2, value: "R$ 14k" },
                  { name: "Grupo Alpha", tag: "Lead", tagColor: "text-primary bg-primary/10", proposals: 1, value: "—" },
                  { name: "MarketPro", tag: "Ativo", tagColor: "text-green-400 bg-green-400/10", proposals: 3, value: "R$ 22k" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-2 bg-white/4 rounded-xl px-2.5 py-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-content-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-primary w-full text-center">{c.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-[8px] text-muted-foreground/50">{c.proposals} proposta(s) · {c.value}</p>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${c.tagColor}`}>{c.tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab strip */}
        <div className="bg-[#070d18] border-t border-white/5 px-3 py-2 flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium transition-colors ${
                activeTab === i ? "bg-primary/20 text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Glow */}
      <div className="absolute inset-0 -z-10 bg-primary/15 blur-[80px] rounded-full scale-75" />

      {/* Floating notification */}
      <div
        className="absolute -top-3 -right-3 bg-green-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5"
        style={{ animation: "float 3s ease-in-out infinite" }}
      >
        <CheckCircle2 className="w-3 h-3" />
        Proposta aprovada!
      </div>
    </div>
  );
}

/* Proposal preview mockup */
function ProposalPreview() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1a] shadow-xl overflow-hidden max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/70 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg" />
            <span className="text-[10px] text-white/70 font-mono">PROP-2026-012</span>
          </div>
          <h3 className="text-sm font-bold text-white">Site + CRM para TechStart</h3>
          <p className="text-[10px] text-white/70 mt-0.5">Proposta Comercial — Winove Agency</p>
        </div>
        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="bg-white/4 rounded-xl p-3">
            <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-1.5">Itens da proposta</p>
            {[
              { name: "Site em React/Next.js", value: "R$ 4.800" },
              { name: "CRM WhatsApp com IA (anual)", value: "R$ 1.650" },
              { name: "E-mail Corporativo (anual)", value: "R$ 550" },
            ].map((item) => (
              <div key={item.name} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-[10px] text-muted-foreground/70">{item.name}</span>
                <span className="text-[10px] font-bold text-foreground">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-1">
              <span className="text-[10px] font-bold text-foreground">Total</span>
              <span className="text-[11px] font-extrabold text-primary">R$ 7.000</span>
            </div>
          </div>
          {/* CTA */}
          <div className="bg-primary/15 border border-primary/25 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-primary">Aprovar proposta</p>
              <p className="text-[9px] text-muted-foreground/50">Válida até 20/05/2026</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-primary/10 blur-[60px] rounded-full scale-75" />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function SistemaProposta() {
  useScrollReveal();

  return (
    <>
      <SEO
        title="Sistema de Proposta Comercial Online | Winove"
        description="Gere propostas comerciais profissionais em minutos, gerencie clientes e feche negócios com CRM, triagem automática, link de pagamento e dashboard completo."
        canonical="https://www.winove.com.br/sistema-proposta-comercial"
        keywords={[
          "sistema de proposta comercial",
          "proposta comercial online",
          "crm para agências",
          "software de proposta",
          "gestão de propostas",
          "proposta comercial digital",
          "sistema crm freelancer",
          "proposta profissional",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Sistema de Proposta Comercial Online",
            provider: { "@type": "Organization", name: "Winove" },
            serviceType: "Software de Gestão Comercial",
            url: "https://www.winove.com.br/sistema-proposta-comercial",
            description:
              "Sistema completo para gerar propostas comerciais profissionais, gerenciar clientes e leads, enviar triagens automáticas e integrar links de pagamento.",
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
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-primary/7 rounded-full blur-[180px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-primary/4 rounded-full blur-[140px]" />
          </div>
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left: copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                    Sistema Comercial Completo
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                  Propostas que{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    fecham negócios
                  </span>{" "}
                  de verdade
                </h1>

                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
                  Pare de perder tempo com Word, PDF e planilha. Gere propostas comerciais
                  completas em minutos, gerencie seus clientes e feche mais negócios com um
                  sistema pensado para quem vende serviços.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="btn-primary gap-2 text-base">
                      <Zap className="w-4 h-4" />
                      Quero uma demonstração
                    </Button>
                  </a>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-2 transition-all duration-300"
                    >
                      <CalendarClock className="w-4 h-4" />
                      Agendar conversa
                    </Button>
                  </a>
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {[
                    "Implantação em até 3 dias",
                    "Personalizado com sua marca",
                    "Suporte via WhatsApp",
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: dashboard mockup */}
              <div className="flex justify-center lg:justify-end">
                <MockDashboard />
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

        {/* ── PROBLEM ──────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="reveal-on-scroll">
                <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                  O problema
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Sua proposta está{" "}
                  <span className="bg-gradient-to-r from-destructive to-red-400 bg-clip-text text-transparent">
                    te custando negócios
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    "PDF genérico que parece igual ao da concorrência",
                    "Horas perdidas editando Word para cada cliente",
                    "Sem rastreamento — você não sabe se o cliente abriu",
                    "Pagamento por fora: boleto enviado separado, atrasos",
                    "Histórico espalhado em WhatsApp, e-mail e planilha",
                    "Sem visibilidade de qual proposta está em aberto",
                  ].map((pain) => (
                    <div key={pain} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-destructive/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-destructive" />
                      </div>
                      <p className="text-muted-foreground text-sm">{pain}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal-on-scroll">
                <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                  A solução
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Um sistema que trabalha{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    enquanto você vende
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    "Proposta com sua marca, pronta em 10 minutos",
                    "Link online com rastreamento de visualização",
                    "Cliente aprova e paga no mesmo fluxo",
                    "CRM com histórico completo de cada cliente",
                    "Dashboard com conversão e receita em tempo real",
                    "Triagem automática antes da proposta",
                  ].map((sol) => (
                    <div key={sol} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-sm">{sol}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ────────────────────────────────────────────── */}
        <section className="py-24 bg-white/[0.02] relative overflow-hidden" id="recursos">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                Funcionalidades
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tudo que você precisa para{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  vender mais e melhor
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Um sistema construído para quem vende serviços e precisa de agilidade, profissionalismo e controle.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="reveal-on-scroll group relative rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-300"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                Como funciona
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Do lead à proposta aprovada
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Quatro etapas para fechar mais negócios com menos esforço.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

              {workflow.map((w, i) => (
                <div key={w.step} className="reveal-on-scroll text-center" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex flex-col items-center justify-center mb-5 shadow-lg shadow-primary/20">
                    <w.icon className="w-6 h-6 text-white" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0a0f1a] border border-primary/40 text-[9px] font-bold text-primary flex items-center justify-center">
                      {w.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROPOSAL PREVIEW ─────────────────────────────────────────── */}
        <section className="py-24 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="reveal-on-scroll order-2 lg:order-1">
                <ProposalPreview />
              </div>
              <div className="reveal-on-scroll order-1 lg:order-2">
                <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                  Proposta online
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Sua proposta tem{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    o visual que merece
                  </span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Cada proposta gera um link único e público com design profissional, personalizado com a sua marca.
                  O cliente abre no celular ou computador, visualiza os itens, condições e valor — e pode aprovar na hora.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Eye, text: "Rastreamento de visualização em tempo real" },
                    { icon: Clock, text: "Data de validade automática e alertas" },
                    { icon: CreditCard, text: "Botão de pagamento InfinitePay integrado" },
                    { icon: Bell, text: "Notificação quando o cliente abrir a proposta" },
                    { icon: Target, text: "Status atualizado automaticamente: enviada → aprovada" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON ───────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                Comparativo
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Do jeito antigo vs. com o sistema
              </h2>
            </div>

            <div className="max-w-3xl mx-auto reveal-on-scroll">
              {/* Header */}
              <div className="grid grid-cols-2 mb-3">
                <div className="text-center pb-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <X className="w-4 h-4 text-destructive" /> Jeito antigo
                  </span>
                </div>
                <div className="text-center pb-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <Check className="w-4 h-4" /> Com o sistema Winove
                  </span>
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-px mb-2 overflow-hidden rounded-xl"
                >
                  <div className="bg-destructive/5 border border-destructive/10 px-4 py-3.5 flex items-center gap-2.5">
                    <X className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{row.normal}</p>
                  </div>
                  <div className="bg-primary/5 border border-primary/15 px-4 py-3.5 flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground font-medium">{row.profissional}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SCREENING HIGHLIGHT ──────────────────────────────────────── */}
        <section className="py-24 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="reveal-on-scroll">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
                  <ClipboardList className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 text-xs font-semibold tracking-wide uppercase">
                    Diferencial exclusivo
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Triagem de leads{" "}
                  <span className="bg-gradient-to-r from-green-400 to-primary bg-clip-text text-transparent">
                    automática e inteligente
                  </span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Antes de montar qualquer proposta, o sistema envia um formulário personalizado
                  ao cliente. Ele responde sobre o projeto — objetivo, referências, prazo, orçamento —
                  e você já parte com todas as informações. Zero reunião inicial sem contexto.
                </p>
                <div className="space-y-4">
                  {[
                    "Envio automático por e-mail com um clique",
                    "Formulário online exclusivo por lead",
                    "Respostas salvas automaticamente no perfil do cliente",
                    "Status em tempo real: enviado, aguardando, respondido",
                    "Envio em massa para todos os leads de uma vez",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triagem mockup */}
              <div className="reveal-on-scroll">
                <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1a] overflow-hidden shadow-xl">
                  <div className="bg-gradient-to-r from-green-500/20 to-primary/20 px-5 py-4 border-b border-white/6">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">Triagem enviada</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">Formulário de Triagem — Winove</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">Para: rogerio@empresa.com.br</p>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { q: "O que você pretende criar?", a: "Quero um site institucional moderno para minha empresa com formulário de contato e integração com WhatsApp.", answered: true },
                      { q: "Você tem alguma referência?", a: "Sim! Gosto do estilo da Apple e da Notion.", answered: true },
                      { q: "Qual é o seu prazo?", a: "30 dias", answered: true },
                      { q: "Alguma informação extra?", a: "", answered: false },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/4 rounded-xl p-3">
                        <p className="text-[10px] text-primary font-semibold mb-1">{item.q}</p>
                        {item.answered ? (
                          <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{item.a}</p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground/30 italic">aguardando resposta...</p>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      <p className="text-[10px] text-green-400 font-semibold">3 de 4 perguntas respondidas · Aguardando última resposta</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEGMENTS ─────────────────────────────────────────────────── */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                Para quem é
              </p>
              <h2 className="text-3xl font-bold mb-3">
                Ideal para quem vende serviços
              </h2>
              <p className="text-muted-foreground">
                Qualquer profissional ou empresa que precisa apresentar e fechar projetos.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 reveal-on-scroll">
              {segments.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-3 hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-200 cursor-default"
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL / SOCIAL PROOF ───────────────────────────────── */}
        <section className="py-24 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                Resultados reais
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Quem usa fecha mais
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Antes eu gastava 2 horas em cada proposta. Agora faço em 10 minutos e o cliente já recebe o link formatado. A taxa de aprovação subiu absurdamente.",
                  name: "Agência de Marketing Digital",
                  stars: 5,
                },
                {
                  quote: "A triagem automática mudou tudo. O cliente chega com o briefing completo e eu já entro na reunião com a proposta quase pronta. Profissionalismo total.",
                  name: "Consultora de Branding",
                  stars: 5,
                },
                {
                  quote: "O dashboard me mostra em tempo real quais propostas estão em aberto e o valor total em negociação. Nunca mais fiquei sem visibilidade do meu funil.",
                  name: "Desenvolvedor Web Freelancer",
                  stars: 5,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="reveal-on-scroll rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-primary/25 transition-all duration-300"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-[11px] font-bold text-white">
                      {t.name[0]}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden" id="faq">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                Dúvidas frequentes
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Perguntas frequentes
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq) => (
                <div key={faq.question} className="reveal-on-scroll">
                  <FaqItem {...faq} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          {/* Large glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[200px]" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="reveal-on-scroll max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-8">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Comece hoje mesmo
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Sua próxima proposta{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  já pode estar fechada
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Implantação em até 3 dias úteis. Personalizado com sua marca. Suporte via WhatsApp.
                Você começa a usar na semana que vem.
              </p>

              <div className="flex flex-wrap gap-4 justify-center mb-10">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="btn-primary gap-2 text-base px-8 py-6 text-lg">
                    <Zap className="w-5 h-5" />
                    Quero meu sistema agora
                  </Button>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-2 text-base px-8 py-6 text-lg transition-all duration-300"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Falar com a Winove
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                {[
                  "Implantação em 3 dias",
                  "Personalizado com sua marca",
                  "Sem mensalidade surpresa",
                  "Suporte via WhatsApp",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
