import {number} from "./workflow-validation.js";
// Marker/time mapping only: does not perform time-stretch DSP.
export class WarpSystem{
 constructor(){this.markers=[];}
 setMarkers(markers){if(!Array.isArray(markers)||markers.length<2)throw new RangeError("Two markers required");const next=markers.map(m=>({beat:number(m.beat),seconds:number(m.seconds)})).sort((a,b)=>a.beat-b.beat);for(let i=1;i<next.length;i++)if(next[i].beat<=next[i-1].beat||next[i].seconds<=next[i-1].seconds)throw new RangeError("Markers must increase");this.markers=next;}
 secondsAt(beat){number(beat);if(this.markers.length<2)throw new Error("Set markers first");let a=this.markers[0],b=this.markers[1];for(let i=1;i<this.markers.length;i++){a=this.markers[i-1];b=this.markers[i];if(beat<=b.beat)break;}return a.seconds+(beat-a.beat)*(b.seconds-a.seconds)/(b.beat-a.beat);}
}
