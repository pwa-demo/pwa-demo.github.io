var staticCacheName = 'pwa';
// navigator.geolocation.getCurrentPosition(function (position) {
//   console.log('Latitude: ' + position.coords.latitude);
//   console.log('Longitude: ' + position.coords.longitude);
// });

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', function (event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
