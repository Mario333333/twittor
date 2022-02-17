/**
 * Manofest nos va a permitir especificar como nuestra app debe verse
 * iconos 
 * shortname
 * etc 
 * No tienen acciones en s2 
 * pero necesarios en PWA 
 */
importScripts("js/sw-utils.js")

const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL = [
  /* "/", */
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  "js/sw-utils.js"
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => {
    return cache.addAll(APP_SHELL);
  });

  const cacheInmutable = caches.open(INMUTABLE_CACHE).then((cache) => {
    return cache.addAll(APP_SHELL_INMUTABLE);
  });

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener("activate", (e) => {
  const response = caches.keys().then((keys) => {
    console.log("keys", keys);
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        caches.delete(key);
      }
    });
  });

  e.waitUntil(response);
});

self.addEventListener("fetch", (e) => {
  const response = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
        fetch(e.request).then(fetchRes => {
            return updateDynamicCache(DYNAMIC_CACHE, e.request, fetchRes)
        })
        
    }
  });

  e.respondWith(response);
});
