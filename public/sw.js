const CACHE_NAME = 'nueva-etapa-v2.2-cache'; // Versión actualizada
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Bypass para llamadas a la API o localhost para evitar errores del SW
  if (url.pathname.includes('/api/') || url.hostname === 'localhost') {
    return; // Dejar que el navegador maneje la petición normalmente
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(err => {
          console.warn('SW Fetch failed:', err);
          // Opcionalmente podrías devolver una página de error o simplemente dejar que falle
          // Pero sin rechazar la promesa principal de respondWith
          return new Response('Network error occurred', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
      })
  );
});

