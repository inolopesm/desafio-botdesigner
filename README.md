# desafio-botdesigner

---

> [🔗 Instruções do Desafio](https://github.com/daniel-prando/desafio-backend)

---

Projeto feito em [Nest.js](https://nestjs.com/) com [PostgreSQL](https://postgresql.org/)

## Como instalar?

### Via Node.js

**Precisa do [Node.js v18.17.1](https://nodejs.org/)**

1. Clone o repositório utilizando o git: `git clone git@github.com:inolopesm/desafio-botdesigner.git`
2. Acesse o diretório criado: `cd desafio-botdesigner`
3. Instale as dependências: `npm ci`
4. Crie o arquivo contendo as variáveis de ambiente: `cp .env.example .env`
5. Preencha o arquivo `.env` com os valores corretos
4. Inicialize a aplicação: `npm run start`

### Via docker

1. Clone o repositório utilizando o git: `git clone git@github.com:inolopesm/desafio-botdesigner.git`
2. Acesse o diretório criado: `cd desafio-botdesigner`
3. Inicialize a aplicação: `docker compose up`

## Rotas

- `POST v1/extraction/force`
- `GET v1/extraction/status`
- `GET v1/processos`
  - [Veja o DTO contendo os filtros](./src/extraction/find-processos.dto.ts)
