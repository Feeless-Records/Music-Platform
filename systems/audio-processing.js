import {number} from "./workflow-validation.js";
// Shared real-time/offline signal path. Compressor is not a brick-wall limiter.
export class AudioProcessingSystem{
 constructor(context,{gain=.7,cutoff=20000}={},destination=context.destination){
 this.context=context;this.input=context.createGain();this.filter=context.createBiquadFilter();this.filter.type="lowpass";this.filter.Q.value=.707;
 this.compressor=context.createDynamicsCompressor();this.compressor.threshold.value=-12;this.compressor.knee.value=12;this.compressor.ratio.value=4;this.compressor.attack.value=.003;this.compressor.release.value=.15;
 this.output=context.createGain();this.analyser=context.createAnalyser();this.analyser.fftSize=2048;
 this.input.connect(this.filter);this.filter.connect(this.compressor);this.compressor.connect(this.output);this.output.connect(this.analyser);this.analyser.connect(destination);
 this.settings={gain:number(gain,0,1),cutoff:number(cutoff,20,20000)};
 this.output.gain.value=gain;this.filter.frequency.value=Math.min(cutoff,context.sampleRate/2-1);
 }
 configure({gain=this.settings.gain,cutoff=this.settings.cutoff}={}){
 number(gain,0,1);number(cutoff,20,20000);this.settings={gain,cutoff};
 const now=this.context.currentTime;
 for(const [parameter,value]of [[this.output.gain,gain],[this.filter.frequency,Math.min(cutoff,this.context.sampleRate/2-1)]]){
 parameter.cancelScheduledValues(now);parameter.setTargetAtTime(value,now,.008);
 }return {...this.settings};
 }
 dispose(){for(const node of [this.input,this.filter,this.compressor,this.output,this.analyser])node.disconnect();}
}
