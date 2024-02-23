'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "49577ca0e5dc03c7de4e6a35dedbe261",
"splash/img/light-2x.png": "8eb7ad907fef34879e8a1e0c5ee00d5f",
"splash/img/dark-4x.png": "ffe5dbc32a27857de1384cd1b9fcb414",
"splash/img/light-3x.png": "c9a9dbe44bc3c5a503a1f9c5e5c71bbe",
"splash/img/dark-3x.png": "c9a9dbe44bc3c5a503a1f9c5e5c71bbe",
"splash/img/light-4x.png": "ffe5dbc32a27857de1384cd1b9fcb414",
"splash/img/dark-2x.png": "8eb7ad907fef34879e8a1e0c5ee00d5f",
"splash/img/dark-1x.png": "ffafd69dcdae97812a2616cf0c2e1acb",
"splash/img/light-1x.png": "ffafd69dcdae97812a2616cf0c2e1acb",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "c94c38ff00a9d487c353a2d78989ea08",
"index.html": "9baec27f7edbaba6f21550a93402875f",
"/": "9baec27f7edbaba6f21550a93402875f",
"main.dart.js": "48a5035ec44c044e22d1bc30725745c3",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "17c31d79d6e2d5d4108c131c74ba3384",
"icons/Icon-192.png": "d4822f1305591339f076fb8654e2f0b6",
"icons/Icon-maskable-192.png": "d4822f1305591339f076fb8654e2f0b6",
"icons/Icon-maskable-512.png": "50e56f3b159f0f6cd34f305eeb73afc5",
"icons/Icon-512.png": "50e56f3b159f0f6cd34f305eeb73afc5",
"manifest.json": "0b4855966a54ce30bde41232edd81dcb",
"assets/AssetManifest.json": "80c04a15ba95c84f5b98795cb24f8ccf",
"assets/NOTICES": "4b512c1574d56bc3e9f7f45637fbeccf",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "2eed22b3716051fb55f56805c7d08a8f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "abf6c299194a3cfe2ba1e79f3e2fecf8",
"assets/fonts/MaterialIcons-Regular.otf": "176048e01878186745ac87a0e9b29631",
"assets/assets/images/stormyknight.gif": "0e05702e9e805a8a4ab693ffe885f8a5",
"assets/assets/images/randgris.gif": "bf19448be07791a33baeaf646e2e69a7",
"assets/assets/images/gtb.gif": "a853b040e85da15c5df52f0b4943099d",
"assets/assets/images/detale.gif": "889d0b615f21a67ccbf2730595fbca28",
"assets/assets/images/garm.gif": "848a4b4c97537d9a9902fd47dc62e7e7",
"assets/assets/images/lod.gif": "2990f6ec157841a0aa877bf6b001e58c",
"assets/assets/images/rsx.gif": "55d86a9fa84d566ca005201fe662309d",
"assets/assets/images/splash.webp": "bb7e91465566367553c391d688860df7",
"assets/assets/images/atroce.gif": "e97cb2adf8c30d4932222bce412b3281",
"assets/assets/images/mvp.png": "cc2fa2b355cffdd07478f992b3521098",
"assets/assets/images/splash.png": "d4ffaf0e353ae2babb2c55f1ae8a2f2f",
"assets/assets/images/moonlight.gif": "440b0ac614e95ef1e46a178b8b9d18f6",
"assets/assets/images/orclord.gif": "716f687cd15490027b7792e9e748acc7",
"assets/assets/images/orchero.gif": "c24337ddeb4889ccb3e777d3727f1603",
"assets/assets/images/vesper.gif": "46a603d3e785bdff26a31efa426c1158",
"assets/assets/images/valkyrie.gif": "bf19448be07791a33baeaf646e2e69a7",
"assets/assets/images/thanatos.gif": "07ae733683bb44a76fe27aad845e9c1f",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
