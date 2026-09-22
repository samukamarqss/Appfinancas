import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { hojeIso } from '../lib/formato'

/** Assinaturas recorrentes: Game Pass, Claude, YouTube Premium, Spotify... */
export function useAssinaturas(usuarioId) {
  const [assinaturas, setAssinaturas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    if (!usuarioId) return
    setCarregando(true)
    const { data, error } = await supabase
      .from('assinaturas')
      .select('*')
      .order('ativa', { ascending: false })
      .order('valor_mensal', { ascending: false })

    if (error) setErro(error.message)
    else {
      setErro(null)
      setAssinaturas(data.map((linha) => ({ ...linha, valor_mensal: Number(linha.valor_mensal) })))
    }
    setCarregando(false)
  }, [usuarioId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  async function adicionar(assinatura) {
    const { error } = await supabase
      .from('assinaturas')
      .insert({ ...assinatura, usuario_id: usuarioId })
    if (error) return { erro: error.message }
    await recarregar()
    return {}
  }

  async function alternarAtiva(assinatura) {
    const { error } = await supabase
      .from('assinaturas')
      .update({ ativa: !assinatura.ativa, data_fim: assinatura.ativa ? hojeIso() : null })
      .eq('id', assinatura.id)
    if (error) return { erro: error.message }
    await recarregar()
    return {}
  }

  async function remover(id) {
    const { error } = await supabase.from('assinaturas').delete().eq('id', id)
    if (error) return { erro: error.message }
    setAssinaturas((atuais) => atuais.filter((a) => a.id !== id))
    return {}
  }

  return { assinaturas, carregando, erro, adicionar, alternarAtiva, remover, recarregar }
}
