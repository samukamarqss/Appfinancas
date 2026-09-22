// Service worker minimo: deixa o app abrir da tela de inicio do iPhone mesmo
// offline. So o shell e cacheado; os dados vem sempre do Supabase pela rede.
const CACHE = 'gastos-shell-v1'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png']

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (evento) => {
  const { request } = evento

  // Chamadas ao Supabase nunca passam pelo cache.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  // Navegacao: rede primeiro, com o shell cacheado como rede de seguranca.
  if (request.mode === 'navigate') {
    evento.respondWith(
      fetch(request).catch(() => caches.match('/index.html').then((r) => r || Response.error())),
    )
    return
  }

  // Demais assets do proprio dominio: cache primeiro, preenchendo em segundo plano.
  evento.respondWith(
    caches.match(request).then((cacheado) => {
      const daRede = fetch(request)
        .then((resposta) => {
          if (resposta.ok) {
            const copia = resposta.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copia))
          }
          return resposta
        })
        .catch(() => cacheado)
      return cacheado || daRede
    }),
  )
})
