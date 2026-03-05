/* ReplyShastra Service Worker FIX */

const CACHE_NAME = "replyshastra-v4";

/* INSTALL */
self.addEventListener("install", e => {
  self.skipWaiting();
});

/* ACTIVATE */
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

/* FETCH */
self.addEventListener("fetch", e => {

  if (e.request.method !== "GET") return;

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
