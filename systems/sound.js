import {FrequencySystem} from "./frequency.js";
import {VelocitySystem} from "./velocity.js";
export class SoundSystem {
  constructor(context,output=context.destination){this.context=context;this.output=output;this.voices=new Set();}
  note({frequency=440,velocity=100,duration=.25,wave="sawtooth",at=this.context.currentTime}={}){
    const oscillator=this.context.createOscillator(),gain=this.context.createGain();
    oscillator.type=wave;oscillator.frequency.value=FrequencySystem.clamp(frequency,1,this.context.sampleRate/2-1);
    const level=VelocitySystem.toGain(velocity)*.3,finish=at+Math.max(.02,duration);
    gain.gain.setValueAtTime(0,at);
    gain.gain.linearRampToValueAtTime(level,at+.005);
    gain.gain.setValueAtTime(level,Math.max(at+.005,finish-.015));
    gain.gain.linearRampToValueAtTime(0,finish);
    oscillator.connect(gain);gain.connect(this.output);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();this.voices.delete(oscillator);};
    this.voices.add(oscillator);oscillator.start(at);oscillator.stop(finish+.001);return oscillator;
  }
  stopAll(){for(const voice of this.voices){try{voice.stop();}catch{}}this.voices.clear();}
}
