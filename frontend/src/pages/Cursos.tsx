import { useState } from "react";
import { SEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ChevronDown,
  Play,
  Youtube,
  BookOpen,
  ShoppingCart,
  Search,
  Layers,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const CHANNEL_URL = "https://www.youtube.com/channel/UC72j8hbrLTXC4ntTtpkvaYw";
const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const ytLink = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/* ─── Data ──────────────────────────────────────────────────────────────── */

const stats = [
  { value: "100%", label: "Gratuito" },
  { value: "15+", label: "Aulas práticas" },
  { value: "Zero", label: "Código obrigatório" },
  { value: "5★", label: "Avaliações no canal" },
];

const grade = [
  { num: "01", titulo: "Planejamento do Site", desc: "Defina objetivos, público-alvo e estrutura de páginas antes de abrir o editor.", icon: BookOpen, done: false },
  { num: "02", titulo: "Criando Conta e Template", desc: "Crie a conta Wix, escolha o template certo e configure as bases do projeto.", icon: Layers, done: false },
  { num: "03", titulo: "Dominando o Editor", desc: "Layout, elementos, responsividade mobile e boas práticas de usabilidade.", icon: Sparkles, done: false },
  { num: "04", titulo: "Estrutura: Páginas e Menus", desc: "Navegação clara com cabeçalho, rodapé, submenus e links internos.", icon: Layers, done: false },
  { num: "05", titulo: "Formulários e Blog", desc: "Formulários nativos, captação de leads e blog integrado com categorias.", icon: BookOpen, done: false },
  { num: "06", titulo: "Loja Online (Wix Stores)", desc: "Produtos, checkout, meios de pagamento e gestão completa de pedidos.", icon: ShoppingCart, done: false },
  { num: "07", titulo: "Páginas Dinâmicas e CMS", desc: "Collections e páginas dinâmicas escaláveis com o Content Manager.", icon: Layers, done: false },
  { num: "08", titulo: "SEO Básico no Wix", desc: "Configurações essenciais para ser encontrado no Google organicamente.", icon: Search, done: false },
  { num: "09", titulo: "Publicação e Gestão", desc: "Publicar o site, conectar domínio próprio e manter seu conteúdo atualizado.", icon: CheckCircle2, done: false },
];

type Category = {
  nome: string;
  cor: string;
  bg: string;
  videos: { id: string; titulo: string; duracao: string; resumo: string }[];
};

const categories: Category[] = [
  {
    nome: "Iniciantes",
    cor: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    videos: [
      { id: "-KIf6N6zsX0", titulo: "Como construir um site sozinho?", duracao: "~10 min", resumo: "Planejamento e primeiros passos para criar seu site com segurança." },
      { id: "START12345A", titulo: "Negócios digitais: por onde começar?", duracao: "~7 min", resumo: "Fundamentos para iniciar um negócio digital sem fórmulas mágicas." },
    ],
  },
  {
    nome: "Avançado",
    cor: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    videos: [
      { id: "VELOFORM24X", titulo: "Formulário personalizado no Wix Studio", duracao: "~18 min", resumo: "Construa formulários customizados sem apps pagos, usando recursos nativos/Velo." },
      { id: "CMSDINAM123", titulo: "CMS e Páginas Dinâmicas no Wix Studio", duracao: "~12 min", resumo: "Coleções de dados e páginas dinâmicas escaláveis para muito conteúdo." },
      { id: "FILTERCMS55", titulo: "Filtros com itens do CMS", duracao: "~5 min", resumo: "Melhore a UX permitindo filtrar listas por categoria e atributos." },
    ],
  },
  {
    nome: "Design e Templates",
    cor: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    videos: [
      { id: "TEMPLATE999", titulo: "Templates no Wix Studio", duracao: "~5 min", resumo: "Escolha e personalize modelos profissionais para começar rápido." },
      { id: "SUBMENUCOLOR", titulo: "Cor do submenu no header (Studio)", duracao: "~5 min", resumo: "Ajuste fino da identidade: cores e estilos do menu suspenso." },
      { id: "ADDTPERSONA", titulo: "Adicionar template personalizado (Studio)", duracao: "~8 min", resumo: "Importe um template próprio e refine dentro do editor." },
    ],
  },
  {
    nome: "SEO e Blog",
    cor: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    videos: [
      { id: "BLOGNEWS32M", titulo: "Site de Notícias/Blog no Wix – Passo a passo", duracao: "~32 min", resumo: "Crie categorias, páginas de post e configurações essenciais de SEO." },
    ],
  },
  {
    nome: "E-commerce",
    cor: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    videos: [
      { id: "STORE2024X", titulo: "Loja no Wix Studio (2024)", duracao: "~30 min", resumo: "Do template ao checkout funcionando, completo." },
      { id: "ORGANPROD9M", titulo: "Organizando produtos no Stores", duracao: "~9 min", resumo: "Coleções e categorias para navegação mais fácil." },
      { id: "ORDERMGMT11", titulo: "Gerenciar pedidos da loja", duracao: "~11 min", resumo: "Painel de pedidos: status, pagamentos e histórico." },
      { id: "MPAGO15MIN", titulo: "Integrar Mercado Pago", duracao: "~15 min", resumo: "Configuração de meios de pagamento locais para o Brasil." },
      { id: "REVIEWS6MIN", titulo: "Avaliações de clientes nos produtos", duracao: "~6 min", resumo: "Ative e exiba reviews para aumentar confiança." },
    ],
  },
];

const faqs = [
  { q: "Preciso pagar para fazer este curso?", a: "Não. As aulas são 100% gratuitas e estão disponíveis no canal oficial da Winove no YouTube. Planos pagos do Wix só são necessários para conectar domínio próprio ou remover anúncios do Wix." },
  { q: "É preciso saber programar?", a: "Não. O editor Wix é completamente visual (arrastar e soltar). Para recursos avançados mostramos o Velo de forma opcional, sempre com exemplos práticos." },
  { q: "O curso cobre Wix Studio e Editor clássico?", a: "Sim. Começamos pelo editor tradicional e evoluímos para o Wix Studio, abordando design profissional, CMS e recursos exclusivos da versão mais avançada." },
  { q: "Posso criar uma loja online completa?", a: "Sim. O curso inclui um módulo completo de Wix Stores: cadastro de produtos, checkout, integração com meios de pagamento (incluindo Mercado Pago) e gestão de pedidos." },
  { q: "Os módulos do curso têm certificado?", a: "No momento os módulos são em vídeo no YouTube. Certificados estão previstos para os cursos pagos que lançaremos em breve. Cadastre-se no canal para ser avisado." },
];

/* ─── Sub-components ────────────────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors duration-300">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground text-sm md:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-56 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: Category["videos"][0] }) {
  const [imgError, setImgError] = useState(false);
  return (
    <a
      href={ytLink(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass border border-white/8 hover:border-primary/30 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-primary/5 overflow-hidden">
        {!imgError ? (
          <img
            src={ytThumb(video.id)}
            alt={video.titulo}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube className="w-10 h-10 text-primary/40" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] font-medium text-white flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duracao}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
          {video.titulo}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{video.resumo}</p>
        <div className="mt-auto pt-2 flex items-center gap-1 text-xs text-primary font-medium">
          <Youtube className="w-3.5 h-3.5" />
          Canal Winove
        </div>
      </div>
    </a>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

const Cursos = () => {
  useScrollReveal();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <SEO
        title="Curso Wix Studio Completo – Crie Sites Profissionais | Winove"
        description="Aprenda Wix Studio do zero ao avançado. Aulas gratuitas com especialistas da Winove. Inclui e-commerce, SEO, CMS e design responsivo."
        canonical="https://www.winove.com.br/cursos"
        keywords={["curso wix", "curso wix studio", "aprender wix", "curso criação de sites", "wix gratuito", "wix stores", "wix seo"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "@id": "https://www.winove.com.br/cursos#course",
            name: "Curso Wix Studio – Do Iniciante ao Profissional",
            description: "Domine a plataforma Wix Studio, crie sites incríveis, lojas virtuais e gerencie seu negócio online de forma profissional.",
            url: "https://www.winove.com.br/cursos",
            provider: { "@id": "https://www.winove.com.br/#organization" },
            inLanguage: "pt-BR",
            isAccessibleForFree: true,
            teaches: ["Criação de sites no Wix Studio", "Design responsivo", "Wix Stores – e-commerce", "SEO no Wix", "CMS e blog no Wix"],
            coursePrerequisites: "Nenhum. Iniciantes são bem-vindos.",
            educationalLevel: "Iniciante a Avançado",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "https://www.winove.com.br/" },
              { "@type": "ListItem", position: 2, name: "Cursos", item: "https://www.winove.com.br/cursos" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <div className="min-h-screen bg-background text-foreground font-inter overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="section--first pb-20 relative overflow-hidden">
          {/* Ambient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-primary/6 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/4 rounded-full blur-[120px]" />
          </div>
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Curso gratuito · Canal Winove
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Aprenda a criar sites{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  profissionais no Wix
                </span>
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Do planejamento ao e-commerce completo — aulas práticas e gratuitas para você dominar
                o Wix Studio sem precisar saber programar.
              </p>

              <div className="flex flex-wrap gap-3 justify-center mb-10">
                <a href="#videos">
                  <Button size="lg" className="btn-primary gap-2 text-base">
                    <Play className="w-4 h-4 fill-white" />
                    Começar a aprender grátis
                  </Button>
                </a>
                <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-2 transition-all duration-300">
                    <Youtube className="w-4 h-4" />
                    Ir para o canal
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-muted-foreground">
                {["100% gratuito", "Sem precisar programar", "Do zero ao avançado", "Wix Studio + E-commerce"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────── */}
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

        {/* ── CURRICULUM ───────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden" id="grade">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/4 rounded-full blur-[130px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-14 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Ementa</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Grade do{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  curso
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                9 módulos organizados do básico ao avançado. Os vídeos de cada módulo estão disponíveis no nosso canal.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {grade.map((mod, i) => (
                <div
                  key={mod.num}
                  className="glass rounded-2xl p-6 border border-white/8 hover:border-primary/25 transition-all duration-300 hover:-translate-y-1 reveal-on-scroll flex flex-col gap-3"
                  style={{ transitionDelay: `${(i % 3) * 60}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-primary/20 leading-none">{mod.num}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                      Em breve
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{mod.titulo}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VIDEOS BY CATEGORY ───────────────────────────────────────── */}
        <section className="py-24 bg-gradient-navy relative overflow-hidden" id="videos">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Aulas</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Assista por{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  categoria
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Todos os vídeos são do canal oficial da Winove no YouTube — gratuitos e práticos.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center mb-10 reveal-on-scroll">
              {categories.map((cat, i) => (
                <button
                  key={cat.nome}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeTab === i
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat.nome}
                </button>
              ))}
            </div>

            {/* Video grid for active category */}
            {categories.map((cat, i) => (
              <div
                key={cat.nome}
                className={`transition-all duration-300 ${activeTab === i ? "opacity-100" : "hidden"}`}
              >
                <div className={`inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border text-sm font-semibold ${cat.bg} ${cat.cor}`}>
                  {cat.nome}
                  <span className="text-xs opacity-70">· {cat.videos.length} aulas</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.videos.map((v) => (
                    <VideoCard key={v.id} video={v} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-[400px] h-[300px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 reveal-on-scroll">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">FAQ</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Dúvidas{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  frequentes
                </span>
              </h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="reveal-on-scroll" style={{ transitionDelay: `${i * 60}ms` }}>
                  <FaqItem q={faq.q} a={faq.a} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-20 pb-28 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-primary/[0.03]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center reveal-on-scroll">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
              <Youtube className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                Gratuito no YouTube
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Comece a aprender{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                agora mesmo
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Inscreva-se no canal e receba novas aulas toda semana. Os cursos pagos estão chegando em breve.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="btn-primary gap-2 text-base px-8">
                  <Youtube className="w-4 h-4" />
                  Assistir no YouTube
                </Button>
              </a>
              <a href="#grade">
                <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-2 transition-all duration-300">
                  <BookOpen className="w-4 h-4" />
                  Ver grade do curso
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm text-muted-foreground">
              {["100% gratuito", "Sem cadastro obrigatório", "Cursos pagos em breve"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Cursos;
