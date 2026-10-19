import {test} from "node:test";
import assert from "node:assert/strict";
import {StudioCore} from "../systems/studio-core.js?v=media-1";
import {MobileSystem} from "../systems/mobile-system.js";
import {encodePCM,AudioEncodingSystem} from "../systems/audio-encoding.js";
function core(){const value=new StudioCore();new MobileSystem({}, {core:value});return value;}
const buffer={numberOfChannels:1,length:3,sampleRate:48000,duration:3/48000,getChannelData:()=>new Float32Array([-1,0,1])};
test("project JSON round trip preserves pattern and tempo; invalid import is atomic",async()=>{
 const source=core();source.setTempo(137);source.workflow.channelRack.setStep("pattern-1","Kick",0,{enabled:true,note:36});const blob=source.exporter.project();
 const target=core();await target.importer.project(blob);assert.equal(target.timeline.bpm,137);assert.equal(target.sequencer.notes.length,1);assert.equal(target.workflow.patterns.get("pattern-1").notes[0].channelId,"Kick");
 const invalid=JSON.parse(await blob.text());invalid.notes[0].note=999;
 await assert.rejects(target.importer.project(new Blob([JSON.stringify(invalid)])),/Invalid project notes/);assert.equal(target.sequencer.notes.length,1);assert.equal(target.timeline.bpm,137);
 await assert.rejects(target.importer.project(new Blob(['{"version":999}'])),/Unsupported/);
});
test("WAV encoder writes signed PCM16, PCM24 and float32 with real sample values",async()=>{
 for(const depth of [16,24,32]){
 const blob=encodePCM(buffer,depth),view=new DataView(await blob.arrayBuffer());
 assert.equal(blob.size,44+3*depth/8);assert.equal(view.getUint16(20,true),depth===32?3:1);assert.equal(view.getUint32(24,true),48000);assert.equal(view.getUint16(34,true),depth);
 if(depth===16){assert.equal(view.getInt16(44,true),-32768);assert.equal(view.getInt16(48,true),32767);}
 if(depth===24){assert.equal(view.getUint8(46),128);assert.equal(view.getUint8(52),127);}
 if(depth===32){assert.equal(view.getFloat32(44,true),-1);assert.equal(view.getFloat32(52,true),1);}
 }
 const headroom={...buffer,getChannelData:()=>new Float32Array([-2,NaN,2])},view=new DataView(await encodePCM(headroom,32).arrayBuffer());assert.equal(view.getFloat32(44,true),-2);assert.equal(view.getFloat32(48,true),0);assert.equal(view.getFloat32(52,true),2);
 assert.throws(()=>encodePCM(buffer,8));
});
test("audio import decodes locally and rejects oversized and overlong files",async()=>{
 const value=core();value.transportController.engine.context={decodeAudioData:async()=>({...buffer,duration:2})};value.transportController.engine.getContext=()=>value.transportController.engine.context;
 const blob=new Blob(["audio"],{type:"audio/wav"});blob.name="example.wav";const imported=await value.importer.audio(blob);assert.equal(imported.name,"example.wav");assert.equal(imported.duration,2);assert.equal(value.importer.assets.length,1);
 await assert.rejects(value.importer.decode({size:26*1024*1024}),/25 MiB/);
 value.transportController.engine.context.decodeAudioData=async()=>({...buffer,duration:121});await assert.rejects(value.importer.audio(blob),/120 seconds/);assert.equal(value.importer.assets.length,1);
});
test("encoding format detection, cancellation and busy guard are explicit",async()=>{
 const value=core(),Recorder={isTypeSupported:mime=>mime.startsWith("audio/ogg")},encoder=new AudioEncodingSystem(value,{Recorder});
 assert.deepEqual(encoder.formats().map(f=>f.id),["wav","ogg"]);
 await assert.rejects(encoder.encode(buffer,{format:"aac"}),/cannot encode/);
 const abort=new AbortController();abort.abort();await assert.rejects(encoder.encode(buffer,{signal:abort.signal}),/cancelled/);
 encoder.busy=true;await assert.rejects(encoder.encode(buffer),/already running/);
});
test("WAV conversion uses an offline context and returns a matching download",async()=>{
 let parameters,disconnected=0;
 class Offline{constructor(...args){parameters=args;this.destination={};}createBufferSource(){return {connect(){},start(){},disconnect(){disconnected++;}};}async startRendering(){return buffer;}}
 const encoder=new AudioEncodingSystem(core(),{Offline});const result=await encoder.encode(buffer,{format:"wav",depth:24,sampleRate:48000,channels:1});
 assert.deepEqual(parameters,[1,3,48000]);assert.equal(disconnected,1);assert.equal(result.extension,"wav");assert.equal(result.blob.size,53);assert.equal(encoder.busy,false);
});
