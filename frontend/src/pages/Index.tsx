import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { SEO } from "@/lib/seo";

const Index = () => {
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
        <Services />
        <About />
        <Portfolio />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;
