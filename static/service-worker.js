const CACHE_NAME = "resep-cache-v6";
const urlsToCache = [
    "/",
    "/result",
    "/offline.html",
    "/static/manifest.json",
    "/static/icons/icon-192.png",
    "/static/icons/icon-512.png",
    "/static/recipe_vectors.json"
];

self.addEventListener( "install", event =>
{
    event.waitUntil(
        caches.open( CACHE_NAME ).then( cache => cache.addAll( urlsToCache ) )
    );
} );

self.addEventListener( "fetch", event =>
{
    event.respondWith(
        caches.match( event.request ).then( response =>
        {
            return response || fetch( event.request ).catch( () => caches.match( "/offline.html" ) );
        } )
    );
} );
