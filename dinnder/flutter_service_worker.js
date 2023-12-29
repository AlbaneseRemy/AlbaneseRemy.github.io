'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "0d5a85f17282ee0bbc187e8d5d8324a1",
"index.html": "cd13f1bbf3a8f600cdd0b1fa2f062cb2",
"/": "cd13f1bbf3a8f600cdd0b1fa2f062cb2",
"main.dart.js": "deadb2bb1fadab86ea1431ec8f2c487b",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "e6cc0afc3f26b64f3c5fe206dd40fe2e",
"assets/AssetManifest.json": "1349f235f195ed2cdd0be0966ce5658c",
"assets/NOTICES": "558c0cd15c42ee6f51a969aa1712d780",
"assets/FontManifest.json": "3b0316c2e00f3d2da5aa799d8e2a9bd7",
"assets/AssetManifest.bin.json": "492354869f71653aa8c4f4c2c0a45e9f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "398113c0033ad5d1ccbc282aa3cfea01",
"assets/fonts/MaterialIcons-Regular.otf": "b9baef19c929f5cbf52071da98afb095",
"assets/assets/images/default_picture.jpeg": "237fc54b4858dddf69ae21537f69ddc0",
"assets/assets/images/restaurants/rouge_delice.jpeg": "2d21faad70f5fb1a47b78305ff4541d6",
"assets/assets/images/restaurants/le_katana.jpeg": "60390d240e93e9ffe6eed89a4ba87dad",
"assets/assets/images/restaurants/syfax.jpeg": "387cd6d5b7cd9efe07b023d4c35e6eee",
"assets/assets/images/restaurants/1989_biergarten.jpeg": "e4b3786a9e8b2808b2b119da8818d985",
"assets/assets/images/restaurants/ici_grenoble.jpeg": "82e52c634dd7e9ab4d2ed62f9fa0e755",
"assets/assets/images/restaurants/ferme_a_dede.jpeg": "fcf3f745a94c312b73b34e96a4a9f596",
"assets/assets/images/restaurants/le_welcome.jpeg": "0a34073b4b2b21d64996a237578d67ff",
"assets/assets/images/restaurants/la_table_de_gordes.jpeg": "20d50604b716ab8bb8a64d300cfe3bed",
"assets/assets/images/restaurants/viva_mexico.jpeg": "c250db9cbfe95b9c277c5d2c81d62cf8",
"assets/assets/images/restaurants/jardin_asie.jpeg": "fee44944be3237395828354ef11a2da2",
"assets/assets/images/restaurants/smash_you.jpeg": "429a657a6cdfab561af65f9622acf549",
"assets/assets/images/restaurants/qualy_sushi.jpeg": "9fa2b766a21849d0ce402a091446e5a3",
"assets/assets/images/restaurants/mazage.jpeg": "362a4a2290fc12f00939c295b83a678d",
"assets/assets/images/restaurants/kfc.jpeg": "e18a7b277eb4ee7bd8c2ff0acae9a93d",
"assets/assets/images/restaurants/pitaya.jpeg": "1106fb1cf2ece9650a555dc45fd50eb3",
"assets/assets/images/restaurants/une_semaine_sur_deux.jpeg": "195738180cfd11f1416bc42a44fa5e76",
"assets/assets/images/background_image.JPG": "83f0f622d5d884bebb75dbd9cf2ef501",
"assets/assets/sounds/trash.ogg": "ffa3fd8d72a88c65c08d73e7d3157252",
"assets/assets/icons/logo.jpg": "7d33375c218081d6ab950edbd210a504",
"assets/assets/icons/vs.png": "2806fe4b5e7195140cd8ec74c5d1d63c",
"assets/assets/icons/loading.JPG": "d2f14db5ba1d482538602b870cf188e5",
"assets/assets/fonts/choko_milky.otf": "0b636f1363d6d85397c997622af8932e",
"assets/assets/fonts/choko_milky_bold.otf": "8a08b443a9abbbc0572ccb0fc6466d5e",
"assets/assets/fonts/zikketica.ttf": "8af45cbd3e9a248a737ef02e5c574fea",
"assets/assets/translations/translation_fr.json": "d2c51a49ea971d3afe35e001032c8e39",
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
