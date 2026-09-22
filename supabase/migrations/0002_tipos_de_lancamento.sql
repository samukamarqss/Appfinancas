-- Lancamentos podem pertencer a uma compra parcelada. Assinaturas continuam
-- em sua propria tabela, pois nao tem uma data de encerramento.
alter table public.gastos
  add column if not exists tipo text not null default 'avulso'
    check (tipo in ('avulso', 'parcelado')),
  add column if not exists grupo_parcelas uuid,
  add column if not exists parcela_numero smallint,
  add column if not exists total_parcelas smallint;

alter table public.gastos
  add constraint gastos_parcelas_validas_check
  check (
    tipo <> 'parcelado'
    or (
      grupo_parcelas is not null
      and parcela_numero is not null
      and total_parcelas is not null
      and parcela_numero between 1 and total_parcelas
      and total_parcelas > 1
    )
  );

alter table public.assinaturas
  add column if not exists data_inicio date not null default current_date,
  add column if not exists data_fim date;

create index if not exists gastos_usuario_grupo_parcelas_idx
  on public.gastos (usuario_id, grupo_parcelas);
