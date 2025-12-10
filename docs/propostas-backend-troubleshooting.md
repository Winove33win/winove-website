# Depuração de erros no endpoint `/api/propostas`

Quando o Plesk retorna a página HTML genérica (“Web application could not be started”) em chamadas ao endpoint `POST /api/propostas`, o problema normalmente está no backend Node/Express, e não no React ou no formulário.

## Checklist rápido
- Verifique a conectividade do banco MariaDB e se o host configurado em `DB_HOST` é acessível pelo Node (use `127.0.0.1` quando o banco estiver no mesmo servidor).
- Confirme que todas as variáveis do `.env` foram definidas, incluindo `COMMERCIAL_PANEL_USERNAME` e `COMMERCIAL_PANEL_PASSWORD`. No Plesk, as variáveis de ambiente prevalecem sobre o `.env` do repositório.
- Aplique a migração `backend/migrations/006_create_propostas_comerciais.sql` ou execute `node scripts/migrate.mjs` para criar/atualizar a tabela `propostas_comerciais` com as 46 colunas obrigatórias.
- Reinicie o processo Node após qualquer alteração de ambiente ou migração.

## Validação do schema
1. Autentique com Basic Auth (`comercial` / `VfY9KO`).
2. Acesse `GET https://winove.com.br/api/propostas/schema` no navegador ou Postman.
3. Resultado esperado: `{ ok: true, columns: [...] }`. Se houver `{ erro_mapeamento: ... }`, o campo `missingRequired` lista colunas que precisam ser criadas/ajustadas.

## Investigação de logs
- Use o painel Node.js do Plesk (Executar comandos) ou os **Logs de acesso/erro** para encontrar mensagens como “Unhandled error” ou “Erro ao salvar proposta comercial”. Elas indicam falhas de conexão, ausência de tabela ou exceções ao gerar PDF.

## Cuidados com o formulário
O campo **Termos e condições** deve conter apenas texto comercial. Evite inserir scripts ou variáveis; isso não corrige o backend e pode poluir a proposta gerada.
