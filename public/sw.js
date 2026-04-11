/**
 * KeepSnip Modern Service Worker
 * Version: 1.0.17
 */

console.log(
  "Hello there, this message is being sent by your trusty service worker."
);

const serviceWorkerCacheVersion = "1.0.17";
const urlsToCache = [
  "/",
  "/snippets",
  "/favicon.ico",
  "/app.webmanifest",
  "/assets/logo/android-chrome-192x192.png",
];

// ---------------------- INSTALL & ACTIVATE ----------------- //

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(serviceWorkerCacheVersion).then((cache) => {
      console.log("Service Worker: Pre-caching assets");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  // Clean up old cache versions
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== serviceWorkerCacheVersion) {
            console.log("Service Worker: Clearing old cache", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// ---------------------- FETCH STRATEGY ----------------- //

self.addEventListener("fetch", (event) => {
  // 1. Bypass cache for notification/subscription API calls
  const bypassUrls = [
    "/add-subscription",
    "/notify-me",
    "/notify-all",
    "/remove-subscription",
  ];
  if (bypassUrls.some((url) => event.request.url.includes(url))) {
    return;
  }

  // 2. Network First, fallback to Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful, clone and update cache
        if (response.ok && response.status < 400) {
          const resClone = response.clone();
          caches.open(serviceWorkerCacheVersion).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request);
      })
  );
});

// ---------------------- PUSH & NOTIFICATIONS ----------------- //

/**
 * Handle incoming Push messages from the server
 * Uses the Push API
 */
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  let data = {
    title: "KeepSnip Update",
    options: {
      body: "New data available in your snippet library.",
      icon: "/assets/logo/android-chrome-192x192.png",
      badge: "/favicon.ico",
    },
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.warn(
        "Push event received but payload was not JSON. Falling back to default."
      );
    }
  }

  // Use the Notifications API to show the message
  event.waitUntil(self.registration.showNotification(data.title, data.options));
});

/**
 * Handle user interaction with the notification
 */
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  // Focus existing window or open a new one
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow("/snippets");
      })
  );
});
