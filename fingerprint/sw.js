var staticCacheName = 'pwa';

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

function updateConnectionStatus() {
  console.log(
    `Connection type changed from ${type} to ${navigator.connection.effectiveType}`
  );
  console.log('==== Network Connection Information ====');
  console.log(
    `Effective Connection Type: ${navigator.connection.effectiveType}`
  );
  console.log(
    `Downlink (estimated bandwidth in Mbps): ${navigator.connection.downlink}`
  );
  console.log(`RTT (Round-trip time in ms): ${navigator.connection.rtt}`);
  console.log(`Save Data Mode Enabled: ${navigator.connection.saveData}`);
  console.log(
    `Max Downlink (max theoretical bandwidth): ${navigator.connection.downlinkMax}`
  );
  console.log(`=== Connection Type (deprecated) ===`);
  console.log(`Type: ${navigator.connection.type || 'Unavailable'}`);
  console.log('======================================');

  type = navigator.connection.effectiveType;
}

let type = navigator.connection.effectiveType;
navigator.connection.addEventListener('change', updateConnectionStatus);

// Initial log to capture the connection status at page load
updateConnectionStatus();

// every 10 seconds, log the connection status
setInterval(updateConnectionStatus, 5000);
