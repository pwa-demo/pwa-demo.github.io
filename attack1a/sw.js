self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});
self.addEventListener('message', (event) => {
  if (event.data && event.data.clipboardContent) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ clipboardContent: event.data.clipboardContent });
      });
    });
  }
});
