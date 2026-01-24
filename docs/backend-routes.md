# Rotas do backend Winove (Express, PHP e serviços auxiliares)

Este documento resume como o backend principal e serviços auxiliares expõem rotas, com ênfase em quais endpoints consultam o banco de dados.

## Backend principal (Express)

Arquivo: `backend/index.js`

### Registro dos grupos de rotas

O servidor Express monta os principais grupos de rotas da API e rotas de SEO:

- `/api` → blog (posts, busca, categorias, slug).
- `/api/cases` → cases.
- `/api/templates` → templates.
- `/api/leads` → leads.
- `/api/propostas` → envio de e-mail (propostas/comercial).
- `/` → rotas de SEO de posts (HTML e JSON).
- `/sitemap.xml` → sitemap dinâmico.
- `/api/health` e `/api/health/db` → health-check.
- Fallback `/api` → 404 para rotas desconhecidas.

Referência: `backend/index.js`.【F:backend/index.js†L162-L302】

### Rotas que consultam banco de dados

#### Blog (Express) — `/api/blog-posts`, `/api/blog-posts/search`, etc.

Arquivo: `backend/routes/blog.js`.

- `GET /api/blog-posts`
  - Lista posts com paginação (`limit`, `offset`) ou `?all=1`.
  - Filtra por categoria (`?category=...`).
  - Faz `COUNT(*)` e `SELECT ... FROM blog_posts`.
- `GET /api/blog-posts/categories`
  - Agrupa e conta categorias (`GROUP BY categoria`).
- `GET /api/blog-posts/search`
  - Busca por `q` e `category` com paginação.
  - Monta `WHERE` dinâmico com `LIKE` em `titulo`, `resumo`, `conteudo`.
- `GET /api/blog-posts/:slug`
  - Busca post específico por `slug` e retorna 404 se não encontrar.

Referência: `backend/routes/blog.js`.【F:backend/routes/blog.js†L160-L352】

#### Cases — `/api/cases`

Arquivo: `backend/routes/cases.js`.

- `GET /api/cases`
  - Lista cases com paginação (`page`, `pageSize`).
  - `SELECT ... FROM cases ORDER BY created_at DESC LIMIT/OFFSET`.
- `GET /api/cases/:slug`
  - Busca case pelo `slug`, retorna 404 se não existir.

Referência: `backend/routes/cases.js`.【F:backend/routes/cases.js†L44-L143】

#### Templates — `/api/templates`

Arquivo: `backend/routes/templates.js`.

- `GET /api/templates`
  - Lista templates (`SELECT ... FROM templates`).
- `GET /api/templates/:slug`
  - Busca template específico por `slug`.

Referência: `backend/routes/templates.js`.【F:backend/routes/templates.js†L111-L149】

#### Leads — `/api/leads` e `/api/leads/libras`

Arquivo: `backend/routes/leads.js`.

- `POST /api/leads`
  - Salva lead na tabela configurada (default: `leads`).
- `POST /api/leads/libras`
  - Salva lead na tabela configurada (default: `leads_libras`).

Referência: `backend/routes/leads.js`.【F:backend/routes/leads.js†L50-L159】

#### Post SEO / HTML por slug — `/blog/:slug` e `/api/post/:slug/seo`

Arquivo: `backend/routes/postSeo.js`.

- `GET /blog/:slug`
  - Busca post no banco e renderiza HTML com metatags e JSON-LD.
- `GET /api/post/:slug/seo`
  - Retorna JSON com meta tags e JSON-LD.

Referência: `backend/routes/postSeo.js`.【F:backend/routes/postSeo.js†L30-L235】

#### Sitemap — `/sitemap.xml`

Arquivo: `backend/routes/sitemap.js`.

- Consulta `blog_posts` e `templates` para montar sitemap dinâmico.
- Em caso de falha, retorna versão estática (sem 500).

Referência: `backend/routes/sitemap.js`.【F:backend/routes/sitemap.js†L24-L111】

### Rotas que **não** consultam banco

- `/api/propostas` (envio de e-mail via SMTP, protegido por Basic Auth).
- `/api/health` e `/api/health/db` (health-check).

Referência: `backend/index.js`.【F:backend/index.js†L240-L302】

## APIs legadas em PHP (httpdocs/api)

Endpoints PHP antigos/alternativos (prováveis para ambiente `httpdocs`).

- `GET /api/blog-posts.php`
  - Lista todos os posts (`SELECT ... FROM blog_posts`), sem paginação.
- `GET /api/blog-posts-search.php`
  - Busca por texto e categoria com paginação.
- `GET /api/blog-posts-categories.php`
  - Lista categorias e contagem (`GROUP BY`).
- `GET /api/blog-posts-by-slug.php`
  - Busca por slug e retorna 404 se não existir.

Referências: `httpdocs/api/*.php`.【F:httpdocs/api/blog-posts.php†L1-L30】【F:httpdocs/api/blog-posts-search.php†L1-L67】【F:httpdocs/api/blog-posts-categories.php†L1-L27】【F:httpdocs/api/blog-posts-by-slug.php†L1-L35】

## Stripe system (serviço separado)

Pasta: `winove-stripe-system/src`.

- `POST /create-checkout-session`
  - Cria sessão de checkout no Stripe (não usa banco).
- `POST /webhook`
  - Processa webhook e chama `salvarPagamento(session)` (grava em `pagamentos`).

Referência: `winove-stripe-system/src/server.js`.【F:winove-stripe-system/src/server.js†L1-L70】

## API AppUni (servidor Express separado)

Arquivo: `winove_api_appuni.js`.

- `GET /health` — health-check simples.
- `GET /templates` — consulta banco (templates).
- `POST /leads` — insere lead em banco.
- `POST /send-email` — envia e-mail via SMTP (sem banco).

Referência: `winove_api_appuni.js`.【F:winove_api_appuni.js†L1-L163】

## Resumo rápido: quais rotas acessam o banco?

**Acessam banco:**

- `/api/blog-posts`, `/api/blog-posts/search`, `/api/blog-posts/categories`, `/api/blog-posts/:slug` (Express).
- `/api/cases` e `/api/cases/:slug` (Express).
- `/api/templates` e `/api/templates/:slug` (Express).
- `/api/leads` e `/api/leads/libras` (Express).
- `/blog/:slug` e `/api/post/:slug/seo` (Express).
- `/sitemap.xml` (Express).
- `/api/*.php` em `httpdocs` (PHP).
- `/webhook` (Stripe) — grava em `pagamentos`.
- `/templates` e `/leads` (AppUni).

Referências: `backend/routes/*`, `httpdocs/api/*.php`, `winove-stripe-system/src/server.js`, `winove_api_appuni.js`.【F:backend/routes/blog.js†L160-L352】【F:backend/routes/cases.js†L44-L143】【F:backend/routes/templates.js†L111-L149】【F:backend/routes/leads.js†L50-L159】【F:backend/routes/postSeo.js†L30-L235】【F:backend/routes/sitemap.js†L24-L111】【F:httpdocs/api/blog-posts.php†L1-L30】【F:httpdocs/api/blog-posts-search.php†L1-L65】【F:httpdocs/api/blog-posts-categories.php†L1-L26】【F:httpdocs/api/blog-posts-by-slug.php†L1-L36】【F:winove-stripe-system/src/server.js†L15-L58】【F:winove_api_appuni.js†L60-L133】

**Não acessam banco:**

- `/api/propostas` (envio de e-mail via SMTP).
- `/api/health` e `/api/health/db` (health-check).
- `/create-checkout-session` (Stripe, sem banco).
- `/send-email` (AppUni — SMTP).

Referências: `backend/index.js`, `winove-stripe-system/src/server.js`, `winove_api_appuni.js`.【F:backend/index.js†L240-L302】【F:winove-stripe-system/src/server.js†L15-L58】【F:winove_api_appuni.js†L60-L133】
