import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/lib/seo";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  Cloud,
  FileCheck,
  FileDigit,
  FileSearch,
  FolderKanban,
  Lock,
  Mail,
  PhoneCall,
  QrCode,
  Scan,
  ShieldCheck,
  Signature,
  Upload,
  Workflow,
  MessageCircle,
} from "lucide-react";

const whatsappHref =
  "https://api.whatsapp.com/send?phone=5519982403845&text=Olá! Quero uma demonstração do sistema de gestão documental para minha empresa.";

const SistemaGestaoDocumental = () => {
  const diferenciais = [
    {
      icon: FileDigit,
      title: "Centralização inteligente",
      description:
        "Reúna PDFs, imagens, contratos, e-mails, planilhas e outros arquivos em um único ambiente seguro.",
    },
    {
      icon: Scan,
      title: "Captura e digitalização sem limitações",
      description:
        "Digitalize e importe documentos com indexação assistida por IA, reduzindo tarefas manuais e retrabalho.",
    },
    {
      icon: Cloud,
      title: "ECM em nuvem para equipes distribuídas",
      description:
        "Acesse tudo pelo navegador, com segurança e disponibilidade 24/7, sem depender de infraestrutura local complexa.",
    },
    {
      icon: Workflow,
      title: "Fluxos automatizados",
      description:
        "Crie regras de aprovação, roteamento, carimbo automático, alertas por e-mail e lembretes de pendências.",
    },
  ];

  const recursos = [
    {
      icon: FileSearch,
      title: "Busca avançada e OCR",
      text: "Encontre documentos em segundos com leitura de texto digitado e manuscrito.",
    },
    {
      icon: Bot,
      title: "Automação com IA",
      text: "Reconhecimento de documentos estruturados e não estruturados para acelerar o cadastro.",
    },
    {
      icon: QrCode,
      title: "Leitura de código de barras e QR Code",
      text: "Classificação e indexação mais rápidas para processos operacionais e fiscais.",
    },
    {
      icon: Signature,
      title: "Formulários eletrônicos e assinatura",
      text: "Monte formulários com fluxo automático de aprovação e assinatura eletrônica.",
    },
    {
      icon: ShieldCheck,
      title: "Segurança, retenção e rastreabilidade",
      text: "Controle de permissão, check-in/check-out, histórico de versões e políticas de retenção.",
    },
    {
      icon: BarChart3,
      title: "Relatórios e visibilidade",
      text: "Acompanhe produtividade, gargalos e indicadores para decisões mais rápidas.",
    },
  ];

  return (
    <>
      <SEO
        title="Sistema de Gestão Documental (ECM) em Nuvem | Winove"
        description="Organize, digitalize, localize e automatize documentos da sua empresa em uma única plataforma. ECM em nuvem com segurança, OCR, workflows e relatórios."
        canonical="https://www.winove.com.br/sistema-gestao-documental"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Sistema de Gestão Documental em Nuvem",
          provider: { "@type": "Organization", name: "Winove" },
          areaServed: "Brasil",
          serviceType: "Enterprise Content Management (ECM)",
          url: "https://www.winove.com.br/sistema-gestao-documental",
        }}
      />

      <div className="min-h-screen bg-background text-foreground">

        <section className="section--first px-4 pb-14 pt-[calc(var(--header-h)+1.5rem)] md:pt-[calc(var(--header-h)+2.5rem)] bg-gradient-to-br from-[#030712] via-[#071226] to-[#02050b]">

          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-8 lg:gap-12 items-center">
              <div className="space-y-6 md:space-y-7">
                <Badge className="px-4 py-2 w-fit">ECM para empresas</Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                  Gestão Documental
                  <span className="block text-primary">Rápida, Segura e Escalável</span>
                </h1>
                <p className="text-lg md:text-xl text-white/85 max-w-2xl">
                  Centralize, digitalize, pesquise, automatize e acompanhe resultados
                  em uma única plataforma de <strong>Enterprise Content Management</strong>.
                </p>
                <p className="text-base md:text-lg text-white/70 max-w-2xl">
                  Chega de arquivos espalhados em pastas, e-mails e servidores diferentes.
                  Sua equipe ganha velocidade para encontrar documentos, aprovar processos
                  e manter conformidade com muito mais controle.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="btn-primary w-full sm:w-auto">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Solicitar demonstração
                    </Button>
                  </a>
                  <a href="tel:+5519982403845">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      <PhoneCall className="w-5 h-5 mr-2" />
                      Falar com especialista
                    </Button>
                  </a>
                </div>
              </div>

              <Card className="bg-black/35 border-white/15 backdrop-blur-sm shadow-xl shadow-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-white">Por que as empresas escolhem ECM?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-5 text-white/90">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-primary" />
                      <span>Redução de até 80% no tempo de cadastro e localização de informações</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-primary" />
                      <span>Custos previsíveis sem cobranças por clique ou por página escaneada</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-primary" />
                      <span>Processos auditáveis com trilha de ações, versões e governança documental</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-primary" />
                      <span>Mais produtividade para equipes administrativas, financeiras e operacionais</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Uma plataforma completa para o ciclo de vida do documento
              </h2>
              <p className="text-lg text-muted-foreground">
                Da captura ao relatório, a sua operação documental fica centralizada,
                rastreável e pronta para crescer com segurança.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {diferenciais.map((item) => (
                <Card key={item.title} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <item.icon className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Recursos para criar um escritório digital de alta performance
              </h2>
              <p className="text-lg text-muted-foreground mb-10 text-center">
                Ferramentas práticas para organizar demandas, aumentar qualidade e acelerar decisões.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recursos.map((recurso) => (
                  <Card key={recurso.title} className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <recurso.icon className="w-5 h-5 text-primary" />
                        {recurso.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">{recurso.text}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Veja a plataforma em ação</h2>
                <p className="text-muted-foreground mb-6">
                  Assista ao vídeo comercial para conhecer como a solução funciona na prática,
                  desde a captura até a automação de processos e colaboração entre equipes.
                </p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><FolderKanban className="w-4 h-4 text-primary" /> Compartilhamento e colaboração entre áreas</p>
                  <p className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-primary" /> Controle de qualidade e redução de erros</p>
                  <p className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Segurança e conformidade em todo o fluxo</p>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Notificações automáticas para tarefas e aprovações</p>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <video
                    className="w-full rounded-lg"
                    controls
                    preload="metadata"
                    poster="https://www.winove.com.br/favicon.png"
                  >
                    <source
                      src="https://www.dokmee.com/wp-content/uploads/2025/11/dokmee_video_1440x760_workflow.mp4"
                      type="video/mp4"
                    />
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para modernizar a gestão documental da sua empresa?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Solicite uma conversa com nosso time e receba uma proposta personalizada
              para o seu cenário, com implantação orientada e foco em resultado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="btn-primary px-8 py-6 text-base w-full sm:w-auto">
                  Solicitar orçamento
                </Button>
              </a>
              <a href="mailto:contato@winove.com.br">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base w-full sm:w-auto">
                  Enviar e-mail
                </Button>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SistemaGestaoDocumental;
