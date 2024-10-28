self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Periodically check clipboard and send to client PWA
setInterval(async () => {
  if (navigator.clipboard) {
    try {
      const text = await navigator.clipboard.readText();
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ clipboardContent: text });
        });
      });
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  }
}, 10000);
