import {test} from "node:test";
import assert from "node:assert/strict";
import {StorageConsentSystem} from "../storage-consent.js";
import {restorePattern,bindStudioStorage} from "../studio-persistence.js";
import {StudioCore} from "../systems/studio-core.js?v=industry-1";
import {MobileSystem} from "../systems/mobile-system.js";
function environment(){const data=new Map(),cookies=[];let persistenceRequests=0;const doc={get cookie(){return cookies.at(-1)??"";},set cookie(value){cookies.push(value);}};const win={localStorage:{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)},navigator:{storage:{persist:async()=>{persistenceRequests++;return false;}}}};return {doc,win,data,cookies,requests:()=>persistenceRequests};}
test("optional writes and persistence requests are disabled until explicit consent",async()=>{
 const env=environment(),consent=new StorageConsentSystem(env);assert.equal(consent.choice,null);consent.saveLayout("tablet");assert.equal(env.data.size,0);assert.equal(env.cookies.length,0);
 await consent.choose({});assert.equal(env.requests(),0);consent.saveLayout("tablet");assert.equal(env.data.size,1);
 await consent.choose({cookies:true,storage:true,persistent:true},{requestPersistence:true});assert.equal(env.requests(),1);assert.match(consent.persistence,/did not grant/);
 consent.saveLayout("tablet");assert.equal(consent.getLayout(),"tablet");assert.match(env.cookies.at(-1),/Path=\/Music-Platform\//);assert.match(env.cookies.at(-1),/Secure/);
 const restored=new StorageConsentSystem(env);assert.equal(restored.choice.storage,true);assert.equal(env.requests(),1);
 await consent.choose({});assert.match(env.cookies.at(-1),/Max-Age=0/);assert.equal(consent.getLayout(),null);
});
test("cookie-only layout, blocked storage and inconsistent choices are handled",async()=>{
 const env=environment(),consent=new StorageConsentSystem(env);await consent.choose({cookies:true,persistent:true});assert.equal(consent.choice.persistent,false);consent.saveLayout("mobile");assert.equal(consent.getLayout(),"mobile");
 const blocked=new StorageConsentSystem({doc:env.doc,win:{localStorage:{getItem(){throw Error();},setItem(){throw Error();}},navigator:{}}});await blocked.choose({storage:true});assert.equal(blocked.choice.storage,true);assert.match(blocked.persistence,/blocked/);
});
test("saved pattern restores through shared core and rejects corrupt notes",()=>{
 const core=new StudioCore();new MobileSystem({}, {core});const snapshot={version:1,bpm:130,notes:[{channelId:"Kick",beat:0,duration:.25,note:36,velocity:100}]};
 assert.equal(restorePattern(core,snapshot),true);assert.equal(core.timeline.bpm,130);assert.equal(core.sequencer.notes.length,1);
 assert.equal(restorePattern(core,{...snapshot,notes:[null]}),false);assert.equal(restorePattern(core,{...snapshot,notes:[{...snapshot.notes[0],channelId:"missing"}]}),false);
 assert.equal(core.sequencer.notes.length,1);
});
test("studio snapshot reads and writes stay gated and recorded Blobs recover",async()=>{
 const env=environment(),consent=new StorageConsentSystem(env),core=new StudioCore();new MobileSystem({}, {core});
 const events={},root={addEventListener:(event,fn)=>events[event]=fn};let reads=0,writes=0,reflows=0;
 const saved={version:1,bpm:125,notes:[{channelId:"Kick",beat:0,duration:.25,note:36,velocity:100}],takes:[{id:"take-saved",name:"Take 1",mime:"audio/webm",blob:new Blob(["take"])}]};
 const store={read:async()=>{reads++;return saved;},write:async value=>{writes++;assert.equal(value.takes[0].blob.size,4);}};
 const binding=bindStudioStorage(consent,{root,core,mode:"auto",reconcile:()=>reflows++},{store});assert.equal(reads,0);events.click();await new Promise(r=>setTimeout(r,220));assert.equal(writes,0);
 await consent.choose({storage:true});await new Promise(r=>setTimeout(r,240));assert.equal(reads,1);assert.equal(core.recording.takes.length,1);assert.equal(writes,1);
 await consent.choose({});events.click();await new Promise(r=>setTimeout(r,220));assert.equal(writes,1);assert.equal(core.recording.takes.length,1);binding.stop();
});
