import { useState } from 'react'
import { CATEGORIAS, LISTA_CARTOES } from '../lib/constantes'
import { hojeIso, valorParaNumero } from '../lib/formato'
import { Botao } from './Botao'
import { CampoSelecao, CampoTexto } from './Campo'
import { Aviso } from './Secao'
import { SeletorCartao } from './SeletorCartao'

const VAZIO = {
  descricao: '',
  valor: '',
  categoria: CATEGORIAS[1],
  cartao: 'meu',
  data: hojeIso(),
  recorrente: false,
}

/** Formulario rapido de novo gasto. Vive dentro do Modal. */
export function FormularioGasto({ aoSalvar, aoConcluir }) {
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    const valor = valorParaNumero(form.valor)
    if (!Number.isFinite(valor) || valor <= 0) {
      setErro('Informe um valor maior que zero.')
      return
    }

    setErro(null)
    setSalvando(true)
    const { erro: falha } = await aoSalvar({
      descricao: form.descricao.trim(),
      valor,
      categoria: form.categoria,
      cartao: form.cartao,
      data: form.data,
      recorrente: form.recorrente,
    })
    setSalvando(false)

    if (falha) {
      setErro(falha)
      return
    }
    setForm({ ...VAZIO, data: form.data, cartao: form.cartao })
    aoConcluir()
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-4">
      <CampoTexto
        rotulo="Descrição"
        placeholder="Ex.: mercado da esquina"
        required
        autoFocus
        value={form.descricao}
        onChange={(e) => alterar('descricao', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <CampoTexto
          rotulo="Valor (R$)"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          required
          value={form.valor}
          onChange={(e) => alterar('valor', e.target.value)}
        />
        <CampoTexto
          rotulo="Data"
          type="date"
          required
          value={form.data}
          onChange={(e) => alterar('data', e.target.value)}
        />
      </div>

      <CampoSelecao
        rotulo="Categoria"
        value={form.categoria}
        onChange={(e) => alterar('categoria', e.target.value)}
        opcoes={CATEGORIAS.map((c) => ({ valor: c, rotulo: c }))}
      />

      <SeletorCartao
        rotulo="Pago com"
        valor={form.cartao}
        aoEscolher={(cartao) => alterar('cartao', cartao)}
        opcoes={LISTA_CARTOES}
      />

      <label className="flex items-center gap-2.5 text-[14px] text-texto-suave">
        <input
          type="checkbox"
          checked={form.recorrente}
          onChange={(e) => alterar('recorrente', e.target.checked)}
          className="h-4 w-4 accent-[var(--color-meu)]"
        />
        É uma despesa recorrente
      </label>

      <Aviso>{erro}</Aviso>

      <Botao type="submit" disabled={salvando}>
        {salvando ? 'Salvando…' : 'Adicionar gasto'}
      </Botao>
    </form>
  )
}
