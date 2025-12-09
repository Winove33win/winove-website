# Plano de recuperação do painel de propostas

Este plano descreve como reativar o painel de propostas quando a API responde com `error: "not_found"`, `painel_bloqueado` ou `schema_invalido`.

## 1) Checklist de ambiente

1. **Senha do painel**
   - No host da API, exporte `COMMERCIAL_PANEL_PASSWORD=VfY9KO` e reinicie o serviço (PM2/systemd/docker). A senha é validada antes de qualquer rota `/api/propostas`.
2. **Usuário do painel**
   - Confirme o usuário básico (padrão `comercial`) via `COMMERCIAL_PANEL_USERNAME`.
3. **Variáveis de e-mail**
   - Defina `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` para que o envio de propostas não quebre silenciosamente.

## 2) Saúde do schema MySQL

1. Verifique a conexão:
   - `mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME -e "SHOW TABLES LIKE 'propostas_comerciais';"`
2. Valide o schema via API (retorna `{ ok: true }` em caso de sucesso):
   - `curl -u comercial:VfY9KO https://<host>/api/propostas/schema`
3. Se retornar `schema_invalido`:
   - Abra `backend/migrations/006_create_propostas_comerciais.sql` e compare com o banco.
   - A tabela precisa de **pelo menos 46 colunas** e todas as listadas em `REQUIRED_COLUMNS` (ver `backend/utils/proposalSchema.js`).
   - Crie/adapte colunas faltantes e rode `FLUSH TABLES;` ou reinicie o container.

## 3) Fluxo de autenticação do painel

1. As rotas `/api/propostas/*` e `/comercial-propostas` exigem **Basic Auth** com o par `comercial:VfY9KO` (ou o usuário definido em `COMMERCIAL_PANEL_USERNAME`).
2. Sem o header `Authorization: Basic ...`, o backend responde 401 antes de processar a rota.
3. Em ambiente de homolog/produção, confirme que o proxy (Nginx/Apache) não está removendo o header `Authorization`.

## 4) Diagnóstico rápido das rotas

- **Schema**: `curl -i -u comercial:VfY9KO https://<host>/api/propostas/schema`
- **Envio de proposta**: `curl -i -u comercial:VfY9KO -H 'Content-Type: application/json' -d '{"nome":"Teste","email":"t@e.st"}' https://<host>/api/propostas`
- **PDF**: `curl -i -u comercial:VfY9KO https://<host>/api/propostas/1/pdf`

## 5) Fracasso no carregamento do painel ("not_found")

1. Confirme que o build do frontend está publicado e que `/comercial-propostas` está roteando para o index do SPA.
2. Se o proxy responde 404, crie uma regra de fallback para servir `frontend/dist/index.html` em qualquer rota que comece com `/comercial-propostas`.
3. Se a API responde 404 para `/api/propostas`, verifique se o backend está em execução e escutando no host/porta corretos configurados no proxy.

## 6) After-action

- Registrar no monitoramento o status de `schema_invalido` e `painel_bloqueado` para agir proativamente.
- Documentar em runbooks de operação o par usuário/senha e o passo de validação do schema antes de deploys.
