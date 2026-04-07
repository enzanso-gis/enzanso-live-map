const CACHE_NAME = 'mountain-live-map-v3';

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
    self.skipWaiting(); // すぐに新しいバージョンをインストール
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('activate', event => {
    self.clients.claim(); // すぐにコントロールを開始
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                // バージョンが変わったら古いキャッシュ(v1など)は完全に削除する
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        ))
    );
});

self.addEventListener('fetch', event => {
    // GETリクエスト（データ取得）以外は無視してそのまま通信させる
    if (event.request.method !== 'GET') return;

    const requestUrl = event.request.url;

    event.respondWith(
        // ★ ignoreSearch: true を追加。これにより ?ID=000 等のパラメータを無視して安全に読み込む
        caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
            if (cachedResponse) {
                // GeoJSON（調査データ）は、裏でこっそり最新データを取得して次回のために更新する
                if (requestUrl.includes('.geojson')) {
                    fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
                        }
                    }).catch(() => {}); 
                }
                return cachedResponse;
            }
            
            // キャッシュにない場合はネットワークへ取りに行く
            return fetch(event.request).then(networkResponse => {
                // はじめて取得した地図画像(国土地理院)やデータは自動的にキャッシュへ保存
                if (networkResponse.ok && (requestUrl.includes('cyberjapandata.gsi.go.jp') || requestUrl.includes('.geojson'))) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            }).catch(() => {
                // 完全にオフラインで、かつキャッシュにもない場合の安全なエラー回避
                return new Response('オフラインのため表示できません', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
});