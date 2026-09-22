// Fonte de verdade do dominio. Os mesmos valores de `cartao` estao replicados
// nos CHECK da migration 0001; mudar aqui exige uma migration nova.

// `cor` e a cor de marca dos graficos (validada contra a superficie escura);
// `corTexto` e o passo mais claro da mesma matiz, usado em numero e rotulo.
export const CARTOES = {
  meu: {
    id: 'meu',
    rotulo: 'Meu cartão',
    curto: 'Eu',
    cor: 'var(--color-meu)',
    corTexto: 'var(--color-meu-texto)',
  },
  mae: {
    id: 'mae',
    rotulo: 'Cartão da mãe',
    curto: 'Mãe',
    cor: 'var(--color-mae)',
    corTexto: 'var(--color-mae-texto)',
  },
}

export const LISTA_CARTOES = Object.values(CARTOES)

export const CATEGORIAS = [
  'Assinaturas',
  'Mercado',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Lazer',
  'Casa',
  'Educação',
  'Compras',
  'Outros',
]


// Atalhos da secao de assinaturas: so preenchem o nome, o valor o Samuca digita.
export const ASSINATURAS_SUGERIDAS = [
  'Game Pass',
  'Claude',
  'YouTube Premium',
  'Spotify',
]
