import {createStorage} from "./browser-storage.js";
export class BrowserSessionSystem{
 constructor(namespace,win=globalThis){this.storage=createStorage(namespace,()=>win.sessionStorage);}
 get(key,fallback=null){return this.storage.get(key,fallback);}
 set(key,value){return this.storage.set(key,value);}
 remove(key){return this.storage.remove(key);}
}
