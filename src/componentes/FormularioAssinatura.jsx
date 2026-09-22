import { useState } from 'react'
import { ASSINATURAS_SUGERIDAS, LISTA_CARTOES } from '../lib/constantes'
import { valorParaNumero } from '../lib/formato'
import { Botao } from './Botao'
import { CampoTexto } from './Campo'
import { Aviso } from './Secao'
import { SeletorCartao } from './SeletorCartao'

const VAZIO = { nome: '', valor_mensal: '', cartao: 'meu', dia_cobranca: '' }

export function FormularioAssinatura({ aoSalvar, aoConcluir }) {
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    const valor = valorParaNumero(form.valor_mensal)
    if (!Number.isFinite(valor) || valor <= 0) {
      setErro('Informe um valor mensal maior que zero.')
      return
    }

    const dia = form.dia_cobranca === '' ? null : Number(form.dia_cobranca)
    if (dia !== null && (!Number.isInteger(dia) || dia < 1 || dia > 31)) {
      setErro('O dia da cobrança precisa estar entre 1 e 31.')
      return
    }

    setErro(null)
    setSalvando(true)
    const { erro: falha } = await aoSalvar({
      nome: form.nome.trim(),
      valor_mensal: valor,
      cartao: form.cartao,
      categoria: 'Assinaturas',
      dia_cobranca: dia,
    })
    setSalvando(false)

    if (falha) {
      setErro(falha)
      return
    }
    setForm(VAZIO)
    aoConcluir()
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <CampoTexto
          rotulo="Serviço"
          placeholder="Ex.: Spotify"
          required
          autoFocus
          value={form.nome}
          onChange={(e) => alterar('nome', e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {ASSINATURAS_SUGERIDAS.map((nome) => (
            <button
              key={nome}
              type="button"
              onClick={() => alterar('nome', nome)}
              className="rounded-full border border-borda px-2.5 py-1 text-[12px] text-texto-suave active:bg-superficie-alta"
            >
              {nome}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CampoTexto
          rotulo="Valor mensal (R$)"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          required
          value={form.valor_mensal}
          onChange={(e) => alterar('valor_mensal', e.target.value)}
        />
        <CampoTexto
          rotulo="Dia da cobrança"
          type="number"
          inputMode="numeric"
          min={1}
          max={31}
          placeholder="Opcional"
          value={form.dia_cobranca}
          onChange={(e) => alterar('dia_cobranca', e.target.value)}
        />
      </div>

      <SeletorCartao
        rotulo="Cobrado no"
        valor={form.cartao}
        aoEscolher={(cartao) => alterar('cartao', cartao)}
        opcoes={LISTA_CARTOES}
      />

      <Aviso>{erro}</Aviso>

      <Botao type="submit" disabled={salvando}>
        {salvando ? 'Salvando…' : 'Adicionar assinatura'}
      </Botao>
    </form>
  )
}
