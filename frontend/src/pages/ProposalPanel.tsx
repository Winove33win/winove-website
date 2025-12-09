import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

const PANEL_AUTH_HEADER =
  typeof btoa === "function" ? `Basic ${btoa("comercial:VfY9KO")}` : "";

const proposalSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo do cliente"),
  empresa: z.string().min(2, "Informe a empresa ou organizacao"),
  email: z.string().email("E-mail invalido"),
  portfolio: z.string().min(2, "Inclua um link ou referencia de portfolio"),
  descricao: z.string().min(10, "Descreva o projeto ou solicitacao"),
  servicos: z
    .array(
      z.object({
        servico: z.string().min(1, "Informe o servico"),
        valor: z.string().min(1, "Inclua o valor"),
      })
    )
    .min(1, "Inclua ao menos um servico"),
  prazo: z.string().min(2, "Defina o prazo de entrega"),
  termos: z.string().min(10, "Inclua os termos e condicoes"),
  assinaturaNome: z.string().min(3, "Digite o nome para assinatura"),
  aceiteDigital: z.literal(true, {
    errorMap: () => ({ message: "Confirme o aceite digital" }),
  }),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;

type ProposalJson = {
  cliente: {
    nome: string;
    empresa: string;
    email: string;
    portfolio: string;
  };
  projeto: {
    descricao: string;
    servicos: string[];
    valores: { servico: string; valor: string }[];
    prazo_entrega: string;
  };
  termos_condicoes: string;
  assinatura: string;
};

type ProposalApiResponse = ProposalJson & {
  pdf_download_url?: string;
  pdf_storage_info?: string;
  mapeamento_indexacao?: Record<string, unknown>;
  email_enviado?: boolean;
  id?: number;
  erro_mapeamento?: string;
  campo_problematico?: string | string[];
  error?: string;
  message?: string;
};

const buildProposalJson = (values: ProposalFormData): ProposalJson => ({
  cliente: {
    nome: values.nome,
    empresa: values.empresa,
    email: values.email,
    portfolio: values.portfolio,
  },
  projeto: {
    descricao: values.descricao,
    servicos: values.servicos.map((item) => item.servico),
    valores: values.servicos.map((item) => ({ servico: item.servico, valor: item.valor })),
    prazo_entrega: values.prazo,
  },
  termos_condicoes: values.termos,
  assinatura: `${values.assinaturaNome} (aceite digital)`,
});

const ProposalPanel = () => {
  const templateRef = useRef<HTMLDivElement>(null);
  const [proposal, setProposal] = useState<ProposalApiResponse | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      empresa: "",
      email: "",
      portfolio: "",
      descricao: "",
      servicos: [{ servico: "", valor: "" }],
      prazo: "",
      termos: "",
      assinaturaNome: "",
      aceiteDigital: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "servicos",
  });

  const watchedValues = form.watch();
  const isComplete = form.formState.isValid && watchedValues.servicos.length > 0;

  const previewProposal = useMemo(() => buildProposalJson(watchedValues), [watchedValues]);

  const onSubmit = async (values: ProposalFormData) => {
    const finalizedProposal = buildProposalJson(values);
    setProposal(finalizedProposal);
    setServerMessage(null);
    setSubmitStatus("saving");

    try {
      const response = await fetch("/api/propostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(PANEL_AUTH_HEADER ? { Authorization: PANEL_AUTH_HEADER } : {}),
        },
        body: JSON.stringify({
          ...values,
          aceiteDigital: values.aceiteDigital,
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        const text = await response.text();
        console.error('Resposta de erro do servidor:', response.status, text);
        // Tentar extrair mensagem JSON caso o servidor retorne JSON de erro
        try {
          const parsed = JSON.parse(text);
          const problem = parsed?.erro_mapeamento || parsed?.error || parsed?.message || `Erro ${response.status}`;
          const campo = parsed?.campo_problematico;
          throw new Error(typeof campo === 'string' ? `${problem} (campo: ${campo})` : problem);
        } catch (_parseErr) {
          // Resposta não é JSON — provavelmente HTML. Levantar erro genérico com trecho
          throw new Error(`Servidor retornou ${response.status}: ${text.slice(0, 200)}`);
        }
      }

      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta inesperada do servidor (não JSON):', text);
        throw new Error('Resposta inesperada do servidor (não JSON)');
      }

      const data: ProposalApiResponse = await response.json();

      setServerMessage("Proposta registrada e mapeada com sucesso.");
      setSubmitStatus("success");
      setProposal(data);
    } catch (err) {
      console.error("Erro ao registrar proposta:", err);
      setServerMessage(
        err instanceof Error ? err.message : "Nao foi possivel salvar a proposta. Tente novamente."
      );
      setSubmitStatus("error");
    }
  };

  const handleExportPdf = () => {
    if (!proposal?.pdf_download_url) {
      setServerMessage("PDF disponivel somente apos registro e validacao do schema.");
      return;
    }

    fetch(proposal.pdf_download_url, {
      headers: PANEL_AUTH_HEADER ? { Authorization: PANEL_AUTH_HEADER } : {},
    })
      .then(async (resp) => {
        if (!resp.ok) {
          throw new Error("Falha ao baixar PDF. Confirme autenticacao e schema.");
        }
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener");
      })
      .catch((err) => {
        console.error(err);
        setServerMessage("Erro ao exportar PDF. Verifique autenticacao e tente novamente.");
      });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <SEO
        title="Painel de Propostas Comerciais | Winove"
        description="Preencha, valide e gere propostas comerciais padronizadas com assinatura digital e exportacao em PDF."
        canonical="https://www.winove.com.br/comercial-propostas"
      />

      <section className="section--first px-4">
        <div className="container mx-auto py-16">
          <div className="max-w-3xl space-y-4">
            <Badge className="rounded-full px-4 py-1">Propostas Padronizadas</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">Painel de Propostas Comerciais</h1>
            <p className="text-lg text-muted-foreground">
              Centralize informacoes essenciais, valide campos obrigatorios e gere um template
              padronizado pronto para visualizacao ou exportacao em PDF.
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Checklist de campos obrigatorios</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Assinatura digital</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-500" /> Exportacao PDF</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle>1. Preencha e valide os dados</CardTitle>
              <CardDescription>
                Todos os campos abaixo sao obrigatorios para finalizar a proposta comercial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo do cliente</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex.: Joao Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa/Organizacao</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex.: Exemplo Ltda" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail para contato</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contato@empresa.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio (link ou referencia)</FormLabel>
                          <FormControl>
                            <Input placeholder="www.exemplo.com/portfolio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descricao do projeto ou solicitacao</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Explique escopo, objetivo e necessidades do projeto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Servicos propostos e valores</FormLabel>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => append({ servico: "", valor: "" })}
                      >
                        Adicionar servico
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 p-3 border rounded-lg">
                          <FormField
                            control={form.control}
                            name={`servicos.${index}.servico`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Servico</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex.: Design" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`servicos.${index}.valor`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Valor</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex.: R$ 1.000,00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="prazo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazos de entrega previstos</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex.: 30 dias apos aprovacao" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Termos e condicoes gerais do servico</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="Detalhe pagamentos, responsabilidades, garantias e confidencialidade" {...field} />
                        </FormControl>
                        <FormDescription>
                          Este campo e exibido integralmente no template final.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-[2fr_1fr] gap-4">
                    <FormField
                      control={form.control}
                      name="assinaturaNome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assinatura eletronica</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o nome do responsavel" {...field} />
                          </FormControl>
                          <FormDescription>Este nome sera mostrado no aceite digital.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aceiteDigital"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(!!checked)}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-tight">
                            <FormLabel>Aceite digital</FormLabel>
                            <FormDescription className="text-xs">
                              Confirmo que os dados estao corretos e autorizo assinatura digital pelo site.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-3 justify-between items-center">
                    <div className={cn("text-sm", isComplete ? "text-emerald-600" : "text-destructive")}>
                      {isComplete ? "Checklist completo. Pronto para gerar a proposta." : "Preencha todos os campos obrigatorios antes de gerar."}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!proposal?.pdf_download_url || submitStatus !== "success"}
                        onClick={handleExportPdf}
                      >
                        Exportar PDF
                      </Button>
                      <Button type="submit" disabled={!isComplete || submitStatus === "saving"}>
                        {submitStatus === "saving" ? "Salvando..." : "Gerar proposta"}
                      </Button>
                    </div>
                  </div>

                  {submitStatus !== "idle" && (
                    <p
                      className={cn(
                        "text-sm",
                        submitStatus === "error"
                          ? "text-destructive"
                          : submitStatus === "saving"
                            ? "text-muted-foreground"
                            : "text-emerald-600"
                      )}
                    >
                      {submitStatus === "saving" ? "Salvando proposta comercial..." : serverMessage}
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card ref={templateRef} className="shadow-sm border-border/60">
              <CardHeader className="pb-4">
                <CardTitle>2. Visualizacao da proposta padrao</CardTitle>
                <CardDescription>
                  Estrutura padronizada pronta para envio, visualizacao ou exportacao em PDF.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-primary uppercase">Dados do cliente</p>
                  <h2 className="text-2xl font-bold">{previewProposal.cliente.nome || "Nome do cliente"}</h2>
                  <p className="text-muted-foreground">{previewProposal.cliente.empresa || "Empresa/Organizacao"}</p>
                  <p className="text-sm text-muted-foreground">{previewProposal.cliente.email || "email@empresa.com"}</p>
                  <a
                    href={previewProposal.cliente.portfolio || "#"}
                    className="text-sm text-primary underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {previewProposal.cliente.portfolio || "Portfolio/Referencia"}
                  </a>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary uppercase">Projeto</p>
                  <p className="text-base leading-relaxed">
                    {previewProposal.projeto.descricao || "Inclua uma breve descricao do projeto."}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-primary/90">Servicos propostos</p>
                    <div className="flex flex-wrap gap-2">
                      {previewProposal.projeto.servicos.length ? (
                        previewProposal.projeto.servicos.map((servico, index) => (
                          <span key={index} className="bg-muted text-sm px-3 py-1 rounded-full">
                            {servico}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhum servico adicionado.</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-primary/90">Valores detalhados</p>
                    <div className="space-y-2">
                      {previewProposal.projeto.valores.length ? (
                        previewProposal.projeto.valores.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm border-b pb-2">
                            <span>{item.servico}</span>
                            <span className="font-semibold">{item.valor}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Adicione valores para cada servico.</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Prazo de entrega:</span>
                    <span>{previewProposal.projeto.prazo_entrega || "Defina o prazo ou data prevista"}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary uppercase">Termos e condicoes</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {previewProposal.termos_condicoes || "Descreva pagamentos, responsabilidades, confidencialidade e demais condicoes."}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary uppercase">Assinatura eletronica</p>
                  <p className="text-base font-semibold">{previewProposal.assinatura || "Nome do responsavel"}</p>
                  <p className="text-xs text-muted-foreground">Aceite digital registrado neste painel.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle>3. Saida JSON padronizada</CardTitle>
                <CardDescription>
                  Confirmamos todos os campos antes de gerar a proposta final.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {proposal ? (
                  <pre className="bg-background border rounded-lg p-4 text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(proposal, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Preencha todos os dados obrigatorios e clique em "Gerar proposta" para exibir o JSON pronto para exportacao.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProposalPanel;
