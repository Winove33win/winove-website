import { useState } from "react";
import BlogList from "@/components/BlogList";
import { SEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, BookOpen, Rss, Send, Sparkles, TrendingUp, Zap } from "lucide-react";

const topics = [
  { label: "SEO & Google", icon: TrendingUp },
  { label: "Wix Studio", icon: Sparkles },
  { label: "Automação", icon: Zap },
  { label: "Marketing Digital", icon: Rss },
  { label: "E-commerce", icon: BookOpen },
];

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Redirect to WhatsApp with email included in message
    const msg = encodeURIComponent(
      `Olá! Quero receber conteúdos exclusivos do blog Winove. Meu e-mail é: ${email}`
    );
    window.open(`https://api.whatsapp.com/send?phone=5519982403845&text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-primary/5 p-8 md:p-12">
      {/* Ambient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/6 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 rounded-full px-3 py-1 mb-4">
            <Rss className="w-3 h-3 text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">Newsletter</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
            Receba conteúdos exclusivos{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              toda semana
            </span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            Dicas de SEO, Wix Studio, automação e estratégias digitais direto para você.
            Sem spam, apenas conteúdo de valor.
          </p>
        </div>

        <div className="flex-1 max-w-md">
          {sent ? (
            <div className="glass rounded-2xl border border-primary/30 p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Perfeito! Vamos te contatar.</p>
              <p className="text-sm text-muted-foreground mt-1">Você será redirecionado ao WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all duration-200"
              />
              <Button type="submit" className="btn-primary gap-2 whitespace-nowrap">
                Quero receber
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
          <p className="text-xs text-muted-foreground/60 mt-3">
            Ao assinar, você concorda com nossa{" "}
            <a href="/politica-de-privacidade" className="underline hover:text-primary transition-colors">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  useScrollReveal();

  return (
    <>
      <SEO
        title="Blog Winove | Marketing Digital, Wix, SEO e Tecnologia"
        description="Artigos, guias e cases sobre criação de sites, SEO, automação, CRM WhatsApp e estratégias digitais para empresas que querem crescer online."
        canonical="https://www.winove.com.br/blog"
        keywords={["blog marketing digital", "criação de sites wix", "seo para empresas", "automação whatsapp", "dicas de vendas online"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://www.winove.com.br/blog#webpage",
            name: "Blog Winove – Marketing Digital e Tecnologia",
            url: "https://www.winove.com.br/blog",
            description: "Conteúdos sobre marketing digital, SEO, criação de sites e estratégias digitais.",
            isPartOf: { "@id": "https://www.winove.com.br/#website" },
            publisher: { "@id": "https://www.winove.com.br/#organization" },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://www.winove.com.br/" },
                { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.winove.com.br/blog" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": "https://www.winove.com.br/blog#blog",
            name: "Blog Winove",
            url: "https://www.winove.com.br/blog",
            description: "Artigos e guias sobre marketing digital, SEO, Wix Studio, automação e CRM.",
            publisher: {
              "@type": "Organization",
              name: "Winove",
              url: "https://www.winove.com.br",
              logo: { "@type": "ImageObject", url: "https://www.winove.com.br/logo.png" },
            },
            inLanguage: "pt-BR",
          },
        ]}
      />

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="section--first pb-16 relative overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-20 top-10 w-[500px] h-[400px] bg-primary/6 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-primary/4 rounded-full blur-[120px]" />
          </div>
          {/* Vertical center line */}
          <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/15 to-transparent lg:block pointer-events-none" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6 reveal-on-scroll">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">Blog & Insights</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5 reveal-on-scroll">
                Conteúdo que{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                  transforma negócios
                </span>
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mb-8 reveal-on-scroll">
                Estratégias de SEO, Wix Studio, automação e marketing digital escritas por quem
                executa projetos reais todos os dias.
              </p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-2 reveal-on-scroll">
                {topics.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-1.5 glass border border-white/10 rounded-full px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200 cursor-default"
                  >
                    <t.icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 pb-24">
          <div className="space-y-14">
            {/* Blog list (featured + grid + filters) */}
            <BlogList NewsletterSlot={<NewsletterSection />} />
          </div>
        </div>
      </div>
    </>
  );
}
