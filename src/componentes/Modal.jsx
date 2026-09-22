import { useEffect } from 'react'

/** Folha que sobe de baixo, o padrao de formulario no iPhone. */
export function Modal({ titulo, aberto, aoFechar, children }) {
  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (evento) => evento.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberto, aoFechar])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={aoFechar}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl border border-borda bg-superficie p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-3xl sm:pb-5"
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold">{titulo}</h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="-mr-1 rounded-lg px-2 py-1 text-[22px] leading-none text-texto-fraco active:text-texto"
          >
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
