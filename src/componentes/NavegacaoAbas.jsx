const TRACO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function IconeLancamentos() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden="true" {...TRACO}>
      <path d="M5 3.5h14v17l-2.3-1.6-2.3 1.6-2.4-1.6-2.3 1.6L7.4 19 5 20.5z" />
      <path d="M9 8.5h6M9 12.5h6" />
    </svg>
  )
}

function IconeAssinaturas() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden="true" {...TRACO}>
      <path d="M4 10a8 8 0 0 1 13.3-4.6L20 8" />
      <path d="M20 4.5V8h-3.5" />
      <path d="M20 14a8 8 0 0 1-13.3 4.6L4 16" />
      <path d="M4 19.5V16h3.5" />
    </svg>
  )
}

function IconeGraficos() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden="true" {...TRACO}>
      <path d="M6.5 19v-6M12 19V6m5.5 13v-9" />
      <path d="M3.5 20.5h17" />
    </svg>
  )
}

export const ABAS = [
  { id: 'gastos', rotulo: 'Gastos', Icone: IconeLancamentos },
  { id: 'assinaturas', rotulo: 'Assinaturas', Icone: IconeAssinaturas },
  { id: 'graficos', rotulo: 'Gráficos', Icone: IconeGraficos },
]

/** Barra inferior fixa, o padrao de navegacao do iPhone. */
export function NavegacaoAbas({ abaAtiva, aoTrocar }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-borda bg-fundo/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg">
        {ABAS.map(({ id, rotulo, Icone }) => {
          const ativa = id === abaAtiva
          return (
            <button
              key={id}
              type="button"
              onClick={() => aoTrocar(id)}
              aria-current={ativa ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                ativa ? 'text-meu-texto' : 'text-texto-fraco'
              }`}
            >
              <Icone />
              {rotulo}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
