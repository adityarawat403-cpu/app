/* ===== ReplyShastra Service Worker (GitHub Pages /app/ FIX) ===== */

const CACHE_NAME = "replyshastra-app-v3";
const APP_PREFIX = "/app/";

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

  const url = new URL(e.request.url);

  // Sirf apni app folder ki files handle kare
  if (!url.pathname.startsWith(APP_PREFIX)) {
    return;
  }

  // HTML files kabhi cache nahi (white screen fix)
  if (url.pathname.endsWith(".html") || url.pathname === "/app/") {
    e.respondWith(fetch(e.request));
    return;
  }

  // baaki files (audio, images, css, js) cache + network
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
