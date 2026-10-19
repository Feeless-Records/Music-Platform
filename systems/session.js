import {number,integer} from "./workflow-validation.js";
export class SessionSystem{
 constructor(clips){this.clips=clips;this.slots=new Map();this.pending=new Map();this.playing=new Map();}
 setSlot(trackId,scene,clipId){integer(scene);this.clips.get(clipId);if(!trackId)throw new TypeError("Track required");this.slots.set(JSON.stringify([trackId,scene]),{trackId,scene,clipId});}
 launch(trackId,scene,{beat=0,quantization=4}={}){number(beat);number(quantization,Number.EPSILON);const slot=this.slots.get(JSON.stringify([trackId,scene]));if(!slot)throw new Error("Empty clip slot");const launch={...slot,at:Math.ceil(beat/quantization)*quantization};this.pending.set(trackId,launch);return launch;}
 launchScene(scene,options={}){integer(scene);return [...this.slots.values()].filter(s=>s.scene===scene).map(s=>this.launch(s.trackId,scene,options));}
 advance(beat){number(beat);for(const [track,launch]of this.pending)if(launch.at<=beat){this.playing.set(track,launch);this.pending.delete(track);}return [...this.playing.values()];}
 stop(trackId){this.pending.delete(trackId);this.playing.delete(trackId);}
}
