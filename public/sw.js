const cacheV = "v1";
const filesToCache = ['/', '/build/_assets/tailwind-4EBDUH4A.css'];

self.addEventListener('install', async (event) => {
    const preCache = async () => {
        const cache = await caches.open(cacheV);
        return cache.addAll(filesToCache);
    }
  event.waitUntil(preCache());
});


