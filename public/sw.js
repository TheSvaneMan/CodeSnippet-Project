// PS Service Worker at your duty!
console.log("Hello there, this message is being sent by your trusty service worker.");

// Unique String Identifier of cache version -> Personally I want to add current date to the version (?)
const swVersionControl = "1.1.4";
const serviceWorkerVersion = swVersionControl;
console.log("Service worker version: " + swVersionControl);

// Cache feature detection
const cacheAvailable = 'caches' in self;

// ---------------------- CONTROL CACHE ----------------- //
const urlsToCache = ['/login', '/profile', '/offline', '/signup', '/favicon.ico', 'app.webmanifest', 'assets/logo/android-chrome-192x192.png'];

// Domain -- Change this before deploying
const herokuDomain = "https://code-snipps-ww.herokuapp.com/";
const localhostDomain = "http://localhost:3000/"
const urlsNotToCache = ['/add-subscription'];
// Total requests made
let count = 0;

async function getClient(id) {
  const browserClient = await self.clients.get(id).then(function (client) {
    return client;
  });
  if (browserClient) {
    count += 1;
    browserClient.postMessage(count);
  }
}

// Checks if the cache API is available on the browser running the current code
if (cacheAvailable === true) { console.log("Cache API available: " + cacheAvailable); }

// This code executes in its own worker or thread !!

// Install event listener to handle caching of network requests and responses on initial download
// Event listener that subscribes to the install event
self.addEventListener("install", event => {
  console.log("Service worker installed");
  const preCache = async () => {
    const cache = await caches.open(serviceWorkerVersion);
    return cache.addAll(urlsToCache);
  }
  try {
    event.waitUntil(preCache());
  }
  catch (error) {
    console.log("Service worker error catch on preCache : " + error.errors);
    return error.errors
  }
})



// Event listener that subscribes to the activate event
self.addEventListener("activate", event => {
  console.log("Service worker activated");
  // Remove old version of cache (serviceWorkerVersion)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cache => {
        if (cache != serviceWorkerVersion) {
          console.log("Service worker: cleared old cache");
          return caches.delete(cache);
        }
      }))
    })
  );
});

// Cache first approach - check cache, add to cache
// --- Our service worker is doing super work offline -- //
self.addEventListener("fetch", event => {
  // Prevent POST requests from interferring with our service worker
  if (event.request.method !== "POST") {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse && cachedResponse.status < 400) {
            return cachedResponse
          } else {
            return fetch(event.request).then(fetchResponse => {
              // We didn't get a match so we fetch the requested url
              if (!fetchResponse.ok) throw fetchResponse.statusText;
              return caches.open(serviceWorkerVersion)
                .then(function (cache) {
                  // We put a clone of the fetched response to cache
                  return cache.put(event.request, fetchResponse.clone());
                }).then(function () {
                  return fetchResponse;
                });
            }).catch(error => {
              console.log("// --- You are now offline ---- //");
              console.log("Offline Handler kicks in when no cache or network response available");
              console.log("Offline: Error: " + error);
              console.log("Offline: Requested URL : " + event.request.url);
              console.log("Offline: Offline page being served");
              return caches.open(serviceWorkerVersion).then(function (cache) {
                // Create new response to handle the MIME type or find out what is wrong with the offline page
                return cache.match('/snippets');
              });
            })
          }
        })
    )
  }
});

// Get the current user ID
self.addEventListener("fetch", (event) => {
  getClient(event.clientId);
})

self.addEventListener("push", (event) => {
  let notification = event.data.json();
  self.registration.showNotification(
    notification.title,
    notification.options
  );
});


// Useful link on caching strategy methods
// LINK: https://web.dev/learn/pwa/serving/#caching-strategies

// ********** DEV NOTES ************* //

// 1). We need to handle the session to access user data when offline (Unless we just prevent people from logging in when offline/ no network).

// 2). Because of this loader found below, the snippets page will always try to make connection to db even if the request has been cached and that throws an error, we need
// to perhaps handle network requests with the Service Worker too, instead of solely using the loader to get the data. We could instead let the service worker do that
// and if fx -> (Network Online), connect to db and get latest snippets, else (Network Offline) serve cached urls of snippets, but of course this then puts a reliance on the Service to work.
// So having a fallback on the loader incase the data is empty, then it could make the network request in case the Service Worker fails for some reason

/* export async function loader({ request }) {
  const db = await connectDb();
  await requireUserSession(request);
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");
  const snipps = await db.models.snip.find({ user: { $in: [userID, ""] } });
  return snipps;
} */

// 3). We can definitely track the app state whether it is offline and update UI. Check the console on browser and see that a fetch request is responded by the service worker as
// app state being offline (Make sure you are offline in dev tools) - this can be used to change the UI when the User is offline.

// 4). Last but not least, if we save /snippets to cache, each unique snippet also declares a new "/snippets/" url asset saved on /snippets/snipps(id) whenever you click on a new snippet, creating
// some duplications in the cache of the /snippets url (Cause it renders again when we navigate to a snippet) / Either we prevent it by making a check on each route/snippet but I don't like this
// because we will get duplicates  per snippet regardless, which scales badly.

// Code perhaps requires some restructuring and rewriting for offline features.