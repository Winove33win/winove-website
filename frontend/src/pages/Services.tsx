import { Link } from "react-router-dom";
import { Services as ServicesSection } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";

const ServicesPage = () => {
  return (
    <>
      <SEO
        title="Serviços | Winove"
        description="Conheça os serviços da Winove para acelerar sua presença digital com estratégia, tecnologia e design."
        canonical="https://www.winove.com.br/servicos"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Serviços Winove",
          url: "https://www.winove.com.br/servicos",
        }}
      />
      <div className="min-h-screen bg-background text-foreground">
        <section className="section--first pb-16 bg-gradient-navy relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
              Soluções Winove
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Serviços que transformam a sua operação digital
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Unimos estratégia, tecnologia e design para criar experiências digitais
              completas. Explore as nossas frentes de atuação e descubra o caminho
              ideal para o seu crescimento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/comercial-propostas">
                <Button className="btn-primary px-8 py-6 text-base">
                  Solicitar proposta
                </Button>
              </Link>
              <a
                href="https://api.whatsapp.com/send?phone=5519982403845"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="px-8 py-6 text-base">
                  Falar com um especialista
                </Button>
              </a>
            </div>
          </div>
        </section>

        <ServicesSection />
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;
