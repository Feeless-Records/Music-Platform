export class AudioSystem {
  constructor(url="./Perkele!.wav",master=null,engine=null){this.engine=engine;this.master=master;this.url=url;this.playing=false;this.audio=new Audio();this.audio.preload="auto";this.audio.src=url;this.cancelPlayback=null;this.playGeneration=0;this.engine?.register(this);this.context=null;this.analyser=null;this.source=null;this.outputGain=Math.pow(10,-6/20);this.volumeNode=null;}
  async play(){
    if(this.playing)return;
    this.playing=true;const generation=++this.playGeneration;
    try{
      this.connectAnalyzer();
      await this.context.resume();
      if(generation!==this.playGeneration)return;
      this.audio.currentTime=0;
      await new Promise((resolve,reject)=>{
        let settled=false;
        const cleanup=()=>{if(this.cancelPlayback===end)this.cancelPlayback=null;this.audio.removeEventListener("ended",end);this.audio.removeEventListener("error",fail);};
        const end=()=>{if(settled)return;settled=true;cleanup();resolve();};
        const fail=()=>{if(settled)return;settled=true;cleanup();reject(new Error("Audio file unavailable or unsupported"));};
        this.cancelPlayback=end;
        this.audio.addEventListener("ended",end,{once:true});
        this.audio.addEventListener("error",fail,{once:true});
        this.audio.play().catch(fail);
      });
    }finally{if(generation===this.playGeneration)this.playing=false;}
  }
  connectAnalyzer(){
    if(this.analyser)return;
    const Context=window.AudioContext||window.webkitAudioContext;
    this.context=this.engine?this.engine.getContext():new Context();
    this.source=this.context.createMediaElementSource(this.audio);
    this.analyser=this.context.createAnalyser();
    this.analyser.fftSize=4096;this.analyser.minDecibels=-60;
    this.analyser.maxDecibels=0;this.analyser.smoothingTimeConstant=.65;
    this.volumeNode=this.context.createGain();
    this.volumeNode.gain.value=this.outputGain;
    this.source.connect(this.volumeNode);
    this.volumeNode.connect(this.analyser);
    if(this.engine)this.analyser.connect(this.engine.input);
    else if(this.master)this.master.attach(this.context,this.analyser);
    else this.analyser.connect(this.context.destination);
  }
  stop(){++this.playGeneration;this.cancelPlayback?.();this.audio.pause();this.audio.currentTime=0;this.playing=false;}
}
