# Campanha do Retiro

Sistema para gerir a campanha de contribuição do retiro: registo de pagamentos,
dashboard com contagem de crianças por faixa etária e cálculo automático do
valor a pagar ao museu.

## Stack

- **Next.js 14** (App Router, TypeScript) — frontend e backend (API routes) juntos
- **Prisma + Neon (Postgres)** — base de dados
- **NextAuth (Credentials)** — login só para a Francisca e o Edvaldo, sem tabela de utilizadores
- **Vercel** — hospedagem (frontend + API routes no mesmo deploy grátis)

Não precisas de um servidor de backend separado: as rotas em `src/app/api/*`
correm como funções serverless no Vercel.

## Cálculo do museu

- 0–11 anos: **6.250 Kz por cada bloco de 25 crianças** (26 crianças = 2 blocos = 12.500 Kz)
- 12+ anos: **265 Kz por pessoa**

Lógica em `src/lib/museum.ts`.

## Correr localmente

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Criar uma base de dados grátis em [neon.tech](https://neon.tech), copiar a
   connection string "pooled" e a "direct".

3. Copiar `.env.example` para `.env` e preencher:
   ```bash
   cp .env.example .env
   ```

4. Gerar os hashes das senhas da Francisca e do Edvaldo:
   ```bash
   npm run hash-password -- "senha-da-francisca"
   npm run hash-password -- "senha-do-edvaldo"
   ```
   Cola os hashes gerados em `ADMIN_FRANCISCA_PASSWORD_HASH` e
   `ADMIN_EDVALDO_PASSWORD_HASH` no `.env`.

5. Gerar `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

6. Criar as tabelas na base de dados:
   ```bash
   npx prisma migrate dev --name init
   ```

7. Arrancar:
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000 — vai redirecionar para o login.

## Deploy no Vercel

1. Sobe este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), "Add New Project" → importa o repositório.
3. Em "Environment Variables", adiciona as mesmas variáveis do `.env`
   (com `NEXTAUTH_URL` a apontar para o domínio do Vercel, ex:
   `https://o-teu-projeto.vercel.app`).
4. Faz deploy. Depois do primeiro deploy, corre as migrations contra a
   base de dados de produção (uma vez, a partir do teu computador):
   ```bash
   npx prisma migrate deploy
   ```
   (usando o `.env` com a `DATABASE_URL`/`DIRECT_URL` de produção)

## Estrutura

```
src/
  app/
    login/              → página de login
    dashboard/          → contagens + cálculo do museu
    payments/            → lista de pagamentos
    payments/new/        → formulário de novo pagamento
    api/
      auth/[...nextauth]/ → login
      payments/           → CRUD de pagamentos
      dashboard/          → estatísticas em JSON
  lib/
    prisma.ts            → cliente Prisma
    auth.ts               → configuração do NextAuth
    museum.ts             → cálculo do valor do museu
prisma/
  schema.prisma           → modelo Payment
```
