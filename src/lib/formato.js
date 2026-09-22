// Helpers de formatacao e de data.
//
// Datas de gasto sao `date` no Postgres, ou seja 'AAAA-MM-DD' sem fuso. Passar
// essa string por `new Date()` faz o parse em UTC e, no Brasil, volta um dia.
// Por isso todo helper daqui trabalha com a string em pedacos.

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatarMoeda(valor) {
  return moeda.format(Number(valor) || 0)
}

/** 'AAAA-MM-DD' de hoje no fuso local, para o valor inicial do formulario. */
export function hojeIso() {
  const agora = new Date()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${agora.getFullYear()}-${mes}-${dia}`
}

/** 'AAAA-MM-DD' -> '05/03'. */
export function formatarDataCurta(iso) {
  const [, mes, dia] = iso.split('-')
  return `${dia}/${mes}`
}

/** 'AAAA-MM-DD' -> '5 de março de 2026'. */
export function formatarDataLonga(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** 'AAAA-MM-DD' -> 'AAAA-MM', a chave de agrupamento mensal. */
export function competencia(iso) {
  return iso.slice(0, 7)
}

/** 'AAAA-MM' -> 'mar/26'. */
export function formatarCompetencia(chave) {
  const [ano, mes] = chave.split('-').map(Number)
  const nome = new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'short' })
  return `${nome.replace('.', '')}/${String(ano).slice(2)}`
}

/** A competencia do mes corrente, usada como filtro inicial. */
export function competenciaAtual() {
  return hojeIso().slice(0, 7)
}

/** Soma meses a uma data sem deixar o dia escapar para o mes seguinte. */
export function adicionarMeses(iso, quantidade) {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const destino = new Date(ano, mes - 1 + quantidade, 1)
  const ultimoDia = new Date(destino.getFullYear(), destino.getMonth() + 1, 0).getDate()
  const diaAjustado = String(Math.min(dia, ultimoDia)).padStart(2, '0')
  return `${destino.getFullYear()}-${String(destino.getMonth() + 1).padStart(2, '0')}-${diaAjustado}`
}

/**
 * Converte o texto digitado no campo de valor para numero.
 * Aceita tanto '12,50' quanto '12.50', porque o teclado do iPhone oferece virgula.
 */
export function valorParaNumero(texto) {
  const numero = Number(String(texto).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(numero) ? numero : NaN
}
