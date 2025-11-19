import { Footer } from "@/components/Footer";
import { SEO } from "@/lib/seo";

const steps = [
  {
    title: "Envie a solicitação",
    description:
      "Preencha o formulário ou envie um e-mail para privacidade@winove.com.br informando que deseja excluir seus dados pessoais e qual relacionamento possui com a Winove.",
  },
  {
    title: "Validação do titular",
    description:
      "Respondemos solicitando informações adicionais para confirmar sua identidade e garantir que apenas o titular legítimo tenha acesso ao pedido.",
  },
  {
    title: "Análise e execução",
    description:
      "Após a validação, iniciamos a exclusão ou anonimização dos registros em nossos sistemas próprios e parceiros, respeitando obrigações legais ou contratuais.",
  },
];

const exceptions = [
  "Cumprimento de obrigações legais ou regulatórias",
  "Prevenção a fraudes e segurança das nossas operações",
  "Exigências contratuais ainda vigentes com clientes ou parceiros",
  "Defesa de direitos em processos judiciais ou administrativos",
];

const channels = [
  {
    label: "E-mail dedicado",
    value: "privacidade@winove.com.br",
  },
  {
    label: "Telefone/WhatsApp",
    value: "(19) 98240-3845",
  },
  {
    label: "Formulário",
    value: "https://winove.com.br/excluir-dados",
  },
];

const DataDeletion = () => {
  return (
    <>
      <SEO
        title="Excluir Dados | Winove"
        description="Saiba como solicitar a exclusão ou anonimização dos seus dados pessoais tratados pela Winove, em conformidade com a LGPD."
        canonical="https://www.winove.com.br/excluir-dados"
      />
      <div className="min-h-screen bg-background text-foreground">
        <section className="py-20 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="uppercase tracking-[0.4em] text-xs text-primary font-semibold mb-4">Proteção de Dados</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Solicitação de Exclusão</h1>
            <p className="text-lg text-muted-foreground">
              Criamos este canal exclusivo para titulares que desejam exercer o direito de exclusão previsto na LGPD e exigido por parceiros como o Meta.
            </p>
            <p className="text-sm text-muted-foreground mt-4">Última atualização: Março/2024</p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-10">
            <article className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Como funciona</h2>
              <p className="text-muted-foreground mb-6">
                Seguimos um fluxo interno para garantir que sua solicitação seja registrada, autenticada e respondida dentro do prazo legal de até 15 dias corridos.
              </p>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.title} className="bg-secondary/50 rounded-2xl p-5">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Quando não podemos excluir</h2>
              <p className="text-muted-foreground mb-4">
                Em alguns cenários, precisamos manter os dados por um período determinado. Nestes casos, explicaremos o fundamento legal e o tempo estimado de retenção.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                {exceptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-semibold mb-4">Canais oficiais</h2>
              <p className="text-muted-foreground mb-6">
                Utilize um dos canais abaixo para abrir seu protocolo. Sempre responda às mensagens de confirmação para que possamos concluir o atendimento.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {channels.map((channel) => (
                  <div key={channel.label} className="bg-background/80 rounded-2xl p-4 border border-border/40">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{channel.label}</p>
                    <p className="text-sm font-medium break-words">
                      {channel.label === "Formulário" ? (
                        <a href={channel.value} className="text-primary hover:underline" rel="noreferrer" target="_blank">
                          {channel.value}
                        </a>
                      ) : (
                        channel.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Transparência contínua</h2>
              <p className="text-muted-foreground">
                Após concluirmos a exclusão, enviaremos um comprovante com a data e os sistemas envolvidos. Caso tenha dúvidas adicionais ou queira exercer outros direitos, consulte nossa Política de Privacidade ou entre em contato com o DPO da Winove.
              </p>
            </article>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DataDeletion;
