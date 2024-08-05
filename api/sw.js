self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // Add a call to skipWaiting here if you want to activate the SW immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(fetch(event.request));
});

// Background Fetch
self.addEventListener('backgroundfetchsuccess', (event) => {
  const bgFetch = event.registration;

  event.waitUntil(
    (async function () {
      const records = await bgFetch.matchAll();
      const promises = records.map(async (record) => {
        const response = await record.responseReady;
        const cache = await caches.open('background-fetch');
        await cache.put(record.request, response);
      });

      await Promise.all(promises);
      console.log('Background Fetch success:', bgFetch.id);
    })()
  );
});

self.addEventListener('backgroundfetchfail', (event) => {
  const bgFetch = event.registration;
  console.error('Background Fetch failed:', bgFetch.id);
});

self.addEventListener('backgroundfetchabort', (event) => {
  const bgFetch = event.registration;
  console.error('Background Fetch aborted:', bgFetch.id);
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tag') {
    event.waitUntil(doSomeBackgroundSync());
  }
});

async function doSomeBackgroundSync() {
  console.log('Performing background sync');
  // Your background sync logic here
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'Push Notification';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
