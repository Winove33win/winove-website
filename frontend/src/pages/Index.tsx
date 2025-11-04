import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Testimonials } from "@/components/Testimonials";
import { Blog } from "@/components/Blog";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchTemplate } from '@/lib/api';
import { SEO } from "@/lib/seo";

const Index = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const { data } = useQuery({
    queryKey: ['template', 'home-hero'],
    queryFn: () => fetchTemplate('home-hero'),
    enabled: isHome,
  });

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
        <Hero heading={data?.heading} subheading={data?.subheading} />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Blog />
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;

