import {AudioEngineSystem} from "./audio-engine.js";
import {AudioRenderingSystem,validateNotes} from "./audio-rendering.js?v=transport-3";
import {SoundSystem} from "./sound.js?v=transport-3";
import {number} from "./workflow-validation.js";
export class TransportController{
 constructor(core,{engine=new AudioEngineSystem(),renderer=new AudioRenderingSystem(),setTimer=(fn,ms)=>globalThis.setInterval(fn,ms),clearTimer=id=>globalThis.clearInterval(id)}={}){
 this.core=core;this.clock=core.workflow.transport;this.engine=engine;this.renderer=renderer;this.setTimer=setTimer;this.clearTimer=clearTimer;
 this.sound=null;this.timer=null;this.length=4;this.loop=true;this.state="stopped";this.listeners=new Set();this.generation=0;this.rendering=false;this.scheduledUntil=0;this.includeHeld=true;this.error=null;
 }
 subscribe(listener){this.listeners.add(listener);listener(this.snapshot());return ()=>this.listeners.delete(listener);}
 snapshot(){const now=this.engine.context?.currentTime||0,absolute=this.clock.position(now);return {state:this.state,beat:this.loop?absolute%this.length:Math.min(absolute,this.length),bpm:this.core.timeline.bpm,loop:this.loop,length:this.length,rendering:this.rendering,error:this.error};}
 emit(){for(const listener of this.listeners)listener(this.snapshot());}
 async play(){
 if(this.state==="playing"||this.state==="starting")return;
 validateNotes(this.core.sequencer.notes);this.state="starting";this.error=null;const token=++this.generation;this.emit();
 try{
 await this.engine.resume();if(token!==this.generation)return;
 this.sound??=new SoundSystem(this.engine.context,this.engine.input);
 if(!this.loop&&this.clock.beat>=this.length)this.clock.seek(0,this.engine.context.currentTime);
 this.clock.play(this.engine.context.currentTime);this.state="playing";this.scheduledUntil=this.clock.position(this.engine.context.currentTime);this.includeHeld=true;
 this.pump();this.timer=this.setTimer(()=>{try{this.pump();}catch(error){this.pause();this.error=error.message;this.emit();}},25);
 }catch(error){if(token===this.generation){this.pause();this.error=error.message;this.emit();}throw error;}
 }
 pump(){
 if(this.state!=="playing")return;
 const context=this.engine.context,now=context.currentTime,bpm=this.core.timeline.bpm,absolute=this.clock.position(now);
 if(!this.loop&&absolute>=this.length){this.pause();this.clock.seek(this.length,now);this.emit();return;}
 const from=Math.max(this.scheduledUntil,absolute),to=this.loop?absolute+.12*bpm/60:Math.min(this.length,absolute+.12*bpm/60);
 for(let cycle=Math.floor(from/this.length);cycle<=Math.floor(to/this.length);cycle++){
 if(!this.loop&&cycle>0)break;
 const base=cycle*this.length;
 for(const note of this.core.sequencer.notes){
 if(note.beat>=this.length)continue;
 const start=base+note.beat,end=base+Math.min(note.beat+note.duration,this.length);
 const held=this.includeHeld&&start<from&&end>from;
 if((start>=from&&start<to)||held){const begin=held?from:start;
 this.sound.note({...note,at:now+Math.max(0,begin-absolute)*60/bpm,duration:(end-begin)*60/bpm});}
 }
 }
 this.includeHeld=false;this.scheduledUntil=to;this.emit();
 }
 silence(){this.sound?.stopAll();this.engine.stopSources();if(this.timer!==null)this.clearTimer(this.timer);this.timer=null;}
 pause(){++this.generation;if(this.clock.playing)this.clock.pause(this.engine.context?.currentTime||0);this.silence();this.state="paused";this.emit();}
 stop(){++this.generation;this.silence();this.clock.stop();this.state="stopped";this.error=null;this.emit();}
 seek(beat){number(beat,0,this.length);const playing=this.state==="playing";this.pause();this.clock.seek(beat,this.engine.context?.currentTime||0);this.emit();if(playing)return this.play();}
 setTempo(bpm){
 number(bpm,20,300);const now=this.engine.context?.currentTime||0,beat=this.clock.position(now),playing=this.state==="playing";
 this.core.project.setTempo(bpm);this.core.timeline.setTempo(bpm);this.clock.seek(beat,now);
 if(playing){this.sound?.stopAll();this.scheduledUntil=beat;this.includeHeld=true;this.pump();}this.emit();
 }
 configure({length=this.length,loop=this.loop}={}){number(length,.25,256);if(typeof loop!=="boolean")throw new TypeError("Loop must be boolean");this.stop();this.length=length;this.loop=loop;this.emit();}
 async render(options={}){
 if(this.rendering)throw new Error("Rendering already in progress");this.rendering=true;this.emit();
 try{return await this.renderer.render({...options,notes:this.core.sequencer.notes.map(n=>({...n})),bpm:this.core.timeline.bpm,startBeat:options.startBeat??0,endBeat:options.endBeat??this.length,settings:{...this.engine.settings,gain:this.engine.settings.gain*(this.engine.master?this.engine.master.value/100:1)}});}
 finally{this.rendering=false;this.emit();}
 }
 dispose(){this.stop();this.listeners.clear();return this.engine.dispose();}
}
