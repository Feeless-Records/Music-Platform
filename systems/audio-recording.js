// Browser microphone capture. No device is opened before start() is called.
export class AudioRecordingSystem{
 constructor({devices=globalThis.navigator?.mediaDevices,Recorder=globalThis.MediaRecorder}={}){this.devices=devices;this.Recorder=Recorder;this.state="idle";this.takes=[];this.listeners=new Set();this.generation=0;this.error=null;}
 subscribe(fn){this.listeners.add(fn);fn(this);return ()=>this.listeners.delete(fn);}
 emit(){for(const fn of this.listeners)fn(this);}
 release(){for(const track of this.stream?.getTracks()??[])track.stop();this.stream=null;}
 async start(){
 if(!["idle","error"].includes(this.state))throw new Error("Finish the current recording first");
 if(!this.devices?.getUserMedia||!this.Recorder)throw new Error("Microphone recording is unavailable in this browser");
 const generation=++this.generation;this.state="requesting";this.error=null;this.emit();
 try{
 const stream=await this.devices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
 if(generation!==this.generation){for(const track of stream.getTracks())track.stop();return;}
 this.stream=stream;
 const mime=["audio/webm;codecs=opus","audio/ogg;codecs=opus","audio/mp4"].find(type=>this.Recorder.isTypeSupported?.(type));
 const recorder=new this.Recorder(stream,mime?{mimeType:mime}:{});this.recorder=recorder;const chunks=[];this.startedAt=Date.now();
 this.finished=new Promise(resolve=>{this.finish=resolve;});
 recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
 recorder.onerror=event=>{this.error=event.error?.message??"Recording failed";this.release();this.state="error";this.emit();};
 recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||chunks[0]?.type||"application/octet-stream"});
 if(blob.size)this.takes.push({id:"take-"+this.startedAt+"-"+this.takes.length,name:"Take "+(this.takes.length+1),blob,mime:blob.type,createdAt:new Date(this.startedAt).toISOString()});
 this.release();this.recorder=null;this.state=this.error?"error":"idle";this.finish?.();this.emit();};
 recorder.start(1000);this.state="recording";this.emit();
 }catch(error){this.release();this.recorder=null;this.finish?.();this.state="error";this.error=error.message;this.emit();throw error;}
 }
 pause(){if(this.state!=="recording")return;this.recorder.pause();this.state="paused";this.emit();}
 resume(){if(this.state!=="paused")return;this.recorder.resume();this.state="recording";this.emit();}
 stop(){
 if(this.state==="requesting"){++this.generation;this.state="idle";this.emit();return Promise.resolve();}
 if(this.recorder&&this.recorder.state!=="inactive"){this.state="stopping";this.recorder.stop();this.release();this.emit();return this.finished;}
 return this.finished??Promise.resolve();
 }
}
