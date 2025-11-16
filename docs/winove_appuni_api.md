# Winove API para AppUni

Este guia explica como implantar e integrar a API da Winove no ambiente AppUni
(Plesk ou servidor compatível). A API expõe três endpoints REST consumidos pelo
seu GPT para listar templates, registrar leads e enviar notificações.

## 1. Pré-requisitos

- **Node.js 18+** disponível no host AppUni.
- **Acesso MySQL** (use as mesmas credenciais configuradas na AppUni, por
  exemplo `lweb03.appuni.com.br`, usuário `winove`, senha `9*19avmU0`, banco
  `fernando_winove_com_br_`).
- **Conta SMTP** (SendGrid, Mailgun, Amazon SES ou SMTP da hospedagem).

## 2. Estrutura do projeto

| Arquivo                  | Descrição                                                   |
| ------------------------ | ----------------------------------------------------------- |
| `winove_api_appuni.js`   | Servidor Express com as rotas `/templates`, `/leads` e `/send-email`. |
| `winove_openapi.json`    | Especificação OpenAPI 3.1 para configurar Actions no GPT.   |

Adicione um arquivo `.env` para armazenar variáveis sensíveis (não faça commit).

## 3. Configuração de ambiente

### 3.1 Variáveis de ambiente

Crie um `.env` na raiz do projeto:

```env
DB_HOST=lweb03.appuni.com.br
DB_PORT=3306
DB_USER=winove
DB_PASS=9*19avmU0
DB_NAME=fernando_winove_com_br_

MAIL_HOST=smtp.seuprovedor.com
MAIL_PORT=587
MAIL_USER=usuario@dominio.com
MAIL_PASS=senha_do_email

CONTACT_EMAIL=destinatario@winove.com.br

PORT=3000
```

Adapte os valores para o seu ambiente real.

### 3.2 Dependências

Instale as bibliotecas necessárias:

```bash
npm install express mysql2 nodemailer dotenv
```

O servidor já importa `dotenv`, portanto nenhuma alteração é necessária.

## 4. Endpoints

### GET `/templates`

Consulta a tabela `templates` retornando `id`, `nome`, `descricao`, `preco` e
`url_demo`.

### POST `/leads`

Cria um lead com `{ nome, email*, telefone, interesse* }`. Campos marcados com
`*` são obrigatórios. Você pode adaptar para disparar e-mails automaticamente.

### POST `/send-email`

Envia os dados do lead para `CONTACT_EMAIL` via SMTP. Reutilize o mesmo payload
utilizado em `/leads`.

## 5. Configurando Actions no GPT

1. No editor de GPT, adicione uma Action e importe `winove_openapi.json`.
2. Deixe a autenticação como "Nenhum" (ou habilite ApiKeyAuth se desejar).
3. Atualize `servers[0].url` com o domínio público da sua API (por exemplo,
   `https://sua-loja.appuni.com.br/api`).
4. Instrua o GPT a coletar nome, e-mail, telefone e interesse e então:
   - chamar `create_lead` com o corpo coletado;
   - opcionalmente chamar `notify_email`;
   - confirmar ao usuário que o contato foi registrado.

## 6. Implantação


1. Copie `winove_api_appuni.js`, `winove_openapi.json` **e o seu `.env`** para o
   host AppUni/Plesk (use SCP, SFTP ou o gerenciador de arquivos do painel).
2. Garanta que o banco possua as tabelas `templates` e `leads` com as colunas
   mencionadas.
3. Configure as variáveis de ambiente (via `.env` ou painel AppUni). Um
   arquivo de exemplo chamado `.env.appuni.example` está disponível neste
   repositório; renomeie-o para `.env` e personalize.
4. No terminal do servidor, instale as dependências e inicie a API:

   ```bash
   npm install express mysql2 nodemailer dotenv

1. Envie `winove_api_appuni.js` e `winove_openapi.json` para o servidor.
2. Garanta que o banco possua as tabelas `templates` e `leads` com as colunas
   mencionadas.
3. Configure as variáveis de ambiente (via `.env` ou painel AppUni).
4. Inicie o app:

   ```bash

   node winove_api_appuni.js
   ```

   Em produção utilize o PM2:

   ```bash
   npm install -g pm2
   pm2 start winove_api_appuni.js --name winove-api
   ```


5. Teste os endpoints com `curl` (ajuste domínio/porta conforme necessário):

   ```bash
   curl -X GET  https://seu-dominio/api/templates
   curl -X POST https://seu-dominio/api/leads \
     -H 'Content-Type: application/json' \
     -d '{"nome":"Teste","email":"teste@dominio.com","interesse":"Site"}'
   curl -X POST https://seu-dominio/api/send-email \
     -H 'Content-Type: application/json' \
     -d '{"email":"teste@dominio.com","interesse":"Site"}'
   ```

   Você também pode abrir as URLs `/templates`, `/leads` e `/send-email` em um
   navegador (para POSTs use uma ferramenta como Postman ou Insomnia).

5. Teste os endpoints, por exemplo `https://seu-dominio/api/templates`.


## 7. Observações

- A versão básica não implementa autenticação. Para aumentar a segurança,
  configure ApiKey ou OAuth e valide o token nos headers.
- Se preferir não usar banco para templates, substitua a query por um array
  estático.
- Personalize o corpo do e-mail enviado para refletir a identidade da marca.
- Atualize sua política de privacidade e informe o usuário ao coletar dados
  pessoais.
