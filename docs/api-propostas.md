# API de propostas comerciais

Este guia resume como usar as três rotas expostas pelo backend sob o prefixo `/api/propostas`, incluindo autenticação, payloads aceitos e respostas esperadas.

## Autenticação e middleware
- As rotas são montadas em `backend/index.js` com o prefixo `/api/propostas` e passam pelo middleware `requireCommercialProposalAuth`, que exige Basic Auth.
- Usuário: `comercial` (ou `COMMERCIAL_PANEL_USERNAME` se definido). Senha: precisa corresponder ao valor configurado em `COMMERCIAL_PANEL_PASSWORD`. Caso contrário, o backend retorna `401` com `error: "painel_bloqueado"`.
- O middleware também valida o schema e o cache de template antes de entregar as rotas. Para testar a configuração, use a rota `/schema` descrita abaixo.

## Validação do schema
- A função `ensureSchemaIsReady` verifica se a senha está correta e se a tabela `propostas_comerciais` possui ao menos 46 colunas obrigatórias definidas em `backend/utils/proposalSchema.js`. Se faltar algo, as rotas respondem `503` com `error: "schema_invalido"`.
- Se for necessário ajustar o banco, aplique a migração `backend/migrations/006_create_propostas_comerciais.sql` ou alinhe `REQUIRED_COLUMNS`/`MIN_COLUMNS` ao schema disponível.

## Rotas disponíveis
### `GET /api/propostas/schema`
Retorna `{ ok: true, columns: [...] }` quando o schema está válido. Caso contrário, responde `503` com detalhes das colunas ausentes. Útil para validar variáveis de ambiente e estrutura da tabela antes de usar o POST.

### `GET /api/propostas/:id/pdf`
- Verifica o schema e, em seguida, busca o PDF salvo na coluna `pdf_blob` para o `id` informado.
- Respostas possíveis: `200` com `Content-Type: application/pdf`, `404` se não houver registro/arquivo, `400` para `id` inválido ou `503` quando o schema não está aprovado.

### `POST /api/propostas`
Rota usada pelo painel para criar uma nova proposta. Fluxo principal:
1) Valida o schema e as credenciais do painel (mesmos requisitos do `/schema`).
2) Campos obrigatórios no corpo: `nome`, `email`, `empresa`, `servicos` (array de `{ servico, valor }`), `prazo`, `termos`, `assinaturaNome`, `aceiteDigital`.
3) Campos opcionais: `lead_id`, `template_id`, `telefone`, `cnpj`, `area_de_negocio`, `numero_de_funcionarios`, `setor`, `faturamento_anual`, `funcionarios_total`, `descricao`, `portfolio`.
4) Sanitiza os valores, gera JSON final, insere na tabela mapeando colunas via `PANEL_TO_DB_MAPPING` e recusa se algum campo obrigatório não tiver coluna correspondente.
5) Gera um PDF com `generateProposalPdf`, salva em `pdf_blob` e expõe `pdf_download_url` (`/api/propostas/{id}/pdf`).
6) Retorna `201` com os dados da proposta, `pdf_download_url`, `pdf_storage_info` e `email_enviado` (se SMTP estiver configurado). Erros de validação retornam `400`; falhas de schema, `503`.

## Checklist de configuração
- Definir `COMMERCIAL_PANEL_PASSWORD` com uma senha não vazia (e `COMMERCIAL_PANEL_USERNAME` se quiser customizar o usuário).
- Configurar credenciais de banco (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- Garantir que a tabela `propostas_comerciais` contenha as 46 colunas exigidas ou ajuste os requisitos no código.
- Para envio de e-mail opcional, definir `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` e `CONTACT_EMAIL`.
