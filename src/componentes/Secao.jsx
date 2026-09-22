/** Bloco de conteudo com titulo, o container padrao das telas. */
export function Secao({ titulo, acao, children }) {
  return (
    <section className="flex flex-col gap-3">
      {(titulo || acao) && (
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-texto-fraco">
            {titulo}
          </h2>
          {acao}
        </header>
      )}
      {children}
    </section>
  )
}

export function EstadoVazio({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-borda px-4 py-8 text-center text-[14px] text-texto-fraco">
      {children}
    </p>
  )
}

export function Aviso({ children }) {
  if (!children) return null
  return (
    <p className="rounded-xl border border-perigo/40 bg-perigo/10 px-3 py-2 text-[13px] text-perigo">
      {children}
    </p>
  )
}
