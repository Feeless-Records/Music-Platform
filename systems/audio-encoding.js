import {integer} from "./workflow-validation.js";
export function encodePCM(buffer,depth=16){
 if(![16,24,32].includes(depth))throw new Error("Choose 16-bit PCM, 24-bit PCM, or 32-bit float");
 const channels=integer(buffer.numberOfChannels,1,2),frames=integer(buffer.length,1),bytesPerSample=depth/8,size=frames*channels*bytesPerSample;
 if(size>256*1024*1024)throw new Error("Encoded WAV exceeds 256 MiB");
 const data=new ArrayBuffer(44+size),view=new DataView(data),text=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};
 text(0,"RIFF");view.setUint32(4,36+size,true);text(8,"WAVE");text(12,"fmt ");view.setUint32(16,16,true);view.setUint16(20,depth===32?3:1,true);view.setUint16(22,channels,true);view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*channels*bytesPerSample,true);view.setUint16(32,channels*bytesPerSample,true);view.setUint16(34,depth,true);text(36,"data");view.setUint32(40,size,true);
 const samples=Array.from({length:channels},(_,i)=>buffer.getChannelData(i));let offset=44;
 for(let frame=0;frame<frames;frame++)for(let channel=0;channel<channels;channel++){const raw=samples[channel][frame],sample=Number.isFinite(raw)?Math.max(-1,Math.min(1,raw)):0;
 if(depth===32)view.setFloat32(offset,Number.isFinite(raw)?raw:0,true);else if(depth===16)view.setInt16(offset,Math.round(sample*(sample<0?32768:32767)),true);else{const value=Math.round(sample*(sample<0?8388608:8388607));view.setUint8(offset,value&255);view.setUint8(offset+1,(value>>8)&255);view.setUint8(offset+2,(value>>16)&255);}offset+=bytesPerSample;}
 return new Blob([data],{type:"audio/wav"});
}
const COMPRESSED=[{id:"webm",name:"WebM / Opus",mime:"audio/webm;codecs=opus",extension:"webm"},{id:"ogg",name:"Ogg / Opus",mime:"audio/ogg;codecs=opus",extension:"ogg"},{id:"aac",name:"M4A / AAC",mime:"audio/mp4;codecs=mp4a.40.2",extension:"m4a"}];
export class AudioEncodingSystem{
 constructor(core,{Recorder=globalThis.MediaRecorder,Offline=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext}={}){this.core=core;this.Recorder=Recorder;this.Offline=Offline;this.busy=false;}
 formats(){return [{id:"wav",name:"WAV / PCM",mime:"audio/wav",extension:"wav"},...COMPRESSED.filter(format=>{try{return this.Recorder?.isTypeSupported(format.mime);}catch{return false;}})];}
 async convert(buffer,{sampleRate=44100,channels=2}={}){
 integer(sampleRate,8000,96000);integer(channels,1,2);if(!buffer||buffer.duration<=0||buffer.duration>120)throw new Error("Choose audio up to 120 seconds");if(!this.Offline)throw new Error("Offline conversion is unavailable");
 const context=new this.Offline(channels,Math.ceil(buffer.duration*sampleRate),sampleRate),source=context.createBufferSource();source.buffer=buffer;source.connect(context.destination);source.start();try{return await context.startRendering();}finally{source.disconnect();}
 }
 async encode(buffer,{format="wav",depth=16,bitrate=192000,sampleRate=44100,channels=2,signal}={}){
 if(this.busy)throw new Error("An encoding job is already running");const target=this.formats().find(item=>item.id===format);if(!target)throw new Error("This browser cannot encode that format");
 if(signal?.aborted)throw new Error("Encoding cancelled");this.busy=true;
 try{const converted=await this.convert(buffer,{sampleRate,channels});if(signal?.aborted)throw new Error("Encoding cancelled");
 if(format==="wav")return {blob:encodePCM(converted,depth),extension:"wav"};
 integer(bitrate,64000,320000);const blob=await this.compressed(converted,target,bitrate,signal);return {blob,extension:target.extension};
 }finally{this.busy=false;}
 }
 async compressed(buffer,format,bitrate,signal){
 const engine=this.core.transportController.engine;await engine.resume();if(signal?.aborted)throw new Error("Encoding cancelled");
 const context=engine.context,destination=context.createMediaStreamDestination(),source=context.createBufferSource();destination.channelCount=buffer.numberOfChannels;destination.channelCountMode="explicit";source.buffer=buffer;source.connect(destination);
 return new Promise((resolve,reject)=>{
 let recorder,timeout,settled=false;const chunks=[];
 const cleanup=()=>{clearTimeout(timeout);signal?.removeEventListener("abort",cancel);source.onended=null;try{source.stop();}catch{}source.disconnect();for(const track of destination.stream.getTracks())track.stop();destination.disconnect();if(recorder&&recorder.state!=="inactive")recorder.stop();};
 const finish=(error,blob)=>{if(settled)return;settled=true;cleanup();error?reject(error):resolve(blob);};
 const cancel=()=>finish(new Error("Encoding cancelled"));
 try{recorder=new this.Recorder(destination.stream,{mimeType:format.mime,audioBitsPerSecond:bitrate});
 recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};recorder.onerror=event=>finish(new Error(event.error?.message||"Audio encoding failed"));
 recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||format.mime});finish(blob.size?null:new Error("Encoder produced no audio"),blob);};
 source.onended=()=>{if(recorder.state!=="inactive")recorder.stop();};signal?.addEventListener("abort",cancel,{once:true});
 recorder.start(1000);source.start();timeout=setTimeout(()=>finish(new Error("Encoding timed out; keep the studio tab active")),Math.ceil(buffer.duration*1000)+15000);
 }catch(error){finish(error);}
 });
 }
}
