/* fetch请求拦截，更改请求响应 */

// 这里this也可以替换为self
/* 监听 service worker 的 install 事件 */
self.addEventListener('install', function(event) {
    // console.info('SW insatlled', event);
});
/* 监听 service worker 的 activate 事件 */
self.addEventListener('activate', function(event) {
    // console.info('SW activated', event);
});

/* 监听 service worker 的 fetch 事件 */
self.addEventListener('fetch', function(event) {
    console.info('SW fetch', event.request.url);
    let destination = event.request.destination;
    // 拦截所有图片请求，更改为自定义图片
    if (destination === 'image') {
        event.respondWith(
            fetch('./assets/mubapei.jpg')
        )
    }

});