// Check if clipboard API is available and test read/write
// 1. clipboard-write
navigator.storage.persist().then(function (persistent) {
  if (persistent) {
    console.log('Storage will not be cleared by the browser automatically.');
  } else {
    console.log(
      'Storage may be cleared by the browser under storage pressure.'
    );
  }
});
try {
  console.log('Clipboard-write API: ' + ('write' in navigator.clipboard));
} catch (error) {
  console.error(
    'Clipboard-write API check failed. Ensure you are in a secure context (HTTPS) and the clipboard permissions are allowed.',
    error
  );
}

// 2. clipboard-read
try {
  console.log('Clipboard-read API: ' + ('read' in navigator.clipboard));
} catch (error) {
  console.error(
    'Clipboard-read API check failed. It may require user permissions and HTTPS. Ensure proper browser support.',
    error
  );
}

// 3. geolocation
try {
  console.log('Geolocation API: ' + ('geolocation' in navigator));
} catch (error) {
  console.error(
    'Geolocation API check failed. Make sure permissions are granted and the API is supported in this context.',
    error
  );
}

// 4. background-sync
try {
  console.log(
    'Background Sync API: ' +
      ('serviceWorker' in navigator && 'SyncManager' in window)
  );
} catch (error) {
  console.error(
    'Background Sync API check failed. Ensure Service Workers and SyncManager are supported by your browser.',
    error
  );
}

// 5. notifications
try {
  console.log('Notification API: ' + ('Notification' in window));
} catch (error) {
  console.error(
    'Notification API check failed. The API may require permissions or HTTPS.',
    error
  );
}

// 6. fullscreen
try {
  console.log('Fullscreen API: ' + ('requestFullscreen' in Element.prototype));
} catch (error) {
  console.error(
    'Fullscreen API check failed. Make sure fullscreen is supported in this browser context.',
    error
  );
}

// 7 & 8. microphone & camera
try {
  console.log('Microphone & Camera API: ' + ('mediaDevices' in navigator));
} catch (error) {
  console.error(
    'Microphone and Camera API check failed. This API may require HTTPS and user permissions.',
    error
  );
}

// 9. storage-access
try {
  console.log('Storage Access API: ' + ('requestStorageAccess' in document));
} catch (error) {
  console.error(
    'Storage Access API check failed. This API might be browser-specific and needs user permissions.',
    error
  );
}

// 10. display-capture
try {
  console.log(
    'Display Capture API: ' + ('getDisplayMedia' in navigator.mediaDevices)
  );
} catch (error) {
  console.error(
    'Display Capture API check failed. Make sure the API is supported and permissions are granted.',
    error
  );
}

// 11. pointer-lock
try {
  console.log(
    'Pointer Lock API: ' + ('requestPointerLock' in Element.prototype)
  );
} catch (error) {
  console.error(
    'Pointer Lock API check failed. This API is usually supported in full-screen mode.',
    error
  );
}

// 12. screen-wake-lock
try {
  console.log('Screen Wake Lock API: ' + ('wakeLock' in navigator));
} catch (error) {
  console.error(
    'Screen Wake Lock API check failed. Ensure browser compatibility and that permissions are granted.',
    error
  );
}

// 13. payment-handler
try {
  console.log('Payment Handler API: ' + ('PaymentRequest' in window));
} catch (error) {
  console.error(
    'Payment Handler API check failed. This API may not be supported in all browsers or contexts.',
    error
  );
}

// 14. periodic-background-sync
try {
  console.log(
    'Periodic Background Sync API: ' + ('periodicSync' in registration)
  );
} catch (error) {
  console.error(
    'Periodic Background Sync API check failed. Ensure Service Workers and PeriodicSyncManager are supported.',
    error
  );
}

// 15. persistent-storage
try {
  console.log('Persistent Storage API: ' + ('storage' in navigator));
} catch (error) {
  console.error(
    'Persistent Storage API check failed. This API may not be available in all browsers.',
    error
  );
}

// 16. midi
try {
  console.log('MIDI API: ' + ('requestMIDIAccess' in navigator));
} catch (error) {
  console.error(
    'MIDI API check failed. Ensure browser support and check that permissions are granted for MIDI devices.',
    error
  );
}

// 17. idle-detection
try {
  console.log('Idle Detection API: ' + ('wakeLock' in navigator));
} catch (error) {
  console.error(
    'Idle Detection API check failed. Make sure the browser supports idle detection.',
    error
  );
}

// 18. window-management
try {
  console.log('Window Management API: ' + ('windowSegments' in window));
} catch (error) {
  console.error(
    'Window Management API check failed. Ensure that browser support for this API is available.',
    error
  );
}

// 19. local-fonts
try {
  console.log('Local Fonts API: ' + ('fonts' in document));
} catch (error) {
  console.error(
    'Local Fonts API check failed. This API may not be available in your browser.',
    error
  );
}

// 20. nfc
try {
  console.log('NFC API: ' + ('nfc' in navigator));
} catch (error) {
  console.error(
    'NFC API check failed. Ensure that the browser and device support NFC.',
    error
  );
}

// 21. push
try {
  console.log('Push API: ' + ('PushManager' in window));
} catch (error) {
  console.error(
    'Push API check failed. Ensure that push notifications are allowed and supported by the browser.',
    error
  );
}

// 22. gyroscope
try {
  console.log('Gyroscope API: ' + ('Gyroscope' in window));
} catch (error) {
  console.error(
    'Gyroscope API check failed. Ensure browser and device support.',
    error
  );
}

// 23. background-fetch
try {
  console.log('Background Fetch API: ' + ('backgroundFetch' in registration));
} catch (error) {
  console.error(
    'Background Fetch API check failed. This API might need Service Worker support.',
    error
  );
}

// 24. captured-surface-control
try {
  console.log('Captured Surface Control API: ' + ('capture' in navigator));
} catch (error) {
  console.error(
    'Captured Surface Control API check failed. Ensure browser compatibility.',
    error
  );
}

// 25. keyboard-lock
try {
  console.log(
    'Keyboard Lock API: ' + ('requestKeyboardLock' in Element.prototype)
  );
} catch (error) {
  console.error(
    'Keyboard Lock API check failed. This feature may require full-screen mode and is browser-specific.',
    error
  );
}

// 26. accelerometer
try {
  console.log('Accelerometer API: ' + ('Accelerometer' in window));
} catch (error) {
  console.error(
    'Accelerometer API check failed. Ensure browser and device support for this API.',
    error
  );
}

// 27. speaker-selection
try {
  console.log(
    'Speaker Selection API: ' + ('setSinkId' in HTMLMediaElement.prototype)
  );
} catch (error) {
  console.error(
    'Speaker Selection API check failed. Make sure browser and device support is available for this feature.',
    error
  );
}
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
