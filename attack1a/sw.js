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

// sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  event.waitUntil(self.clients.claim());
});

// Fetch IP address periodically
async function fetchIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('IP Address:', data.ip);

    // You could add additional logic here to store or handle IP data
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
  }
}

// Fetch IP address when Service Worker is active
self.addEventListener('message', (event) => {
  if (event.data === 'fetch-ip') {
    fetchIPAddress();
  }
});
