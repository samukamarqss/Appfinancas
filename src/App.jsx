import { useMemo, useState } from 'react'
import {
  agruparPorCategoria,
  agruparPorMes,
  competenciasDisponiveis,
  filtrarPorCartaoECategoria,
  filtrarPorCompetencia,
  incluirAssinaturasNosGastos,
  totalPorCartao,
} from './lib/agregacoes'
import { competenciaAtual } from './lib/formato'
import { useAssinaturas } from './hooks/useAssinaturas'
import { useAuth } from './hooks/useAuth'
import { useGastos } from './hooks/useGastos'
import { Cabecalho } from './componentes/Cabecalho'
import { CartoesTotais } from './componentes/CartoesTotais'
import { FiltrosGastos } from './componentes/FiltrosGastos'
import { FormularioAssinatura } from './componentes/FormularioAssinatura'
import { FormularioGasto } from './componentes/FormularioGasto'
import { GraficoCategorias } from './componentes/GraficoCategorias'
import { GraficoMensal } from './componentes/GraficoMensal'
import { ListaGastos } from './componentes/ListaGastos'
import { Login } from './componentes/Login'
import { Modal } from './componentes/Modal'
import { NavegacaoAbas } from './componentes/NavegacaoAbas'
import { Aviso, Secao } from './componentes/Secao'
import { SecaoAssinaturas } from './componentes/SecaoAssinaturas'

export function App() {
  const { usuario, carregando, entrar, criarConta, sair } = useAuth()

  if (carregando) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[14px] text-texto-fraco">
        Carregando…
      </div>
    )
  }

  if (!usuario) return <Login entrar={entrar} criarConta={criarConta} />

  // A key remonta o app inteiro na troca de conta, zerando todo state derivado.
  return <AppLogado key={usuario.id} usuario={usuario} aoSair={sair} />
}

function AppLogado({ usuario, aoSair }) {
  const gastosApi = useGastos(usuario.id)
  const assinaturasApi = useAssinaturas(usuario.id)

  const [aba, setAba] = useState('gastos')
  const [mes, setMes] = useState(competenciaAtual())
  const [filtros, setFiltros] = useState({ cartao: 'todos', categoria: 'todas' })
  const [modal, setModal] = useState(null)

  const gastos = useMemo(
    () => incluirAssinaturasNosGastos(gastosApi.gastos, assinaturasApi.assinaturas),
    [gastosApi.gastos, assinaturasApi.assinaturas],
  )

  const meses = useMemo(() => competenciasDisponiveis(gastos), [gastos])
  const doMes = useMemo(() => filtrarPorCompetencia(gastos, mes), [gastos, mes])
  const visiveis = useMemo(() => filtrarPorCartaoECategoria(doMes, filtros), [doMes, filtros])

  // Os totais grandes seguem o mes e os filtros, para bater com a lista abaixo.
  const totais = useMemo(() => totalPorCartao(visiveis), [visiveis])
  const porCategoria = useMemo(() => agruparPorCategoria(doMes), [doMes])
  const porMes = useMemo(() => agruparPorMes(gastos), [gastos])

  // O mes corrente aparece no seletor mesmo antes do primeiro lancamento.
  const mesesDoSeletor = meses.includes(mes) || mes === 'todos' ? meses : [mes, ...meses]

  async function removerGasto(gasto) {
    if (gasto.assinatura_virtual) {
      if (!window.confirm(`Remover a assinatura \"${gasto.descricao}\"? Ela deixará de aparecer em todos os meses.`)) return
      const { erro } = await assinaturasApi.remover(gasto.assinatura_id)
      if (erro) window.alert(`Não deu para remover: ${erro}`)
      return
    }
    if (!window.confirm(`Remover "${gasto.descricao}"?`)) return
    const { erro } = await gastosApi.remover(gasto.id)
    if (erro) window.alert(`Não deu para remover: ${erro}`)
  }

  async function removerAssinatura(assinatura) {
    if (!window.confirm(`Remover a assinatura "${assinatura.nome}"?`)) return
    const { erro } = await assinaturasApi.remover(assinatura.id)
    if (erro) window.alert(`Não deu para remover: ${erro}`)
  }

  return (
    <div className="min-h-dvh pb-24">
      <Cabecalho
        competencias={mesesDoSeletor}
        competenciaAtiva={mes}
        aoTrocarCompetencia={setMes}
        aoSair={aoSair}
      />

      <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-5">
        <Aviso>{gastosApi.erro || assinaturasApi.erro}</Aviso>

        {aba === 'gastos' && (
          <>
            <CartoesTotais totalPorCartao={totais} />

            <Secao titulo={`Lançamentos (${visiveis.length})`}>
              <FiltrosGastos filtros={filtros} aoAlterar={setFiltros} />
              {gastosApi.carregando ? (
                <p className="py-6 text-center text-[13px] text-texto-fraco">Carregando…</p>
              ) : (
                <ListaGastos gastos={visiveis} aoRemover={removerGasto} />
              )}
            </Secao>
          </>
        )}

        {aba === 'assinaturas' && (
          <Secao titulo="Assinaturas recorrentes">
            <SecaoAssinaturas
              assinaturas={assinaturasApi.assinaturas}
              aoAlternar={assinaturasApi.alternarAtiva}
              aoRemover={removerAssinatura}
            />
          </Secao>
        )}

        {aba === 'graficos' && (
          <>
            <Secao titulo="Por categoria">
              <GraficoCategorias linhas={porCategoria} />
            </Secao>
            <Secao titulo="Últimos meses">
              <GraficoMensal linhas={porMes} />
            </Secao>
          </>
        )}
      </main>

      {aba !== 'graficos' && (
        <button
          type="button"
          onClick={() => setModal(aba === 'assinaturas' ? 'assinatura' : 'gasto')}
          aria-label={aba === 'assinaturas' ? 'Nova assinatura' : 'Novo gasto'}
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-40 h-14 w-14 rounded-full bg-meu text-[28px] leading-none text-fundo shadow-lg shadow-black/40 active:bg-emerald-400"
        >
          +
        </button>
      )}

      <NavegacaoAbas abaAtiva={aba} aoTrocar={setAba} />

      <Modal titulo="Novo lançamento" aberto={modal === 'gasto'} aoFechar={() => setModal(null)}>
        <FormularioGasto
          aoSalvar={gastosApi.adicionar}
          aoSalvarParcelas={gastosApi.adicionarVarios}
          aoCriarAssinatura={assinaturasApi.adicionar}
          aoConcluir={() => setModal(null)}
        />
      </Modal>

      <Modal
        titulo="Nova assinatura"
        aberto={modal === 'assinatura'}
        aoFechar={() => setModal(null)}
      >
        <FormularioAssinatura
          aoSalvar={assinaturasApi.adicionar}
          aoConcluir={() => setModal(null)}
        />
      </Modal>
    </div>
  )
}
