import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section id="hero" className="section--first px-4 pb-16 group min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary/15 rounded-full blur-xl animate-glow" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 animate-fade-in-up leading-tight transition-transform duration-300 group-hover:scale-[1.02]">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Transformamos sites, automações e inteligência artificial em estrutura real de crescimento para o seu negócio.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Da presença digital à operação com sistemas e IA, a Winove constrói soluções sob medida para empresas que querem vender mais, organizar processos e crescer com tecnologia.
          </p>

          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-primary text-lg px-12 py-6">
                Quero entender a melhor solução
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
