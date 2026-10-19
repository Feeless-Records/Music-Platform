export const PROJECT_FORMAT="feeless.music-platform.pattern-project";
export function validateProject(value){
 if(value?.format!==PROJECT_FORMAT||value.version!==1)throw new Error("Unsupported Music Platform project format");
 if(typeof value.name!=="string"||value.name.length>200||!Number.isFinite(value.bpm)||value.bpm<20||value.bpm>300||!Array.isArray(value.notes)||value.notes.length>4096)throw new Error("Invalid project metadata");
 if(value.notes.some(n=>!n||!["Kick","Snare","Hat","Bass"].includes(n.channelId)||![n.beat,n.duration,n.note,n.velocity].every(Number.isFinite)||n.beat<0||n.duration<=0||n.beat+n.duration>4||!Number.isInteger(n.note)||n.note<0||n.note>127||!Number.isInteger(n.velocity)||n.velocity<0||n.velocity>127))throw new Error("Invalid project notes");
 if(value.plugins!==undefined&&(!value.plugins||typeof value.plugins!=="object"||Array.isArray(value.plugins)||!Array.isArray(value.plugins.instruments)||!Array.isArray(value.plugins.effects)))throw new Error("Invalid plugin state");
 return {name:value.name,bpm:value.bpm,plugins:value.plugins,notes:value.notes.map(({channelId,beat,duration,note,velocity})=>({channelId,beat,duration,note,velocity}))};
}
export class ImportSystem{
 constructor(core){this.core=core;this.assets=[];this.listeners=new Set();}
 subscribe(fn){this.listeners.add(fn);return ()=>this.listeners.delete(fn);}
 emit(){for(const fn of this.listeners)fn();}
 async decode(blob){if(!blob||blob.size>25*1024*1024||blob.size===0)throw new Error("Choose a non-empty audio file up to 25 MiB");let buffer;try{buffer=await this.core.transportController.engine.getContext().decodeAudioData(await blob.arrayBuffer());}catch{throw new Error("This browser could not decode that audio format or file");}if(buffer.duration>120)throw new Error("Audio imports are limited to 120 seconds");return buffer;}
 async audio(file){const buffer=await this.decode(file);const asset={id:globalThis.crypto.randomUUID(),name:file.name||"Imported audio",blob:file,duration:buffer.duration,sampleRate:buffer.sampleRate,channels:buffer.numberOfChannels};this.assets.push(asset);this.emit();return asset;}
 async project(file){if(file.size>2*1024*1024)throw new Error("Project JSON is limited to 2 MiB");const value=validateProject(JSON.parse(await file.text()));const instruments=value.plugins?.instruments?this.core.instruments.validate(value.plugins.instruments):null,effects=value.plugins?.effects?this.core.effects.validate(value.plugins.effects):null;this.core.transportController.stop();if(instruments)this.core.instruments.replace(instruments);if(effects)this.core.effects.replace(effects);this.core.workflow.patterns.get("pattern-1").notes=value.notes;this.core.project.name=value.name;this.core.setTempo(value.bpm);this.core.loadPattern("pattern-1");this.emit();return value;}
}
