# Controle de Gastos

App web pessoal (PWA) para controlar gastos separando o que foi pago no **meu
cartão** do que foi pago no **cartão da mãe**, incluindo as assinaturas
recorrentes (Game Pass, Claude, YouTube Premium, Spotify).

React + Vite · Tailwind CSS · Supabase (Postgres + Auth) · deploy na Vercel.

## O que ele faz

- Formulário rápido de novo gasto: descrição, valor, categoria, cartão, data e
  se é recorrente.
- Lista de lançamentos com filtro por quem pagou e por categoria.
- **Dois totais separados**, o meu e o do cartão da mãe, com a fatia de cada um.
- Seção de assinaturas, com o total mensal comprometido em cada cartão e um
  botão para lançar a cobrança do mês como gasto.
- Gráficos por categoria e por mês, os dois partidos entre os dois cartões.
- Instalável na tela de início do iPhone, abre em tela cheia e sem barra do Safari.

## Rodando local

```bash
npm install
cp .env.example .env   # preencha com os valores abaixo
npm run dev
```

As duas variáveis:

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://nwjqytsydggoibszhncr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | a *publishable key* em Supabase → Project Settings → API Keys |

Elas são chaves públicas — viajam no bundle que roda no navegador, como é o
projeto do Supabase para client-side. Quem protege os dados é o **RLS**: cada
linha tem `usuario_id` e as policies só liberam `auth.uid() = usuario_id`.

## Primeiro acesso

O app é de uso individual. Na primeira vez, toque em **Criar conta**, informe
email e senha, e confirme pelo link que o Supabase manda por email (a
confirmação vem ligada por padrão no projeto). Depois é só entrar.

Para dispensar a confirmação por email: Supabase → Authentication → Sign In /
Providers → Email → desligar *Confirm email*.

## Deploy na Vercel

O projeto não está publicado ainda — falta conectar uma conta Vercel. Com a
conta em mãos:

1. Vercel → **Add New… → Project** → importe este repositório do GitHub.
2. O framework é detectado como Vite (`npm run build`, saída em `dist`); o
   `vercel.json` do repositório já cuida do rewrite de SPA e do cache.
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY` com os mesmos valores do `.env`, marcando
   Production, Preview e Development.
4. **Deploy**. Cada push na branch passa a gerar um deploy novo.

Pela CLI dá no mesmo:

```bash
npx vercel login
npx vercel link
npx vercel env add VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_ANON_KEY
npx vercel --prod
```

## Instalando no iPhone

Abra o link da Vercel no Safari → botão de compartilhar → **Adicionar à Tela de
Início**. O ícone e o nome já vêm do `manifest.webmanifest`.

## Banco de dados

O schema está em `supabase/migrations/0001_gastos_e_assinaturas.sql` e já foi
aplicado no projeto. Duas tabelas, `gastos` e `assinaturas`, ambas com RLS
ligado. Mudanças de schema entram como um arquivo novo em `supabase/migrations/`,
nunca editando uma migration já aplicada.

## Estrutura

```
src/
  lib/          client do Supabase, constantes de domínio, formatação, agregações
  hooks/        acesso a dados (useAuth, useGastos, useAssinaturas)
  componentes/  UI, um arquivo por componente
  App.jsx       abas, filtros e estado de sessão
supabase/migrations/   schema versionado
public/                manifest, service worker e ícones do PWA
```

As convenções do projeto estão em `CLAUDE.md`.
