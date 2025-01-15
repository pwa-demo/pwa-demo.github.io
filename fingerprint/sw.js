var staticCacheName = 'pwa';

alert('hello');
navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
  console.log('geolocation' + result.state);
});
self.addEventListener('install', function (e) {
  console.log('install');
});

self.addEventListener('fetch', function (event) {
  console.log(event.request.url);
});

function checkKeyboardLockPermission() {
  try {
    const permissionStatus = navigator.permissions.query({
      name: 'keyboard-lock',
    });

    return permissionStatus.state;
  } catch (error) {
    if (error instanceof TypeError) {
      return 'no value';
    } else {
      return 'error';
    }
  }
}
function checkPermission(name) {
  try {
    const permissionStatus = navigator.permissions.query({ name });
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
const accelerometer = checkPermission('accelerometer');
const topLevelstorage = checkKeyboardLockPermission();

if (
  topLevelstorage !== 'no value' &&
  topLevelstorage !== 'error' &&
  topLevelstorage !== 'denied'
) {
  console.log('Desktop');
} else if (accelerometer === 'no value' || accelerometer === 'error') {
  const midi = checkPermission('midi');
  const storageAccess = checkPermission('storage-access');

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
  const paymentHandler = checkPermission('payment-handler');
  if (paymentHandler === 'no value') {
    console.log('Firefox on Android');
  } else {
    const nfc = checkPermission('nfc');
    const storageAccess = checkPermission('storage-access');
    if (nfc === 'no value') {
      console.log('Brave on Android');
    } else if (storageAccess === 'denied') {
      console.log('Opera on Android');
    } else {
      const backgroundSync = checkPermission('background-fetch');
      const periodicBackgroundSync = checkPermission(
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

function checkUserAgent() {
  let browser = 'Unknown Browser';
  let platform = 'Unknown Platform';

  // User-Agent Client Hints based detection
  if (navigator.userAgentData) {
    const uaData = navigator.userAgentData;
    platform = uaData.platform;

    uaData.brands.forEach((brand) => {
      if (brand.brand.includes('Chromium')) browser = 'Chromium-based Browser';
      if (brand.brand.includes('Google Chrome')) browser = 'Google Chrome';
      if (brand.brand.includes('Microsoft Edge')) browser = 'Microsoft Edge';
      if (brand.brand.includes('Firefox')) browser = 'Firefox';
      if (brand.brand.includes('Opera')) browser = 'Opera';
    });

    // Check if on mobile platform
    const isMobile = uaData.mobile ? 'Mobile' : 'Desktop';
    document.getElementById(
      'browserInfo'
    ).textContent = `Browser Info (Client Hints): ${browser} on ${platform} (${isMobile})`;
  } else {
    // Fallback for browsers without Client Hints
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) platform = 'Android';
    else if (userAgent.includes('iphone') || userAgent.includes('ipad'))
      platform = 'iOS';
    else if (userAgent.includes('mac')) platform = 'MacOS';
    else if (userAgent.includes('win')) platform = 'Windows';

    if (userAgent.includes('chrome') && !userAgent.includes('edg'))
      browser = 'Chrome';
    else if (userAgent.includes('firefox')) browser = 'Firefox';
    else if (userAgent.includes('safari') && !userAgent.includes('chrome'))
      browser = 'Safari';
    else if (userAgent.includes('edg')) browser = 'Edge';
    else if (userAgent.includes('opera') || userAgent.includes('opr'))
      browser = 'Opera';

    document.getElementById(
      'browserInfo'
    ).textContent = `Browser Info (User-Agent): ${browser} on ${platform}`;
  }
}
