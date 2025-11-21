// Nombre de la caché para el control de versiones
const CACHE_NAME = 'guest-guide-v1';

// Lista de archivos que queremos almacenar en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/es.js',
  '/en.js',
  '/css/styles.css', // Si tienes un archivo CSS externo
  // Asegúrate de listar todas las imágenes usadas, ej:
  '/images/electrodomestico.png',
  // ... añadir más imágenes y archivos si es necesario ...
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