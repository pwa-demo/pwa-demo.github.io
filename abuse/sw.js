var staticCacheName = 'pwa';

self.addEventListener('install', function (e) {
  console.log('install');
});

self.addEventListener('fetch', function (event) {
  console.log(event.request.url);
});
