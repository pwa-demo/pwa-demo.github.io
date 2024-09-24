// Check if clipboard API is available and test read/write
// 1.	clipboard-write
// 2.	clipboard-read
console.log('Clipboard API: ' + navigator.clipboard);
// 3.	geolocation
console.log('Geolocation API: ' + navigator.geolocation);
// 4.	background-sync
console.log(
  'Background Sync API: ' + 'serviceWorker' in navigator &&
    'SyncManager' in window
);
// 5.	notifications
console.log('Notification API: ' + Notification);
// 6.	fullscreen
console.log('Fullscreen API: ' + 'requestFullscreen' in Element.prototype);
// 7.	microphone
// 8.	camera
console.log('Microphone API: ' + navigator.mediaDevices);
// 9.	storage-access
console.log('Storage Access API: ' + 'requestStorageAccess' in document);
// 10.	display-capture
console.log(
  'Display Capture API: ' + 'getDisplayMedia' in navigator.mediaDevices
);
// 11.	pointer-lock
console.log('Pointer Lock API: ' + 'requestPointerLock' in Element.prototype);
// 12.	screen-wake-lock
console.log('Screen Wake Lock API: ' + 'wakeLock' in navigator);
// 13.	payment-handler
console.log('Payment Handler API: ' + 'PaymentRequest' in window);
// 14.	periodic-background-sync
console.log('Periodic Background Sync API: ' + 'periodicSync' in registration);
// 15.	persistent-storage
console.log('Persistent Storage API: ' + 'storage' in navigator);
// 16.	midi
console.log('MIDI API: ' + 'requestMIDIAccess' in navigator);
// 17.	idle-detection
console.log('Idle Detection API: ' + 'wakeLock' in navigator);
// 18.	window-management
console.log('Window Management API: ' + 'windowSegments' in window);
// 19.	local-fonts
console.log('Local Fonts API: ' + 'fonts' in document);
// 20.	nfc
console.log('NFC API: ' + 'nfc' in navigator);
// 21.	push
console.log('Push API: ' + 'PushManager' in window);
// 22.	gyroscope
console.log('Gyroscope API: ' + 'Gyroscope' in window);
// 23.	background-fetch
console.log('Background Fetch API: ' + 'backgroundFetch' in registration);
// 24.	captured-surface-control
console.log('Captured Surface Control API: ' + 'capture' in navigator);
// 25.	keyboard-lock
console.log('Keyboard Lock API: ' + 'requestKeyboardLock' in Element.prototype);
// 26.	accelerometer
console.log('Accelerometer API: ' + 'Accelerometer' in window);
// 27.	speaker-selection
console.log(
  'Speaker Selection API: ' + 'setSinkId' in HTMLMediaElement.prototype
);
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
