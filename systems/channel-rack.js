import {insert,required,integer} from "./workflow-validation.js";
export class ChannelRackSystem{
 constructor(patterns,pianoRoll){this.patterns=patterns;this.pianoRoll=pianoRoll;this.channels=new Map();}
 add(id,{name=id,instrument="saw",mixerId="master"}={}){return insert(this.channels,id,{id,name,instrument,mixerId});}
 setStep(patternId,channelId,step,{enabled=true,stepsPerBeat=4,note=60,velocity=100}={}){
 required(this.channels,channelId);integer(step);integer(stepsPerBeat,1,96);const pattern=this.patterns.get(patternId),beat=step/stepsPerBeat;
 if(beat>=pattern.length)throw new RangeError("Step outside pattern");
 // Replace the step's note for this channel; preserve other channels.
 const options={channelId,beat,duration:1/stepsPerBeat,note,velocity};
 if(enabled){integer(note,0,127);integer(velocity,0,127);if(beat+options.duration>pattern.length)throw new RangeError("Step exceeds pattern");}
 pattern.notes=pattern.notes.filter(n=>!(n.channelId===channelId&&n.beat===beat));
 return enabled?this.pianoRoll.addNote(patternId,options):null;
 }
}
