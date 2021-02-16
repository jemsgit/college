const staticCacheName = 'site-static-v1'; //v1 для того чтобы загружть новый кеш при изменении файлов
const dynamicCacheName = 'dynamic-cache-v2';
let db;
const assets = [
    '/',
    'index.html',
    'index_bundle.js'
];

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener('activate', (e) => {
    e.waitUntil(
            caches.keys().then(keys => {
                Promise.all(keys
                    .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                    .map(key => caches.delete(key)))
            })
        ) //чистим устарешие кеши
})

self.addEventListener('fetch', (e) => {
    let request = e.request.clone();
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(e.request.url, fetchRes.clone()); //добавляем новый ресурс в динмичский кеш
                    limitCacheSize(dynamicCacheName, 10); //проверяем лимит кеша
                    return fetchRes;
                })
            })
        })
        .catch(er => {
            //вернуть страницу с ошибкой
        })
    )
})
