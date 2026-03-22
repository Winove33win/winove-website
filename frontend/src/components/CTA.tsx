import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export const CTA = () => (
  <section id="contact" className="py-24 bg-background relative overflow-hidden">
    {/* Ambient glow */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-primary/8 rounded-full blur-[140px]" />
    </div>

    {/* Top divider */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

    {/* Dot grid */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "radial-gradient(hsl(210 40% 98%) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center reveal-on-scroll">
        <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-5">
          Próximo passo
        </p>

        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          <span className="text-foreground">Seu negócio precisa de</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/60 bg-clip-text text-transparent">
            estrutura, não só de site.
          </span>
        </h2>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Fale com a Winove e descubra qual solução faz mais sentido para o
          momento atual do seu negócio.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://api.whatsapp.com/send?phone=5519982403845"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="btn-primary text-lg px-10 py-6 gap-2 animate-glow w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Falar com a Winove
            </Button>
          </a>
          <a href="/cases">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 gap-2 border-white/15 text-foreground hover:bg-white/5 hover:border-primary/40 transition-all duration-300 w-full sm:w-auto"
            >
              Ver cases de sucesso
              <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>

        {/* Social proof strip */}
        <div className="mt-14 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          {[
            "Sem fidelidade obrigatória",
            "Entrega dentro do prazo",
            "Suporte pós-entrega incluído",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
