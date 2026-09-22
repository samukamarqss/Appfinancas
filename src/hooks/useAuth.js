import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/** Sessao do Supabase Auth. E o unico lugar do app que fala de login. */
export function useAuth() {
  const [sessao, setSessao] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return
      setSessao(data.session)
      setCarregando(false)
    })

    const { data: inscricao } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao)
      setCarregando(false)
    })

    return () => {
      ativo = false
      inscricao.subscription.unsubscribe()
    }
  }, [])

  return {
    sessao,
    usuario: sessao?.user ?? null,
    carregando,
    entrar: (email, senha) => supabase.auth.signInWithPassword({ email, password: senha }),
    criarConta: (email, senha) => supabase.auth.signUp({ email, password: senha }),
    sair: () => supabase.auth.signOut(),
  }
}
