var staticCacheName = 'pwa';

self.addEventListener('install', function (e) {
  console.log('install');
});

self.addEventListener('fetch', function (event) {
  console.log(event.request.url);
});

async function checkPermission(name) {
  try {
    const permissionStatus = await navigator.permissions.query({ name });
    return permissionStatus.state; // Returns 'prompt', 'granted', or 'denied' if supported
  } catch (error) {
    if (error instanceof TypeError) {
      return 'no value'; // Represents lack of support
    } else {
      return 'error';
    }
  }
}

// Begin detection logic
const accelerometer = await checkPermission('accelerometer');
const topLevelstorage = await checkKeyboardLockPermission();

if (
  topLevelstorage !== 'no value' &&
  topLevelstorage !== 'error' &&
  topLevelstorage !== 'denied'
) {
  console.log('Desktop');
} else if (accelerometer === 'no value' || accelerometer === 'error') {
  const midi = await checkPermission('midi');
  const storageAccess = await checkPermission('storage-access');

  if (
    midi === 'no value' ||
    midi === 'error' ||
    storageAccess === 'no value' ||
    storageAccess === 'error' ||
    storageAccess !== 'prompt'
  ) {
    console.log('iOS');
  } else {
    console.log('Android Firefox');
  }
} else {
  const paymentHandler = await checkPermission('payment-handler');
  if (paymentHandler === 'no value') {
    console.log('Firefox on Android');
  } else {
    const nfc = await checkPermission('nfc');
    const storageAccess = await checkPermission('storage-access');
    if (nfc === 'no value') {
      console.log('Brave on Android');
    } else if (storageAccess === 'denied') {
      console.log('Opera on Android');
    } else {
      const backgroundSync = await checkPermission('background-fetch');
      const periodicBackgroundSync = await checkPermission(
        'periodic-background-sync'
      );
      if (backgroundSync === 'denied' && periodicBackgroundSync === 'denied') {
        console.log('Samsung Internet on Android');
      } else if (periodicBackgroundSync === 'denied') {
        console.log('Edge on Android');
      } else {
        console.log('Chrome on Android');
      }
    }
  }
}
