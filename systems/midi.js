import {FrequencySystem} from "./frequency.js";
export class MIDISystem {
  constructor(synth,{onNotesChanged=()=>{},onStatus=()=>{},onDevicesChanged=()=>{},onError=console.error}={}){
    this.synth=synth;this.onNotesChanged=onNotesChanged;this.onStatus=onStatus;this.onDevicesChanged=onDevicesChanged;this.onError=onError;
    this.access=null;this.active=new Map();this.inputs=new Map();this.tuningReference=440;
    this.stateChange=this.stateChange.bind(this);
  }
  async start(){
    if(!navigator.requestMIDIAccess){this.onStatus("Web MIDI unavailable");this.onDevicesChanged({inputs:[],outputs:[]});return false;}
    try{
      this.access=await navigator.requestMIDIAccess({sysex:false});
      this.access.addEventListener("statechange",this.stateChange);
      this.refreshInputs();return true;
    }catch(error){this.onStatus("MIDI access denied");this.onDevicesChanged({inputs:[],outputs:[]});this.onError(error);return false;}
  }
  refreshInputs(){
    const available=new Map(this.access?.inputs||[]);
    for(const [id,input] of this.inputs)if(!available.has(id)||available.get(id)!==input){
      input.removeEventListener("midimessage",this.listenerFor(id));
      this.releaseDevice(id);this.inputs.delete(id);
    }
    for(const [id,input] of available)if(!this.inputs.has(id)){
      input.addEventListener("midimessage",this.listenerFor(id));this.inputs.set(id,input);
    }
    this.onStatus(this.inputs.size+" MIDI input(s)");
    this.onDevicesChanged(this.getDevices());
  }
  getDevices(){
    const describe=port=>({id:port.id,name:port.name||"Unnamed MIDI device",manufacturer:port.manufacturer||"",state:port.state||"unknown",connection:port.connection||"unknown"});
    return {inputs:[...(this.access?.inputs?.values()||[])].map(describe),outputs:[...(this.access?.outputs?.values()||[])].map(describe)};
  }
  listenerFor(id){
    if(!this.listeners)this.listeners=new Map();
    if(!this.listeners.has(id))this.listeners.set(id,event=>this.receive(id,event.data));
    return this.listeners.get(id);
  }
  stateChange(){this.refreshInputs();}
  receive(device,data){
    if(!data||data.length<3)return;
    const command=data[0]&0xf0,channel=data[0]&0x0f,note=data[1],velocity=data[2];
    const key="midi:"+device+":"+channel+":"+note;
    if(command===0x90&&velocity>0)this.noteOn(key,note,velocity);
    else if(command===0x80||(command===0x90&&velocity===0))this.noteOff(key);
    else if(command===0xb0&&(note===120||note===123))this.releaseChannel(device,channel);
  }
  noteOn(key,note,velocity){
    if(this.active.has(key))this.noteOff(key);
    this.active.set(key,{note,velocity});
    this.synth.noteOn(key,FrequencySystem.midiToHz(note)*this.tuningReference/440,note)
      .catch(error=>{this.active.delete(key);this.notify();this.onError(error);});
    this.notify();
  }
  noteOff(key){if(!this.active.delete(key))return;this.synth.noteOff(key);this.notify();}
  releaseChannel(device,channel){for(const key of [...this.active.keys()])if(key.startsWith("midi:"+device+":"+channel+":"))this.noteOff(key);}
  releaseDevice(device){for(const key of [...this.active.keys()])if(key.startsWith("midi:"+device+":"))this.noteOff(key);}
  releaseAll(){for(const key of [...this.active.keys()])this.noteOff(key);}
  notify(){this.onNotesChanged([...this.active.values()].map(voice=>voice.note));}
  setTuningReference(hz){this.tuningReference=hz;this.synth.retuneNotes(hz);}
  stop(){
    this.releaseAll();
    this.access?.removeEventListener("statechange",this.stateChange);
    for(const [id,input] of this.inputs)input.removeEventListener("midimessage",this.listenerFor(id));
    this.inputs.clear();this.access=null;this.onDevicesChanged({inputs:[],outputs:[]});
  }
}
