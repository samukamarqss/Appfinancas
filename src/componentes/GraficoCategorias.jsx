import { CARTOES } from '../lib/constantes'
import { formatarMoeda } from '../lib/formato'
import { LegendaCartoes } from './LegendaCartoes'
import { EstadoVazio } from './Secao'
import { TabelaDados } from './TabelaDados'

/**
 * Barras horizontais empilhadas: magnitude por categoria, partida entre os dois
 * cartoes. Cada linha e rotulada direto com nome e valor, entao a cor so reforca
 * de quem foi a fatia.
 */
export function GraficoCategorias({ linhas }) {
  if (linhas.length === 0) {
    return <EstadoVazio>Sem gastos no período para montar o gráfico.</EstadoVazio>
  }

  const maior = Math.max(...linhas.map((l) => l.total))

  return (
    <div className="flex flex-col gap-3.5">
      <LegendaCartoes />

      <ul className="flex flex-col gap-3">
        {linhas.map((linha) => (
          <li key={linha.chave}>
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="truncate text-texto-suave">{linha.rotulo}</span>
              <span className="shrink-0 tabular-nums">{formatarMoeda(linha.total)}</span>
            </div>

            <div
              className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-superficie-alta"
              role="img"
              aria-label={`${linha.rotulo}: ${formatarMoeda(linha.meu)} no meu cartão e ${formatarMoeda(linha.mae)} no cartão da mãe`}
            >
              {/* Largura relativa a maior categoria, para comparar de relance. */}
              <div className="flex h-full gap-[2px]" style={{ width: `${(linha.total / maior) * 100}%` }}>
                {linha.meu > 0 && (
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(linha.meu / linha.total) * 100}%`,
                      backgroundColor: CARTOES.meu.cor,
                    }}
                  />
                )}
                {linha.mae > 0 && (
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(linha.mae / linha.total) * 100}%`,
                      backgroundColor: CARTOES.mae.cor,
                    }}
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <TabelaDados rotuloColuna="Categoria" linhas={linhas} />
    </div>
  )
}
