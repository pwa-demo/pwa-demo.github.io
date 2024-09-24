// Check if clipboard API is available and test read/write
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      let results = {};

      // Test Clipboard.write
      try {
        await navigator.clipboard.writeText('Test write');
        results['clipboardWrite'] = 'Clipboard.write is available';
        console.log('Clipboard.write: Success');
      } catch (err) {
        results['clipboardWrite'] = 'Clipboard.write is NOT available';
        console.log('Clipboard.write: Not available', err);
      }

      // Test Clipboard.read
      try {
        await navigator.clipboard.readText();
        results['clipboardRead'] = 'Clipboard.read is available';
        console.log('Clipboard.read: Success');
      } catch (err) {
        results['clipboardRead'] = 'Clipboard.read is NOT available';
        console.log('Clipboard.read: Not available', err);
      }

      // Test Geolocation API
      if ('geolocation' in navigator) {
        results['geolocation'] = 'Geolocation API is available';
        console.log('Geolocation API: Available');
      } else {
        results['geolocation'] = 'Geolocation API is NOT available';
        console.log('Geolocation API: Not available');
      }

      // Test Notification API
      if ('Notification' in self) {
        results['notification'] = 'Notification API is available';
        console.log('Notification API: Available');
      } else {
        results['notification'] = 'Notification API is NOT available';
        console.log('Notification API: Not available');
      }

      // Test Camera (MediaDevices.getUserMedia)
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        results['camera'] = 'Camera API is available';
        console.log('Camera API: Available');
      } catch (err) {
        results['camera'] = 'Camera API is NOT available';
        console.log('Camera API: Not available', err);
      }

      // Test Microphone (MediaDevices.getUserMedia)
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        results['microphone'] = 'Microphone API is available';
        console.log('Microphone API: Available');
      } catch (err) {
        results['microphone'] = 'Microphone API is NOT available';
        console.log('Microphone API: Not available', err);
      }

      // Post results back to the main page
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage(results);
        });
      });
    })()
  );
});
