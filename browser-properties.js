function available(read){try{return Boolean(read());}catch{return false;}}
export class BrowserPropertiesSystem{
 static read(win){
 const nav=win.navigator||{};
 return {secureContext:win.isSecureContext===true,cookiesEnabled:typeof nav.cookieEnabled==="boolean"?nav.cookieEnabled:null,onlineHint:typeof nav.onLine==="boolean"?nav.onLine:null,
 storage:{localStorage:available(()=>win.localStorage),sessionStorage:available(()=>win.sessionStorage),indexedDB:available(()=>win.indexedDB),quotaEstimate:typeof nav.storage?.estimate==="function",persistentStatus:typeof nav.storage?.persisted==="function"},
 cache:{cacheAPI:available(()=>win.caches),serviceWorkerAPI:available(()=>nav.serviceWorker)},
 input:{maxTouchPoints:nav.maxTouchPoints||0,pointerEvents:typeof win.PointerEvent==="function"},
 media:{webAudio:typeof(win.AudioContext||win.webkitAudioContext)==="function",offlineAudio:typeof(win.OfflineAudioContext||win.webkitOfflineAudioContext)==="function",midi:typeof nav.requestMIDIAccess==="function",mediaRecorder:typeof win.MediaRecorder==="function"},
 graphics:{webGPUAPI:available(()=>nav.gpu),webAssembly:available(()=>win.WebAssembly)}};
 }
 static async storageStatus(navigator={}){
 const manager=navigator.storage,result={usage:null,quota:null,persistent:null,errors:[]};
 if(!manager)return result;
 if(typeof manager.estimate==="function")try{const estimate=await manager.estimate();result.usage=estimate.usage??null;result.quota=estimate.quota??null;}catch{result.errors.push("estimate-unavailable");}
 if(typeof manager.persisted==="function")try{result.persistent=await manager.persisted();}catch{result.errors.push("persistence-status-unavailable");}
 return result;
 }
}
