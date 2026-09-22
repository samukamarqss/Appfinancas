import { LISTA_CARTOES } from '../lib/constantes'

/** Com duas series no grafico a legenda e sempre presente: identidade nunca so por cor. */
export function LegendaCartoes() {
  return (
    <ul className="flex items-center gap-4">
      {LISTA_CARTOES.map((cartao) => (
        <li key={cartao.id} className="flex items-center gap-1.5 text-[12px] text-texto-suave">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: cartao.cor }}
            aria-hidden="true"
          />
          {cartao.curto}
        </li>
      ))}
    </ul>
  )
}
