import {TimelineSystem} from "./timeline.js";
export class SequencingSystem {
  constructor({timeline=new TimelineSystem(),events=null}={}){this.timeline=timeline;this.events=events;this.notes=[];}
  addNote({beat=0,duration=1,frequency=440,velocity=100}={}){
    if(beat<0||duration<=0)throw new RangeError("Invalid note timing");
    const note={beat,duration,frequency,velocity};this.notes.push(note);this.notes.sort((a,b)=>a.beat-b.beat);this.events?.emit("sequence:changed",note);return note;
  }
  inRange(fromBeat,toBeat){return this.notes.filter(note=>note.beat>=fromBeat&&note.beat<toBeat);}
  schedule(sound,{startBeat=0,endBeat=4,at=sound.context.currentTime}={}){
    const notes=this.inRange(startBeat,endBeat);
    for(const note of notes)sound.note({...note,duration:this.timeline.beatToSeconds(note.duration),at:at+this.timeline.beatToSeconds(note.beat-startBeat)});
    return notes.length;
  }
}
