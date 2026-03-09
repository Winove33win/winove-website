import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/lib/seo";
import {
  Bot,
  CalendarClock,
  Check,
  Cpu,
  Link as LinkIcon,
  MessagesSquare,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

const comparisonRows = [
  { normal: "1 atendente por número", profissional: "Atendimento WhatsApp multiusuário" },
  { normal: "Conversas perdidas e sem histórico", profissional: "Histórico completo por contato e equipe" },
  { normal: "Sem automação", profissional: "Chatbot, automações e IA" },
  { normal: "Sem funil comercial", profissional: "CRM WhatsApp com funil e métricas" },
];

const faqs = [
  {
    question: "O que é CRM para WhatsApp?",
    answer:
      "É uma plataforma que organiza contatos, histórico, tarefas e funil comercial para transformar o WhatsApp em canal profissional de atendimento e vendas.",
  },
  {
    question: "Como funciona a automação no WhatsApp?",
    answer:
      "Você cria fluxos com regras de horário, palavras-chave, qualificação de leads e distribuição automática para equipe, reduzindo tempo de resposta.",
  },
  {
    question: "Posso usar com vários atendentes?",
    answer:
      "Sim. A solução permite múltiplos atendentes no mesmo número, com permissões, filas e auditoria de atividades.",
  },
  {
    question: "A integração com API do WhatsApp é oficial?",
    answer:
      "A Winove trabalha com integração via API para garantir estabilidade, escalabilidade e operação profissional para empresas.",
  },
  {
    question: "Posso integrar com ChatGPT e outros modelos de IA?",
    answer:
      "Sim. É possível integrar com ChatGPT, Claude, Gemini e outros conectores para automações e respostas inteligentes.",
  },
];

export default function ChatWhatsapp() {
  return (
    <>
      <SEO
        title="CRM para WhatsApp | Automação, Atendimento e IA | Winove"
        description="Transforme seu WhatsApp em uma central de vendas e atendimento com CRM, automação, chatbot, IA e operação multiusuário para empresas."
        canonical="https://www.winove.com.br/chat-whatsapp"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "CRM para WhatsApp com automação e IA",
            provider: { "@type": "Organization", name: "Winove" },
            serviceType: "Atendimento WhatsApp para empresas",
            url: "https://www.winove.com.br/chat-whatsapp",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]}
      />

      <div className="min-h-screen">
        <section className="section--first pb-14" aria-labelledby="chatwhats-hero">
          <div className="container mx-auto px-4">
            <Badge variant="secondary" className="mb-3">CRM WhatsApp para empresas</Badge>
            <h1 id="chatwhats-hero" className="text-3xl md:text-5xl font-bold tracking-tight max-w-5xl">
              CRM para WhatsApp com automação, atendimento multiusuário e inteligência artificial
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-4xl">
              Transforme seu WhatsApp em uma central profissional de atendimento, vendas e automação com chatbot,
              API oficial, IA e gestão completa da equipe.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
                <Button size="lg">Solicitar demonstração</Button>
              </a>
              <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">Falar com especialista</Button>
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Atendimento WhatsApp empresa com auditoria, estabilidade e operação escalável.
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8" aria-labelledby="chatwhats-problema">
          <h2 id="chatwhats-problema" className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Por que empresas precisam de um CRM para WhatsApp
          </h2>
          <p className="text-muted-foreground max-w-5xl">
            Sem estrutura, o WhatsApp vira um canal desorganizado. Com um CRM para WhatsApp, sua empresa centraliza
            conversas, organiza o atendimento, automatiza mensagens, melhora a gestão da equipe e acelera vendas pelo
            WhatsApp com histórico completo de cada lead.
          </p>
        </section>

        <section className="container mx-auto px-4 py-8" aria-labelledby="chatwhats-recursos-gerais">
          <h2 id="chatwhats-recursos-gerais" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            Tudo que sua empresa precisa para vender e atender pelo WhatsApp
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle>Atendimento multiusuário</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Vários atendentes no mesmo número com filas, distribuição e gestão por equipe.</CardContent></Card>
            <Card><CardHeader><CardTitle>Central de conversas</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Visualize conversas abertas, pendentes e resolvidas com histórico completo por cliente.</CardContent></Card>
            <Card><CardHeader><CardTitle>Automação com IA</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Fluxos inteligentes, chatbot e integração com modelos de IA para ganho de produtividade.</CardContent></Card>
            <Card><CardHeader><CardTitle>CRM e funil de vendas</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Pipeline, Kanban e etapas comerciais para acompanhar o lead até o fechamento.</CardContent></Card>
            <Card><CardHeader><CardTitle>Campanhas e disparos</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Envios segmentados e campanhas automatizadas para relacionamento e reativação.</CardContent></Card>
            <Card><CardHeader><CardTitle>Integrações e API</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Conecte com API do WhatsApp, webhooks e ferramentas externas da operação.</CardContent></Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8" aria-labelledby="chatwhats-recursos-detalhados">
          <h2 id="chatwhats-recursos-detalhados" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Recursos da plataforma</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Atendimento em equipe</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <h3 className="font-medium text-foreground">Múltiplos operadores e distribuição automática</h3>
                <p>Organize filas, responsáveis e histórico completo para garantir continuidade do atendimento.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Chatbot e automação</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <h3 className="font-medium text-foreground">Fluxos inteligentes e qualificação de leads</h3>
                <p>Automatize triagens, roteie oportunidades e padronize scripts de vendas.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessagesSquare className="h-5 w-5" /> CRM e funil</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <h3 className="font-medium text-foreground">Pipeline, Kanban e métricas</h3>
                <p>Monitore conversão e produtividade do time de vendas no WhatsApp.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5" /> Inteligência artificial e integrações</CardTitle>
                <CardDescription>ChatGPT, Claude, Gemini, webhooks e API</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Operação multi-IA com integração para automações avançadas, atendimento e escalabilidade.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10" aria-labelledby="chatwhats-comparativo">
          <h2 id="chatwhats-comparativo" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            WhatsApp comum vs WhatsApp profissional
          </h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-left p-3 font-semibold">WhatsApp normal</th>
                  <th className="text-left p-3 font-semibold">Plataforma CRM para WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.normal} className="border-t">
                    <td className="p-3 text-muted-foreground"><span className="inline-flex items-center gap-2"><X className="h-4 w-4 text-destructive" />{row.normal}</span></td>
                    <td className="p-3 text-muted-foreground"><span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-green-600" />{row.profissional}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8" aria-labelledby="chatwhats-mercados">
          <h2 id="chatwhats-mercados" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Quem usa CRM para WhatsApp</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            {['Clínicas', 'Varejo', 'Imobiliárias', 'Escritórios', 'Indústrias', 'Serviços em geral'].map((item) => (
              <Card key={item}><CardContent className="p-4">{item}</CardContent></Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10" aria-labelledby="chatwhats-faq">
          <h2 id="chatwhats-faq" className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Perguntas frequentes sobre CRM WhatsApp</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{faq.answer}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 pb-20" aria-labelledby="chatwhats-cta">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl border">
            <div>
              <h2 id="chatwhats-cta" className="text-xl md:text-2xl font-semibold">Transforme seu WhatsApp em um sistema de vendas</h2>
              <p className="text-muted-foreground">Implante CRM, automação e atendimento profissional em poucos dias.</p>
            </div>
            <div className="flex gap-3">
              <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
                <Button size="lg"><Zap className="h-4 w-4 mr-2" />Solicitar integração</Button>
              </a>
              <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"><CalendarClock className="h-4 w-4 mr-2" />Agendar demonstração</Button>
              </a>
              <a href="https://api.whatsapp.com/send?phone=5519982403845" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="ghost"><LinkIcon className="h-4 w-4 mr-2" />Falar com especialista</Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
