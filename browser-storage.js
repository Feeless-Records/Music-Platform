/** Generic browser/device family module. No business dependencies. */
export function createStorage(namespace,getBackend=()=>globalThis.localStorage){
  if(!namespace)throw new TypeError("Storage namespace required");
  const key=name=>namespace+":"+name;
  return {get(name,fallback=null){try{const raw=getBackend().getItem(key(name));return raw===null?fallback:JSON.parse(raw);}catch{return fallback;}},
  set(name,value){try{getBackend().setItem(key(name),JSON.stringify(value));return true;}catch{return false;}},
  remove(name){try{getBackend().removeItem(key(name));return true;}catch{return false;}}};
}
