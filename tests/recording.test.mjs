import {test} from "node:test";
import assert from "node:assert/strict";
import {AudioRecordingSystem} from "../systems/audio-recording.js";
import {IndustrySystem} from "../systems/industry-system.js";
class Recorder{
 static isTypeSupported(type){return type.startsWith("audio/webm");}
 constructor(stream,options){this.state="inactive";this.mimeType=options.mimeType;}
 start(){this.state="recording";}
 pause(){this.state="paused";}
 resume(){this.state="recording";}
 stop(){this.state="inactive";queueMicrotask(()=>{this.ondataavailable({data:new Blob(["audio"],{type:this.mimeType})});this.onstop();});}
}
function setup(RecorderClass=Recorder){let stopped=0,calls=0;const stream={getTracks:()=>[{stop:()=>stopped++}]};return {stream,stops:()=>stopped,calls:()=>calls,recording:new AudioRecordingSystem({devices:{getUserMedia:async()=>{calls++;return stream;}},Recorder:RecorderClass})};}
test("recording requests input only at start and finalizes playable take metadata",async()=>{
 const {recording,calls,stops}=setup();assert.equal(calls(),0);
 await recording.start();assert.equal(recording.state,"recording");recording.pause();assert.equal(recording.state,"paused");recording.resume();assert.equal(recording.state,"recording");
 await recording.stop();assert.equal(recording.state,"idle");assert.equal(recording.takes.length,1);assert.equal(recording.takes[0].blob.size,5);assert.match(recording.takes[0].mime,/webm/);assert.equal(stops(),1);
 await recording.start();await recording.stop();assert.equal(recording.takes.length,2);
});
test("cancelled permission request releases a late stream without starting a recorder",async()=>{
 let resolve,stopped=0;const recording=new AudioRecordingSystem({devices:{getUserMedia:()=>new Promise(r=>resolve=r)},Recorder});
 const pending=recording.start();assert.equal(recording.state,"requesting");await recording.stop();resolve({getTracks:()=>[{stop:()=>stopped++}]});await pending;
 assert.equal(stopped,1);assert.equal(recording.state,"idle");assert.equal(recording.takes.length,0);
});
test("permission and recorder failures release capture and allow retry",async()=>{
 const recording=new AudioRecordingSystem({devices:{getUserMedia:async()=>{throw new Error("Permission denied");}},Recorder});await assert.rejects(recording.start(),/Permission denied/);assert.equal(recording.state,"error");
 class Broken extends Recorder{start(){throw new Error("Codec failed");}}
 const setupResult=setup(Broken);await assert.rejects(setupResult.recording.start(),/Codec failed/);assert.equal(setupResult.stops(),1);await setupResult.recording.stop();
});
test("industry systems have unique domain identifiers and honest capability states",()=>{
 const industry=new IndustrySystem(),systems=industry.list();assert.equal(industry.domains.length,8);assert.equal(new Set(systems.map(s=>s.id)).size,systems.length);
 assert.ok(systems.length>=70);assert.ok(industry.list({status:"planned"}).length>60);assert.equal(industry.get("audio.audio-recording").tool,"recording");
 assert.throws(()=>industry.get("missing"));assert.ok(industry.list({domain:"events"}).every(s=>s.id.startsWith("events.")));
});
test("recording panel mounts with idle controls without requesting microphone",async()=>{
 const {RecordingPanel}=await import("../systems/recording-panel.js");const {recording,calls}=setup();
 const doc={createElement:()=>({ownerDocument:doc,children:[],classList:{add(){}},setAttribute(){},append(...items){this.children.push(...items);},replaceChildren(){this.children=[];},addEventListener(){}})};
 const panel=new RecordingPanel(recording).mount(doc.createElement("div"));assert.equal(calls(),0);assert.equal(panel.buttons["Start recording"].disabled,false);assert.equal(panel.buttons["Stop recording"].disabled,true);panel.dispose();assert.equal(recording.listeners.size,0);
});
