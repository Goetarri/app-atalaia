// Nombre de la caché para el control de versiones
const CACHE_NAME = 'atalaia-app-v2';

// Lista de archivos que queremos almacenar en caché
const urlsToCache = [
  './',
  './index.html',
  './es.js',
  './en.js',

  // Las imágenes también deben usar la URL base
  './images/icon-192x192.png', 
  './images/icon-512x512.png',

  // ... añadir todas las demás imágenes usadas (lavadora, toldo, etc.)
  './images/awning_es.png',
  './images/awning_en.png',
  './images/heating_es.png',
  './images/heating_en.png',
  './images/wash_seq_es.png',
  './images/wash_seq_en.png',
  './images/ic_actividades.png',
  './images/ic_calefaccion.png',
  './images/ic_electrodomestico.png',
  './images/ic_lavadora.png',
  './images/ic_persiana.png',
  './images/ic_restaurante.png',
  './images/ic_tips.png',
  './images/ic_toldo.png',
  './images/ic_wifi.png'
];

// 1. Instalación: Almacenar los archivos estáticos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Forzar que el nuevo Service Worker se active inmediatamente
  self.skipWaiting(); 
});

// 2. Activación: Limpiar las cachés antiguas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Eliminar cachés antiguas
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Peticiones: Servir los archivos desde la caché primero
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver la respuesta de la caché si está disponible
        if (response) {
          return response;
        }
        // Si no está en caché, hacer la petición a la red
        return fetch(event.request);
      }
    )
  );
});