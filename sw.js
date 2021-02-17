const staticCacheName = 'site-static-v1'; //при изменении значения переменной будут перезагружаься статические кешированные файлы
const dynamicCacheName = 'dynamic-cache-v2';//при изменении значения переменной будут перезагружаься динамические кешированные файлы

const assets = [
    '/',
    'index.html',
    'index_bundle.js'
]; //файлы для кеширования

const limitCacheSize = (name, size) => { //функция ограничения количества кешируемых файлов
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size)); //удаляет фйл из кеша, если превышается число кешируемых файлов
            }
        })
    })
}

self.addEventListener('install', (e) => { //после установки service worker'a sw.js кешируем файлы сборки
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

self.addEventListener('fetch', (e) => { //при запросе смотрим есть ли файл в кеше, если есть - отдаем из кеша, если нет, выполняем запрос и добавляем результат в кеш
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
