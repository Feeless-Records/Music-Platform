export class SamplingSystem {
  constructor(context,output=context.destination){this.context=context;this.output=output;this.buffers=new Map();this.sources=new Set();}
  async load(name,url){const response=await fetch(url);if(!response.ok)throw new Error("Sample HTTP "+response.status);const buffer=await this.context.decodeAudioData(await response.arrayBuffer());this.buffers.set(name,buffer);return buffer;}
  play(name,{gain=1,rate=1,at=this.context.currentTime}={}){
    const buffer=this.buffers.get(name);if(!buffer)throw new Error("Unknown sample: "+name);
    const node=this.context.createBufferSource(),level=this.context.createGain();
    node.buffer=buffer;node.playbackRate.value=rate;level.gain.value=gain;
    node.connect(level);level.connect(this.output);this.sources.add(node);node.onended=()=>{this.sources.delete(node);node.disconnect();level.disconnect();};node.start(at);return node;
  }
  stopAll(){for(const source of this.sources){try{source.stop();}catch{}}this.sources.clear();}
}
