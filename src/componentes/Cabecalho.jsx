import { formatarCompetencia } from '../lib/formato'

/** Titulo, seletor de mes e sair. O mes escolhido vale para o app inteiro. */
export function Cabecalho({ competencias, competenciaAtiva, aoTrocarCompetencia, aoSair }) {
  return (
    <header className="sticky top-0 z-30 border-b border-borda bg-fundo/85 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-[19px] font-semibold tracking-tight">Gastos</h1>
          <select
            value={competenciaAtiva}
            onChange={(e) => aoTrocarCompetencia(e.target.value)}
            aria-label="Mês"
            className="appearance-none rounded-lg bg-superficie-alta px-2.5 py-1 text-[13px] text-texto-suave outline-none"
          >
            {competencias.map((chave) => (
              <option key={chave} value={chave}>
                {formatarCompetencia(chave)}
              </option>
            ))}
            <option value="todos">Tudo</option>
          </select>
        </div>

        <button
          type="button"
          onClick={aoSair}
          className="text-[13px] text-texto-fraco active:text-texto"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
