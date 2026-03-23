import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/lib/seo";

const Promocoes = () => {
  const promotions = [
    {
      title: "Pacote com 5 contas de e-mail corporativo (3 GB)",
      description: "Assine 5 contas de e-mail corporativo com 3 GB cada por R$ 433 por ano.",
      link: "/email-corporativo",
    },
    {
      title: "Templates Wix Studio com 10% de desconto",
      description: "Modelos profissionais do Wix Studio com 10% de desconto.",
      link: "/templates",
    },
    {
      title: "Chat WhatsApp com 20% de desconto",
      description: "Economize 20% no plano anual do nosso Chat WhatsApp.",
      link: "/chat-whatsapp",
    },
  ];

  return (
    <>
      <SEO
        title="Promoções e ofertas | Winove"
        description="Ofertas vigentes de e-mail corporativo, templates Wix Studio e soluções omnichannel da Winove."
        canonical="https://www.winove.com.br/promocoes"
      />
        <div className="min-h-screen bg-background text-foreground">
          <section className="section--first pb-16 px-4">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Promoções do Mês
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Confira as ofertas especiais que preparamos para você.
              </p>
            </div>
            <div className="container mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promo) => (
                <Card key={promo.title} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{promo.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>{promo.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link to={promo.link}>
                      <Button className="btn-primary">Saiba mais</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

        </div>
    </>
  );
};

export default Promocoes;
