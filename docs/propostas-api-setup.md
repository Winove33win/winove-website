# API de propostas comerciais

A rota `/api/propostas` responde com `503 schema_invalido` quando o backend detecta que o painel comercial está bloqueado ou que a tabela `propostas_comerciais` não possui o schema mínimo esperado. O check é realizado por `ensureSchemaIsReady()` (em `backend/routes/proposals.js`), que consulta o módulo `backend/utils/proposalSchema.js`.

## Variáveis de ambiente obrigatórias

O painel comercial só é liberado quando a variável `COMMERCIAL_PANEL_PASSWORD` está definida exatamente com o valor fixo `VfY9KO`. Se outro valor for usado, o check falha e o backend devolve 503. Configure também a conexão MySQL usada pelo pool do backend:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=fernando_winove_com_br_
DB_USER=winove
DB_PASSWORD=9*19avmU0

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

## Payload esperado no POST `/api/propostas`

A rota aceita campos simples no corpo da requisição, como `nome`, `email`, `empresa`, `servicos` (array com `{ servico, valor }`), `prazo`, `termos`, `assinaturaNome`, `aceiteDigital` e `portfolio`. Não envie o JSON aninhado do exemplo "Saída JSON padronizada" — use esses nomes planos para que a inserção no MySQL funcione e o PDF seja salvo em `pdf_blob`.
