import {AudioProcessingSystem} from "./audio-processing.js";
import {SoundSystem} from "./sound.js?v=transport-3";
import {number,integer} from "./workflow-validation.js";
export function validateNotes(notes){
 if(!Array.isArray(notes))throw new TypeError("Notes array required");
 return notes.map(n=>{number(n.beat);number(n.duration,Number.EPSILON);number(n.frequency,1,100000);integer(n.velocity,0,127);if(n.wave&&!["sine","square","sawtooth","triangle"].includes(n.wave))throw new TypeError("Unsupported oscillator");return {...n};});
}
export function encodeWav(buffer){
 const channels=integer(buffer.numberOfChannels,1,2),frames=integer(buffer.length),bytes=frames*channels*2;
 const data=new ArrayBuffer(44+bytes),view=new DataView(data),text=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};
 text(0,"RIFF");view.setUint32(4,36+bytes,true);text(8,"WAVE");text(12,"fmt ");view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);
 view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*channels*2,true);view.setUint16(32,channels*2,true);view.setUint16(34,16,true);text(36,"data");view.setUint32(40,bytes,true);
 const samples=Array.from({length:channels},(_,i)=>buffer.getChannelData(i));let offset=44;
 for(let frame=0;frame<frames;frame++)for(let channel=0;channel<channels;channel++){const raw=samples[channel][frame],value=Number.isFinite(raw)?Math.max(-1,Math.min(1,raw)):0;view.setInt16(offset,Math.round(value*(value<0?32768:32767)),true);offset+=2;}
 return new Blob([data],{type:"audio/wav"});
}
export class AudioRenderingSystem{
 constructor({offlineFactory=null}={}){this.offlineFactory=offlineFactory;}
 async render({notes,bpm=120,startBeat=0,endBeat=4,sampleRate=44100,channels=2,settings={gain:.7,cutoff:20000}}){
 const snapshot=validateNotes(notes);number(bpm,20,300);number(startBeat);number(endBeat,startBeat+Number.EPSILON);integer(sampleRate,8000,96000);integer(channels,1,2);
 const seconds=(endBeat-startBeat)*60/bpm+.25;if(seconds>120)throw new RangeError("Render is limited to 120 seconds per export");
 const Factory=this.offlineFactory||globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!Factory)throw new Error("Offline audio rendering is unavailable");
 const context=new Factory(channels,Math.ceil(seconds*sampleRate),sampleRate),processing=new AudioProcessingSystem(context,settings),sound=new SoundSystem(context,processing.input);
 for(const note of snapshot){const begin=Math.max(note.beat,startBeat),finish=Math.min(note.beat+note.duration,endBeat);if(finish>begin)sound.note({...note,at:(begin-startBeat)*60/bpm,duration:(finish-begin)*60/bpm});}
 try{return await context.startRendering();}finally{processing.dispose();}
 }
 toWav(buffer){return encodeWav(buffer);}
}
