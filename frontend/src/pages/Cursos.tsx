import { useEffect, useState } from "react";
import { SEO } from "@/lib/seo";


import "./Cursos.css";

const CHANNEL_ID = "UC72j8hbrLTXC4ntTtpkvaYw";
const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const ytLink = (id: string) => `https://www.youtube.com/watch?v=${id}`;

const grade = [
  { titulo:"Planejamento do Site", desc:"Entenda objetivos, público e estrutura antes de começar.", videoId:null },
  { titulo:"Criando Conta e Template", desc:"Crie a conta e escolha um template para iniciar.", videoId:null },
  { titulo:"Dominando o Editor", desc:"Layout, elementos, responsividade e boas práticas.", videoId:null },
  { titulo:"Estrutura: Páginas e Menus", desc:"Navegação clara com cabeçalho, rodapé e submenus.", videoId:null },
  { titulo:"Formulários e Blog", desc:"Formulários nativos e opções avançadas com Velo; blog integrado.", videoId:null },
  { titulo:"Loja Online (Wix Stores)", desc:"Produtos, checkout, meios de pagamento e gestão de pedidos.", videoId:null },
  { titulo:"Páginas Dinâmicas e CMS", desc:"Collections e páginas dinâmicas com o Content Manager.", videoId:null },
  { titulo:"SEO Básico", desc:"Configurações essenciais para ser encontrado no Google.", videoId:null },
  { titulo:"Publicação e Gestão", desc:"Publicar, conectar domínio e manter seu site.", videoId:null }
];

const categories = [
  {
    nome: "Iniciantes",
    cor: "#27c38a",
    videos: [
      { id:"-KIf6N6zsX0", titulo:"Como construir um site sozinho?", duracao:"~10 min", resumo:"Planejamento e primeiros passos para criar seu site com segurança." },
      { id:"START12345A", titulo:"Negócios digitais: por onde começar?", duracao:"~7 min", resumo:"Fundamentos para iniciar um negócio digital sem fórmulas mágicas." }
    ]
  },
  {
    nome: "Avançado",
    cor: "#7db7ff",
    videos: [
      { id:"VELOFORM24X", titulo:"Formulário personalizado no Wix Studio", duracao:"~18 min", resumo:"Construa formulários customizados sem apps pagos, usando recursos nativos/Velo." },
      { id:"CMSDINAM123", titulo:"CMS e Páginas Dinâmicas no Wix Studio", duracao:"~12 min", resumo:"Coleções de dados e páginas dinâmicas escaláveis para muito conteúdo." },
      { id:"FILTERCMS55", titulo:"Filtros com itens do CMS", duracao:"~5 min", resumo:"Melhore a UX permitindo filtrar listas por categoria e atributos." }
    ]
  },
  {
    nome: "Design e Templates",
    cor: "#d9a7ff",
    videos: [
      { id:"TEMPLATE999", titulo:"Templates no Wix Studio", duracao:"~5 min", resumo:"Escolha e personalize modelos profissionais para começar rápido." },
      { id:"SUBMENUCOLOR", titulo:"Cor do submenu no header (Studio)", duracao:"~5 min", resumo:"Ajuste fino da identidade: cores e estilos do menu suspenso." },
      { id:"ADDTPERSONA", titulo:"Adicionar template personalizado (Studio)", duracao:"~8 min", resumo:"Importe um template próprio e refine dentro do editor." }
    ]
  },
  {
    nome: "SEO e Blog",
    cor: "#ffd166",
    videos: [
      { id:"BLOGNEWS32M", titulo:"Site de Notícias/Blog no Wix – Passo a passo", duracao:"~32 min", resumo:"Crie categorias, páginas de post e configurações essenciais de SEO." }
    ]
  },
  {
    nome: "E-commerce",
    cor: "#ff9b66",
    videos: [
      { id:"STORE2024X", titulo:"Loja no Wix Studio (2024)", duracao:"~30 min", resumo:"Do template ao checkout funcionando, completo." },
      { id:"ORGANPROD9M", titulo:"Organizando produtos no Stores", duracao:"~9 min", resumo:"Coleções e categorias para navegação mais fácil." },
      { id:"ORDERMGMT11", titulo:"Gerenciar pedidos da loja", duracao:"~11 min", resumo:"Painel de pedidos: status, pagamentos e histórico." },
      { id:"MPAGO15MIN", titulo:"Integrar Mercado Pago", duracao:"~15 min", resumo:"Configuração de meios de pagamento locais para Brasil." },
      { id:"REVIEWS6MIN", titulo:"Avaliações de clientes nos produtos", duracao:"~6 min", resumo:"Ative e exiba reviews para aumentar confiança." }
    ]
  }
];

const faqs = [
  { q: "Preciso pagar para usar o Wix ou fazer este curso?", a: "Não. Você pode começar gratuitamente no Wix e assistir às aulas no nosso canal. Planos pagos só são necessários para recursos como conectar domínio próprio e remover anúncios." },
  { q: "É preciso saber programar?", a: "Não. O editor é visual (arrastar e soltar). Para recursos avançados, apresentamos Velo de forma opcional, sempre com exemplos práticos." },
  { q: "O curso cobre Wix Studio e Editor clássico?", a: "Sim. Começamos pelo Editor tradicional e mostramos o que muda no Wix Studio em tópicos de design profissional e CMS." },
  { q: "Posso criar loja online completa?", a: "Sim. Temos aulas de Wix Stores: cadastro de produtos, checkout, meios de pagamento e gestão de pedidos." }
];

const Cursos = () => {
  useEffect(() => {
    document.body.classList.add("cursos-page");
    return () => document.body.classList.remove("cursos-page");
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            mainEntity: [
              { "@type": "Question", name: "O curso é gratuito?", acceptedAnswer: { "@type": "Answer", text: "Sim. As aulas em vídeo são gratuitas e disponíveis no canal oficial da Winove no YouTube." } },
              { "@type": "Question", name: "Preciso saber programar para aprender Wix?", acceptedAnswer: { "@type": "Answer", text: "Não. O editor Wix é visual (arrastar e soltar). Para recursos avançados, apresentamos Velo de forma opcional, sempre com exemplos práticos." } },
              { "@type": "Question", name: "O curso cobre Wix Studio e Editor clássico?", acceptedAnswer: { "@type": "Answer", text: "Sim. Começamos pelo Editor tradicional e mostramos o que muda no Wix Studio em tópicos de design profissional e CMS." } },
              { "@type": "Question", name: "Posso criar loja online completa?", acceptedAnswer: { "@type": "Answer", text: "Sim. O curso inclui aulas de Wix Stores: cadastro de produtos, checkout, meios de pagamento e gestão de pedidos." } },
            ],
          },
        ]}
      />
      <header className="container" style={{ marginTop: "var(--header-h)", padding: "16px 24px 0" }}>
        <div className="badge">Curso Wix • Winove</div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Aprenda a Criar e Gerenciar Sites no Wix</h1>
            <p className="subtitle">Domine a plataforma Wix, crie sites incríveis e gerencie seu negócio online de forma profissional. Aulas gratuitas com base no nosso canal oficial.</p>
            <div className="cta">
              <a className="btn btn-primary" href="#videos">Começar pelas aulas (Grátis)</a>
              <a className="btn btn-ghost" href="https://www.youtube.com/channel/UC72j8hbrLTXC4ntTtpkvaYw" target="_blank" rel="noopener">Ir para o Canal Winove</a>
            </div>
            <div className="hero-kpis">
              <div className="kpi"><b>Passo a passo</b><br /><span className="muted">Do zero ao avançado</span></div>
              <div className="kpi"><b>Sem código</b><br /><span className="muted">E com Velo quando precisar</span></div>
              <div className="kpi"><b>100% prático</b><br /><span className="muted">Projetos reais</span></div>
            </div>
          </div>
          <div className="hero-media">
            <div className="overlay">
              <div className="tag">Prévia</div>
              <h3 style={{ margin: "10px 0 6px" }}>O que você vai construir</h3>
              <p className="muted">Estruturas de páginas, blog, e-commerce, CMS dinâmico e boas práticas de SEO – tudo em um fluxo didático.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="grade">
        <div className="container">
          <h2>Grade do Curso</h2>
          <p className="lead">Organizamos os tópicos em módulos. Os cards abaixo levam para as aulas correspondentes no YouTube (somente do nosso canal).</p>
          <div className="grid cols-3">
            {grade.map((mod, idx) => (
              <div className="card" key={idx}>
                <span className="tag">{mod.videoId ? "Disponível" : "Em breve"}</span>
                <h3>{mod.titulo}</h3>
                <p>{mod.desc}</p>
                <div className="actions">
                  {mod.videoId ? (
                    <a className="btn btn-sm btn-primary" target="_blank" rel="noopener" href={ytLink(mod.videoId)}>
                      Assistir no YouTube
                    </a>
                  ) : (
                    <button className="btn btn-sm btn-ghost" disabled>Em breve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="videos">
        <div className="container">
          <h2>Assista por Categoria</h2>
          <p className="lead">Cards com título, thumbnail, duração e resumo. Todos os links apontam exclusivamente ao nosso canal.</p>
          <div>
            {categories.map((cat, idx) => (
              <div className="cat" key={idx}>
                <h3 style={{ color: cat.cor }}>{cat.nome}</h3>
                <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                  {cat.videos.map((v) => (
                    <a className="video-card" href={ytLink(v.id)} target="_blank" rel="noopener" key={v.id} data-yt-id={v.id}>
                      <img className="thumb" alt={v.titulo} src={ytThumb(v.id)} loading="lazy" />
                      <div className="video-content">
                        <div className="video-meta">
                          <span className="pill">{v.duracao || ""}</span>
                          <span className="pill">Canal Winove</span>
                        </div>
                        <h4 style={{ margin: "8px 0 6px" }}>{v.titulo}</h4>
                        <p>{v.resumo || ""}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Perguntas Frequentes</h2>
          <div className="accordion" id="faq">
            {faqs.map((item, idx) => (
              <div className={`acc-item ${openFaq === idx ? "open" : ""}`} key={idx}>
                <button className="acc-btn" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  {item.q}
                </button>
                <div className="acc-panel">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band section">
        <div className="container">
          <h2>Todas as aulas gratuitas no nosso canal</h2>
          <p className="lead">Inscreva-se e comece hoje mesmo. Deixamos esta página pronta para futuros cursos pagos (em breve).</p>
          <div className="cta">
            <a className="btn btn-primary" href="https://www.youtube.com/channel/UC72j8hbrLTXC4ntTtpkvaYw" target="_blank" rel="noopener">Assistir no YouTube</a>
            <a className="btn btn-ghost" href="#grade">Ver módulos</a>
          </div>
          <p className="disclaimer" style={{ marginTop: "16px" }}>
            Aviso: por política do cliente, esta página usa <b>exclusivamente</b> vídeos do canal Winove (ID: {CHANNEL_ID}).
          </p>
        </div>
      </section>



      <footer>
        <div className="container" style={{ borderTop: "1px solid var(--line)", paddingTop: "18px" }}>
          <small>© Winove. Curso Wix – Landing page conceito estilo Airbnb.</small>
        </div>
      </footer>

    </>
  );
};

export default Cursos;
