const DATABASE="feeless-Music-Platform-v1";
export class StudioPersistenceSystem{
 constructor({indexedDB=globalThis.indexedDB}={}){this.indexedDB=indexedDB;this.pending=Promise.resolve();}
 async open(){if(!this.indexedDB)throw new Error("IndexedDB is unavailable");if(this.db)return this.db;return new Promise((resolve,reject)=>{const request=this.indexedDB.open(DATABASE,1);request.onupgradeneeded=()=>request.result.createObjectStore("studio");request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error("Close other studio tabs to enable storage"));request.onsuccess=()=>{this.db=request.result;this.db.onversionchange=()=>{this.db.close();this.db=null;};resolve(this.db);};});}
 async read(){const db=await this.open();return new Promise((resolve,reject)=>{const tx=db.transaction("studio","readonly"),request=tx.objectStore("studio").get("snapshot");let value;request.onsuccess=()=>value=request.result;tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
 write(value){this.pending=this.pending.catch(()=>{}).then(async()=>{const db=await this.open();return new Promise((resolve,reject)=>{const tx=db.transaction("studio","readwrite");tx.objectStore("studio").put(value,"snapshot");tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});});return this.pending;}
}
export function restorePattern(core,value){
 if(!value||value.version!==1||!Array.isArray(value.notes))return false;
 const channels=core.workflow.channelRack.channels;
 if(value.notes.length>4096||value.notes.some(n=>!n||!channels.has(n.channelId)||![n.beat,n.duration,n.note,n.velocity].every(Number.isFinite)||n.beat<0||n.beat+n.duration>4||n.duration<=0||!Number.isInteger(n.note)||n.note<0||n.note>127||!Number.isInteger(n.velocity)||n.velocity<0||n.velocity>127))return false;
 core.workflow.patterns.get("pattern-1").notes=value.notes.map(({channelId,beat,duration,note,velocity})=>({channelId,beat,duration,note,velocity}));
 if(Number.isFinite(value.bpm)&&value.bpm>=20&&value.bpm<=300)core.setTempo(value.bpm);
 core.loadPattern("pattern-1");return true;
}
export function bindStudioStorage(consent,interfaces,{store=new StudioPersistenceSystem()}={}){
 let unsubscribe,unimport,saveTimer,generation=0,dirty=false;
 const root=interfaces.root;
 const save=()=>{if(!consent.choice?.storage)return;clearTimeout(saveTimer);const currentGeneration=generation;saveTimer=setTimeout(async()=>{if(!consent.choice?.storage||currentGeneration!==generation)return;const core=interfaces.core;try{await store.write({version:1,notes:structuredClone(core.workflow.patterns.get("pattern-1").notes),bpm:core.timeline.bpm,takes:structuredClone(core.recording.takes),mode:interfaces.mode});consent.report("Studio saved on this device. "+(consent.persistence.includes("Protection granted")?"Protection granted.":"Download important recordings as a backup."));}catch{consent.report("Local saving failed or storage is full. Download your recordings.");}},200);};
 root.addEventListener("click",()=>{dirty=true;save();});root.addEventListener("change",()=>{dirty=true;consent.saveLayout(interfaces.mode);save();});
 const activate=async()=>{
 const token=++generation;unsubscribe?.();unimport?.();unsubscribe=null;unimport=null;clearTimeout(saveTimer);
 if(!consent.choice?.storage)return;
 const initialDirty=dirty;try{const saved=await store.read();if(!consent.choice?.storage||token!==generation)return;
 if(saved?.version===1){
 if(!initialDirty&&!dirty&&restorePattern(interfaces.core,saved))interfaces.reconcile(true);
 const takes=Array.isArray(saved.takes)?saved.takes.filter(t=>t&&typeof t.id==="string"&&typeof t.name==="string"&&typeof t.mime==="string"&&t.blob instanceof Blob&&t.blob.size>0):[];
 const map=new Map(takes.map(t=>[t.id,t]));for(const take of interfaces.core.recording.takes)map.set(take.id,take);interfaces.core.recording.takes=[...map.values()];interfaces.core.recording.emit();
 }
 unsubscribe=interfaces.core.recording.subscribe(()=>save());unimport=interfaces.core.importer?.subscribe(()=>save());
 }catch{consent.report("Local storage is unavailable. The studio still works; download recordings before leaving.");}
 };
 consent.subscribe(activate);activate();
 return {save,stop(){++generation;clearTimeout(saveTimer);unsubscribe?.();unimport?.();}};
}
