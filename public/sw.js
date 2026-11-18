// ==============================================================================
// CRT F&B Connect - Progressive Web App Service Worker
// ==============================================================================

const CACHE_NAME = 'crt-fnb-connect-v1';

const STATIC_PRECACHE = [
    '/offline.html',
    '/manifest.json',
    '/favicon.png',
    '/apple-touch-icon.png',
    '/images/logo-badge.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png',
    '/images/icons/icon-maskable-192x192.png',
    '/images/icons/icon-maskable-512x512.png'
];

// Install: Cache essential offline shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_PRECACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate: Clean up old caches and take control
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Skip Chrome extension requests or non-http protocols
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // 1. Navigation requests (HTML pages) -> Network first, fall back to offline.html
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    return networkResponse;
                })
                .catch(async () => {
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return cache.match('/offline.html');
                })
        );
        return;
    }

    // 2. Static images, fonts, icons -> Cache first, fallback to network
    if (
        url.pathname.startsWith('/images/') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.ico') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('fonts.googleapis.com')
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                });
            })
        );
        return;
    }

    // 3. All other requests -> Network with stale-while-revalidate for assets
    event.respondWith(
        fetch(request).catch(async () => {
            const cached = await caches.match(request);
            if (cached) {
                return cached;
            }
            throw new Error('Network request failed and no cache available');
        })
    );
});

// Listen for skip waiting messages
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
