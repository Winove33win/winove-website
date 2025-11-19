import { Footer } from "@/components/Footer";
import { SEO } from "@/lib/seo";

interface PolicySection {
  title: string;
  description: string;
  items?: string[];
}

const sections: PolicySection[] = [
  {
    title: "Informações que coletamos",
    description:
      "Coletamos somente os dados necessários para prestar nossos serviços de marketing digital, desenvolvimento e consultoria.",
    items: [
      "Dados de contato como nome, e-mail, telefone e cargo",
      "Informações comerciais fornecidas em formulários, reuniões ou contratos",
      "Dados de navegação coletados via cookies e pixels para mensuração de campanhas",
      "Histórico de interações com nossos canais de atendimento",
    ],
  },
  {
    title: "Como usamos seus dados",
    description:
      "Utilizamos as informações para responder solicitações, enviar propostas personalizadas e aprimorar a experiência com nossos produtos e serviços.",
    items: [
      "Elaboração de diagnósticos, planos de marketing e relatórios",
      "Envio de comunicações institucionais, newsletters e convites",
      "Cumprimento de obrigações contratuais e legais",
      "Monitoramento de segurança e prevenção a fraudes",
    ],
  },
  {
    title: "Compartilhamento e armazenamento",
    description:
      "Seus dados são armazenados em ambientes seguros e podem ser compartilhados apenas com parceiros estratégicos que nos auxiliam na operação de campanhas, sempre respeitando esta política e a LGPD.",
  },
  {
    title: "Base legal",
    description:
      "Tratamos dados com fundamento em consentimento, execução de contrato, legítimo interesse ou cumprimento de obrigação legal/regulatória.",
  },
];

const rights = [
  "Confirmar a existência de tratamento",
  "Acessar, corrigir ou atualizar dados",
  "Solicitar anonimização, bloqueio ou eliminação",
  "Revogar consentimento e limitar o uso",
  "Portar seus dados para outro fornecedor",
];

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Política de Privacidade | Winove"
        description="Saiba como a Winove trata dados pessoais, quais informações coletamos e quais são seus direitos conforme a LGPD."
        canonical="https://www.winove.com.br/politica-de-privacidade"
      />
      <div className="min-h-screen bg-background text-foreground">
        <section className="py-20 px-4 bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="uppercase tracking-[0.4em] text-xs text-primary font-semibold mb-4">
              Transparência
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-lg text-muted-foreground">
              A proteção dos seus dados pessoais é prioridade. Esta página detalha como coletamos, usamos e
              armazenamos informações de clientes, leads e parceiros.
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-12">
            {sections.map((section) => (
              <article key={section.title} className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                {section.items && (
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            <article className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-3">Seus direitos</h2>
              <p className="text-muted-foreground mb-4">
                De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode exercer os seguintes direitos a qualquer momento:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                {rights.map((right) => (
                  <li key={right} className="bg-secondary/50 rounded-xl px-4 py-3">
                    {right}
                  </li>
                ))}
              </ul>
            </article>

            <article className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-semibold mb-3">Canal do titular</h2>
              <p className="text-muted-foreground mb-4">
                Para dúvidas ou solicitações envolvendo seus dados pessoais, envie um e-mail para
                <span className="font-semibold text-primary"> privacidade@winove.com.br</span> ou entre em contato pelo telefone (19) 98240-3845.
              </p>
              <p className="text-sm text-muted-foreground">
                Atualizamos esta política sempre que surgem novos processos ou requisitos legais. Consulte-a regularmente para manter-se informado.
              </p>
            </article>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
