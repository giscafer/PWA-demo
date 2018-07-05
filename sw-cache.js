/* 缓存文件脚本文件或图片 */
// Cache和CacheStorage都是Service Worker API下的接口，可以直接使用全局的 caches 属性访问 CacheStorage
var version = 1;
var chacheName = 'test-cache-v' + version;

// 一组相对于 origin 的 URL 组成的数组，这些 URL 就是你想缓存的资源的列表
var cacheFiles = [
    './js/test.js',
    './assets/library_check.png',
    './assets/library_in.png',
    './assets/library_out.png',
    './assets/mubapei.jpg'
]

/* 监听 service worker 的 install 事件 */
self.addEventListener('install', function(event) {
    console.info('SW insatlled', event);
    event.waitUtil(
        // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
        caches.open(chacheName).then(function(cache) {
            // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
            return cache.addAll(cacheFiles);
        })
    )
});
/* 监听 service worker 的 activate 事件 */
self.addEventListener('activate', function(event) {
    // console.info('SW activated', event);
    // 更新缓存，删除当前版本不一致的旧缓存
    event.waitUtil(
        caches.keys.then(keylist => {
            return Promise.all(keylist.filter(key => key !== chacheName).map(key => caches.delete(key)));
        })
    )
});

/* 监听 service worker 的 fetch 事件 */
self.addEventListener('fetch', function(event) {
    // 通过respondWith() 方法来劫持我们的 HTTP 响应
    event.respondWith(
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/match
        caches.match(event.request).then(function(response) {
            // 如果SW里边已经缓存过该请求，直接返回缓存的结果，这样页面就少了一个http请求
            if (response) {
                return response;
            }

            // 如果 SW 没有缓存过该请求，那就直接走真实远程服务
            // 克隆一个原始request（Why clone? see:https://www.w3cschool.cn/fetch_api/fetch_api-y1932m68.html）
            var request = event.request.clone();

            return fetch(request).then(function(httpRes) {
                // 请求失败（失败就失败，不处理失败情况，返回结果）
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }

                // 请求成功，则缓存请求
                var responseClone = httpRes.clone();
                caches.open(chacheName).then(function(cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            })

        })
    )

});