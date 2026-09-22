/** Escolha de cartao como dois botoes grandes, mais rapido que um select no iPhone. */
export function SeletorCartao({ rotulo, valor, aoEscolher, opcoes }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-[13px] font-medium text-texto-suave">{rotulo}</legend>
      <div className="grid grid-cols-2 gap-2">
        {opcoes.map((cartao) => {
          const ativo = cartao.id === valor
          return (
            <button
              key={cartao.id}
              type="button"
              onClick={() => aoEscolher(cartao.id)}
              aria-pressed={ativo}
              className={`rounded-xl border px-3 py-2.5 text-[14px] transition-colors ${
                ativo ? 'border-transparent font-medium' : 'border-borda text-texto-suave'
              }`}
              style={
                ativo
                  ? {
                      backgroundColor: `color-mix(in srgb, ${cartao.cor} 20%, transparent)`,
                      color: cartao.corTexto,
                      borderColor: cartao.cor,
                    }
                  : undefined
              }
            >
              {cartao.rotulo}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
