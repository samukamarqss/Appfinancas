const CLASSES_CONTROLE =
  'w-full rounded-xl border border-borda bg-superficie-alta px-3 py-2.5 text-texto ' +
  'placeholder:text-texto-fraco outline-none transition-colors focus:border-meu'

/** Label + controle. `children` recebe as classes ja prontas via render prop. */
export function Campo({ rotulo, dica, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-texto-suave">{rotulo}</span>
      {children(CLASSES_CONTROLE)}
      {dica && <span className="text-[12px] text-texto-fraco">{dica}</span>}
    </label>
  )
}

export function CampoTexto({ rotulo, dica, ...props }) {
  return (
    <Campo rotulo={rotulo} dica={dica}>
      {(classes) => <input className={classes} {...props} />}
    </Campo>
  )
}

export function CampoSelecao({ rotulo, dica, opcoes, ...props }) {
  return (
    <Campo rotulo={rotulo} dica={dica}>
      {(classes) => (
        <select className={`${classes} appearance-none`} {...props}>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      )}
    </Campo>
  )
}
