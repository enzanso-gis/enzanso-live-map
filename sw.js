const CACHE_NAME = 'mountain-live-map-v1';

// アプリを動かすために必ず保存するファイル群
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './main.js',
    './config.js',
    // Leaflet関連ファイル
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const requestUrl = event.request.url;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // GeoJSON（調査データ）は、裏でこっそり最新データを取得して次回のために更新する
                if (requestUrl.includes('.geojson')) {
                    fetch(event.request).then(networkResponse => {
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
                    }).catch(() => {}); 
                }
                return cachedResponse;
            }
            
            return fetch(event.request).then(networkResponse => {
                // はじめて取得した地図画像(国土地理院)やデータは自動的にキャッシュへ保存
                if (requestUrl.includes('cyberjapandata.gsi.go.jp') || requestUrl.includes('.geojson')) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            }).catch(() => {
                // 完全にオフラインの場合は何もしない（保存済みのキャッシュから表示される）
            });
        })
    );
});