import {test} from "node:test";
import assert from "node:assert/strict";
import {StudioCore} from "../systems/studio-core.js";
import {TransportController} from "../systems/transport-controller.js";
import {AudioEngineSystem} from "../systems/audio-engine.js";
import {AudioRenderingSystem,encodeWav} from "../systems/audio-rendering.js";
function param(value=0){return {value,setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.value=v;},setTargetAtTime(v){this.value=v;},cancelScheduledValues(){}};}
class Context{
 constructor(){this.currentTime=0;this.sampleRate=44100;this.state="running";this.destination={};this.oscillators=[];this.nodes=[];}
 node(){const n={context:this,connect(target){this.destination=target;},disconnect(){this.disconnected=true;},gain:param(1),frequency:param(440),Q:param(1),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param()};this.nodes.push(n);return n;}
 createGain(){return this.node();}createBiquadFilter(){return this.node();}createDynamicsCompressor(){return this.node();}createAnalyser(){return this.node();}
 createOscillator(){const node=this.node();node.start=time=>{node.startTime=time;};node.stop=time=>{node.stopTime=time;};this.oscillators.push(node);return node;}
 async resume(){}async close(){this.state="closed";}
}
function setup(){
 const core=new StudioCore(),context=new Context(),engine=new AudioEngineSystem({context});
 const timers=new Set(),controller=new TransportController(core,{engine,setTimer:fn=>{timers.add(fn);return fn;},clearTimer:fn=>timers.delete(fn)});
 core.transportController=controller;core.sequencer.addNote({beat:0,duration:.25,frequency:440});core.sequencer.addNote({beat:1,duration:.25,frequency:220});
 return {core,context,engine,controller,timers};
}
test("transport schedules against audio time once and stops queued voices",async()=>{
 const {controller,context,timers}=setup();await controller.play();assert.equal(context.oscillators.length,1);
 controller.pump();assert.equal(context.oscillators.length,1);
 context.currentTime=.45;controller.pump();assert.equal(context.oscillators.length,2);assert.ok(Math.abs(context.oscillators[1].startTime-.5)<1e-8);
 controller.pause();assert.equal(timers.size,0);assert.equal(controller.state,"paused");assert.ok(Math.abs(controller.clock.beat-.9)<1e-8);
 controller.stop();assert.equal(controller.snapshot().beat,0);
});
test("live tempo changes preserve beat and looping schedules next cycle",async()=>{
 const {core,controller,context}=setup();await controller.play();context.currentTime=.5;
 core.setTempo(60);assert.equal(controller.clock.position(.5),1);context.currentTime=1;assert.equal(controller.clock.position(1),1.5);
 controller.stop();core.setTempo(120);await controller.play();context.currentTime+=1.95;controller.pump();
 assert.ok(context.oscillators.some(n=>Math.abs(n.startTime-3)<1e-8));controller.stop();
});
test("pause cancels pending asynchronous audio resume",async()=>{
 const {controller,engine,timers}=setup();let resolve;engine.resume=()=>new Promise(r=>{resolve=r;});
 const pending=controller.play();controller.pause();resolve();await pending;assert.equal(controller.state,"paused");assert.equal(timers.size,0);
});
test("seek cuts voices and restarts from requested beat; non-loop ends",async()=>{
 const {controller,context}=setup();await controller.play();await controller.seek(1);assert.equal(controller.snapshot().beat,1);
 controller.configure({loop:false});await controller.play();context.currentTime=3;controller.pump();
 assert.equal(controller.state,"paused");assert.equal(controller.snapshot().beat,4);controller.stop();
});
test("shared processing graph applies gain/cutoff and validates controls",()=>{
 const {engine,context}=setup();engine.getContext();engine.configure({gain:.4,cutoff:1000});
 assert.equal(engine.processing.output.gain.value,.4);assert.equal(engine.processing.filter.frequency.value,1000);
 assert.equal(engine.processing.analyser.destination,context.destination);assert.throws(()=>engine.configure({gain:2}));
});
test("offline render snapshots notes and schedules trimmed duration without realtime changes",async()=>{
 let offline;
 class Offline extends Context{
 constructor(channels,length,rate){super();this.sampleRate=rate;this.channels=channels;this.length=length;offline=this;}
 async startRendering(){return {length:this.length,sampleRate:this.sampleRate,numberOfChannels:this.channels,duration:this.length/this.sampleRate,getChannelData:()=>new Float32Array(this.length)};}
 }
 const renderer=new AudioRenderingSystem({offlineFactory:Offline});
 const buffer=await renderer.render({notes:[{beat:0,duration:2,frequency:440,velocity:100}],bpm:120,startBeat:1,endBeat:2});
 assert.equal(offline.oscillators.length,1);assert.equal(offline.oscillators[0].startTime,0);assert.equal(buffer.duration,.75);
 await assert.rejects(()=>renderer.render({notes:[],endBeat:1000,bpm:20}),/120 seconds/);
 await assert.rejects(()=>renderer.render({notes:[{beat:0,duration:1,frequency:NaN,velocity:100}]}));
});
test("WAV exporter writes stereo PCM headers, interleaves and clamps samples",async()=>{
 const buffer={numberOfChannels:2,length:2,sampleRate:44100,getChannelData:i=>i===0?new Float32Array([2,-2]):new Float32Array([.5,NaN])};
 const wav=encodeWav(buffer),data=await wav.arrayBuffer(),view=new DataView(data);
 assert.equal(new TextDecoder().decode(new Uint8Array(data,0,4)),"RIFF");assert.equal(view.getUint16(22,true),2);assert.equal(view.getUint32(40,true),8);
 assert.equal(view.getInt16(44,true),32767);assert.equal(view.getInt16(48,true),-32768);assert.equal(view.getInt16(50,true),0);
});

test("browser timer callbacks retain the global receiver",async()=>{
 const {core,engine}=setup(),oldSet=globalThis.setInterval,oldClear=globalThis.clearInterval;let cleared=false;
 globalThis.setInterval=function(){assert.equal(this,globalThis);return 123;};
 globalThis.clearInterval=function(id){assert.equal(this,globalThis);assert.equal(id,123);cleared=true;};
 try{const controller=new TransportController(core,{engine});await controller.play();controller.pause();assert.equal(cleared,true);}
 finally{globalThis.setInterval=oldSet;globalThis.clearInterval=oldClear;}
});
