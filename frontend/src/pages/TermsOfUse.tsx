import { Footer } from "@/components/Footer";
import { SEO } from "@/lib/seo";

interface TermSection {
  title: string;
  content: string;
}

const sections: TermSection[] = [
  {
    title: "Aceitação dos termos",
    content:
      "Ao acessar o site da Winove ou contratar nossos serviços, você declara ter lido, compreendido e concordado com todas as condições descritas nesta página.",
  },
  {
    title: "Uso permitido",
    content:
      "Você se compromete a utilizar nossas páginas e materiais apenas para fins legítimos, respeitando a legislação brasileira, os direitos de terceiros e as políticas de segurança aplicáveis.",
  },
  {
    title: "Propriedade intelectual",
    content:
      "Todo conteúdo, marca, layout, textos, imagens, ilustrações e códigos disponibilizados pertencem à Winove ou aos parceiros devidamente autorizados. É proibido reproduzir, distribuir ou modificar qualquer ativo sem autorização prévia por escrito.",
  },
  {
    title: "Contratações e pagamentos",
    content:
      "Os serviços apresentados no site podem exigir proposta comercial. Os pagamentos são processados conforme o contrato firmado com o cliente e podem envolver gateways externos, respeitando seus próprios termos e políticas de segurança.",
  },
  {
    title: "Limitação de responsabilidade",
    content:
      "A Winove envida seus melhores esforços para manter o site atualizado e seguro, porém não se responsabiliza por indisponibilidades temporárias, erros de digitação ou danos indiretos causados pelo uso das informações aqui apresentadas.",
  },
  {
    title: "Atualizações deste documento",
    content:
      "Podemos atualizar estes termos a qualquer momento para refletir mudanças legais, tecnológicas ou de negócio. A versão vigente sempre será a publicada neste endereço, com a indicação de data de revisão.",
  },
];

const TermsOfUse = () => {
  return (
    <>
      <SEO
        title="Termos de Uso | Winove"
        description="Conheça as regras para utilização do site, contratações e direitos de propriedade intelectual da Winove."
        canonical="https://www.winove.com.br/termos-de-uso"
      />
      <div className="min-h-screen bg-background text-foreground">
        <section className="py-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="uppercase tracking-[0.4em] text-xs text-primary font-semibold mb-4">Condições gerais</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-lg text-muted-foreground">
              Este documento descreve como você pode utilizar nossos conteúdos e serviços digitais de forma segura e transparente.
            </p>
            <p className="text-sm text-muted-foreground mt-4">Última atualização: Março/2024</p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            {sections.map((section) => (
              <article key={section.title} className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </article>
            ))}

            <article className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-semibold mb-3">Contato</h2>
              <p className="text-muted-foreground">
                Em caso de dúvidas sobre estes termos ou para solicitar autorizações, envie um e-mail para
                <span className="font-semibold text-primary"> legal@winove.com.br</span> ou fale conosco no WhatsApp (19) 98240-3845.
              </p>
            </article>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfUse;
