import {number,integer} from "./workflow-validation.js";
export class PianoRollSystem{
 constructor(patterns){this.patterns=patterns;}
 addNote(patternId,{channelId,beat=0,duration=1,note=60,velocity=100}={}){
 const pattern=this.patterns.get(patternId);number(beat);number(duration,Number.EPSILON);integer(note,0,127);integer(velocity,0,127);
 if(typeof channelId!=="string"||!channelId||beat+duration>pattern.length)throw new RangeError("Invalid channel or note exceeds pattern");
 const event={channelId,beat,duration,note,velocity};pattern.notes.push(event);pattern.notes.sort((a,b)=>a.beat-b.beat);return event;
 }
}
