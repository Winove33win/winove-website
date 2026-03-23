import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail, Shield, Filter, Globe, Calendar, Users,
  CheckCircle, MessageSquare, Clock, FileText,
  Share2, Settings, Zap, Cloud, Smartphone,
  PhoneCall, MessageCircle
} from "lucide-react";
import { SEO } from "@/lib/seo";

const EmailCorporativo = () => {
  const features = [
    { icon: Shield, title: "Antivirus", description: "Varredura de todos os e-mails recebidos em busca de vírus, malware e outras pragas virtuais." },
    { icon: Filter, title: "AntiSpam", description: "3 níveis de filtragens (baixo, médio e alto), com regras pré definidas, crie a sua lista de remetentes confiáveis" },
    { icon: Globe, title: "Autenticação por Geo Localização", description: "Autenticação por blocos, previne que a sua conta seja acessada em outros países." },
    { icon: Calendar, title: "Calendário", description: "Organize os seus compromissos de maneira rápida e prática" },
    { icon: Users, title: "Contatos", description: "Gerencie todos os seus contatos profissionais, recursos de importar e exportar." },
    { icon: CheckCircle, title: "Tarefas", description: "Organize o seu dia a dia com este recurso" },
    { icon: FileText, title: "Notas", description: "Espaço reservado para suas ideias e informações relevantes" },
    { icon: MessageSquare, title: "Reuniões", description: "Não precisa instalar software, sem limite de tempo, faça suas reuniões com nossa tecnologia." },
  ];

  return (
    <>
      <SEO
        title="E-mail Corporativo Profissional | Winove"
        description="Contas a partir de 5 GB com Antivirus, Antispam com 3 níveis de filtragem, acesso por Webmail, POP e IMAP."
        canonical="https://www.winove.com.br/email-corporativo"
        keywords={["email corporativo profissional", "email com domínio próprio", "email empresarial", "email antispam antivírus", "webmail imap pop3"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.winove.com.br/email-corporativo#service",
            name: "E-mail Corporativo Profissional",
            description: "Contas de e-mail com domínio próprio, antivírus, antispam, calendário, contatos e reuniões integradas.",
            provider: { "@id": "https://www.winove.com.br/#organization" },
            areaServed: { "@type": "Country", name: "Brasil" },
            serviceType: "E-mail corporativo",
            url: "https://www.winove.com.br/email-corporativo",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Planos de E-mail Corporativo",
              itemListElement: [
                { "@type": "Offer", name: "Plano Inicial – 5 GB", description: "1 conta de e-mail com 5 GB", priceCurrency: "BRL", availability: "https://schema.org/InStock" },
                { "@type": "Offer", name: "Pacote 5 contas – 3 GB cada", description: "5 contas de e-mail com 3 GB cada por R$ 433/ano", price: "433.00", priceCurrency: "BRL", availability: "https://schema.org/InStock" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "https://www.winove.com.br/" },
              { "@type": "ListItem", position: 2, name: "E-mail Corporativo", item: "https://www.winove.com.br/email-corporativo" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Qual a diferença entre POP3 e IMAP?", acceptedAnswer: { "@type": "Answer", text: "IMAP sincroniza os e-mails em todos os dispositivos em tempo real. POP3 baixa os e-mails para um dispositivo local. Para uso corporativo, recomendamos IMAP." } },
              { "@type": "Question", name: "O e-mail corporativo tem antispam?", acceptedAnswer: { "@type": "Answer", text: "Sim. Nosso sistema possui 3 níveis de filtragem antispam (baixo, médio e alto), além de proteção antivírus em todos os e-mails recebidos." } },
              { "@type": "Question", name: "Posso usar meu próprio domínio?", acceptedAnswer: { "@type": "Answer", text: "Sim. O e-mail corporativo da Winove é configurado com o seu domínio (ex: voce@suaempresa.com.br)." } },
            ],
          },
        ]}
      />
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section
        id="hero"
        className="section--first min-h-[80vh] px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5"
      >
        <div className="container mx-auto text-center">
          <Badge className="mb-4 px-4 py-2">Email Profissional</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Tenha o seu E-mail Profissional
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Contas a partir de 5 GB com Antivirus, Antispam com 3 níveis de filtragem, 
            acesso por Webmail, POP e IMAP.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://api.whatsapp.com/send?phone=5519982403845&text=Olá! Gostaria de uma cotação para email corporativo." target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-primary">
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Cotação
              </Button>
            </a>
            <a href="tel:+5519982403845">
              <Button size="lg" variant="outline">
                <PhoneCall className="w-5 h-5 mr-2" />
                (19) 98240-3845
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-bold">Webmail Personalizado</div>
              <div className="text-sm text-muted-foreground">Com seu domínio e logo</div>
            </div>
            <div className="p-4">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-bold">Backup Diário</div>
              <div className="text-sm text-muted-foreground">Seus dados seguros</div>
            </div>
            <div className="p-4">
              <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-bold">Painel de Controle</div>
              <div className="text-sm text-muted-foreground">Gerenciamento completo</div>
            </div>
            <div className="p-4">
              <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-bold">Interface Moderna</div>
              <div className="text-sm text-muted-foreground">Leve e compatível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">O E-MAIL IDEAL PARA SEU NEGÓCIO</h2>
          <p className="text-center text-muted-foreground mb-12">Conheça todos recursos do e-mail corporativo</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* IMAP vs POP3 */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-6 h-6 text-primary" />
                  IMAP - Sincronização de Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Recomendamos a configuração IMAP por conta da sincronização das mensagens entre todos os seus dispositivos.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-sm">Sincronização entre dispositivos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm">Backup diário com retenção de 5 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-primary" />
                    <span className="text-sm">Dados seguros na nuvem</span>
                  </div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="font-medium">Configuração IMAP:</p>
                  <p className="text-sm">Entrada: imap.appuni.com.br - Porta 993 - SSL</p>
                  <p className="text-sm">Saída: smtp.appuni.com.br - Porta 465/587 - SSL</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  POP3 - Download Local
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O e-mail configurado como POP3 baixa as mensagens e limpa do servidor.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Baixa mensagens em um único dispositivo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">Opção de manter cópia por 14 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Recomendado backup local</span>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Atenção:</strong> Tenha uma rotina de backup para não correr o risco de perder suas mensagens.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para ter seu Email Profissional?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Entre em contato agora e solicite uma cotação personalizada para sua empresa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://api.whatsapp.com/send?phone=5519982403845&text=Olá! Gostaria de uma cotação para email corporativo." target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-primary">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp - Cotação Rápida
              </Button>
            </a>
            <a href="mailto:contato@winove.com.br">
              <Button size="lg" variant="outline">
                <Mail className="w-5 h-5 mr-2" />
                contato@winove.com.br
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
    </>
  );
};

export default EmailCorporativo;