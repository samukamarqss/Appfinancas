// Funcoes puras sobre a lista de gastos. Ficam fora dos componentes para serem
// testaveis isoladamente e para o App nao virar um amontoado de reduce.

import { CATEGORIAS } from './constantes'
import { competencia, formatarCompetencia } from './formato'

/** Os meses que tem lancamento, do mais recente para o mais antigo. */
export function competenciasDisponiveis(gastos) {
  return [...new Set(gastos.map((g) => competencia(g.data)))].sort().reverse()
}

export function filtrarPorCompetencia(gastos, chave) {
  if (chave === 'todos') return gastos
  return gastos.filter((g) => competencia(g.data) === chave)
}

export function filtrarPorCartaoECategoria(gastos, { cartao, categoria }) {
  return gastos.filter(
    (g) =>
      (cartao === 'todos' || g.cartao === cartao) &&
      (categoria === 'todas' || g.categoria === categoria),
  )
}

export function totalPorCartao(gastos) {
  return gastos.reduce(
    (totais, gasto) => {
      totais[gasto.cartao] += gasto.valor
      return totais
    },
    { meu: 0, mae: 0 },
  )
}

/** Uma linha por categoria com lancamento, da maior para a menor. */
export function agruparPorCategoria(gastos) {
  const porChave = new Map()

  for (const gasto of gastos) {
    const atual = porChave.get(gasto.categoria) ?? { meu: 0, mae: 0 }
    atual[gasto.cartao] += gasto.valor
    porChave.set(gasto.categoria, atual)
  }

  return [...porChave.entries()]
    .map(([chave, valores]) => ({
      chave,
      rotulo: chave,
      ...valores,
      total: valores.meu + valores.mae,
    }))
    .sort((a, b) => b.total - a.total || CATEGORIAS.indexOf(a.chave) - CATEGORIAS.indexOf(b.chave))
}

/** Uma linha por mes, em ordem cronologica, limitada aos ultimos `limite` meses. */
export function agruparPorMes(gastos, limite = 6) {
  const porChave = new Map()

  for (const gasto of gastos) {
    const chave = competencia(gasto.data)
    const atual = porChave.get(chave) ?? { meu: 0, mae: 0 }
    atual[gasto.cartao] += gasto.valor
    porChave.set(chave, atual)
  }

  return [...porChave.entries()]
    .map(([chave, valores]) => ({
      chave,
      rotulo: formatarCompetencia(chave),
      ...valores,
      total: valores.meu + valores.mae,
    }))
    .sort((a, b) => a.chave.localeCompare(b.chave))
    .slice(-limite)
}
