self.addEventListener('install', (event) => {
  // Service worker installation
  console.log('Service Worker installing.');
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check if the request is for an asset you don't want to cache
  if (url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg')) {
    // Do not cache images
    return fetch(event.request);
  }

  // Your existing caching logic for other requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});
