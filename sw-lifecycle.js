/* Service Worker 生命周期介绍 */

// 这里this也可以替换为self
/* 监听 service worker 的 install 事件 */
this.addEventListener('install', function(event) {
    console.info('SW insatlled', event);
});
/* 监听 service worker 的 activate 事件 */
this.addEventListener('activate', function(event) {
    console.info('SW activated', event);
});
/* 监听 service worker 的 fetch 事件 */
this.addEventListener('fetch', function(event) {
    console.info('SW fetch', event.request.url);
});