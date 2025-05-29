
/*
const CACHE_NAME = 'analysesymptoms-monolith-v1';
const urlsToCache = [
  '/index.html',
  '/js/jspdf.umd.min.js',
  '/sw.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png',
  'icons/lungs.png',
  'icons/hand.png',
  'icons/heart.png',
  'icons/stomach.png',
  'icons/head.png',
  'icons/brain.png',
  'icons/person.png'
  // ajouter d'autres fichiers statiques (css, js, images) que tu utilises
];

// Installer service worker et pré-cacher
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Nettoyer anciens caches lors de l'activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});
*/
const CACHE_NAME = 'analysesymptoms-monolith-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/js/jspdf.umd.min.js',
  '/sw.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png',
  'icons/lungs.png',
  'icons/hand.png',
  'icons/heart.png',
  'icons/stomach.png',
  'icons/head.png',
  'icons/brain.png',
  'icons/person.png',
  'icons/911.png',
  'icons/abc.png',
  'icons/aed.png',
  'icons/chocking.png',
  'icons/cpr.png'
];

// Installation : mise en cache initiale
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();

  // Informer les pages qu'une nouvelle version est activée
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'NEW_VERSION_AVAILABLE' }));
  });

});

// Fetch avec stratégie stale-while-revalidate
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Met à jour le cache en arrière-plan
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // En cas d’échec réseau : retourner le cache si dispo
            return cachedResponse || caches.match('/index.html');
          });

        return cachedResponse || fetchPromise;
      })
    )
  );
});

