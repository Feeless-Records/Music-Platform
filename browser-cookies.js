/** Generic browser/device family module. No business dependencies. */
// Optional cookies only: no cookies are created during application startup.
export function readCookie(name,doc=globalThis.document){
  const prefix=encodeURIComponent(name)+"=";
  const value=doc.cookie.split(";").map(x=>x.trim()).find(x=>x.startsWith(prefix));
  if(!value)return null;try{return decodeURIComponent(value.slice(prefix.length));}catch{return null;}
}
export function writeCookie(name,value,{path="/",maxAge=86400}={},doc=globalThis.document){
  if(!/^\/[A-Za-z0-9/_-]*$/.test(path)||!Number.isFinite(maxAge))throw new TypeError("Invalid cookie options");
  doc.cookie=encodeURIComponent(name)+"="+encodeURIComponent(value)+"; Path="+path+"; Max-Age="+Math.floor(maxAge)+"; SameSite=Lax; Secure";
}
