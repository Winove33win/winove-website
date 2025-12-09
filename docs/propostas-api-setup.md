# API de propostas comerciais

A rota `/api/propostas` responde com `503 schema_invalido` quando o backend detecta que o painel comercial está bloqueado ou que a tabela `propostas_comerciais` não possui o schema mínimo esperado. O check é realizado por `ensureSchemaIsReady()` (em `backend/routes/proposals.js`), que consulta o módulo `backend/utils/proposalSchema.js`.

## Variáveis de ambiente obrigatórias

O painel comercial só é liberado quando a variável `COMMERCIAL_PANEL_PASSWORD` está definida exatamente com o valor fixo `VfY9KO`. Se outro valor for usado, o check falha e o backend devolve 503. Configure também a conexão MySQL usada pelo pool do backend (todos os valores devem ser obtidos do ambiente de hospedagem ou de um secret manager):

```env
DB_HOST=<database-host>
DB_PORT=<database-port>
DB_NAME=<database-name>
DB_USER=<database-user>
DB_PASSWORD=<database-password>

# senha que libera o painel comercial
COMMERCIAL_PANEL_PASSWORD=VfY9KO
```

Copie `backend/.env.example` para `backend/.env`, ajuste os valores acima e reinicie o app Node no Plesk (ou o processo local) para recarregar o ambiente.

## Criar/alinhar a tabela `propostas_comerciais`

Há uma migração pronta (`backend/migrations/006_create_propostas_comerciais.sql`) que cria a tabela com todas as 46 colunas exigidas por `proposalSchema.js`. Para aplicá-la no servidor:

```sh
cd /var/www/vhosts/winove.com.br/httpdocs/backend
node scripts/migrate.mjs
```

O script executa todas as migrações pendentes; se preferir, rode o SQL diretamente via phpMyAdmin.

## Validar o schema via endpoint

Depois de configurar o `.env` e aplicar a migração, consulte o status:

```sh
GET https://winove.com.br/api/propostas/schema
```

A resposta deve ser `{ ok: true, columns: [...] }`. Se `ok` vier `false`, o campo `missing` indicará quais colunas precisam ser adicionadas.

> Dica: o arquivo `docs/api-propostas.md` detalha respostas e payloads das rotas `/api/propostas` caso precise checar formatos ou mensagens de erro.

## Erros comuns e como resolver

- **Resposta HTML e status 500 ao fazer POST /api/propostas** – indica que o processo Node não iniciou. Confirme as variáveis no `.env` ou no painel do Plesk (DB_*, COMMERCIAL_PANEL_*). O backend só sobe quando `COMMERCIAL_PANEL_PASSWORD` for exatamente `VfY9KO`.
- **TypeError no frontend (não consegue ler `payload`)** – acontece quando o backend devolve a página HTML genérica de erro do Plesk em vez de JSON. Ajuste as variáveis de ambiente, rode `node scripts/migrate.mjs` para alinhar o schema e reinicie a aplicação Node; depois disso o endpoint volta a responder JSON.
- **HTTP 503 schema_invalido** – a tabela `propostas_comerciais` está ausente ou faltam colunas. Execute a migração `backend/migrations/006_create_propostas_comerciais.sql` (ou `node scripts/migrate.mjs`) para criar/atualizar o schema com as 46 colunas exigidas.
- **Variáveis coladas no formulário do painel** – não insira as credenciais nos campos do formulário de proposta. Esses valores precisam estar no `.env` ou nas variáveis de ambiente do Plesk; o formulário deve receber apenas dados da proposta.

## Payload esperado no POST `/api/propostas`

A rota aceita campos simples no corpo da requisição, como `nome`, `email`, `empresa`, `servicos` (array com `{ servico, valor }`), `prazo`, `termos`, `assinaturaNome`, `aceiteDigital` e `portfolio`. Não envie o JSON aninhado do exemplo "Saída JSON padronizada" — use esses nomes planos para que a inserção no MySQL funcione e o PDF seja salvo em `pdf_blob`.
