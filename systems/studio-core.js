import {TransportController} from "./transport-controller.js?v=transport-3";
import {WorkflowSystem} from "./workflow.js";
import {ProjectSystem} from "./project.js";
import {DocumentSystem} from "./document.js";
import {TimelineSystem} from "./timeline.js";
import {SequencingSystem} from "./sequencing.js";
import {ParametricSystem} from "./parametric.js";
import {FrequencySystem} from "./frequency.js";
import {VelocitySystem} from "./velocity.js";
import {SoundSystem} from "./sound.js?v=transport-3";
import {SamplingSystem} from "./sampling.js?v=transport-3";
export class StudioCore {
  constructor({bpm=120}={}){
    this.project=new ProjectSystem({bpm});
    this.document=this.project.addDocument(new DocumentSystem({id:"arrangement",name:"Arrangement"}));
    this.timeline=new TimelineSystem({bpm});
    this.sequencer=new SequencingSystem({timeline:this.timeline,events:this.project.events});
    this.parameters=new ParametricSystem().define("cutoff",{value:1000,min:20,max:20000});
    this.frequency=FrequencySystem;this.velocity=VelocitySystem;
    this.workflow=new WorkflowSystem(this.timeline);
    this.sound=null;this.sampling=null;this.transportController=new TransportController(this);
  }
  loadPattern(id){this.sequencer.notes=this.workflow.compilePattern(id);return this.sequencer.notes.length;}
  connectAudio(context){if(this.transportController.engine.context&&this.transportController.engine.context!==context)throw new Error("Studio already uses another audio context");this.transportController.engine.context=context;const output=this.transportController.engine.input;this.sound?.stopAll();this.sampling?.stopAll();this.sound=new SoundSystem(context,output);this.sampling=new SamplingSystem(context,output);this.transportController.sound=this.sound;this.samplingRegistration?.();this.samplingRegistration=this.transportController.engine.register({stop:()=>this.sampling.stopAll()});return this;}
  setTempo(bpm){this.transportController.setTempo(bpm);}
  scheduleBars(startBeat,endBeat){if(!this.sound)throw new Error("Call connectAudio first");return this.sequencer.schedule(this.sound,{startBeat,endBeat});}
}
