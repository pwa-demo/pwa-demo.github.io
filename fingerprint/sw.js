// Function to check specific permission
function checkPermission(name) {
  try {
    const permissionStatus = navigator.permissions.query({ name });
    return permissionStatus.then(
      (status) => status.state, // 'prompt', 'granted', 'denied'
      () => 'error' // Promise rejected
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return Promise.resolve('no value'); // Represents lack of support
    } else {
      return Promise.resolve('error');
    }
  }
}

// Function to check keyboard lock permission
function checkKeyboardLockPermission() {
  try {
    const permissionStatus = navigator.permissions.query({
      name: 'keyboard-lock',
    });
    return permissionStatus.then(
      (status) => status.state,
      () => 'error'
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return Promise.resolve('no value');
    } else {
      return Promise.resolve('error');
    }
  }
}

// Logic for detecting platform and browser
function detectPlatformAndBrowser() {
  return Promise.all([
    checkPermission('accelerometer'),
    checkKeyboardLockPermission(),
    checkPermission('midi'),
    checkPermission('storage-access'),
    checkPermission('payment-handler'),
    checkPermission('nfc'),
    checkPermission('background-fetch'),
    checkPermission('periodic-background-sync'),
  ]).then(
    ([
      accelerometer,
      topLevelstorage,
      midi,
      storageAccess,
      paymentHandler,
      nfc,
      backgroundSync,
      periodicBackgroundSync,
    ]) => {
      let platform = 'Unknown';
      let browser = 'Unknown';

      if (
        topLevelstorage !== 'no value' &&
        topLevelstorage !== 'error' &&
        topLevelstorage !== 'denied'
      ) {
        platform = 'Desktop';
      } else if (accelerometer === 'no value' || accelerometer === 'error') {
        if (
          midi === 'no value' ||
          midi === 'error' ||
          storageAccess === 'no value' ||
          storageAccess === 'error' ||
          storageAccess !== 'prompt'
        ) {
          platform = 'iOS';
        } else {
          platform = 'Android';
          browser = 'Firefox';
        }
      } else if (paymentHandler === 'no value') {
        platform = 'Android';
        browser = 'Firefox';
      } else if (nfc === 'no value') {
        platform = 'Android';
        browser = 'Brave';
      } else if (storageAccess === 'denied') {
        platform = 'Android';
        browser = 'Opera';
      } else if (
        backgroundSync === 'denied' &&
        periodicBackgroundSync === 'denied'
      ) {
        platform = 'Android';
        browser = 'Samsung Internet';
      } else if (periodicBackgroundSync === 'denied') {
        platform = 'Android';
        browser = 'Edge';
      } else {
        platform = 'Android';
        browser = 'Chrome';
      }

      return { platform, browser };
    }
  );
}

// Function to send platform info and permissions to the server
function sendPlatformInfoToServer() {
  detectPlatformAndBrowser().then(({ platform, browser }) => {
    const userAgent = navigator.userAgent;

    fetch('http://localhost:3000/receive-platform-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform,
        browser,
        userAgent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Platform info successfully sent:', data);
      })
      .catch((error) => {
        console.error('Error sending platform info:', error);
      });
  });
}

// Service Worker install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  sendPlatformInfoToServer();
});

// Service Worker fetch event
self.addEventListener('fetch', (event) => {
  console.log(`Fetch intercepted: ${event.request.url}`);
});
