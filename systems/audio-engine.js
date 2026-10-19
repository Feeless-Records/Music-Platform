import {AudioProcessingSystem} from "./audio-processing.js";
import {number} from "./workflow-validation.js";
export class AudioEngineSystem{
 constructor({context=null,contextFactory=null,master=null}={}){this.context=context;this.contextFactory=contextFactory;this.master=master;this.processing=null;this.settings={gain:.7,cutoff:20000};this.sources=new Set();}
 getContext(){
 if(!this.context){const Factory=this.contextFactory||globalThis.AudioContext||globalThis.webkitAudioContext;if(!Factory)throw new Error("Web Audio is unavailable in this browser");this.context=new Factory();}
 if(!this.processing){this.processing=new AudioProcessingSystem(this.context,this.settings);if(this.master){this.processing.analyser.disconnect();this.master.attach(this.context,this.processing.analyser);}}
 if(this.effectsSystem&&!this.effectsGraph)this.effectsGraph=this.effectsSystem.createGraph(this.context,this.processing.input,undefined,{live:true});
 return this.context;
 }
 get input(){this.getContext();return this.effectsGraph?.input??this.processing.input;}
 async resume(){const context=this.getContext();if(context.state==="closed")throw new Error("Audio engine is closed");await context.resume();return context;}
 configure(options){const settings={...this.settings,...options};number(settings.gain,0,1);number(settings.cutoff,20,20000);this.settings=settings;this.processing?.configure(settings);return {...settings};}
 register(source){this.sources.add(source);return ()=>this.sources.delete(source);}
 stopSources(){for(const source of this.sources)source.stop?.();}
 async dispose(){this.stopSources();this.effectsGraph?.dispose();this.effectsGraph=null;this.processing?.dispose();this.sources.clear();await this.context?.close();this.context=null;this.processing=null;}
}
