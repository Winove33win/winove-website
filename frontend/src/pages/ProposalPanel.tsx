import { useEffect, useMemo, useRef, useState } from "react";
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

const proposalSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo do cliente"),
  empresa: z.string().min(2, "Informe a empresa ou organização"),
  email: z.string().email("E-mail inválido"),
  portfolio: z.string().min(2, "Inclua um link ou referência de portfólio"),
  descricao: z.string().min(10, "Descreva o projeto ou solicitação"),
  servicos: z
    .array(
      z.object({
        servico: z.string().min(1, "Informe o serviço"),
        valor: z.string().min(1, "Inclua o valor"),
      })
    )
    .min(1, "Inclua ao menos um serviço"),
  prazo: z.string().min(2, "Defina o prazo de entrega"),
  termos: z.string().min(10, "Inclua os termos e condições"),
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
  detalhes_checagem?: ProposalStatusPayload;
};

type EnvStep = {
  key: string;
  expected: string;
  value: string | null;
  ok: boolean;
  matchesExpected: boolean;
  action: string;
};

type ProposalStatusPayload = {
  ok: boolean;
  envStatus?: {
    ok: boolean;
    envFileExists?: boolean;
    steps?: EnvStep[];
    message?: string;
  };
  schemaStatus?: {
    ok: boolean;
    columnNames?: string[];
    missingRequired?: string[];
    message?: string;
  };
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
  assinatura: `${values.assinaturaNome} (aceite digital)`
});

const ProposalPanel = () => {
  const templateRef = useRef<HTMLDivElement>(null);
  const [proposal, setProposal] = useState<ProposalApiResponse | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [statusPayload, setStatusPayload] = useState<ProposalStatusPayload | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

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

  useEffect(() => {
    const fetchStatus = async () => {
      setLoadingStatus(true);
      try {
        const response = await fetch("/api/propostas/status");
        const data = (await response.json()) as ProposalStatusPayload & { erro_mapeamento?: string };

        if (!response.ok) {
          setStatusError(
            data?.erro_mapeamento || "Ambiente não validado. Ajuste .env, senha do painel e schema do banco antes de seguir."
          );
          setStatusPayload(data?.detalhes_checagem || { ok: false });
        } else {
          setStatusPayload(data?.detalhes_checagem || data);
          setStatusError(null);
        }
      } catch (error) {
        console.error("Erro ao validar checklist do painel:", error);
        setStatusError("Não foi possível validar o ambiente. Confira .env, Plesk e migração do banco.");
        setStatusPayload({ ok: false });
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, []);

  const onSubmit = async (values: ProposalFormData) => {
    const finalizedProposal = buildProposalJson(values);
    setProposal(finalizedProposal);
    setServerMessage(null);
    setSubmitStatus("saving");

    if (!statusPayload?.ok) {
      setSubmitStatus("error");
      setServerMessage(
        statusError ||
          "Checklist de ambiente não validado. Ajuste o .env/Plesk, migração SQL e senha do painel antes de registrar."
      );
      return;
    }

    try {
      const response = await fetch("/api/propostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          aceiteDigital: values.aceiteDigital,
        }),
      });

      const data: ProposalApiResponse = await response.json();

      if (!response.ok) {
        const problem =
          data?.erro_mapeamento ||
          data?.error ||
          data?.message ||
          "Erro ao salvar proposta";
        throw new Error(
          typeof data?.campo_problematico === "string"
            ? `${problem} (campo: ${data.campo_problematico})`
            : problem
        );
      }

      setServerMessage("Proposta registrada e mapeada com sucesso.");
      setSubmitStatus("success");
      setProposal(data);
    } catch (err) {
      console.error("Erro ao registrar proposta:", err);
      setServerMessage(
        err instanceof Error ? err.message : "Não foi possível salvar a proposta. Tente novamente."
      );
      setSubmitStatus("error");
    }
  };

  const handleExportPdf = () => {
    if (!proposal?.pdf_download_url) {
      setServerMessage("PDF disponível somente após registro e validação do schema.");
      return;
    }
    window.open(proposal.pdf_download_url, "_blank", "noopener");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <SEO
        title="Painel de Propostas Comerciais | Winove"
        description="Preencha, valide e gere propostas comerciais padronizadas com assinatura digital e exportação em PDF."
        canonical="https://www.winove.com.br/comercial-propostas"
      />

      <section className="section--first px-4">
        <div className="container mx-auto py-16">
          <div className="max-w-3xl space-y-4">
            <Badge className="rounded-full px-4 py-1">Propostas Padronizadas</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">Painel de Propostas Comerciais</h1>
            <p className="text-lg text-muted-foreground">
              Centralize informações essenciais, valide campos obrigatórios e gere um template
              padronizado pronto para visualização ou exportação em PDF.
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Checklist de campos obrigatórios</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Assinatura digital</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-500" /> Exportação PDF</span>
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
                Todos os campos abaixo são obrigatórios para finalizar a proposta comercial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <p className="text-sm font-semibold">Checklist de pré-condições do backend</p>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Variáveis de ambiente</p>
                    <ul className="space-y-1">
                      {loadingStatus && <li className="text-muted-foreground">Validando .env e senha...</li>}
                      {!loadingStatus &&
                        (statusPayload?.envStatus?.steps || []).map((step) => (
                          <li key={step.key} className={cn(step.ok ? "text-emerald-600" : "text-destructive")}>
                            {step.key}: {step.value || "não definido"} {step.matchesExpected ? "(ok)" : "(ajustar)"}
                          </li>
                        ))}
                      {!loadingStatus && !statusPayload?.envStatus?.steps?.length && (
                        <li className="text-destructive">Configuração ausente. Crie o .env ou defina as variáveis no Plesk.</li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Schema e migração</p>
                    <p className={cn(statusPayload?.schemaStatus?.ok ? "text-emerald-600" : "text-destructive", "text-sm")}>
                      {statusPayload?.schemaStatus?.ok
                        ? "Tabela propostas_comerciais validada com 46 colunas."
                        : "Execute a migração 006_create_propostas_comerciais.sql e reinicie o Node."}
                    </p>
                    {!!statusPayload?.schemaStatus?.missingRequired?.length && (
                      <p className="text-xs text-destructive">
                        Faltam colunas: {statusPayload.schemaStatus.missingRequired.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                {statusError && (
                  <p className="text-xs text-destructive">
                    {statusError} | Após corrigir, reinicie o Node para carregar as variáveis.
                  </p>
                )}
              </div>

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
                            <Input placeholder="Ex.: João Silva" {...field} />
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
                          <FormLabel>Empresa/Organização</FormLabel>
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
                          <FormLabel>Portfólio (link ou referência)</FormLabel>
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
                        <FormLabel>Descrição do projeto ou solicitação</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Explique escopo, objetivo e necessidades do projeto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Serviços propostos e valores</FormLabel>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => append({ servico: "", valor: "" })}
                      >
                        Adicionar serviço
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
                                <FormLabel className="text-sm">Serviço</FormLabel>
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
                          <Input placeholder="Ex.: 30 dias após aprovação" {...field} />
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
                        <FormLabel>Termos e condições gerais do serviço</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="Detalhe pagamentos, responsabilidades, garantias e confidencialidade" {...field} />
                        </FormControl>
                        <FormDescription>
                          Este campo é exibido integralmente no template final.
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
                          <FormLabel>Assinatura eletrônica</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o nome do responsável" {...field} />
                          </FormControl>
                          <FormDescription>Este nome será mostrado no aceite digital.</FormDescription>
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
                              Confirmo que os dados estão corretos e autorizo assinatura digital pelo site.
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
                      {isComplete ? "Checklist completo. Pronto para gerar a proposta." : "Preencha todos os campos obrigatórios antes de gerar."}
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
                      <Button
                        type="submit"
                        disabled={!isComplete || submitStatus === "saving" || !statusPayload?.ok}
                      >
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
                <CardTitle>2. Visualização da proposta padrão</CardTitle>
                <CardDescription>
                  Estrutura padronizada pronta para envio, visualização ou exportação em PDF.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-primary uppercase">Dados do cliente</p>
                  <h2 className="text-2xl font-bold">{previewProposal.cliente.nome || "Nome do cliente"}</h2>
                  <p className="text-muted-foreground">{previewProposal.cliente.empresa || "Empresa/Organização"}</p>
                  <p className="text-sm text-muted-foreground">{previewProposal.cliente.email || "email@empresa.com"}</p>
                  <a
                    href={previewProposal.cliente.portfolio || "#"}
                    className="text-sm text-primary underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {previewProposal.cliente.portfolio || "Portfólio/Referência"}
                  </a>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary uppercase">Projeto</p>
                  <p className="text-base leading-relaxed">
                    {previewProposal.projeto.descricao || "Inclua uma breve descrição do projeto."}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-primary/90">Serviços propostos</p>
                    <div className="flex flex-wrap gap-2">
                      {previewProposal.projeto.servicos.length ? (
                        previewProposal.projeto.servicos.map((servico, index) => (
                          <span key={index} className="bg-muted text-sm px-3 py-1 rounded-full">
                            {servico}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhum serviço adicionado.</span>
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
                        <span className="text-sm text-muted-foreground">Adicione valores para cada serviço.</span>
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
                  <p className="text-sm font-semibold text-primary uppercase">Termos e condições</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {previewProposal.termos_condicoes || "Descreva pagamentos, responsabilidades, confidencialidade e demais condições."}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary uppercase">Assinatura eletrônica</p>
                  <p className="text-base font-semibold">{previewProposal.assinatura || "Nome do responsável"}</p>
                  <p className="text-xs text-muted-foreground">Aceite digital registrado neste painel.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle>3. Saída JSON padronizada</CardTitle>
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
                    Preencha todos os dados obrigatórios e clique em "Gerar proposta" para exibir o JSON pronto para exportação.
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
