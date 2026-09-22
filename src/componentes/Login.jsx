import { useState } from 'react'
import { Botao } from './Botao'
import { CampoTexto } from './Campo'
import { Aviso } from './Secao'

/**
 * App de uso individual: o Samuca cria a conta uma vez e depois so entra.
 * O cadastro fica atras de um link discreto justamente por isso.
 */
export function Login({ entrar, criarConta }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modoCadastro, setModoCadastro] = useState(false)
  const [erro, setErro] = useState(null)
  const [recado, setRecado] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro(null)
    setRecado(null)
    setEnviando(true)

    const { error, data } = modoCadastro
      ? await criarConta(email, senha)
      : await entrar(email, senha)

    setEnviando(false)
    if (error) {
      setErro(traduzirErro(error.message))
      return
    }
    // Se o projeto exigir confirmacao por email, nao vem sessao na hora.
    if (modoCadastro && !data.session) {
      setRecado('Conta criada. Confirme pelo link que chegou no seu email e depois entre.')
      setModoCadastro(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <form onSubmit={aoEnviar} className="flex w-full max-w-sm flex-col gap-4">
        <header className="mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Controle de Gastos</h1>
          <p className="mt-1 text-[14px] text-texto-suave">
            {modoCadastro ? 'Crie sua conta para começar.' : 'Entre para ver seus lançamentos.'}
          </p>
        </header>

        <CampoTexto
          rotulo="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CampoTexto
          rotulo="Senha"
          type="password"
          autoComplete={modoCadastro ? 'new-password' : 'current-password'}
          required
          minLength={6}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          dica={modoCadastro ? 'Mínimo de 6 caracteres.' : undefined}
        />

        <Aviso>{erro}</Aviso>
        {recado && (
          <p className="rounded-xl border border-meu/40 bg-meu/10 px-3 py-2 text-[13px] text-meu">
            {recado}
          </p>
        )}

        <Botao type="submit" disabled={enviando}>
          {enviando ? 'Aguarde…' : modoCadastro ? 'Criar conta' : 'Entrar'}
        </Botao>

        <Botao
          variante="fantasma"
          tamanho="pequeno"
          onClick={() => {
            setModoCadastro((atual) => !atual)
            setErro(null)
            setRecado(null)
          }}
        >
          {modoCadastro ? 'Já tenho conta, quero entrar' : 'Primeira vez aqui? Criar conta'}
        </Botao>
      </form>
    </div>
  )
}

function traduzirErro(mensagem) {
  if (/invalid login credentials/i.test(mensagem)) return 'Email ou senha incorretos.'
  if (/user already registered/i.test(mensagem)) return 'Esse email já tem conta. É só entrar.'
  if (/password should be at least/i.test(mensagem)) return 'A senha precisa de ao menos 6 caracteres.'
  if (/email address .* invalid/i.test(mensagem)) return 'Email inválido.'
  return mensagem
}
