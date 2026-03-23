import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/lib/seo";
import { BriefcaseBusiness, CheckCircle2, GraduationCap, Lightbulb, LineChart, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";

const experiences = [
  {
    role: "CEO",
    company: "Winove Online",
    period: "fev de 2021 - o momento",
    location: "São Paulo, Brasil",
    details:
      "Fundador da Winove.online, liderando estratégias de posicionamento digital, SEO e crescimento orientado por dados para empresas em diferentes estágios.",
  },
  {
    role: "Chief Executive Officer / Fundador e CEO",
    company: "OMSA - Organização Multidisciplinar de Saúde Aplicada",
    period: "jan de 2017 - o momento",
    location: "São Paulo e Região / Campinas",
    details:
      "Responsável pela expansão de operações, inovação em atendimento de saúde e estruturação de crescimento sustentável.",
  },
  {
    role: "Day Trader",
    company: "FBS Inc.",
    period: "jan de 2018 - jul de 2020",
    location: "São Paulo e Região",
    details:
      "Atuação em operações orientadas por análise de risco, tomada de decisão sob pressão e disciplina de performance.",
  },
  {
    role: "Vendedor externo",
    company: "Hotmart",
    period: "jan de 2017 - mai de 2020",
    location: "Brasil",
    details: "Experiência comercial com foco em aquisição de clientes, negociação e expansão de receitas.",
  },
  {
    role: "Chief Marketing Officer",
    company: "Simmel Móveis Planejados",
    period: "jan de 2019 - mar de 2019",
    location: "Campinas e Região",
    details: "Estratégias de marketing para posicionamento de marca, geração de demanda e fortalecimento da presença digital.",
  },
];

const education = [
  "NEXT MBA — MBA em Marketing (2022–2024)",
  "Product School — Product Masterclass: How to Build Digital Products (2020)",
  "University of California, Davis — Especialização em Search Engine Optimization (2021–2022)",
  "University of California, Davis — SEO Specialization (2020)",
  "Harvard University — Metodologia Scrum e Business Plan (2018)",
  "University of Virginia — Design Thinking for Innovation (2020)",
  "Northwestern State University — Customer Segmentation and Prospecting (2020)",
  "Centro Universitário de Jaguariúna (UniFAJ) — Graduação em Human Nutrition",
  "CNEC — Extensão em Business, Management, Marketing and Related Support Services",
  "The Next MBA — Executive MBA, Special Products Marketing Operations (2022–2023)",
];

const seoEducationHighlights = [
  {
    title: "University of California, Davis",
    focus: "Search Engine Optimization (SEO)",
    period: "2021–2022",
    description:
      "Especialização com foco em estratégia de conteúdo, autoridade de domínio e otimização técnica para posicionamento orgânico sustentável.",
  },
  {
    title: "University of California, Davis",
    focus: "SEO Specialization",
    period: "2020",
    description:
      "Formação internacional direcionada à aplicação prática de SEO on-page, pesquisa de palavras-chave e crescimento orientado por dados.",
  },
  {
    title: "NEXT MBA",
    focus: "MBA em Marketing",
    period: "2022–2024",
    description:
      "Base estratégica para integrar SEO, marca e performance em operações de aquisição e retenção de clientes.",
  },
];

const faqs = [
  {
    question: "Como Fernando Souza atua em projetos de SEO e crescimento digital?",
    answer:
      "A atuação combina diagnóstico técnico, estratégia de conteúdo, melhoria de conversão e execução orientada por dados para gerar crescimento orgânico sustentável.",
  },
  {
    question: "Para quais tipos de empresas a consultoria é indicada?",
    answer:
      "Empresas que precisam escalar aquisição de clientes, fortalecer autoridade de marca e estruturar presença digital com previsibilidade de resultados.",
  },
  {
    question: "Qual o diferencial da abordagem da Winove?",
    answer:
      "Integração entre SEO, posicionamento digital, marketing de performance e gestão estratégica, com foco em legado, evolução contínua e impacto real no negócio.",
  },
];

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Fernando Souza",
  jobTitle: "CEO, CMO, Consultor, Professor e Especialista em SEO",
  description:
    "Empreendedor, estrategista digital e fundador da Winove.online, com atuação em SEO, posicionamento digital e crescimento orientado por dados.",
  url: "https://www.winove.com.br/sobre-fernando-souza",
  knowsAbout: ["SEO", "Posicionamento digital", "Growth", "Marketing digital", "Inovação"],
  alumniOf: ["NEXT MBA", "University of California, Davis", "Harvard University", "University of Virginia"],
  worksFor: [
    { "@type": "Organization", name: "Winove Online", url: "https://www.winove.com.br/" },
    { "@type": "Organization", name: "OMSA - Organização Multidisciplinar de Saúde Aplicada" },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://www.winove.com.br/" },
    { "@type": "ListItem", position: 2, name: "Sobre Fernando Souza", item: "https://www.winove.com.br/sobre-fernando-souza" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function SobreFernandoSouza() {
  return (
    <>
      <SEO
        title="Fernando Souza | Especialista em SEO, Inovação e Estratégia Digital"
        description="Conheça Fernando Souza: empreendedor, professor de MBA, especialista em SEO e fundador da Winove.online. Mais de 1.000 negócios com atuação internacional em criação e crescimento digital."
        canonical="https://www.winove.com.br/sobre-fernando-souza"
        jsonLd={[personJsonLd, breadcrumbJsonLd, faqJsonLd]}
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <section className="section--first pb-8" aria-label="breadcrumb">
          <div className="container mx-auto px-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <span className="mx-2">/</span>
            <span>Sobre Fernando Souza</span>
          </div>
        </section>

        <section className="pb-12" aria-labelledby="sobre-fernando-title">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] items-start">
              <Card className="border-primary/30 shadow-sm">
                <CardContent className="pt-8">
                  <Badge variant="secondary" className="mb-4">Sobre Fernando Souza</Badge>
                  <h1 id="sobre-fernando-title" className="text-3xl md:text-5xl font-bold tracking-tight">
                    Innovation | MBA Professor | SEO Specialist | CEO, CMO, Board Member, Consultant e Speaker
                  </h1>
                  <p className="mt-6 text-lg text-muted-foreground">
                    Empreendedor, estrategista digital e engenheiro de mundos em constante construção. Ao longo da trajetória,
                    participei da construção e aceleração de mais de 100 negócios, transformando presença digital em crescimento real.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Acredito que negócios, carreiras e vidas são construídos como projetos: com visão, estratégia, ajustes e evolução contínua.
                    Meu trabalho une tecnologia, marketing e execução prática para gerar resultados consistentes e impacto duradouro.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
                      <Button size="lg">Falar com Fernando</Button>
                    </a>
                    <Link to="/servicos">
                      <Button size="lg" variant="outline">Conhecer serviços de SEO</Button>
                    </Link>
                    <Link to="/cases">
                      <Button size="lg" variant="ghost" className="underline-offset-4 hover:underline">Ver cases de crescimento</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Destaques profissionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border/50 p-4">
                    <p className="text-2xl font-bold">+1.000</p>
                    <p className="text-sm text-muted-foreground">negócios na criação e aceleração</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4">
                    <p className="text-2xl font-bold">+10 países</p>
                    <p className="text-sm text-muted-foreground">de atuação internacional em negócios</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4">
                    <p className="text-2xl font-bold">SEO forte</p>
                    <p className="text-sm text-muted-foreground">especialização aplicada para crescimento orgânico</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10" aria-labelledby="proposta-valor">
          <h2 id="proposta-valor" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Como gero crescimento digital sustentável</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Target className="h-5 w-5" /> Posicionamento digital</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Estratégias para fortalecer autoridade de marca e presença orgânica no Google.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><LineChart className="h-5 w-5" /> SEO orientado por dados</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Diagnóstico técnico, otimização de conteúdo e decisões baseadas em métricas de performance.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-5 w-5" /> Inovação aplicada</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Combinação de marketing, tecnologia e processos para acelerar crescimento real e previsível.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Users className="h-5 w-5" /> Mentoria e consultoria</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Apoio para empresas e profissionais que buscam evolução estratégica com execução prática.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><BriefcaseBusiness className="h-5 w-5" /> Liderança executiva</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Atuação como CEO, CMO e conselheiro, construindo operações com visão de longo prazo.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5" /> Educação e legado</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Professor de MBA e speaker, compartilhando conhecimento para gerar impacto em pessoas e negócios.</CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10" aria-labelledby="metodologia-seo-crescimento">
          <h2 id="metodologia-seo-crescimento" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Metodologia de SEO e estratégia de crescimento</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" /> Diagnóstico técnico e semântico para identificar gargalos de ranqueamento.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" /> Planejamento editorial orientado por intenção de busca e jornada de compra.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" /> Otimização contínua de conteúdo, autoridade e conversão para gerar receita recorrente.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" /> Monitoramento de KPIs estratégicos: tráfego orgânico qualificado, leads e crescimento de marca.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 py-10" aria-labelledby="experiencia-profissional">
          <h2 id="experiencia-profissional" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Experiência profissional</h2>
          <div className="space-y-4">
            {experiences.map((item) => (
              <Card key={`${item.company}-${item.role}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.role} — {item.company}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Período:</strong> {item.period}</p>
                  <p><strong>Local:</strong> {item.location}</p>
                  <p>{item.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10" aria-labelledby="formacao-academica">
          <h2 id="formacao-academica" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Formação acadêmica e certificações</h2>
          <div className="grid gap-4 lg:grid-cols-3 mb-6">
            {seoEducationHighlights.map((item) => (
              <Card key={`${item.title}-${item.focus}`} className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg leading-tight">{item.focus}</CardTitle>
                  <p className="text-sm font-medium text-primary">{item.title} • {item.period}</p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.description}</CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demais formações e certificações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
                {education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 py-10 pb-20" aria-labelledby="faq-fernando-souza">
          <h2 id="faq-fernando-souza" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Perguntas frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{faq.answer}</CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
