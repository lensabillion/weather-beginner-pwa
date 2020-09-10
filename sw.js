const staticCacheName ='v2';
const assets = [
    '/',
    '/index.html',
    '/Styles/layout.css',
    '/Scripts/myScript.js',
    '/Images/new.jpg',
    '/Font/rimouski_sb-webfont.woff2',
  '/Icons/unknown.png',
    '/Font/Rimouski.css',
   
    
];


//Call Install Event
self.addEventListener('install',e => {
    e.waitUntil( 
        caches.open(staticCacheName).then(cache => {
            console.log("caching shell assets");
            cache.addAll(assets)
            .then(() => console.log('Assets added to cache'))
            .catch(err => console.log('Error while fetching assets', err));
        })
    );
   
    //console.log("service worker: Installed");
});
//Call Activate Event
self.addEventListener('activate', event => {
    console.log('Activating new service worker...');
  
    const cacheAllowlist = [staticCacheName];
  
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheAllowlist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });


  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;     // if valid response is found in cache return it
          } else {
            return fetch(event.request)     //fetch from internet
              .then(function(res) {
                return caches.open(staticCacheName)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());    //save the response for future
                    return res;   // return the fetched data
                  })
              })
              .catch(function(err) {       // fallback mechanism
                return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                  .then(function(cache) {
                    return cache.match('index.html');
                  });
              });
          }
        })
    );
  });  
  
