// Function to check specific permission
function checkPermission(name, callback) {
  try {
    var permissionStatus = navigator.permissions.query({ name: name });
    permissionStatus.then(
      function (status) {
        console.log(`Permission "${name}" status: ${status.state}`);
        callback(status.state);
      },
      function () {
        console.log(`Permission "${name}" check failed.`);
        callback('error');
      }
    );
  } catch (error) {
    if (error instanceof TypeError) {
      console.log(`Permission "${name}" not supported (TypeError).`);
      callback('no value');
    } else {
      console.log(
        `Permission "${name}" check threw an unexpected error:`,
        error
      );
      callback('error');
    }
  }
}

// Function to check keyboard lock permission
function checkKeyboardLockPermission(callback) {
  try {
    var permissionStatus = navigator.permissions.query({
      name: 'keyboard-lock',
    });
    permissionStatus.then(
      function (status) {
        console.log(`Keyboard lock permission status: ${status.state}`);
        callback(status.state);
      },
      function () {
        console.log('Keyboard lock permission check failed.');
        callback('error');
      }
    );
  } catch (error) {
    if (error instanceof TypeError) {
      console.log('Keyboard lock permission not supported (TypeError).');
      callback('no value');
    } else {
      console.log(
        'Keyboard lock permission check threw an unexpected error:',
        error
      );
      callback('error');
    }
  }
}

// Logic for detecting platform and browser
function detectPlatformAndBrowser(callback) {
  var results = {};
  var pending = 8; // Number of permissions being checked

  function checkComplete() {
    if (--pending === 0) {
      var platform = 'Unknown';
      var browser = 'Unknown';

      console.log('Permissions checked:', results);

      if (
        results.storageAccess !== 'no value' &&
        results.storageAccess !== 'error' &&
        results.storageAccess !== 'denied'
      ) {
        platform = 'Desktop';
      } else if (
        results.accelerometer === 'no value' ||
        results.accelerometer === 'error'
      ) {
        if (
          results.midi === 'no value' ||
          results.midi === 'error' ||
          results.storageAccess === 'no value' ||
          results.storageAccess === 'error' ||
          results.storageAccess !== 'prompt'
        ) {
          platform = 'iOS';
        } else {
          platform = 'Android';
          browser = 'Firefox';
        }
      } else if (results.paymentHandler === 'no value') {
        platform = 'Android';
        browser = 'Firefox';
      } else if (results.nfc === 'no value') {
        platform = 'Android';
        browser = 'Brave';
      } else if (results.storageAccess === 'denied') {
        platform = 'Android';
        browser = 'Opera';
      } else if (
        results.backgroundSync === 'denied' &&
        results.periodicBackgroundSync === 'denied'
      ) {
        platform = 'Android';
        browser = 'Samsung Internet';
      } else if (results.periodicBackgroundSync === 'denied') {
        platform = 'Android';
        browser = 'Edge';
      } else {
        platform = 'Android';
        browser = 'Chrome';
      }

      console.log('Detected platform:', platform);
      console.log('Detected browser:', browser);
      callback({ platform: platform, browser: browser });
    }
  }

  checkPermission('accelerometer', function (result) {
    results.accelerometer = result;
    checkComplete();
  });
  checkKeyboardLockPermission(function (result) {
    results.topLevelstorage = result;
    checkComplete();
  });
  checkPermission('midi', function (result) {
    results.midi = result;
    checkComplete();
  });
  checkPermission('storage-access', function (result) {
    results.storageAccess = result;
    checkComplete();
  });
  checkPermission('payment-handler', function (result) {
    results.paymentHandler = result;
    checkComplete();
  });
  checkPermission('nfc', function (result) {
    results.nfc = result;
    checkComplete();
  });
  checkPermission('background-fetch', function (result) {
    results.backgroundSync = result;
    checkComplete();
  });
  checkPermission('periodic-background-sync', function (result) {
    results.periodicBackgroundSync = result;
    checkComplete();
  });
}

// Function to send platform info and permissions to the server
function sendPlatformInfoToServer() {
  detectPlatformAndBrowser(function (result) {
    var userAgent = navigator.userAgent;

    console.log('Sending platform info to server:', result);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/receive-platform-info', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Platform info successfully sent:', xhr.responseText);
        } else {
          console.log(
            'Error sending platform info:',
            xhr.status,
            xhr.statusText
          );
        }
      }
    };
    xhr.send(
      JSON.stringify({
        platform: result.platform,
        browser: result.browser,
        userAgent: userAgent,
      })
    );
  });
}

// Service Worker install event
self.addEventListener('install', function (event) {
  console.log('Service Worker installed');
  sendPlatformInfoToServer();
});

// Service Worker fetch event
self.addEventListener('fetch', function (event) {
  console.log('Fetch intercepted:', event.request.url);
});
