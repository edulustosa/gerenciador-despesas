# Gerenciador de Despesas

Esse Gerenciador de Despesas é uma aplicação RESTful desenvolvida para gerenciar despesas. Ela fornece endpoints para adicionar, visualizar, atualizar e excluir despesas de forma eficiente.

## Instalação

1. Clone o repositório:

``` bash
git clone https://github.com/edulustosa/gerenciador-despesas.git
```

2. Instale as dependências:

``` bash
cd gerenciador-despesas
npm install
```

3. Configure as variáveis de ambiente:

Renomeie o arquivo `.env.example` para `.env` e atualize as variáveis de ambiente conforme necessário.

4. Rode as migrations:

``` bash
npm run knex -- migrate:latest
```

5. Inicie o servidor:

``` bash
npm run dev
```

## Uso

A aplicação também está disponível aqui: <https://gerenciador-despesas-api.onrender.com>

### Endpoints

- **POST /transactions**: Adiciona uma nova transação.
- **GET /transactions**: Retorna todas as transações do usuário.
- **GET /transactions/:id**: Retorna uma despesa específica com o ID fornecido.
- **GET /transactions/summary**: Retorna o sumário das transações.
- **PUT /transactions/:id**: Atualiza uma despesa existente com o ID fornecido.
- **DELETE /transactions/:id**: Exclui uma despesa com o ID fornecido.

### Formato da transação

``` json
{
  "title": "Título transação",
  "amount": 100,
  "type": "credit ou debit"
}
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
