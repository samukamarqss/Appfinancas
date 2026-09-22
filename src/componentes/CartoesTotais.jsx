import { CARTOES } from '../lib/constantes'
import { formatarMoeda } from '../lib/formato'

/** Os dois totais separados, a pergunta central do app. */
export function CartoesTotais({ totalPorCartao }) {
  const total = totalPorCartao.meu + totalPorCartao.mae

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <CartaoTotal cartao={CARTOES.meu} valor={totalPorCartao.meu} total={total} />
        <CartaoTotal cartao={CARTOES.mae} valor={totalPorCartao.mae} total={total} />
      </div>
      <p className="text-center text-[13px] text-texto-fraco">
        Total no período: <span className="text-texto-suave">{formatarMoeda(total)}</span>
      </p>
    </div>
  )
}

function CartaoTotal({ cartao, valor, total }) {
  const fatia = total > 0 ? Math.round((valor / total) * 100) : 0

  return (
    <div className="rounded-2xl border border-borda bg-superficie p-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: cartao.cor }}
          aria-hidden="true"
        />
        <span className="text-[13px] text-texto-suave">{cartao.rotulo}</span>
      </div>
      <p
        className="mt-2 text-[22px] font-semibold tracking-tight tabular-nums"
        style={{ color: cartao.corTexto }}
      >
        {formatarMoeda(valor)}
      </p>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-superficie-alta">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${fatia}%`, backgroundColor: cartao.cor }}
        />
      </div>
      <p className="mt-1.5 text-[12px] text-texto-fraco">{fatia}% do total</p>
    </div>
  )
}
