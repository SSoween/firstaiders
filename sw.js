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
