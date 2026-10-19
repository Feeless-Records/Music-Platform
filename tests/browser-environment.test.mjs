import {test} from "node:test";
import assert from "node:assert/strict";
import {BrowserDetectionSystem} from "../browser-detection.js";
import {BrowserPropertiesSystem} from "../browser-properties.js";
import {DeviceSystem} from "../browser-device.js";
import {ViewportSystem} from "../browser-viewport.js";
import {BrowserSessionSystem} from "../browser-session.js";
import {BrowserCacheSystem} from "../browser-cache.js";
import {BrowserApp} from "../browser-app.js?v=environment-1";
test("device, responsive profile and orientation are independent",()=>{
 const win={innerWidth:390,innerHeight:800,navigator:{userAgent:"Mozilla/5.0 (Windows NT 10.0) Chrome/140.0 Safari/537.36"},matchMedia:()=>({matches:false}),addEventListener(){},removeEventListener(){}};
 const root={dataset:{},style:{setProperty(){}}},app=new BrowserApp({win,root});app.start();
 assert.equal(app.state.family,"mobile");assert.equal(app.state.browser.device.family,"desktop");assert.equal(app.state.orientation,"portrait");app.stop();
 assert.equal(DeviceSystem.detect({userAgent:"Mozilla Macintosh",maxTouchPoints:5}).family,"tablet");
});
test("browser variants are not mistaken for generic Chromium",()=>{
 const data={userAgentData:{brands:[{brand:"Chromium",version:"140"}]}};
 assert.equal(BrowserDetectionSystem.detect({...data,userAgent:"Chrome/140.0 SamsungBrowser/28.0 Safari/537.36"}).name,"Samsung Internet");
 assert.equal(BrowserDetectionSystem.detect({...data,userAgent:"Chrome/140.0 Edg/140.0"}).name,"Edge");
 assert.equal(BrowserDetectionSystem.detect({userAgent:"Version/18.0 Safari/605.1"}).name,"Safari");
 assert.equal(BrowserDetectionSystem.detect({}).name,"Unknown");
});
test("capability inspection tolerates blocked storage and writes nothing",()=>{
 let writes=0;const win={navigator:{cookieEnabled:false,onLine:false},sessionStorage:{setItem(){writes++;}}};
 Object.defineProperty(win,"localStorage",{get(){throw Error("blocked");}});
 const properties=BrowserPropertiesSystem.read(win);
 assert.equal(properties.storage.localStorage,false);assert.equal(properties.storage.sessionStorage,true);assert.equal(properties.media.midi,false);assert.equal(properties.cookiesEnabled,false);assert.equal(writes,0);
});
test("storage quota/persistence failures remain explicit and non-destructive",async()=>{
 const status=await BrowserPropertiesSystem.storageStatus({storage:{estimate:async()=>{throw Error();},persisted:async()=>true}});
 assert.equal(status.usage,null);assert.equal(status.persistent,true);assert.deepEqual(status.errors,["estimate-unavailable"]);
});
test("visual viewport and screen orientation remain separate from layout",()=>{
 const win={innerWidth:800,innerHeight:400,devicePixelRatio:2,screen:{orientation:{type:"landscape-primary"}},visualViewport:{width:400,height:180,scale:2,offsetLeft:20,offsetTop:10},matchMedia:()=>({matches:true})};
 const state=new ViewportSystem(win).read();assert.equal(state.width,800);assert.equal(state.orientation,"landscape");assert.equal(state.visual.width,400);assert.equal(state.visual.scale,2);assert.equal(state.screenOrientation,"landscape-primary");
});
test("session storage is namespaced and uses session backend",()=>{
 const data=new Map(),win={sessionStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}};
 const session=new BrowserSessionSystem("feeless-music-platform",win);session.set("workspace","radio");assert.equal(session.get("workspace"),"radio");assert.ok(data.has("feeless-music-platform:workspace"));
});
test("cache operations use only their named cache",async()=>{
 const opened=[],entries=new Map(),cache={match:async k=>entries.get(k),put:async(k,v)=>entries.set(k,v),delete:async k=>entries.delete(k)};
 const system=new BrowserCacheSystem("feeless-music-platform:v1",()=>({open:async n=>{opened.push(n);return cache;}}));
 const response={clone:()=>"payload"};await system.write("asset",response);assert.equal(await system.read("asset"),"payload");await system.remove("asset");assert.equal(await system.read("asset"),null);assert.ok(opened.every(n=>n==="feeless-music-platform:v1"));
});
