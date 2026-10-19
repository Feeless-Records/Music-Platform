import {number} from "./workflow-validation.js";
// Clock model; caller supplies monotonic seconds (for example AudioContext.currentTime).
export class TransportSystem{
 constructor(timeline){this.timeline=timeline;this.beat=0;this.playing=false;this.origin=0;}
 play(now=0){number(now);if(this.playing)return;this.origin=now;this.playing=true;}
 position(now=0){number(now);return this.beat+(this.playing?(now-this.origin)*this.timeline.bpm/60:0);}
 pause(now=0){this.beat=this.position(now);this.playing=false;}
 stop(){this.beat=0;this.playing=false;}
 seek(beat,now=0){number(beat);number(now);this.beat=beat;this.origin=now;}
}
