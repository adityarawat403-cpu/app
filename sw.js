const CACHE_NAME = "replyshastra-v3";   // version change very important

self.addEventListener("install", e => {
self.skipWaiting();
});

self.addEventListener("activate", e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.map(key => {
if (key !== CACHE_NAME) {
return caches.delete(key);
}
})
)
)
);
self.clients.claim();
});

// only cache images & audio (NOT index.html)
self.addEventListener("fetch", e => {
const url = new URL(e.request.url);

// NEVER CACHE HTML
if (url.pathname.endsWith(".html") || url.pathname === "/") {
e.respondWith(fetch(e.request));
return;
}

e.respondWith(
caches.match(e.request).then(res => {
return res || fetch(e.request).then(fetchRes => {
return caches.open(CACHE_NAME).then(cache => {
cache.put(e.request, fetchRes.clone());
return fetchRes;
});
});
})
);
});
