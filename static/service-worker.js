const CACHE_NAME = "resep-cache-v12";
const urlsToCache = [
    "/",                // halaman utama
    "/offline.html",    // fallback offline
    "/static/manifest.json",
    "/static/icons/icon-192.png",
    "/static/icons/icon-512.png",
    "/static/recipe_vectors.json",
    "/static/assets/bootstrap.min.css",
    "/static/assets/bootstrap.bundle.min.js",
    "/static/assets/jquery-3.6.0.min.js",
    "/static/assets/jquery-ui.css",
    "/static/assets/jquery-ui.js",
    "/static/recommend.js"
];

// Install: cache semua file
self.addEventListener( "install", event =>
{
    event.waitUntil(
        caches.open( CACHE_NAME ).then( cache =>
        {
            return Promise.all(
                urlsToCache.map( url =>
                    cache.add( url ).catch( err => console.error( "❌ Gagal cache:", url, err ) )
                )
            );
        } )
    );
} );

// Fetch: serve dari cache, fallback ke offline.html
self.addEventListener( "fetch", event =>
{
    event.respondWith(
        caches.match( event.request ).then( response =>
        {
            return response || fetch( event.request ).catch( () => caches.match( "/offline.html" ) );
        } )
    );
} );
