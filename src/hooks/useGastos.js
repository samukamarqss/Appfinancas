import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Lancamentos do usuario, do mais recente para o mais antigo.
 * Nenhum componente fala com o Supabase direto; tudo passa por aqui.
 */
export function useGastos(usuarioId) {
  const [gastos, setGastos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    if (!usuarioId) return
    setCarregando(true)
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .order('data', { ascending: false })
      .order('criado_em', { ascending: false })

    if (error) setErro(error.message)
    else {
      setErro(null)
      // O Postgres devolve numeric como string para nao perder precisao.
      setGastos(data.map((linha) => ({ ...linha, valor: Number(linha.valor) })))
    }
    setCarregando(false)
  }, [usuarioId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  async function adicionar(gasto) {
    const { error } = await supabase.from('gastos').insert({ ...gasto, usuario_id: usuarioId })
    if (error) return { erro: error.message }
    await recarregar()
    return {}
  }

  async function remover(id) {
    const { error } = await supabase.from('gastos').delete().eq('id', id)
    if (error) return { erro: error.message }
    setGastos((atuais) => atuais.filter((g) => g.id !== id))
    return {}
  }

  return { gastos, carregando, erro, adicionar, remover, recarregar }
}
