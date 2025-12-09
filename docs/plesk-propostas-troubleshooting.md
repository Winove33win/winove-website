# Resolução de Erro 500 em /api/propostas (Plesk)

## Síntese do Problema

O POST `https://winove.com.br/api/propostas` retorna "Web application could not be started" (HTML de erro 500 do Plesk), indicando que:
- O serviço Node não está a iniciar ou a responder à rota corretamente.
- O Plesk exibe uma página HTML genérica de erro em vez de deixar o Node retornar JSON.

As causas mais comuns:
1. **Banco de dados inacessível** ou **tabela `propostas_comerciais` não existe / está incompleta**
2. **Variáveis de ambiente ausentes ou inconsistentes** (credenciais do banco, painel comercial)
3. **Serviço Node não reiniciado** após alterações

---

## Checklist de Resolução

### 1. Validar Variáveis de Ambiente no Plesk

**Passos:**
1. Aceda ao painel Plesk → **Domains** → seu domínio (winove.com.br)
2. Vá para **Node.js** → **Environment Variables**
3. Verifique ou adicione:
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=winove
   DB_PASSWORD=9*19avmU0
   DB_NAME=fernando_winove_com_br_
   COMMERCIAL_PANEL_USERNAME=comercial
   COMMERCIAL_PANEL_PASSWORD=VfY9KO
   MAIL_HOST=[seu host SMTP]
   MAIL_PORT=[porta SMTP, ex: 587 ou 465]
   MAIL_USER=[seu usuário SMTP]
   MAIL_PASS=[sua senha SMTP]
   CONTACT_EMAIL=[email para notificações]
   ```

4. **Salve** e prossiga para o próximo passo (reiniciar não é feito aqui, será feito depois)

**Dica:** Se `DB_HOST` não for `127.0.0.1` (ex: um host remoto), certifique-se de que:
- O host é acessível de fora da máquina local
- As regras de firewall permitem porta 3306 (MySQL)
- O utilizador `winove` tem permissões para aceder de esse host

---

### 2. Validar Banco de Dados e Schema

**Opção A: Executar Script de Diagnóstico Remoto (Recomendado)**

Se o seu repositório tem `backend/diagnose-proposals.js`:

1. Aceda a **Plesk** → **Domains** → seu domínio → **Node.js** → **Run Node.js Commands**
2. Execute:
   ```bash
   cd /var/www/vhosts/winove.com.br/httpdocs/backend
   npm install
   node diagnose-proposals.js
   ```
3. Leia o output (irá indicar se banco, schema e variáveis estão OK)

**Opção B: Validar Manualmente via MariaDB/MySQL**

1. Aceda ao Plesk → **Databases** (ou via terminal SSH se disponível)
2. Verificar se tabela existe:
   ```sql
   USE fernando_winove_com_br_;
   SHOW TABLES LIKE 'propostas_comerciais';
   ```
   Se **não aparecer**, a tabela não existe. Vá para o Passo 3.

3. Verificar colunas (caso tabela exista):
   ```sql
   DESCRIBE propostas_comerciais;
   ```
   Deve ter pelo menos estas colunas:
   - `id` (PRIMARY KEY auto_increment)
   - `nome`, `email`, `empresa`, `telefone`, `cnpj`, etc.
   - `pdf_blob`, `pdf_download_url`
   - `status`, `data_envio`
   
   Se faltarem colunas, execute a migração (Passo 3).

---

### 3. Aplicar Migração do Schema

Se a tabela não existe ou está incompleta:

**Opção A: Via Node.js (Recomendado)**

1. Aceda a **Plesk** → **Run Node.js Commands**
2. Execute:
   ```bash
   cd /var/www/vhosts/winove.com.br/httpdocs/backend
   node scripts/migrate.mjs
   ```
3. Aguarde conclusão. Deve imprimir "Migrations completed" ou similar.

**Opção B: Carregar SQL Manualmente**

Se `migrate.mjs` não funcionar:

1. Copie o conteúdo de `backend/migrations/006_create_propostas_comerciais.sql`
2. Aceda ao painel **Plesk** → **Databases** → select a base `fernando_winove_com_br_`
3. Clique em **SQL Editor** (ou phpMyAdmin)
4. Cole o SQL e execute

---

### 4. Reiniciar Serviço Node no Plesk

**Passos:**

1. Aceda a **Plesk** → **Domains** → seu domínio → **Node.js**
2. Clique em **Restart Application** (ou "Stop" depois "Start")
3. Aguarde ~10 segundos
4. Verifique em **Application Status** se está "running"

---

### 5. Validar Rota /api/propostas/schema

Após reiniciar, teste o endpoint schema (não requer POST nem JSON complexo):

**Via Browser:**
1. Abra: `https://winove.com.br/api/propostas/schema`
2. Na janela de autenticação, digite:
   - User: `comercial`
   - Password: `VfY9KO`
3. Você deve receber JSON:
   ```json
   {
     "ok": true,
     "columns": ["id", "nome", "email", ...]
   }
   ```

**Via curl (PowerShell):**
```powershell
curl.exe -i -u "comercial:VfY9KO" "https://winove.com.br/api/propostas/schema"
```

**Se receber:**
- `{ "ok": true, ... }` → Schema está válido. Prossiga para o Passo 6.
- `{ "erro_mapeamento": "...", "campo_problematico": [...] }` → Faltam colunas. Volta ao Passo 3.
- HTML de erro (500) → Volte ao Passo 1 (verificar variáveis) ou Passo 4 (reiniciar).

---

### 6. Testar POST /api/propostas

**Via curl (PowerShell):**

```powershell
curl.exe -i -X POST "https://winove.com.br/api/propostas" `
  -H "Content-Type: application/json" `
  -u "comercial:VfY9KO" `
  -d '{"nome":"Teste","email":"teste@example.com","empresa":"Empresa X","servicos":[{"servico":"Site","valor":"1000"}],"descricao":"Desc","prazo":"30 dias","termos":"OK","assinaturaNome":"Fulano","aceiteDigital":true}'
```

**Respostas esperadas:**

✅ **Sucesso (201):**
```json
{
  "cliente": { "nome": "Teste", ... },
  "pdf_download_url": "/api/propostas/1/pdf",
  "id": 1,
  ...
}
```

❌ **Erro de Validação (400):**
```json
{
  "erro_mapeamento": "Campos obrigatorios ausentes.",
  "campo_problematico": ["nome"]
}
```
→ Revise o payload JSON.

❌ **Erro no Banco (500):**
```json
{
  "erro_mapeamento": "falha_ao_registrar_proposta",
  "detalhe": "insert error: ..."
}
```
→ Verifique logs do Plesk (Passo 7) ou re-execute migração (Passo 3).

❌ **Página HTML de erro (500):**
→ Verifique logs do servidor (Passo 7) ou reinicie Node (Passo 4).

---

### 7. Consultar Logs do Servidor

Se ainda receber erro 500 ou JSON com `detalhe` indicando falha:

**Plesk:**
1. Aceda a **Logs** → **Access Log** ou **Error Log** do domínio
2. Procure por linhas contendo:
   - "Erro ao salvar proposta comercial"
   - "Unhandled error"
   - "ER_" (erros MySQL)
3. O stack trace indicará a causa (ex: coluna não existe, falha ao gerar PDF)

**Alternativa: Run Commands no Plesk**
1. Aceda a **Run Node.js Commands**
2. Execute:
   ```bash
   tail -f /var/log/plesk-nodejs/[app-name].log
   ```
   Reproduza a requisição POST e observe o output em tempo real.

---

## Fluxograma Rápido

```
Erro 500 em POST /api/propostas
    ↓
[Passo 1] Variáveis de ambiente definidas no Plesk? 
    ├─ NÃO → Defina e salve
    └─ SIM ↓
[Passo 2] Tabela propostas_comerciais existe?
    ├─ NÃO → [Passo 3] Executar migração
    └─ SIM ↓
[Passo 4] Reiniciar Node no Plesk
    ↓
[Passo 5] Testar GET /api/propostas/schema
    ├─ HTML 500 → Voltar a Passo 1/4
    ├─ JSON erro → Passo 3 (migração incompleta)
    └─ JSON OK ↓
[Passo 6] Testar POST /api/propostas
    ├─ 201 JSON → ✅ Sucesso! Pode usar no formulário
    ├─ 400/422 JSON → Revisar payload
    └─ 500 JSON/HTML → [Passo 7] Consultar logs
```

---

## Verificação Final

Quando tudo estiver funcionando:

1. **GET `/api/propostas/schema`** retorna `{ "ok": true }`
2. **POST `/api/propostas`** retorna `201` com JSON e `pdf_download_url`
3. Formulário React em `/comercial-propostas` consegue submeter sem erros
4. E-mails de notificação são recebidos (se MAIL_* estiver configurado)

---

## Contato e Suporte

Se ainda houver dúvidas:
- Verifique os logs (Passo 7) e procure por mensagens de erro específicas
- Execute `node diagnose-proposals.js` localmente para testar cada componente
- Consulte `docs/propostas-api-setup.md` para detalhes sobre o payload esperado
