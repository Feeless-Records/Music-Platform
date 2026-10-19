export class TimelineSystem {
  constructor({bpm=120,beatsPerBar=4}={}){this.setTempo(bpm);this.beatsPerBar=beatsPerBar;this.position=0;}
  setTempo(bpm){if(!(Number.isFinite(bpm)&&bpm>0))throw new RangeError("Invalid BPM");this.bpm=bpm;}
  beatToSeconds(beat){return beat*60/this.bpm;}
  secondsToBeat(seconds){return seconds*this.bpm/60;}
  seek(beat){this.position=Math.max(0,beat);return this.position;}
  barAt(beat=this.position){return Math.floor(beat/this.beatsPerBar)+1;}
}
