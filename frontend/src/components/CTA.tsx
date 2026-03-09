import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-8 md:p-12 glow-soft">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Seu negócio não precisa apenas de um site.
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Precisa de uma estrutura digital que venda, organize e cresça com você.
            </p>

            <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-primary text-xl px-12 py-6 animate-glow">
                Falar com a Winove
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
