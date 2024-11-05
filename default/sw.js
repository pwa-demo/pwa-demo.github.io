function initializeServiceWorker() {
  var staticCacheName = 'pwa';

  self.addEventListener('install', function (e) {
    console.log('Service Worker installing.');
  });

  self.addEventListener('activate', function (e) {
    updatePermissionStates();
    checkTopLevelPermission();
    console.log('Service Worker activating.');
    e.waitUntil(self.clients.claim());
  });

  self.addEventListener('fetch', function (event) {
    console.log(event.request.url);

    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  });
}

// 用于存储权限状态的对象
let permissionStates = {};

// 批量检查各项权限的函数并更新权限状态
function updatePermissionStates() {
  const permissions = [
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
    'captured-surface-control',
    'keyboard-lock',
    'pointer-lock',
    'fullscreen',
    'web-app-installation',
  ];

  for (const permission of permissions) {
    navigator.permissions
      .query({ name: permission })
      .then((e) => {
        permissionStates[permission] = e.state;
      })
      .catch((e) => {
        permissionStates[permission] = `Error: ${e}`;
      });
  }

  console.log('Updated Permission States:', permissionStates);
}

// 检查 top-level-storage-access 权限的函数并更新状态
async function checkTopLevelPermission() {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: 'top-level-storage-access',
      requestedOrigin: 'https://pwa-install.github.io',
    });

    permissionStates['top-level-storage-access'] = permissionStatus.state;
  } catch (error) {
    permissionStates['top-level-storage-access'] = `Error: ${error.message}`;
  }

  console.log(
    'Updated top-level-storage-access:',
    permissionStates['top-level-storage-access']
  );
}

// 调用初始化 Service Worker 的函数
initializeServiceWorker();

// 每 10 秒重新调用权限检查函数
setInterval(() => {
  updatePermissionStates();
  checkTopLevelPermission();
}, 10000);
