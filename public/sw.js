// PS Service Worker at your duty!
console.log("Hello there, this message is being sent by your trusty service worker.");

// Unique String Identifier of cache version -> Personally I want to add current date to the version (?)
const serviceWorkerCacheVersion = "v1";

// Cache feature detection
const cacheAvailable = 'caches' in self;

// ---------------------- CONTROL CACHE ----------------- //
const urlsToCache = ['/', '/login', '/snippets', '/signup', '/favicon.ico'];

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
      const cache = await caches.open(serviceWorkerCacheVersion);

      return cache.addAll(urlsToCache);
  }
  try {
    event.waitUntil(preCache());
  }
  catch (error) {
    console.log("Service worker error catch on preCache : " + error.errors)
    return error.errors
  }
})

// Get the current user ID
self.addEventListener("fetch", (event) => {
  getClient(event.clientId);
})

// Event listener that subscribes to the activate event
self.addEventListener("activate", event => {
    console.log("Service worker activated");
});


// ---------- Saves the snippet data and associated page data that was navigated to when online to cache for offline viewing --- //
// Cache-specific search, so as to only save snippets once and prevent duplicates
self.addEventListener("fetch", event => {
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
});

// ----------------- OFFLINE FEATURES -------------------------------- //
// Offline State 
let offline = false;

// Runs always but handles offline events on fetch -> Handles offline Network requests because the 
// request failed to reach the server. I think most practical implementation for our needs
// Network first approachS
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(error => {
      offline = true;
      console.log("Application Network state. Offline? : " + offline);
      return caches.match(event.request);
    })
  )
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