chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkPermissions') {
    let results = '';
    const permissionsList = [
      'accelerometer',
      'accessibility-events',
      'ambient-light-sensor',
      'background-sync',
      'background-fetch',
      'camera',
      'clipboard-read',
      'clipboard-write',
      'geolocation',
      'gyroscope',
      'magnetometer',
      'microphone',
      'midi',
      'notifications',
      'payment-handler',
      'persistent-storage',
      'push',
      'screen-wake-lock',
      'nfc',
      'display-capture',
      'idle-detection',
      'periodic-background-sync',
      'system-wake-lock',
      'storage-access',
      'window-management',
      'window-placement',
      'local-fonts',
      'speaker-selection',
      'bluetooth',
    ];

    permissionsList.forEach((a, index) => {
      navigator.permissions
        .query({ name: a })
        .then((e) => {
          results += a + ': ' + e.state + '\n';
          if (index === permissionsList.length - 1) {
            sendResponse({ result: results });
          }
        })
        .catch((e) => {
          results += a + ': ' + e + '\n';
          if (index === permissionsList.length - 1) {
            sendResponse({ result: results });
          }
        });
    });

    return true; // Will respond asynchronously
  }
});
