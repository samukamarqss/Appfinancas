import { formatarMoeda } from '../lib/formato'

/**
 * Leitura alternativa dos graficos, para quem nao distingue as cores e para
 * conferir valor exato. Fica recolhida para nao competir com o grafico.
 */
export function TabelaDados({ rotuloColuna, linhas }) {
  if (linhas.length === 0) return null

  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-[12px] text-texto-fraco active:text-texto-suave">
        <span className="group-open:hidden">Ver tabela</span>
        <span className="hidden group-open:inline">Esconder tabela</span>
      </summary>
      <table className="mt-2.5 w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-texto-fraco">
            <th scope="col" className="py-1.5 text-left font-medium">
              {rotuloColuna}
            </th>
            <th scope="col" className="py-1.5 text-right font-medium">
              Eu
            </th>
            <th scope="col" className="py-1.5 text-right font-medium">
              Mãe
            </th>
            <th scope="col" className="py-1.5 text-right font-medium">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.chave} className="border-t border-borda">
              <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                {linha.rotulo}
              </th>
              <td className="py-1.5 text-right tabular-nums text-texto-suave">
                {formatarMoeda(linha.meu)}
              </td>
              <td className="py-1.5 text-right tabular-nums text-texto-suave">
                {formatarMoeda(linha.mae)}
              </td>
              <td className="py-1.5 text-right tabular-nums">{formatarMoeda(linha.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}
