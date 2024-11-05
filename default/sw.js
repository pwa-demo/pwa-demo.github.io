var staticCacheName = 'pwa';

self.addEventListener('install', function (e) {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', function (e) {
  for (const a of [
    'accelerometer',
    'accessibility-events',
    'ambient-light-sensor',
    'background-sync',
    'background-fetch',
    'camera',
    'clipboard-read',
    'clipboard-write',
    'geolocation',
    'gyroscope',
    'magnetometer',
    'microphone',
    'midi',
    'notifications',
    'payment-handler',
    'persistent-storage',
    'push',
    'screen-wake-lock',
    'nfc',
    'display-capture',
    'idle-detection',
    'periodic-background-sync',
    'system-wake-lock',
    'storage-access',
    'window-management',
    'window-placement',
    'local-fonts',
    'speaker-selection',
    'bluetooth',
    'captured-surface-control',
    'speaker-selection',
    'keyboard-lock',
    'pointer-lock',
    'fullscreen',
    'web-app-installation',
  ]) {
    navigator.permissions
      .query({ name: a })
      .then((e) => {
        console.log(a + ': ' + e.state);
      })
      .catch((e) => {
        console.log(a + ': ' + e);
      });
  }

  async function checkPermission() {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: 'top-level-storage-access',
        requestedOrigin: 'https://pwa-install.github.io',
      });

      console.log('top-level-storage-access: ' + permissionStatus.state);
    } catch (error) {
      console.log('Error checking permission: ' + error.message);
    }
  }

  // 调用 checkPermission 函数
  checkPermission();
  console.log('Service Worker activating.');
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function (event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
