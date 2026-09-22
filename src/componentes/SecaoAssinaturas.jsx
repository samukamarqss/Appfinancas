import { CARTOES } from '../lib/constantes'
import { formatarMoeda } from '../lib/formato'
import { Botao } from './Botao'
import { EstadoVazio } from './Secao'

/**
 * Assinaturas recorrentes, com o total mensal comprometido em cada cartao.
 * E o numero que responde "quanto sai todo mes sem eu fazer nada".
 */
export function SecaoAssinaturas({ assinaturas, aoAlternar, aoRemover }) {
  const ativas = assinaturas.filter((a) => a.ativa)
  const mensalPorCartao = {
    meu: somar(ativas.filter((a) => a.cartao === 'meu')),
    mae: somar(ativas.filter((a) => a.cartao === 'mae')),
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {Object.values(CARTOES).map((cartao) => (
          <div key={cartao.id} className="rounded-2xl border border-borda bg-superficie p-3.5">
            <p className="text-[12px] text-texto-suave">{cartao.rotulo}</p>
            <p
              className="mt-1 text-[18px] font-semibold tabular-nums"
              style={{ color: cartao.corTexto }}
            >
              {formatarMoeda(mensalPorCartao[cartao.id])}
            </p>
            <p className="text-[11px] text-texto-fraco">por mês</p>
          </div>
        ))}
      </div>

      {assinaturas.length === 0 ? (
        <EstadoVazio>
          Nenhuma assinatura cadastrada. Adicione o Game Pass, o Claude, o YouTube Premium e o
          Spotify para ver quanto sai todo mês.
        </EstadoVazio>
      ) : (
        <ul className="flex flex-col gap-2">
          {assinaturas.map((assinatura) => (
            <ItemAssinatura
              key={assinatura.id}
              assinatura={assinatura}
              aoAlternar={aoAlternar}
              aoRemover={aoRemover}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function ItemAssinatura({ assinatura, aoAlternar, aoRemover }) {
  const cartao = CARTOES[assinatura.cartao]

  return (
    <li
      className={`rounded-2xl border border-borda bg-superficie px-3.5 py-3 transition-opacity ${
        assinatura.ativa ? '' : 'opacity-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className="h-9 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: cartao.cor }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px]">{assinatura.nome}</p>
          <p className="mt-0.5 text-[12px] text-texto-fraco">
            {cartao.rotulo}
            {assinatura.dia_cobranca ? ` · dia ${assinatura.dia_cobranca}` : ''}
            {assinatura.ativa ? '' : ' · pausada'}
          </p>
        </div>
        <span className="shrink-0 text-[15px] font-medium tabular-nums">
          {formatarMoeda(assinatura.valor_mensal)}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 border-t border-borda pt-2.5">
        <Botao variante="fantasma" tamanho="pequeno" onClick={() => aoAlternar(assinatura)}>
          {assinatura.ativa ? 'Pausar' : 'Reativar'}
        </Botao>
        <Botao
          variante="perigo"
          tamanho="pequeno"
          className="ml-auto"
          onClick={() => aoRemover(assinatura)}
        >
          Remover
        </Botao>
      </div>
    </li>
  )
}

function somar(lista) {
  return lista.reduce((total, item) => total + item.valor_mensal, 0)
}
