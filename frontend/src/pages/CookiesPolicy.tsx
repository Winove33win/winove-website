import { Footer } from "@/components/Footer";
import { SEO } from "@/lib/seo";

interface CookieType {
  name: string;
  description: string;
  example: string;
}

const cookieTypes: CookieType[] = [
  {
    name: "Essenciais",
    description:
      "Permitem que o site funcione corretamente, garantindo recursos como autenticação, segurança e preenchimento de formulários.",
    example: "Cookies de sessão utilizados para lembrar o estado do navegador durante a navegação.",
  },
  {
    name: "Analíticos",
    description:
      "Coletam dados estatísticos de forma agregada para entendermos o desempenho das páginas, tempo de permanência e caminhos percorridos.",
    example: "Google Analytics, Meta Pixel e ferramentas próprias de mensuração.",
  },
  {
    name: "Marketing",
    description:
      "Ajudam a entregar anúncios relevantes e personalizar campanhas em redes sociais ou plataformas de mídia programática.",
    example: "Cookies de remarketing utilizados em campanhas no Google Ads e LinkedIn Ads.",
  },
  {
    name: "Funcionais",
    description:
      "Memorizam preferências como idioma, versão acessível e histórico de downloads para melhorar sua experiência.",
    example: "Cookies que lembram se o usuário fechou um pop-up ou preferiu visualizar a versão em Libras.",
  },
];

const CookiesPolicy = () => {
  return (
    <>
      <SEO
        title="Política de Cookies | Winove"
        description="Entenda como utilizamos cookies para oferecer uma experiência personalizada, segura e alinhada às melhores práticas de privacidade."
        canonical="https://www.winove.com.br/politica-de-cookies"
      />
      <div className="min-h-screen bg-background text-foreground">
        <section className="py-20 px-4 bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="uppercase tracking-[0.4em] text-xs text-primary font-semibold mb-4">Preferências digitais</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Cookies</h1>
            <p className="text-lg text-muted-foreground">
              Explicamos quais tecnologias usamos para coletar dados de navegação e como você pode gerenciar suas preferências.
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-10">
            <article className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-3">O que são cookies?</h2>
              <p className="text-muted-foreground">
                Cookies são pequenos arquivos instalados no seu dispositivo ao visitar nossas páginas. Eles registram informações de navegação para tornar o uso do site mais eficiente, seguro e personalizado.
              </p>
            </article>

            <article className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm space-y-6">
              <h2 className="text-2xl font-semibold">Categorias utilizadas</h2>
              <div className="space-y-6">
                {cookieTypes.map((cookie) => (
                  <div key={cookie.name} className="p-5 rounded-2xl bg-secondary/50">
                    <h3 className="text-xl font-semibold">{cookie.name}</h3>
                    <p className="text-muted-foreground mb-2">{cookie.description}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Exemplos:</span> {cookie.example}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-semibold mb-3">Gerenciamento de preferências</h2>
              <p className="text-muted-foreground mb-3">
                Ao continuar navegando você concorda com o uso dos cookies descritos. Caso deseje, é possível ajustar as permissões diretamente no seu navegador (Chrome, Firefox, Safari, Edge) ou utilizar ferramentas como o modo anônimo.
              </p>
              <p className="text-muted-foreground">
                Também disponibilizamos canais de atendimento para solicitar a exclusão de dados coletados por meio dessas tecnologias: envie um e-mail para
                <span className="font-semibold text-primary"> privacidade@winove.com.br</span> e retornaremos rapidamente.
              </p>
            </article>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CookiesPolicy;
