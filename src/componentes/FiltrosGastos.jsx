import { CATEGORIAS, LISTA_CARTOES } from '../lib/constantes'

/** Filtros por quem pagou e por categoria, em linha rolavel. */
export function FiltrosGastos({ filtros, aoAlterar }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Pilulas
        aria-label="Filtrar por cartão"
        valor={filtros.cartao}
        aoEscolher={(cartao) => aoAlterar({ ...filtros, cartao })}
        opcoes={[
          { valor: 'todos', rotulo: 'Todos' },
          ...LISTA_CARTOES.map((c) => ({ valor: c.id, rotulo: c.curto, cor: c.cor })),
        ]}
      />
      <Pilulas
        aria-label="Filtrar por categoria"
        valor={filtros.categoria}
        aoEscolher={(categoria) => aoAlterar({ ...filtros, categoria })}
        opcoes={[
          { valor: 'todas', rotulo: 'Todas' },
          ...CATEGORIAS.map((c) => ({ valor: c, rotulo: c })),
        ]}
      />
    </div>
  )
}

function Pilulas({ valor, aoEscolher, opcoes, ...props }) {
  return (
    <div
      role="group"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      {...props}
    >
      {opcoes.map((opcao) => {
        const ativa = opcao.valor === valor
        return (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => aoEscolher(opcao.valor)}
            aria-pressed={ativa}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
              ativa
                ? 'border-transparent bg-texto text-fundo font-medium'
                : 'border-borda text-texto-suave'
            }`}
            style={ativa && opcao.cor ? { backgroundColor: opcao.cor } : undefined}
          >
            {opcao.rotulo}
          </button>
        )
      })}
    </div>
  )
}
