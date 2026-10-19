import {test} from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import {AudioSystem} from "../systems/audio.js";
function appClass(){
 const source=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8").replace(/^import .*;\n/gm,"").replace("new AudioStudioApp().start();","globalThis.App=AudioStudioApp;");
 const context={document:{createElement:()=>({hidden:false}),body:{append(){}}}};vm.createContext(context);vm.runInContext(source,context);return context.App;
}
test("circle appears on first click and alternates",()=>{
 const App=appClass(),app=Object.create(App.prototype);app.quintButton={setAttribute(){}};
 app.toggleQuintCircle();assert.equal(app.quintCircle.hidden,false);app.toggleQuintCircle();assert.equal(app.quintCircle.hidden,true);
});
test("app shutdown stops sample and resume restarts paused services",()=>{
 const App=appClass(),app=Object.create(App.prototype),calls=[];
 for(const name of ["audio","browser","keyboard","midi","animation","fft"])app[name]={stop:()=>calls.push(name+":stop"),start:()=>calls.push(name+":start")};
 app.releaseSaw=()=>calls.push("saw:release");app.stop();app.resume();
 assert.ok(calls.includes("audio:stop"));for(const name of ["browser","keyboard","animation","fft"])assert.ok(calls.includes(name+":start"));
});
test("sample stop settles playback and removes listeners",async()=>{
 const previous=globalThis.Audio;
 globalThis.Audio=class{
 constructor(){this.handlers=new Map();}
 addEventListener(k,v){this.handlers.set(k,v);}
 removeEventListener(k){this.handlers.delete(k);}
 play(){return Promise.resolve();}
 pause(){}
 };
 try{
 const audio=new AudioSystem();audio.connectAnalyzer=()=>{audio.context={resume:async()=>{}}};
 const playback=audio.play();await new Promise(r=>setImmediate(r));audio.stop();
 const settled=await Promise.race([playback.then(()=>true),new Promise(r=>setTimeout(()=>r(false),50))]);
 assert.equal(settled,true);assert.equal(audio.audio.handlers.size,0);assert.equal(audio.playing,false);
 }finally{globalThis.Audio=previous;}
});
