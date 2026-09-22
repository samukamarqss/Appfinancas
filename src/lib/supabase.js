import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY

// Falha cedo e com mensagem clara em vez de estourar um erro opaco na primeira query.
if (!url || !chave) {
  throw new Error(
    'Faltam VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. ' +
      'Local: copie .env.example para .env. Na Vercel: Settings > Environment Variables.',
  )
}

export const supabase = createClient(url, chave, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
