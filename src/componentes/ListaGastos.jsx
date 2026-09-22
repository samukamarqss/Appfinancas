import { CARTOES } from '../lib/constantes'
import { formatarDataCurta, formatarDataLonga, formatarMoeda } from '../lib/formato'
import { EstadoVazio } from './Secao'

export function ListaGastos({ gastos, aoRemover }) {
  if (gastos.length === 0) {
    return <EstadoVazio>Nenhum gasto por aqui. Toque no + para lançar o primeiro.</EstadoVazio>
  }

  return (
    <ul className="flex flex-col gap-2">
      {gastos.map((gasto) => (
        <ItemGasto key={gasto.id} gasto={gasto} aoRemover={aoRemover} />
      ))}
    </ul>
  )
}

function ItemGasto({ gasto, aoRemover }) {
  const cartao = CARTOES[gasto.cartao]

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-borda bg-superficie px-3.5 py-3">
      <span
        className="h-9 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: cartao.cor }}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px]">{gasto.descricao}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-texto-fraco">
          <span className="truncate">{gasto.categoria}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={gasto.data} title={formatarDataLonga(gasto.data)}>
            {formatarDataCurta(gasto.data)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{cartao.curto}</span>
          {gasto.tipo === 'assinatura' && <Etiqueta texto="assinatura" />}
          {gasto.tipo === 'parcelado' && (
            <Etiqueta texto={`${gasto.parcela_numero}/${gasto.total_parcelas}`} />
          )}
          {gasto.recorrente && (
            <Etiqueta texto="fixo" />
          )}
        </p>
      </div>

      <span className="shrink-0 text-[15px] font-medium tabular-nums">
        {formatarMoeda(gasto.valor)}
      </span>

      <button
        type="button"
        onClick={() => aoRemover(gasto)}
        aria-label={`Remover ${gasto.descricao}`}
        className="-mr-1 shrink-0 px-1.5 py-1 text-[16px] leading-none text-texto-fraco active:text-perigo"
      >
        ×
      </button>
    </li>
  )
}

function Etiqueta({ texto }) {
  return (
    <span className="shrink-0 rounded px-1 py-px text-[10px] uppercase tracking-wide text-texto-fraco ring-1 ring-borda">
      {texto}
    </span>
  )
}
