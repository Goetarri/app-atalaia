// Nombre de la caché para el control de versiones
const CACHE_NAME = 'guest-app-v1';
const BASE_URL = 'https://goetarri.github.io/app-atalaia/'; // <-- ¡DEFINE ESTA VARIABLE! PON LA URL DE PAGES DE GITHUB

// Lista de archivos que queremos almacenar en caché
const urlsToCache = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/es.js`,
  `${BASE_URL}/en.js`,
  // Las imágenes también deben usar la URL base
  `${BASE_URL}/images/icon-192x192.png`, 
  `${BASE_URL}/images/icon-512x512.png`,

  // ... añadir todas las demás imágenes usadas (lavadora, toldo, etc.)
  // Ejemplo de otra imagen:
    `${BASE_URL}/images/awning_es.png`,
    `${BASE_URL}/images/awning_en.png`,
    `${BASE_URL}/images/heating_es.png`,
    `${BASE_URL}/images/heating_en.png`,
    `${BASE_URL}/images/wash_seq_es.png`,
    `${BASE_URL}/images/wash_seq_en.png`,
    `${BASE_URL}/images/ic_actividades.png`,
    `${BASE_URL}/images/ic_calefaccion.png`,
    `${BASE_URL}/images/ic_electrodomestico.png`,
    `${BASE_URL}/images/ic_lavadora.png`,
    `${BASE_URL}/images/ic_persiana.png`,
    `${BASE_URL}/images/ic_restaurante.png`,
    `${BASE_URL}/images/ic_tips.png`,
    `${BASE_URL}/images/ic_toldo.png`,
    `${BASE_URL}/images/ic_wifi.png`
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