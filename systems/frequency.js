export class FrequencySystem {
  static clamp(hz,min=20,max=20000){return Math.max(min,Math.min(max,hz));}
  static fromNormalized(position,min=20,max=20000){return min*Math.pow(max/min,Math.max(0,Math.min(1,position)));}
  static toNormalized(hz,min=20,max=20000){return Math.log(FrequencySystem.clamp(hz,min,max)/min)/Math.log(max/min);}
  static midiToHz(note,a4=440){return a4*Math.pow(2,(note-69)/12);}
  static hzToMidi(hz,a4=440){if(hz<=0)throw new RangeError("Frequency must be positive");return 69+12*Math.log2(hz/a4);}
}
