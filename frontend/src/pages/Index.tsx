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
        title="Winove - Soluções Criativas e Resultados Reais"
        description="A Winove entrega soluções digitais que transformam negócios. Descubra nossos cases de sucesso, serviços e portfólio."
        canonical="https://www.winove.com.br/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Início - Winove",
          url: "https://www.winove.com.br/",
        }}
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
