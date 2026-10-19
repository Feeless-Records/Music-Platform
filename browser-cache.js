/** Generic browser/device family module. No business dependencies. */
// Explicit opt-in cache access; this module never installs a service worker.
export async function openCache(namespace,cacheStorage=globalThis.caches){
  if(!namespace)throw new TypeError("Cache namespace required");
  return cacheStorage?cacheStorage.open(namespace):null;
}
