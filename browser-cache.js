// Cache API is separate from the browser-managed HTTP cache.
// These methods are opt-in and never install a service worker.
export async function openCache(namespace,cacheStorage=globalThis.caches){
 if(typeof namespace!=="string"||!namespace.trim())throw new TypeError("Cache namespace required");
 return cacheStorage?cacheStorage.open(namespace):null;
}
export class BrowserCacheSystem{
 constructor(namespace,getBackend=()=>globalThis.caches){if(typeof namespace!=="string"||!namespace.trim())throw new TypeError("Cache namespace required");this.namespace=namespace;this.getBackend=getBackend;}
 open(){return openCache(this.namespace,this.getBackend());}
 async read(request){const cache=await this.open();return cache?(await cache.match(request))??null:null;}
 async write(request,response){const cache=await this.open();if(!cache)return false;await cache.put(request,response.clone());return true;}
 async remove(request){const cache=await this.open();return cache?cache.delete(request):false;}
}
