//serice worker.js

self.addEventListener("install", (event)=>{
    event.waitUntil(
        caches.open("my-cache").then((cache)=>{
            return cache.addAll([
                "/",
                "/index.html",
                "/static/js/main.03365142.js", // Corrected path to your main JavaScript file
                "/static/css/main.a96359ff.css",
            ])
        })
    )
})

self.addEventListener("fetch", (event)=>{
    event.respondWith(
        caches.match(event.request).then((response)=>{
            return response || fetch(event.request)
        })
    )
})