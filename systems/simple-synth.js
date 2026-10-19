export class SimpleSynth {
  constructor(master=null,engine=null){
    this.engine=engine;this.engine?.register({stop:()=>{this.release();this.releaseAllNotes();}});
    this.master=master;
    this.context=null;this.oscillator=null;this.gain=null;
    this.outputGain=Math.pow(10,-3/20);this.frequency=440;this.held=false;this.generation=0;this.analyser=null;
    this.voices=new Map();
  }
  setFrequency(value){
    this.frequency=Math.max(20,Math.min(20000,Number(value)||440));
    if(this.oscillator && this.context){
      this.oscillator.frequency.setTargetAtTime(
        Math.min(this.frequency,this.context.sampleRate/2-1),this.context.currentTime,.008);
    }
  }
  async ensureContext(){
    if(!this.context)this.context=this.engine?this.engine.getContext():new (window.AudioContext||window.webkitAudioContext)();
    if(!this.analyser){
      this.analyser=this.context.createAnalyser();
      this.analyser.fftSize=4096;this.analyser.minDecibels=-60;
      this.analyser.maxDecibels=0;this.analyser.smoothingTimeConstant=.65;
      if(this.engine)this.analyser.connect(this.engine.input);
      else if(this.master)this.master.attach(this.context,this.analyser);
      else this.analyser.connect(this.context.destination);
    }
    await this.context.resume();
  }
  async noteOn(key,frequency,note=null){
    if(this.voices.has(key))return;
    const voice={pending:true,released:false,baseFrequency:frequency, note};
    this.voices.set(key,voice);
    try{
      await this.ensureContext();
      if(voice.released||this.voices.get(key)!==voice)return;
      const now=this.context.currentTime;
      const oscillator=this.context.createOscillator(),gain=this.context.createGain();
      oscillator.type="sawtooth";
      oscillator.frequency.setValueAtTime(Math.max(20,Math.min(voice.baseFrequency,this.context.sampleRate/2-1)),now);
      gain.gain.setValueAtTime(0,now);
      // Each keyboard voice uses the configured -3 dB gain.
      gain.gain.linearRampToValueAtTime(this.outputGain,now+.012);
      oscillator.connect(gain);gain.connect(this.analyser);
      oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
      voice.oscillator=oscillator;voice.gain=gain;voice.pending=false;
      oscillator.start(now);
    }catch(error){this.voices.delete(key);throw error;}
  }
  retuneNotes(referenceHz){
    for(const voice of this.voices.values()){
      if(voice.note===null)continue;
      voice.baseFrequency=440*Math.pow(2,(voice.note-69)/12)*referenceHz/440;
      if(voice.oscillator && this.context){
        const limit=this.context.sampleRate/2-1;
        voice.oscillator.frequency.setTargetAtTime(Math.max(20,Math.min(limit,voice.baseFrequency)),this.context.currentTime,.008);
      }
    }
  }
  noteOff(key){
    const voice=this.voices.get(key);
    if(!voice)return;
    voice.released=true;this.voices.delete(key);
    if(!voice.oscillator)return;
    const now=this.context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value,now);
    voice.gain.gain.linearRampToValueAtTime(0,now+.018);
    voice.oscillator.stop(now+.02);
  }
  releaseAllNotes(){
    for(const key of [...this.voices.keys()])this.noteOff(key);
  }
  async press(){
    if(this.held)return;
    this.held=true;
    const generation=++this.generation;
    try{
      await this.ensureContext();
      if(!this.held||generation!==this.generation)return;
      const now=this.context.currentTime;
      const oscillator=this.context.createOscillator();
      const gain=this.context.createGain();
      oscillator.type="sawtooth";
      oscillator.frequency.setValueAtTime(Math.min(this.frequency,this.context.sampleRate/2-1),now);
      gain.gain.setValueAtTime(0,now);
      gain.gain.linearRampToValueAtTime(this.outputGain,now+.012);
      oscillator.connect(gain);
      if(!this.analyser){this.analyser=this.context.createAnalyser();this.analyser.fftSize=4096;this.analyser.minDecibels=-60;this.analyser.maxDecibels=0;this.analyser.smoothingTimeConstant=.65;this.analyser.connect(this.context.destination);}
      gain.connect(this.analyser);
      oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
      this.oscillator=oscillator;this.gain=gain;oscillator.start(now);
    }catch(error){this.release();throw error;}
  }
  release(){
    this.held=false;++this.generation;
    if(!this.oscillator||!this.context)return;
    const now=this.context.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value,now);
    this.gain.gain.linearRampToValueAtTime(0,now+.018);
    this.oscillator.stop(now+.02);
    this.oscillator=null;this.gain=null;
  }
}
