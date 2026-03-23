import { Link } from "react-router-dom";
import { Services as ServicesSection } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";

const ServicesPage = () => {
  return (
    <>
      <SEO
        title="Serviços Digitais | Criação de Sites, SEO, Automação e IA – Winove"
        description="Criação de sites profissionais no Wix Studio, SEO, automação com IA, CRM WhatsApp, e-mail corporativo e gestão documental. Transforme sua operação digital com a Winove."
        canonical="https://www.winove.com.br/servicos"
        keywords={["criação de sites wix studio", "agência digital são paulo", "automação de marketing", "CRM whatsapp", "seo profissional", "email corporativo"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://www.winove.com.br/servicos#webpage",
            name: "Serviços Digitais – Winove",
            url: "https://www.winove.com.br/servicos",
            isPartOf: { "@id": "https://www.winove.com.br/#website" },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://www.winove.com.br/" },
                { "@type": "ListItem", position: 2, name: "Serviços", item: "https://www.winove.com.br/servicos" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Serviços da Winove",
            itemListElement: [
              {
                "@type": "ListItem", position: 1,
                item: { "@type": "Service", name: "Criação de Sites Profissionais", description: "Desenvolvimento de sites no Wix Studio com design moderno, SEO e alta performance.", url: "https://www.winove.com.br/servicos", provider: { "@id": "https://www.winove.com.br/#organization" } },
              },
              {
                "@type": "ListItem", position: 2,
                item: { "@type": "Service", name: "Templates Wix Studio", description: "Templates profissionais prontos para customização e lançamento rápido.", url: "https://www.winove.com.br/templates", provider: { "@id": "https://www.winove.com.br/#organization" } },
              },
              {
                "@type": "ListItem", position: 3,
                item: { "@type": "Service", name: "E-mail Corporativo", description: "Contas de e-mail profissional com antivírus, antispam e domínio próprio.", url: "https://www.winove.com.br/email-corporativo", provider: { "@id": "https://www.winove.com.br/#organization" } },
              },
              {
                "@type": "ListItem", position: 4,
                item: { "@type": "Service", name: "CRM WhatsApp com IA", description: "Atendimento multiusuário, chatbot, automações e CRM integrado ao WhatsApp.", url: "https://www.winove.com.br/chat-whatsapp", provider: { "@id": "https://www.winove.com.br/#organization" } },
              },
              {
                "@type": "ListItem", position: 5,
                item: { "@type": "Service", name: "Gestão Documental", description: "Sistema ECM em nuvem para organizar, assinar e automatizar documentos.", url: "https://www.winove.com.br/sistema-gestao-documental", provider: { "@id": "https://www.winove.com.br/#organization" } },
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Quais serviços a Winove oferece?", acceptedAnswer: { "@type": "Answer", text: "A Winove oferece criação de sites no Wix Studio, templates profissionais, e-mail corporativo, CRM WhatsApp com IA, gestão documental e cursos online." } },
              { "@type": "Question", name: "A Winove atende empresas de qualquer segmento?", acceptedAnswer: { "@type": "Answer", text: "Sim. Atendemos clínicas, varejo, imobiliárias, escritórios, indústrias, startups e agências em todo o Brasil." } },
              { "@type": "Question", name: "Como solicitar um orçamento?", acceptedAnswer: { "@type": "Answer", text: "Você pode solicitar um orçamento via WhatsApp pelo número +55 19 98240-3845 ou pela página de proposta em winove.com.br/comercial-propostas." } },
            ],
          },
        ]}
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
      </div>
    </>
  );
};

export default ServicesPage;
