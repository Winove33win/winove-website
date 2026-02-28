# Plano de rotas REST e fluxo de dados (frontend → backend → MySQL)

## Reasoning Steps

1. **Definir um recurso padrão para CRUD**: usar `users` (pode ser substituído por `products`, `leads`, `orders`) para representar o conjunto básico de operações REST.
2. **Mapear CRUD para verbos HTTP**: `POST` cria, `GET` lê, `PUT/PATCH` atualiza, `DELETE` remove. Cada ação deve ter um endpoint específico e previsível.
3. **Desenhar o fluxo de dados ponta a ponta**:
   - **Frontend → Backend**: o cliente chama `https://winove.com.br/api/...` com JSON e headers de autenticação quando necessário.
   - **Backend → Banco**: o servidor abre pool MySQL com as variáveis de ambiente, executa SQL parametrizado e retorna resultados normalizados.
   - **Banco → Backend → Frontend**: o banco devolve linhas; o backend converte para JSON; o frontend exibe.
4. **Definir autenticação/autorização**: usar um login de painel comercial com `COMMERCIAL_PANEL_USERNAME` e `COMMERCIAL_PANEL_PASSWORD`. O backend retorna um token e exige `Authorization: Bearer <token>` em rotas protegidas.
5. **Documentar variáveis de ambiente relevantes**: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`, `PUBLIC_BASE_URL` e credenciais de e-mail para alertas/fluxos auxiliares.

## API Routes and Descriptions

**Base URL:** `https://winove.com.br`  
**Prefixo:** `/api`

| Método | Endpoint | Finalidade | Entrada | Saída | Auth |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | Autentica painel comercial e retorna token | `{ "username": "...", "password": "..." }` | `{ "token": "...", "expiresAt": "..." }` | Não |
| GET | `/api/users` | Lista usuários (com paginação) | `?page=1&limit=20` | `[USER_OBJECT]` | Sim |
| POST | `/api/users` | Cria novo usuário | `[USER_OBJECT_CREATE]` | `[USER_OBJECT]` | Sim |
| GET | `/api/users/:id` | Lê usuário por ID | — | `[USER_OBJECT]` | Sim |
| PUT | `/api/users/:id` | Atualiza usuário (completo) | `[USER_OBJECT_UPDATE]` | `[USER_OBJECT]` | Sim |
| PATCH | `/api/users/:id` | Atualiza usuário (parcial) | `{ "field": "value" }` | `[USER_OBJECT]` | Sim |
| DELETE | `/api/users/:id` | Remove usuário | — | `{ "deleted": true }` | Sim |

**Notas:**
- O recurso `users` é um placeholder. Substitua por `products`, `leads`, `orders` mantendo o mesmo padrão REST.
- Todas as rotas CRUD podem retornar erros padronizados: `400` (validação), `401` (não autenticado), `403` (sem permissão), `404` (não encontrado), `500` (erro interno).

## Backend–Database Connection Details

**Variáveis de ambiente (exemplo de configuração do backend):**

- `DB_HOST=lweb03.appuni.com.br`
- `DB_PORT=3306`
- `DB_USER=winove`
- `DB_PASSWORD=9*19avmU0`
- `DB_NAME=fernando_winove_com_br_`
- `PORT=3333`
- `PUBLIC_BASE_URL=https://winove.com.br`
- `MAIL_HOST=smtp.appuni.com.br`
- `MAIL_PORT=587`
- `MAIL_USER=fernando@winove.com.br`
- `MAIL_PASS=nb!mX2648`
- `COMMERCIAL_PANEL_USERNAME=comercial`
- `COMMERCIAL_PANEL_PASSWORD=VfY9KO`

**Como o backend usa essas variáveis:**

- Inicializa um pool MySQL com `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- O servidor HTTP escuta em `PORT`.
- O frontend usa `PUBLIC_BASE_URL` para construir a URL base das chamadas (`https://winove.com.br/api/...`).
- As credenciais SMTP podem ser usadas para alertas de criação/alteração, se necessário.
- O login do painel comercial valida `COMMERCIAL_PANEL_USERNAME` e `COMMERCIAL_PANEL_PASSWORD` e emite token para rotas protegidas.

**SQL típico (exemplos de CRUD):**

- Criar: `INSERT INTO users (name, email, ...) VALUES (?, ?, ...)`
- Listar: `SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`
- Buscar por ID: `SELECT * FROM users WHERE id = ?`
- Atualizar: `UPDATE users SET name = ?, email = ? WHERE id = ?`
- Remover: `DELETE FROM users WHERE id = ?`

## Example Request/Response

**Criar usuário**
```
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

[USER_OBJECT_CREATE]
```

**Resposta**
```
201 Created
Content-Type: application/json

[USER_OBJECT]
```

**Buscar usuário**
```
GET /api/users/123
Authorization: Bearer <token>
```

**Resposta**
```
200 OK
Content-Type: application/json

[USER_OBJECT]
```
