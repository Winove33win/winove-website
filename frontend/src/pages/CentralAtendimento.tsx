import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanSquare, Star, Zap } from "lucide-react";
import { SEO } from "@/lib/seo";

export function CentralAtendimento() {
  return (
      <>
      <SEO
        title="Central de Atendimento WhatsApp com Funil de Vendas | Winove"
        description="Gerencie todos os atendimentos do WhatsApp em um único painel kanban. Funil de vendas visual, automação de fluxos, métricas de SLA e relatórios em tempo real para sua equipe comercial."
        canonical="https://www.winove.com.br/central-atendimento"
        keywords={["central de atendimento whatsapp", "crm kanban", "funil de vendas whatsapp", "gestão de atendimento", "automação whatsapp", "central de conversas", "atendimento multiusuário"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.winove.com.br/central-atendimento#service",
            name: "Central de Atendimento WhatsApp com Funil de Vendas",
            description: "Painel kanban para gestão de atendimentos WhatsApp com automação de fluxos, funil de vendas visual e métricas em tempo real.",
            provider: {
              "@type": "Organization",
              name: "Winove",
              url: "https://www.winove.com.br",
            },
            serviceType: "Software de CRM e Atendimento",
            url: "https://www.winove.com.br/central-atendimento",
            areaServed: { "@type": "Country", name: "Brasil" },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "https://www.winove.com.br/" },
              { "@type": "ListItem", position: 2, name: "Central de Atendimento", item: "https://www.winove.com.br/central-atendimento" },
            ],
          },
        ]}
      />
      <div className="min-h-screen">
        <section className="section--first pb-16" aria-labelledby="central-hero">
          <div className="container mx-auto px-4">
            <Badge variant="secondary" className="mb-3">Central de Atendimento</Badge>
            <h1 id="central-hero" className="text-3xl md:text-5xl font-bold tracking-tight">Central de Conversas com funil</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Gerencie atendimentos em tempo real e automatize fluxos.
            </p>

            <Tabs defaultValue="abertos" className="mt-8">
              <TabsList className="grid w-full grid-cols-4 md:w-auto">
                <TabsTrigger value="abertos">Abertos</TabsTrigger>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                <TabsTrigger value="resolvidos">Resolvidos</TabsTrigger>
                <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
              </TabsList>
              <TabsContent value="abertos" className="mt-6 grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><KanbanSquare className="h-5 w-5" /> Gestão de Oportunidades</CardTitle>
                    <CardDescription>Visualização em kanban das conversas</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Acompanhe estágios, atribua responsáveis e registre atividades em cada oportunidade.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Avaliação de Atendimento</CardTitle>
                    <CardDescription>Feedback direto dos clientes</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Colete notas e comentários ao finalizar cada conversa.
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pendentes" className="mt-6 text-sm text-muted-foreground">
                <p>Conversas aguardando retorno ficam em evidência para garantir SLAs e prazos.</p>
              </TabsContent>
              <TabsContent value="resolvidos" className="mt-6 text-sm text-muted-foreground">
                <p>Histórico completo e exportação das conversas finalizadas.</p>
              </TabsContent>
              <TabsContent value="chatbot" className="mt-6 text-sm text-muted-foreground">
                <p>Automatize triagem e respostas com fluxos e IA integrados.</p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

      <section className="container mx-auto px-4 py-10" aria-labelledby="central-planos">
        <h2 id="central-planos" className="sr-only">Planos e valores</h2>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" /> Planos e valores</CardTitle>
            <CardDescription>Mínimo de 5 usuários por conta</CardDescription>
          </CardHeader>
          <CardContent className="text-sm md:text-base text-muted-foreground">
            <p><b>Base:</b> R$ 1.533/ano (plano anual para até 5 usuários).</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=5519982403845"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm">Solicitar integração</Button>
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=5519982403845"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline">Agendar treinamento</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
      </>
  );
}

export default CentralAtendimento;

