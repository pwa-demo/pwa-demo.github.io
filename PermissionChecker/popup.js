document.addEventListener('DOMContentLoaded', () => {
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

  const resultContainer = document.getElementById('permissions');
  resultContainer.innerText = ''; // 清空初始文本

  permissionsList.forEach((a) => {
    navigator.permissions
      .query({ name: a })
      .then((e) => {
        resultContainer.innerText += a + ': ' + e.state + '\n';
      })
      .catch((e) => {
        resultContainer.innerText += a + ': ' + e + '\n';
      });
  });
});
