export class InstrumentSystem{
 constructor(plugins){this.plugins=plugins;this.channels=new Map(["Kick","Snare","Hat","Bass"].map(id=>[id,{channelId:id,pluginId:"instrument.sawtooth",parameters:plugins.settings("instrument.sawtooth",{},"instrument")}]));this.listeners=new Set();}
 subscribe(fn){this.listeners.add(fn);return ()=>this.listeners.delete(fn);}
 snapshot(){return structuredClone([...this.channels.values()]);}
 validate(snapshot){if(!Array.isArray(snapshot)||snapshot.length!==4||new Set(snapshot.map(item=>item?.channelId)).size!==4)throw new Error("Four channel instruments are required");return snapshot.map(item=>{if(!this.channels.has(item.channelId))throw new Error("Unknown instrument channel");return {channelId:item.channelId,pluginId:this.plugins.get(item.pluginId,"instrument").id,parameters:this.plugins.settings(item.pluginId,item.parameters,"instrument")};});}
 replace(snapshot){this.channels=new Map(this.validate(snapshot).map(item=>[item.channelId,item]));for(const listener of this.listeners)listener();}
 assign(channelId,pluginId,parameters={}){if(!this.channels.has(channelId))throw new Error("Unknown channel");const value={channelId,pluginId:this.plugins.get(pluginId,"instrument").id,parameters:this.plugins.settings(pluginId,parameters,"instrument")};this.channels.set(channelId,value);for(const listener of this.listeners)listener();return value;}
 createPlayer(context,output,snapshot=null){
 const instances=new Map();const stopAll=()=>{for(const player of instances.values()){player.stopAll();player.dispose?.();}instances.clear();};
 return {note:note=>{const config=(snapshot??this.snapshot()).find(item=>item.channelId===note.channelId)??{pluginId:"instrument.sawtooth",parameters:this.plugins.settings("instrument.sawtooth",{},"instrument")};
 const key=JSON.stringify(config);if(!instances.has(key)){const instance=this.plugins.get(config.pluginId,"instrument").create(context,output,config.parameters);if(typeof instance?.note!=="function"||typeof instance?.stopAll!=="function")throw new Error("Instrument plugin contract failed");instances.set(key,instance);}
 return instances.get(key).note(note);},stopAll,dispose:stopAll};
 }
}
