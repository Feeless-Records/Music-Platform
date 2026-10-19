import {test} from "node:test";
import assert from "node:assert/strict";
import {BrowserApp,selectProfile} from "../browser-app.js";
import {createStorage} from "../browser-storage.js";
test("responsive boundaries and pointer categories",()=>{
 for(const [width,coarse,family] of [[390,true,"mobile"],[599,false,"mobile"],[600,false,"tablet"],[1023,false,"tablet"],[1024,false,"desktop"],[1366,true,"desktop"]])
 assert.equal(selectProfile({width,coarse}).family,family);
});
test("viewport rotation updates layout and releases every observer",()=>{
 const listeners=new Map(),visual=new Map(),properties=new Map();
 const win={innerWidth:390,innerHeight:844,matchMedia:()=>({matches:true}),
 addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k),
 visualViewport:{addEventListener:(k,v)=>visual.set(k,v),removeEventListener:k=>visual.delete(k)}};
 const root={dataset:{},style:{setProperty:(k,v)=>properties.set(k,v)}};
 const app=new BrowserApp({win,root});app.start();app.start();
 assert.equal(root.dataset.device,"mobile");assert.equal(root.dataset.orientation,"portrait");
 win.innerWidth=844;win.innerHeight=390;listeners.get("resize")();
 assert.equal(root.dataset.device,"mobile");assert.equal(root.dataset.orientation,"landscape");
 assert.equal(properties.get("--viewport-height"),"390px");
 app.stop();assert.equal(listeners.size,0);assert.equal(visual.size,0);
 app.start();assert.equal(listeners.size,1);app.stop();
});
test("namespaced storage survives profile changes and blocked storage",()=>{
 const values=new Map(),backend={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const mobile=selectProfile({width:390,coarse:true}).createStorage("studio",()=>backend);
 const desktop=selectProfile({width:1200,coarse:false}).createStorage("studio",()=>backend);
 assert.equal(mobile.set("theme","dark"),true);assert.equal(desktop.get("theme"),"dark");
 const blocked=createStorage("studio",()=>{throw Error("denied");});
 assert.equal(blocked.get("theme","default"),"default");assert.equal(blocked.set("theme","dark"),false);
 values.set("studio:broken","{");assert.equal(mobile.get("broken","fallback"),"fallback");
});
