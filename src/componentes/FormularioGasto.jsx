import { useMemo, useState } from 'react'
import { CATEGORIAS, LISTA_CARTOES } from '../lib/constantes'
import { adicionarMeses, formatarCompetencia, hojeIso, valorParaNumero } from '../lib/formato'
import { Botao } from './Botao'
import { CampoSelecao, CampoTexto } from './Campo'
import { Aviso } from './Secao'
import { SeletorCartao } from './SeletorCartao'

const VAZIO = {
  tipo: 'avulso', descricao: '', valor: '', categoria: CATEGORIAS[1], cartao: 'meu',
  data: hojeIso(), totalParcelas: '2',
}

const TIPOS = [
  { valor: 'avulso', rotulo: 'Compra à vista' },
  { valor: 'assinatura', rotulo: 'Assinatura mensal' },
  { valor: 'parcelado', rotulo: 'Compra parcelada' },
]

/** Formulario de lancamento: compra avulsa, assinatura ou parcelas do cartao. */
export function FormularioGasto({ aoSalvar, aoSalvarParcelas, aoCriarAssinatura, aoConcluir }) {
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const totalParcelas = Number(form.totalParcelas)
  const dataFim = useMemo(
    () => Number.isInteger(totalParcelas) && totalParcelas > 0 ? adicionarMeses(form.data, totalParcelas - 1) : null,
    [form.data, totalParcelas],
  )

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    const valor = valorParaNumero(form.valor)
    if (!form.descricao.trim()) return setErro('Informe uma descrição.')
    if (!Number.isFinite(valor) || valor <= 0) {
      return setErro(form.tipo === 'parcelado' ? 'Informe o valor de cada parcela.' : 'Informe um valor maior que zero.')
    }
    if (form.tipo === 'parcelado' && (!Number.isInteger(totalParcelas) || totalParcelas < 2)) {
      return setErro('Uma compra parcelada precisa ter pelo menos 2 parcelas.')
    }

    setErro(null)
    setSalvando(true)
    let resultado
    if (form.tipo === 'assinatura') {
      resultado = await aoCriarAssinatura({
        nome: form.descricao.trim(), valor_mensal: valor, cartao: form.cartao,
        categoria: form.categoria, dia_cobranca: Number(form.data.slice(8, 10)), data_inicio: form.data,
      })
    } else if (form.tipo === 'parcelado') {
      const grupoParcelas = crypto.randomUUID()
      resultado = await aoSalvarParcelas(Array.from({ length: totalParcelas }, (_, indice) => ({
        descricao: form.descricao.trim(), valor, categoria: form.categoria, cartao: form.cartao,
        data: adicionarMeses(form.data, indice), recorrente: false, tipo: 'parcelado',
        grupo_parcelas: grupoParcelas, parcela_numero: indice + 1, total_parcelas: totalParcelas,
      })))
    } else {
      resultado = await aoSalvar({
        descricao: form.descricao.trim(), valor, categoria: form.categoria, cartao: form.cartao,
        data: form.data, recorrente: false, tipo: 'avulso',
      })
    }
    setSalvando(false)

    if (resultado?.erro) return setErro(resultado.erro)
    setForm({ ...VAZIO, data: form.data, cartao: form.cartao })
    aoConcluir()
  }

  const valorRotulo = form.tipo === 'assinatura' ? 'Valor mensal (R$)' : form.tipo === 'parcelado' ? 'Valor da parcela (R$)' : 'Valor (R$)'

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-4">
      <CampoSelecao rotulo="Tipo de lançamento" value={form.tipo} onChange={(e) => alterar('tipo', e.target.value)} opcoes={TIPOS} />
      <CampoTexto rotulo={form.tipo === 'assinatura' ? 'Assinatura ou serviço' : 'Descrição'} placeholder={form.tipo === 'assinatura' ? 'Ex.: Spotify' : 'Ex.: tênis novo'} required autoFocus value={form.descricao} onChange={(e) => alterar('descricao', e.target.value)} />

      <div className="grid grid-cols-2 gap-3">
        <CampoTexto rotulo={valorRotulo} type="text" inputMode="decimal" placeholder="0,00" required value={form.valor} onChange={(e) => alterar('valor', e.target.value)} />
        <CampoTexto rotulo={form.tipo === 'parcelado' ? '1ª parcela' : form.tipo === 'assinatura' ? 'Primeira cobrança' : 'Data'} type="date" required value={form.data} onChange={(e) => alterar('data', e.target.value)} />
      </div>

      {form.tipo === 'parcelado' && (
        <div className="rounded-xl border border-borda bg-superficie p-3">
          <CampoTexto rotulo="Quantidade de parcelas" type="number" inputMode="numeric" min={2} required value={form.totalParcelas} onChange={(e) => alterar('totalParcelas', e.target.value)} />
          {dataFim && <p className="mt-2 text-[12px] text-texto-fraco">Última parcela em <strong className="font-medium text-texto-suave">{formatarCompetencia(dataFim.slice(0, 7))}</strong>.</p>}
        </div>
      )}

      <CampoSelecao rotulo="Categoria" value={form.categoria} onChange={(e) => alterar('categoria', e.target.value)} opcoes={CATEGORIAS.map((c) => ({ valor: c, rotulo: c }))} />
      <SeletorCartao rotulo={form.tipo === 'assinatura' ? 'Cobrado no cartão' : 'Cartão usado'} valor={form.cartao} aoEscolher={(cartao) => alterar('cartao', cartao)} opcoes={LISTA_CARTOES} />
      {form.tipo === 'assinatura' && <p className="rounded-xl border border-borda bg-superficie p-3 text-[12px] text-texto-fraco">A cobrança vai aparecer automaticamente todo mês, a partir da primeira cobrança.</p>}
      <Aviso>{erro}</Aviso>
      <Botao type="submit" disabled={salvando}>{salvando ? 'Salvando…' : form.tipo === 'assinatura' ? 'Adicionar assinatura' : 'Adicionar lançamento'}</Botao>
    </form>
  )
}
