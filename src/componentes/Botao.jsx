const VARIANTES = {
  primario: 'bg-meu text-fundo font-semibold active:bg-emerald-400 disabled:bg-meu/40',
  secundario:
    'bg-superficie-alta text-texto border border-borda active:bg-borda disabled:opacity-50',
  fantasma: 'text-texto-suave active:text-texto disabled:opacity-50',
  perigo: 'text-perigo active:text-red-300 disabled:opacity-50',
}

const TAMANHOS = {
  normal: 'px-4 py-3 text-[15px]',
  pequeno: 'px-3 py-1.5 text-[13px]',
}

export function Botao({
  variante = 'primario',
  tamanho = 'normal',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`rounded-xl transition-colors disabled:cursor-not-allowed ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${className}`}
      {...props}
    />
  )
}
