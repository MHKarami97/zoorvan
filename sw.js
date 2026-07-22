// sw.js — Service Worker برای پیشرفته‌سازی PWA (استراتژی Cache-First با Fallback به شبکه)
// مطابق الگوی رسمی MDN Service Worker Cookbook برای offline caching
// https://github.com/mdn/serviceworker-cookbook

const CACHE_VERSION = "tajrobe-v1";
const OFFLINE_URL = "{{ '/offline/' | relative_url }}";

const PRECACHE_URLS = [
  "{{ '/' | relative_url }}",
  "{{ '/categories/' | relative_url }}",
  "{{ '/submit/' | relative_url }}",
  "{{ '/about/' | relative_url }}",
  "{{ '/offline/' | relative_url }}",
  "{{ '/assets/css/main.css' | relative_url }}",
  "{{ '/assets/Vazirmatn-font-face.css' | relative_url }}",
  "{{ '/assets/js/main.js' | relative_url }}",
  "{{ '/assets/images/icons/icon-192x192.png' | relative_url }}",
  "{{ '/manifest.webmanifest' | relative_url }}",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// استراتژی: Network First برای صفحات HTML (محتوا همیشه به‌روز باشد)، Cache First برای assets ایستا
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isHTML =
    req.headers.get("accept") &&
    req.headers.get("accept").includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then((cached) => cached || caches.match(OFFLINE_URL)),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => cached);
    }),
  );
});
