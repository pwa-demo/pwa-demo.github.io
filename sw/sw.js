var staticCacheName = 'pwa';

// service-worker.js

self.addEventListener('install', function (e) {});

self.addEventListener('fetch', function (event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', function (event) {
  // 处理推送事件
  event.waitUntil(
    self.registration.showNotification('获取位置', {
      body: '正在后台获取位置信息...',
      icon: 'images/icon.png',
    })
  );

  // 使用Geolocation API获取位置
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
      // 这里可以将位置数据发送到服务器
    },
    function (error) {
      console.error('Error getting location:', error);
    }
  );
});
