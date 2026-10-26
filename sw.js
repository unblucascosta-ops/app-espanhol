// Service worker: guarda o app inteiro em cache para funcionar offline.
// A lista abaixo é gerada por `npm run build:sw` — não edite à mão.

// <precache>
const VERSION = 'fe1499a5b0';
const PRECACHE = [
  "./",
  "css/app.css",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon.svg",
  "icons/maskable-512.png",
  "index.html",
  "js/content/challenges.js",
  "js/content/index.js",
  "js/content/lessons/brasileiros.js",
  "js/content/lessons/madrid.js",
  "js/content/lessons/negocios.js",
  "js/content/lessons/social.js",
  "js/content/lessons/universidad.js",
  "js/core/db.js",
  "js/core/fsrs.js",
  "js/core/scheduler.js",
  "js/core/speech.js",
  "js/core/stats.js",
  "js/core/store.js",
  "js/core/text.js",
  "js/core/time.js",
  "js/main.js",
  "js/ui/dom.js",
  "js/ui/screens/home.js",
  "js/ui/screens/lesson.js",
  "js/ui/screens/lessons.js",
  "js/ui/screens/review.js",
  "js/ui/screens/shadow.js",
  "manifest.webmanifest"
];
// </precache>

const CACHE = `espanol-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('espanol-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Cache primeiro (rápido e offline); se não estiver no cache, busca na rede.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(
      (hit) => hit || fetch(req).catch(() => (req.mode === 'navigate' ? caches.match('index.html') : Response.error())),
    ),
  );
});
