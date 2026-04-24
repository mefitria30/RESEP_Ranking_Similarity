const CACHE_NAME = "resep-cache-v4";
const urlsToCache = [
    "/",
    "/result",
    "/offline.html",
    "/static/manifest.json",
    "/static/icons/icon-192.png",
    "/static/icons/icon-512.png",
    "/static/recipe_vectors.json",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://code.jquery.com/jquery-3.6.0.min.js",
    "https://code.jquery.com/ui/1.13.2/jquery-ui.js"
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
