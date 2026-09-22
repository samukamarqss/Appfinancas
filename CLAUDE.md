# CLAUDE.md - Controle de Gastos Samuca

## Visao geral do projeto

Aplicativo web pessoal para controle de gastos do Samuca, com foco em separar
gastos pagos no cartao proprio dos gastos pagos no cartao da mae. Uso individual,
sem cadastro de outros usuarios. Backend em nuvem via Supabase, deploy publico
via Vercel. Instalavel como PWA na tela de inicio do iPhone.

## Escopo da primeira versao

- Cadastro de gastos com descricao, valor, categoria, cartao usado, data e recorrencia.
- Listagem de gastos com filtros por cartao e categoria.
- Totais separados por cartao.
- Secao de assinaturas recorrentes.
- Grafico de gastos por categoria e por mes.
- Dados salvos no Supabase, acessivel de qualquer lugar.
- Deploy publico na Vercel.

## Fora de escopo por enquanto

- Publicacao na App Store.
- Multiplos usuarios com contas separadas.
- Integracao bancaria automatica.

## Stack tecnica

- React 19 com Vite 7.
- Tailwind CSS 4 (plugin oficial do Vite, configuracao via `@theme` no CSS).
- Supabase para banco de dados Postgres e autenticacao por email e senha.
- Deploy na Vercel.
- PWA sem dependencia externa: `manifest.webmanifest` + service worker proprio.

## Convencoes de codigo

- Componentes pequenos, um componente por responsabilidade.
- Nomes de variaveis e comentarios em portugues quando fizer sentido, termos
  tecnicos da industria em ingles (`state`, `props`, `hook`, `build`, `deploy`).
- Evitar dependencias externas desnecessarias, priorizar simplicidade.
  Em particular os graficos sao SVG escrito a mao, sem biblioteca de charts.
- Design limpo e moderno, dark mode como padrao (e unico tema, nao ha toggle:
  a paleta escura esta nos tokens do `@theme`, entao nao se usa variante `dark:`).
- Variaveis de ambiente do Supabase configuradas tanto local quanto na Vercel.

## Arquitetura

```
src/
  lib/          supabase client, constantes de dominio, helpers de formato
  hooks/        acesso a dados (useAuth, useGastos, useAssinaturas)
  componentes/  UI, um arquivo por componente
  App.jsx       composicao das abas e do estado de sessao
```

Regras:

- Nenhum componente fala com o Supabase direto. Todo acesso a dados passa por um
  hook em `src/hooks/`, que expoe `{ dados, carregando, erro, acoes... }`.
- `src/lib/constantes.js` e a unica fonte de verdade para categorias e cartoes.
  Os mesmos valores estao replicados nos `CHECK` do banco; mudar um exige mudar o outro.
- Valores monetarios: `numeric(12,2)` no Postgres, `number` no JS, formatados
  para exibicao so na borda da UI via `formatarMoeda`.
- Datas de gasto sao `date` (sem fuso). Nunca usar `new Date(string)` numa data
  vinda do banco, porque o parse em UTC volta um dia; usar os helpers de `formato.js`.

## Modelo de dados

`assinaturas` — servico recorrente (Game Pass, Claude, YouTube Premium, Spotify...).
`gastos` — lancamento individual; `assinatura_id` liga um lancamento a assinatura
que o originou, e e nulo para compras avulsas.

Ambas as tabelas tem `usuario_id` com RLS ligado e policy `auth.uid() = usuario_id`.
Toda tabela nova neste projeto deve seguir o mesmo padrao.

## Fluxo de trabalho neste projeto

- Mudancas grandes de arquitetura devem ser explicadas antes de implementadas.
- Cada funcionalidade nova implementada de forma incremental e testavel isoladamente.
- Manter este arquivo atualizado sempre que uma decisao de arquitetura mudar.
- Mudancas de schema entram como um arquivo novo em `supabase/migrations/`,
  nunca editando uma migration ja aplicada.
- Antes de commitar: `npm run build` tem que passar.

## Contexto de negocio

Este e um projeto pessoal do Samuca, nao um produto para terceiros. Prioridade e
ter algo funcional rapido, rodando com link publico na Vercel, e nao criar
estrutura de empresa, marca ou infraestrutura corporativa nesta fase.
