/* Folha do Paiquerê PWA shell v187: network-first keeps published code fresh and offers a basic offline fallback. */
const FP_PAIQUERE_PWA_V187 = 'fp-paiquere-pwa-v187';
const FP_PAIQUERE_SCOPE = self.registration.scope;
const FP_PAIQUERE_PRECACHE_V187 = [
  'index.html',
  'painel.html',
  'manifest.webmanifest',
  'assets/branding/brasao-folha-paiquere.png',
  'assets/branding/brasao-folha-paiquere-192.png',
  'assets/branding/brasao-folha-paiquere-512.png',
  'pwa.js',
  'fp-v181-interface-polish.css',
  'fp-v184-role-navigation-fix.css',
  'fp-v185-focused-fixes.css',
].map(path => new URL(path, FP_PAIQUERE_SCOPE).href);
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try { const cache = await caches.open(FP_PAIQUERE_PWA_V187); await cache.addAll(FP_PAIQUERE_PRECACHE_V187); }
    catch (_) { /* Não bloqueia instalação caso um recurso opcional falhe. */ }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('fp-paiquere-pwa-') && key !== FP_PAIQUERE_PWA_V187).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Network-first for navigation and same-origin assets; keep current deployment whenever online.
  event.respondWith((async () => {
    const cache = await caches.open(FP_PAIQUERE_PWA_V187);
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await cache.match(new URL('index.html', FP_PAIQUERE_SCOPE).href)) || Response.error();
      }
      return Response.error();
    }
  })());
});
