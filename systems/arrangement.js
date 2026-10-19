import {number} from "./workflow-validation.js";
export class ArrangementSystem{
 constructor(clips){this.clips=clips;this.placements=[];}
 place(clipId,{trackId,beat=0,length=this.clips.get(clipId).length}={}){this.clips.get(clipId);number(beat);number(length,Number.EPSILON);if(!trackId)throw new TypeError("Track required");const placement={clipId,trackId,beat,length};this.placements.push(placement);return placement;}
 inRange(from,to){number(from);number(to,from);return this.placements.filter(p=>p.beat<to&&p.beat+p.length>from);}
}
