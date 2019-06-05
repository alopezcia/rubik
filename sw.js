// imports
importScripts('scripts/sw-utils.js');

// Usamos tres caches para elementos que no van a variar nada (inmutable) poco conocido (static) poco desconocido (dynamic)
const DYNAMIC_CACHE = 'dynamic-v1';
const STATIC_CACHE = 'static-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'styles/certificate2.css',
    'styles/cube.css',
    'styles/doodle2.css',
    'scripts/cuber.min.js',
    'media/static-cube.png',
    'scripts/iecss3d.js',
    'scripts/ierenderer.js',
    'scripts/deviceMotion.js',
    'scripts/locked.js',
    'scripts/textBox.js',
    'scripts/ResizeableTextBox.3.js',
    'scripts/divBox.js',
    'scripts/frames.js',
    'scripts/certificate.js',
    'scripts/main3.js',
    'scripts/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Rubik+One&subset=all',
    'scripts/tween.r12.js',
    'scripts/Three.r66.noStrict.js'
];



self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then( cache => cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open( INMUTABLE_CACHE).then( cache => cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', event => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if( key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        });
    });
    event.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match( e.request ).then( res => {
        if( res ) {
            return res;
        }else
        {
            console.log('fetch', e.request.url);
            return fetch( e.request ).then( newRes => {
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes );
            });
        }
    });
    e.respondWith(respuesta);
});