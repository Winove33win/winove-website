# Diagnóstico do erro 500 em `POST /api/leads`

Este guia consolida as hipóteses levantadas durante a investigação do erro 500 observado no endpoint `POST /api/leads` e lista ações práticas para restabelecer o funcionamento correto da API.

## Sintoma

Chamadas ao endpoint `POST /api/leads` retornam `HTTP 500` mesmo quando o banco de dados aparenta estar funcionando e a tabela `leads` contém todas as colunas esperadas.

## Hipóteses analisadas

1. **Log do endpoint não exposto**  
   O bloco `try/catch` do endpoint já captura exceções, porém somente registra `POST /api/leads error` no console, retornando `{"error":"internal_error"}` para o cliente. Em ambientes Plesk (Passenger), essa saída geralmente fica em `/var/log/passenger/passenger.log`, não aparecendo no painel padrão. Sem acesso ao log real, a pilha de erro fica oculta.
2. **Validação ou SQL silenciosos**  
   A validação de `nome`, `email` e `interesse` retorna `400` quando falha, portanto um `500` indica que os campos obrigatórios chegaram corretamente. A query usa placeholders e os mesmos sete campos existentes na tabela (`nome`, `email`, `telefone`, `interesse`, `origem`, `mensagem`, `extra`), tornando improvável um erro de sintaxe. Ainda assim, restrições de tamanho/ENUM ou dados `null` em colunas `NOT NULL` podem gerar exceções SQL.
3. **Campo `extra` mal formado**  
   Campos adicionais são reunidos em um objeto e serializados com `JSON.stringify`. Se o cliente enviar um campo `extra` já serializado como string, o banco receberá um JSON com string aninhada, o que não causa exceção. Porém, se a coluna `extra` for `NOT NULL` e o backend enviar `null`, a inserção falha.
4. **Logs suprimidos pelo ambiente**  
   Mesmo que o backend registre o erro, o Plesk não exibe o `stdout/stderr` da aplicação automaticamente. Sem ler o arquivo de log correto, parece que “não há detalhes do erro”.

## Recomendações práticas

1. **Registrar detalhes completos**  
   Atualize o endpoint para registrar `err.message`, `err.stack` e detalhes do MySQL (já implementado em `backend/routes/leads.js`). Assim, qualquer falha fica visível no log.
2. **Testar payload mínimo válido**  
   Envie somente `nome`, `email` e `interesse` via `curl` para confirmar se o fluxo básico funciona. Adicione outros campos gradualmente para descobrir se algum valor específico dispara o erro.
3. **Verificar credenciais/conectividade**  
   Confirme que `host`, `user`, `password` e `database` usados pela API são os mesmos das inserções manuais. Execute um `SELECT 1` ou utilize o endpoint `/api/health` (se existir) para validar a conexão MySQL a partir do Node.
4. **Observar restrições da tabela**  
   Cheque se alguma coluna da tabela `leads` é `NOT NULL` sem default ou possui `ENUM`/limites de tamanho. Ajuste o payload (ou a tabela) para garantir compatibilidade.
5. **Conferir o envio de campos extras**  
   Oriente o frontend a enviar campos adicionais como propriedades normais do JSON (por exemplo, `"origem": "Facebook"`), deixando o backend consolidá-los em `extra`. Evite enviar `extra` já serializado.
6. **Acessar os logs corretos no Plesk**  
   Via SSH ou File Manager, abra `/var/log/passenger/passenger.log` (ou use o Log Browser do Plesk) para capturar a stack trace completa durante o erro 500.

Seguindo os passos acima é possível identificar a causa raiz (geralmente ligada a uma exceção MySQL) e restaurar o funcionamento do endpoint.
