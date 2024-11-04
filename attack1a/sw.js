// sw.js

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
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
    icon: '/images/icon.png', // Replace with your icon path
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
