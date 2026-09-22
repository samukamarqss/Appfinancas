-- Migration 0001: schema inicial do controle de gastos.
-- Aplicada no projeto Supabase do app. Nao edite este arquivo depois de aplicado;
-- mudancas de schema entram como uma migration nova.

-- Assinaturas recorrentes (Game Pass, Claude, YouTube Premium, Spotify...)
create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade,
  nome text not null check (length(trim(nome)) > 0),
  valor_mensal numeric(12, 2) not null check (valor_mensal > 0),
  cartao text not null check (cartao in ('meu', 'mae')),
  categoria text not null default 'Assinaturas',
  dia_cobranca smallint check (dia_cobranca between 1 and 31),
  ativa boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Lancamentos individuais. assinatura_id e nulo para compras avulsas.
create table if not exists public.gastos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade,
  descricao text not null check (length(trim(descricao)) > 0),
  valor numeric(12, 2) not null check (valor > 0),
  categoria text not null,
  cartao text not null check (cartao in ('meu', 'mae')),
  data date not null default current_date,
  recorrente boolean not null default false,
  assinatura_id uuid references public.assinaturas (id) on delete set null,
  criado_em timestamptz not null default now()
);

create index if not exists gastos_usuario_data_idx on public.gastos (usuario_id, data desc);
create index if not exists gastos_usuario_cartao_idx on public.gastos (usuario_id, cartao);
create index if not exists assinaturas_usuario_idx on public.assinaturas (usuario_id, ativa);

alter table public.assinaturas enable row level security;
alter table public.gastos enable row level security;

-- Cada usuario enxerga e escreve apenas as proprias linhas.
drop policy if exists "assinaturas_proprias_select" on public.assinaturas;
create policy "assinaturas_proprias_select" on public.assinaturas
  for select to authenticated using ((select auth.uid()) = usuario_id);

drop policy if exists "assinaturas_proprias_insert" on public.assinaturas;
create policy "assinaturas_proprias_insert" on public.assinaturas
  for insert to authenticated with check ((select auth.uid()) = usuario_id);

drop policy if exists "assinaturas_proprias_update" on public.assinaturas;
create policy "assinaturas_proprias_update" on public.assinaturas
  for update to authenticated using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

drop policy if exists "assinaturas_proprias_delete" on public.assinaturas;
create policy "assinaturas_proprias_delete" on public.assinaturas
  for delete to authenticated using ((select auth.uid()) = usuario_id);

drop policy if exists "gastos_proprios_select" on public.gastos;
create policy "gastos_proprios_select" on public.gastos
  for select to authenticated using ((select auth.uid()) = usuario_id);

drop policy if exists "gastos_proprios_insert" on public.gastos;
create policy "gastos_proprios_insert" on public.gastos
  for insert to authenticated with check ((select auth.uid()) = usuario_id);

drop policy if exists "gastos_proprios_update" on public.gastos;
create policy "gastos_proprios_update" on public.gastos
  for update to authenticated using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

drop policy if exists "gastos_proprios_delete" on public.gastos;
create policy "gastos_proprios_delete" on public.gastos
  for delete to authenticated using ((select auth.uid()) = usuario_id);
