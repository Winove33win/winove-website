# Welcome to your Winove project

## Project info

**URL**: www.winove.com.br
## How can I edit this code?

There are several ways of editing your application.

**Use Winove**

Simply visit the www.winove.com.br

Changes made via Winove will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Winove.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

This project uses Node.js **18.19.0**. Configure this version in Plesk and run `nvm use` locally (using the provided `.nvmrc`) to match the server environment.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Create a `.env` file based on `.env.example` (required for builds).
cp .env.example .env
# Ensure the `VITE_API_URL` variable is present. For production it should be
# `https://winove.com.br/api`.
# When the backend is served from a different domain or port, set
# `VITE_API_URL` to that backend's base URL (e.g. `https://example.com/api`).
# If undefined, the application defaults to `/api` and assumes the backend is
# hosted under the same domain.

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Backend dependencies

The local server relies on the following packages:

- **express** – API server framework
- **mysql2** – MySQL client with promise support
- **stripe** – Stripe API client
- **dotenv** – load environment variables from `.env`
- **nodemailer** – envio de notificações SMTP

### Backend environment variables

Algumas rotas do backend, como `/api/propostas`, dependem das seguintes
variáveis de ambiente (configure-as no painel da hospedagem ou em um arquivo
`.env` dentro de `backend/`):

- `MAIL_HOST` – host SMTP fornecido pela hospedagem/provedor de e-mail.
- `MAIL_PORT` – porta SMTP (geralmente 587 ou 465).
- `MAIL_USER` – usuário ou remetente autenticado no servidor SMTP.
- `MAIL_PASS` – senha do usuário SMTP.
- `CONTACT_EMAIL` – e-mail que receberá as propostas enviadas pelo site.

Opcionalmente, defina `MAIL_FROM` para personalizar o endereço "from". Caso
não seja informado, o valor de `MAIL_USER` será utilizado.

#### Conexão com o banco de produção

O backend lê os dados do MySQL por variáveis de ambiente (`DB_HOST`,
`DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`). Um template pronto está em
`backend/.env.example`; copie-o para `backend/.env` e ajuste os valores se
precisar. Para o banco atual do Plesk, use:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=fernando_winove_com_br_
DB_USER=winove
DB_PASSWORD=9*19avmU0
```

Após salvar o `.env`, execute `node scripts/migrate.mjs` dentro da pasta
`backend/` para criar/atualizar a tabela `propostas_comerciais` e reinicie o
app no painel Node.js do Plesk para que as variáveis sejam recarregadas.

Consulte também a [checklist de liberação do painel de propostas](docs/propostas-api-setup.md)
para configurar `COMMERCIAL_PANEL_PASSWORD`, validar o schema com o endpoint
`/api/propostas/schema` e conferir o payload aceito pelo POST `/api/propostas`.

### AppUni standalone API

For AppUni/Plesk environments that require a lightweight API dedicated to GPT
Actions, this repository now ships `winove_api_appuni.js` (Express server) and

`winove_openapi.json` (schema for Actions). A ready-to-copy `.env`
template—`.env.appuni.example`—is also included. Follow the full setup guide in
`docs/winove_appuni_api.md` to configurar o `.env`, instalar dependências,
copiar os arquivos para o servidor e testar os endpoints com `curl` antes de
abrir o serviço ao público.

`winove_openapi.json` (schema for Actions). Follow the full setup guide in
`docs/winove_appuni_api.md` to configure the `.env`, install dependencies and
deploy the service alongside your main site.


## How can I deploy this project?

Simply open [Winove](https://lovable.dev/projects/47e97737-0d5b-4617-a6fc-0cc3a9fb4b6b) and click on Share -> Publish.

When building locally or running `deploy.sh`, make sure a `.env` file exists
with `VITE_API_URL` defined. The provided `deploy.sh` script will create a
minimal `.env` automatically.

### Automatic deploys

For servers that host this repository directly, the helper script
`deploy/auto-update.sh` can keep the site synchronized with the latest
commits. It fetches updates from the `main` branch and only runs the full
`deploy.sh` process when new commits are detected.

Example cron entry to check for changes every five minutes:

```
*/5 * * * * /var/www/vhosts/winove.com.br/httpdocs/deploy/auto-update.sh >> /var/log/winove-deploy.log 2>&1
```

This approach avoids rebuilding when there are no changes while ensuring new
deployments happen automatically.

## Can I connect a custom domain to my Winove project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Offline database setup

An SQL dump file named `winove_offline.sql` is included in the repository. It creates the `Winove-new` database with sample tables and data used by the project. To import the dump on your server, execute:

```sh
mysql -u fernandowinove -p Winove-new < winove_offline.sql
```

You can also use phpMyAdmin or another GUI to import the file manually.

## Offline JSON mode

For development without a running MySQL server, set `USE_JSON_DB=true` in
`backend/.env`. The API will then read data from the JSON files located in
`backend/data/`, allowing the blog and cases pages to function entirely
offline.

## Testing database connectivity

Use the `testFullConnection.js` script to diagnose network issues and test the
database connection. Run it with Node:

```sh
node testFullConnection.js
```

If your database requires whitelisting a fixed IP, you can discover the public
IP address of this Codex environment with:

```sh
curl ifconfig.me
```

---

## 📦 Scripts de Banco de Dados (Winove)

Este projeto inclui scripts utilitários para interagir com o banco de dados MySQL.

### ▶️ Scripts incluídos

| Arquivo                      | Função                                               |
|-----------------------------|-------------------------------------------------------|
| `testConnection.js`         | Testa a conexão com o banco                          |
| `createTable.js`            | Cria a tabela `pagamentos`                           |
| `insertData.js`             | Insere dados fictícios                               |
| `selectData.js`             | Busca dados da tabela                                |
| `grant-access.sql`          | Libera acesso externo ao banco para um IP remoto     |
| `conectar-banco-winove.bat` | Executa o teste de conexão com um clique (Windows)   |

### 🛠️ Instruções

1. Execute os scripts com Node.js:

```bash
node createTable.js
node insertData.js
node selectData.js

GRANT ALL PRIVILEGES ON fernando_winove_com_br.* TO 'Winove'@'%' IDENTIFIED BY '9*19avmU0';
FLUSH PRIVILEGES;
