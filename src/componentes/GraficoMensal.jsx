import { useState } from 'react'
import { CARTOES } from '../lib/constantes'
import { formatarMoeda } from '../lib/formato'
import { LegendaCartoes } from './LegendaCartoes'
import { EstadoVazio } from './Secao'
import { TabelaDados } from './TabelaDados'

const ALTURA_PLOT = 132

/**
 * Colunas empilhadas por mes. No iPhone nao existe hover, entao a leitura de
 * valor exato e por toque: a coluna escolhida mostra o detalhe acima do grafico.
 */
export function GraficoMensal({ linhas }) {
  const [selecionada, setSelecionada] = useState(null)

  if (linhas.length === 0) {
    return <EstadoVazio>Ainda não há meses com lançamentos.</EstadoVazio>
  }

  const maior = Math.max(...linhas.map((l) => l.total))
  const emFoco = linhas.find((l) => l.chave === selecionada) ?? linhas[linhas.length - 1]

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] text-texto-fraco">{emFoco.rotulo}</p>
          <p className="text-[20px] font-semibold tabular-nums">{formatarMoeda(emFoco.total)}</p>
          <p className="mt-0.5 text-[12px] text-texto-suave">
            <span style={{ color: CARTOES.meu.corTexto }}>{formatarMoeda(emFoco.meu)}</span>
            {' · '}
            <span style={{ color: CARTOES.mae.corTexto }}>{formatarMoeda(emFoco.mae)}</span>
          </p>
        </div>
        <LegendaCartoes />
      </div>

      <div className="flex items-end gap-2" style={{ height: ALTURA_PLOT }}>
        {linhas.map((linha) => {
          const ativa = linha.chave === emFoco.chave
          return (
            <button
              key={linha.chave}
              type="button"
              onClick={() => setSelecionada(linha.chave)}
              aria-pressed={ativa}
              aria-label={`${linha.rotulo}: ${formatarMoeda(linha.total)}`}
              className="flex h-full min-w-0 max-w-[64px] flex-1 flex-col justify-end gap-1.5"
            >
              {/* A selecao e marcada por regua e rotulo, nunca esmaecendo a cor:
                  baixar a opacidade desloca a matiz e confunde as duas series. */}
              <div
                className="flex w-full flex-col justify-end gap-[2px] overflow-hidden rounded-t-[4px]"
                style={{ height: `${Math.max((linha.total / maior) * 100, 2)}%` }}
              >
                {linha.mae > 0 && (
                  <div
                    style={{
                      height: `${(linha.mae / linha.total) * 100}%`,
                      backgroundColor: CARTOES.mae.cor,
                    }}
                  />
                )}
                {linha.meu > 0 && (
                  <div
                    style={{
                      height: `${(linha.meu / linha.total) * 100}%`,
                      backgroundColor: CARTOES.meu.cor,
                    }}
                  />
                )}
              </div>
              <span
                className={`truncate border-t-2 pt-1 text-[10px] transition-colors ${
                  ativa ? 'border-texto-suave text-texto-suave' : 'border-borda text-texto-fraco'
                }`}
              >
                {linha.rotulo}
              </span>
            </button>
          )
        })}
      </div>

      <TabelaDados rotuloColuna="Mês" linhas={linhas} />
    </div>
  )
}
