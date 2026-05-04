import { Link } from "react-router-dom";
import {
  Globe, Mail, MessageSquare, FileText, ClipboardList,
  Wine, GraduationCap, LayoutTemplate, ArrowRight,
} from "lucide-react";

const products = [
  {
    category: "Presença Digital",
    categoryColor: "#3b82f6",
    icon: Globe,
    name: "Serviços Web",
    desc: "Sites profissionais em Wix Studio, desenvolvimento personalizado, SEO e estratégia digital completa.",
    href: "/servicos",
    badge: null,
  },
  {
    category: "Presença Digital",
    categoryColor: "#3b82f6",
    icon: LayoutTemplate,
    name: "Templates Wix Studio",
    desc: "Modelos prontos, responsivos e otimizados para SEO. Personalize com sua marca e lance em dias.",
    href: "/templates",
    badge: null,
  },
  {
    category: "Comunicação",
    categoryColor: "#10b981",
    icon: Mail,
    name: "E-mail Corporativo",
    desc: "E-mail com domínio próprio via Google Workspace ou Microsoft 365. Credibilidade e segurança.",
    href: "/email-corporativo",
    badge: null,
  },
  {
    category: "Comunicação",
    categoryColor: "#10b981",
    icon: MessageSquare,
    name: "Chat WhatsApp",
    desc: "CRM, chatbot e IA integrados no WhatsApp. Funil de vendas, atendimento 24h e métricas em tempo real.",
    href: "/chat-whatsapp",
    badge: "Popular",
  },
  {
    category: "Sistemas",
    categoryColor: "#f59e0b",
    icon: FileText,
    name: "Gestão Documental",
    desc: "ECM em nuvem para digitalizar, organizar e automatizar documentos com conformidade LGPD.",
    href: "/sistema-gestao-documental",
    badge: null,
  },
  {
    category: "Sistemas",
    categoryColor: "#f59e0b",
    icon: ClipboardList,
    name: "Sistema de Propostas",
    desc: "Crie propostas comerciais profissionais em minutos, com catálogo, PDF, link de pagamento integrado.",
    href: "/sistema-proposta-comercial",
    badge: "Novo",
  },
  {
    category: "IA Especializada",
    categoryColor: "#7C1C2A",
    icon: Wine,
    name: "AI Sommelier",
    desc: "Atendimento inteligente para lojas de vinho e destilados. Harmonização, presentes e 7+ idiomas.",
    href: "/ai-sommelier",
    badge: "IA",
  },
  {
    category: "Educação",
    categoryColor: "#6366f1",
    icon: GraduationCap,
    name: "Cursos",
    desc: "Aprenda Wix Studio do zero ao avançado com Fernando Souza. Certificado e acesso vitalício.",
    href: "/cursos",
    badge: null,
  },
];

export const ProductsShowcase = () => (
  <section className="py-24 bg-background relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--primary)/0.04),transparent)]" />

    <div className="container mx-auto px-4 relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
        <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
          Nossos produtos
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
          Tudo que construímos{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            para o seu negócio
          </span>
        </h2>
        <p className="text-muted-foreground text-lg">
          De sites e automação até sistemas com IA — soluções completas para cada etapa do crescimento digital.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.href}
              to={p.href}
              className="group relative glass border border-white/5 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_0_40px_hsl(var(--primary)/0.08)] reveal-on-scroll"
            >
              {/* Badge */}
              {p.badge && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${p.categoryColor}20`,
                    color: p.categoryColor,
                    border: `1px solid ${p.categoryColor}30`,
                  }}
                >
                  {p.badge}
                </span>
              )}

              {/* Category */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.categoryColor }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: p.categoryColor }}>
                  {p.category}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: `${p.categoryColor}18` }}
              >
                <Icon className="w-5 h-5 transition-colors" style={{ color: p.categoryColor }} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {p.desc}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors pt-1">
                Conhecer
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);
