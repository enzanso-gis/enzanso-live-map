const CACHE_NAME = 'mountain-live-map-v4';

// アプリを動かすために必ず保存するファイル群
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './main.js',
    './config.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
];

self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('activate', event => {
    self.clients.claim(); 
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        ))
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const requestUrl = event.request.url;

    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
            if (cachedResponse) {
                if (requestUrl.includes('.geojson')) {
                    fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
                        }
                    }).catch(() => {}); 
                }
                return cachedResponse;
            }
            
            return fetch(event.request).then(networkResponse => {
                // ★修正：国土地理院などの外部画像（opaqueレスポンス）も許可してキャッシュに保存する
                if ((networkResponse.ok || networkResponse.type === 'opaque') && 
                    (requestUrl.includes('cyberjapandata.gsi.go.jp') || requestUrl.includes('.geojson'))) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            }).catch(() => {
                return new Response('オフラインのため表示できません', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
});