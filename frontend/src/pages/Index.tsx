import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { ChatWhatsappPromo } from "@/components/ChatWhatsappPromo";
import { TemplatesCarousel } from "@/components/TemplatesCarousel";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { SEO } from "@/lib/seo";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();

  return (
    <>
      <SEO
        title="Winove – Agência Digital: Sites, Automação, CRM e IA"
        description="A Winove cria sites profissionais, automatiza processos e integra IA ao seu negócio. Mais de 500 projetos entregues. Parceiro oficial Wix Studio."
        canonical="https://www.winove.com.br/"
        keywords={["agência digital", "criação de sites", "wix studio", "automação", "CRM WhatsApp", "SEO", "templates wix"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://www.winove.com.br/#webpage",
            name: "Início – Winove Agência Digital",
            url: "https://www.winove.com.br/",
            description: "Agência digital especializada em criação de sites, automação, CRM WhatsApp e IA.",
            isPartOf: { "@id": "https://www.winove.com.br/#website" },
            about: { "@id": "https://www.winove.com.br/#organization" },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: "https://www.winove.com.br/" }],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.winove.com.br/#localbusiness",
            name: "Winove",
            image: "https://www.winove.com.br/imagem-de-compartilhamento.png",
            url: "https://www.winove.com.br",
            telephone: "+55-19-98240-3845",
            email: "criacao@winove.com.br",
            priceRange: "$$",
            currenciesAccepted: "BRL",
            paymentAccepted: "Cartão de crédito, Pix, Boleto",
            address: {
              "@type": "PostalAddress",
              addressLocality: "São Paulo",
              addressRegion: "SP",
              addressCountry: "BR",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "40",
              bestRating: "5",
              worstRating: "1",
            },
            sameAs: ["https://www.instagram.com/winove", "https://www.linkedin.com/company/winove"],
          },
        ]}
      />
      <div className="min-h-screen bg-background text-foreground font-inter">
        <Hero />
        <Stats />
        <Services />
        <About />
        <ChatWhatsappPromo />
        <TemplatesCarousel />
        <Testimonials />
        <CTA />
      </div>
    </>
  );
};

export default Index;
