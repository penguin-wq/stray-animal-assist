const CACHE_NAME = 'animal-rescue-v4';
const OFFLINE_URL = './offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_URL);
    }),
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedPage = await caches.match(OFFLINE_URL);

        return (
          cachedPage ||
          new Response('You are offline. Please check your internet connection.', {
            status: 503,
            headers: {
              'Content-Type': 'text/plain',
            },
          })
        );
      }),
    );
  }
});
