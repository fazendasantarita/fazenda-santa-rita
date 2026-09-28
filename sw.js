// Service Worker — Fazenda Santa Rita PWA
const CACHE_NAME = 'santa-rita-v3';
const BASE = '/fazenda-santa-rita/';

// Arquivos essenciais para cache (shell do app)
const SHELL = [
  BASE + 'index.html',
  BASE + 'app.html',
  BASE + 'app-endividamento.html',
  BASE + 'app-config.html',
  BASE + 'manifest.json',
  BASE + 'config.js',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Instalar: fazer cache do shell
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL).catch(function(err) {
        console.warn('Cache parcial:', err);
      });
    })
  );
  self.skipWaiting();
});

// Ativar: limpar caches antigos
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, fallback para cache
// Supabase sempre via rede (dados em tempo real)
self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // Requisições Supabase: sempre rede, sem cache
  if (url.includes('supabase.co')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Demais recursos: network first, fallback cache
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Salvar cópia no cache se for GET bem-sucedido
        if (e.request.method === 'GET' && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      })
      .catch(function() {
        // Offline: tentar do cache
        return caches.match(e.request).then(function(cached) {
          if (cached) return cached;
          // Fallback: retornar index.html para navegação
          if (e.request.mode === 'navigate') {
            return caches.match(BASE + 'index.html');
          }
        });
      })
  );
});
