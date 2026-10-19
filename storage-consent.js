import {writeCookie,readCookie} from "./browser-cookies.js";
const KEY="feeless:Music-Platform:consent:v1",PREF="feeless:Music-Platform:layout",COOKIE="feeless_music_layout";
export class StorageConsentSystem{
 constructor({win=window,doc=document}={}){this.win=win;this.doc=doc;this.choice=null;this.listeners=new Set();this.persistence="Not requested";try{const stored=JSON.parse(win.localStorage.getItem(KEY));if(stored?.version===1&&Date.now()-stored.updatedAt<180*86400000)this.choice=this.normalize(stored);}catch{}}
 normalize(value){return {version:1,cookies:value.cookies===true,storage:value.storage===true,persistent:value.storage===true&&value.persistent===true,updatedAt:value.updatedAt??Date.now()};}
 subscribe(fn){this.listeners.add(fn);return ()=>this.listeners.delete(fn);}
 async choose(value,{requestPersistence=false}={}){
 this.choice=this.normalize({...value,updatedAt:Date.now()});this.persistence="Not requested";
 try{this.win.localStorage.setItem(KEY,JSON.stringify(this.choice));}catch{this.persistence="Browser blocked saving your choice; it applies to this page only.";}
 if(!this.choice.cookies)try{writeCookie(COOKIE,"",{path:"/Music-Platform/",maxAge:0},this.doc);}catch{}
 for(const listener of this.listeners)listener(this.choice);
 if(this.choice.persistent&&requestPersistence){try{this.persistence=typeof this.win.navigator.storage?.persist==="function"?(await this.win.navigator.storage.persist()?"Protection granted by browser":"Browser did not grant protection; ordinary local saving remains available"):"Browser does not support persistence requests";}catch{this.persistence="Persistence request unavailable; ordinary local saving remains available";}}
 this.updateStatus();return this.choice;
 }
 getLayout(){if(this.choice?.storage)try{const mode=this.win.localStorage.getItem(PREF);if(mode)return mode;}catch{}if(this.choice?.cookies)try{return readCookie(COOKIE,this.doc);}catch{}return null;}
 saveLayout(mode){if(!["auto","mobile","tablet","desktop"].includes(mode))return;if(this.choice?.storage)try{this.win.localStorage.setItem(PREF,mode);}catch{}if(this.choice?.cookies)try{writeCookie(COOKIE,mode,{path:"/Music-Platform/",maxAge:180*86400000},this.doc);}catch{}}
 mount(){
 const doc=this.doc;this.style=doc.createElement("link");this.style.rel="stylesheet";this.style.href="./storage-consent.css";doc.head.append(this.style);
 this.settings=doc.createElement("button");this.settings.type="button";this.settings.className="storage-settings";this.settings.textContent="Cookies & storage";this.settings.addEventListener("click",()=>this.open(true));doc.body.append(this.settings);
 this.dialog=doc.createElement("dialog");this.dialog.className="storage-consent";this.dialog.setAttribute("aria-labelledby","storage-consent-title");
 const heading=doc.createElement("h2");heading.id="storage-consent-title";heading.textContent="Keep your studio on this device?";
 const copy=doc.createElement("p");copy.textContent="Choose optional preference cookies and local storage for your layout, pattern, tempo and recordings. Nothing is uploaded. The platform works with these options off.";
 const essential=doc.createElement("p");essential.textContent="We remember this choice locally for 180 days, including rejection. No advertising or analytics cookies are used.";
 this.options=doc.createElement("fieldset");const legend=doc.createElement("legend");legend.textContent="Your choices";this.options.append(legend);this.inputs={};
 for(const [id,text]of [["cookies","Preference cookies — remember your interface layout for 180 days."],["storage","Local storage — save layout, pattern, tempo and recording takes across reloads."],["persistent","Ask the browser to protect local data from automatic eviction. Requires local storage."]]){
 const label=doc.createElement("label"),input=doc.createElement("input");input.type="checkbox";input.checked=this.choice?.[id]??false;this.inputs[id]=input;label.append(input,doc.createTextNode(text));this.options.append(label);}
 this.inputs.storage.addEventListener("change",()=>{this.inputs.persistent.disabled=!this.inputs.storage.checked;if(!this.inputs.storage.checked)this.inputs.persistent.checked=false;});
 const caveat=doc.createElement("p");caveat.textContent="Local data is not a backup. Clearing browser data removes it. Storage protection applies to this GitHub Pages origin and is controlled by your browser. Turning saving off retains existing saved takes but stops accessing or updating them.";
 this.status=doc.createElement("p");this.status.setAttribute("role","status");this.status.className="storage-status";
 const actions=doc.createElement("div");actions.className="storage-actions";
 const button=(text,fn)=>{const b=doc.createElement("button");b.type="button";b.textContent=text;b.addEventListener("click",fn);actions.append(b);};
 const apply=async value=>{for(const b of actions.querySelectorAll("button"))b.disabled=true;try{await this.choose(value,{requestPersistence:true});this.dialog.close();}finally{for(const b of actions.querySelectorAll("button"))b.disabled=false;}};
 button("Accept all",()=>apply({cookies:true,storage:true,persistent:true}));
 button("Reject optional",()=>apply({}));
 button("Customize",()=>{this.options.hidden=false;this.save.hidden=false;this.inputs.cookies.focus();});
 this.save=doc.createElement("button");this.save.type="button";this.save.textContent="Save selected choices";this.save.addEventListener("click",()=>apply(Object.fromEntries(Object.entries(this.inputs).map(([key,input])=>[key,input.checked]))));actions.append(this.save);
 this.dialog.append(heading,copy,essential,this.options,caveat,this.status,actions);doc.body.append(this.dialog);if(!this.choice)this.open();return this;
 }
 open(customize=false){for(const [key,input]of Object.entries(this.inputs))input.checked=this.choice?.[key]??false;this.inputs.persistent.disabled=!this.inputs.storage.checked;this.options.hidden=!customize;this.save.hidden=!customize;this.updateStatus();if(!this.dialog.open)this.dialog.showModal();}
 updateStatus(){if(this.status)this.status.textContent=this.persistence;if(this.settings)this.settings.title=this.persistence;}
 report(message){this.persistence=message;this.updateStatus();if(this.settings)this.settings.title=message;}
}
