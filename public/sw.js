// PS Service Worker at your duty!
console.log("Hello there, this message is being sent by your trusty service worker.");

// Unique String Identifier of cache version -> Personally I want to add current date to the version (?)
const serviceWorkerCacheVersion = "v4";
console.log("Service Worker version: " + serviceWorkerCacheVersion);
// Cache feature detection
const cacheAvailable = 'caches' in self;

// ---------------------- CONTROL CACHE ----------------- //
const urlsToCache = ['/', '/snippets', '/signup', '/favicon.ico', 'app.webmanifest', 'assets/logo/android-chrome-192x192.png'];

// Domain 
const herokuDomain = "https://code-snipps-ww.herokuapp.com/";
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

// I was trying to see if /snippets exists in cache, It would be usefull to check if a button should work or not
async function checkCache() {
  const exist = await caches.has('/snippets');
  console.log("exist: " + exist);
}
checkCache();

// Install event listener to handle caching of network requests and responses on initial download
// Event listener that subscribes to the install event
self.addEventListener("install", event => {
  console.log("Service Worker: installed");
  const preCache = async () => {
    const cache = await caches.open(serviceWorkerCacheVersion);
    return cache.addAll(urlsToCache);
  }
  try {
    event.waitUntil(preCache());
  }
  catch (error) {
    console.log("Service Worker: error catch on preCache : " + error.errors);
    return error.errors
  }
})

// Get the current user ID
self.addEventListener("fetch", (event) => {
  getClient(event.clientId);
})

// Event listener that subscribes to the activate event
self.addEventListener("activate", event => {
  console.log("Service Worker: activated");
  // Remove old version of cache (serviceWorkerCacheVersion)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cache => {
        if (cache != serviceWorkerCacheVersion) {
          console.log("Service worker: cleared old cache");
          return caches.delete(cache);
        }
      }))
    })
  );
});


// Cache first approach - check cache, add to cache
self.addEventListener("fetch", async (event) => {
  console.log("Service Worker: fetch request");
  const cacheResponse = await caches.match(event.request.url);
  const cache = await caches.open(serviceWorkerCacheVersion);
  
  if (cacheResponse && cacheResponse.status < 400) {
    console.log("Service Worker: cookie match");
    return cacheResponse;
  } else {
    console.log("Service Worker: no cookie match");
    // We didn't get a match so we fetch the requested url
    return fetch(event.request.url).then(fetchResponse => {
      if (!fetchResponse.ok) {
        throw fetchResponse.statusText;
        // If fetchResponse is not ok, we throw an error
      }
      cache.put(event.request.url, fetchResponse.clone());
      // We put a clone of the fetched response to cache
      console.log("Service Worker: Resource added to cache");
      return fetchResponse;
    });
  }
});

// ---------- Saves the snippet data and associated page data that was navigated to when online to cache for offline viewing --- //
// Cache-specific search, so as to only save snippets once and prevent duplicates
/* self.addEventListener("fetch", event => {
  const checkCache = async () => {
    const cache = await caches.open(serviceWorkerCacheVersion);
    const response = await cache.match(event.request.url);
    // This prevents caching pages the user hasn't visited yet
    console.log(response ? "Asset is stored in cache :)" : "It's not in the cache");
    // We save snippet data once the user has viewed it and it ISN'T in cache :) Happy data storage method imo
    if (!response) {
      const recentlyViewedSnippetCache = async () => {
        const cache = await caches.open(serviceWorkerCacheVersion);
        return cache.add(event.request.url);
      }
      event.waitUntil(recentlyViewedSnippetCache());
    }
  }
  event.waitUntil(checkCache());  
}); */

// ----------------- OFFLINE FEATURES -------------------------------- //
// Runs always but handles offline events on fetch -> Handles offline Network requests because the 
// request failed to reach the server. I think most practical implementation for our needs
// Network first approachS
self.addEventListener("fetch", event => {
  // Prevent service worker from interferring with subscription service calls
  if (event.request.url.indexOf('/add-subscription') !== -1) {
    return false;
  } else if (event.request.url.indexOf('/notify-me') !== -1) {
    return false;
  }
  event.respondWith(
    fetch(event.request).catch(error => {
      //  console.log("cache: " + caches.match(event.request));
      return caches.match(event.request);
    })
  )
});

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