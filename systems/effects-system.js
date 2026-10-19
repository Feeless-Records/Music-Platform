export class EffectsSystem{
 constructor(plugins){this.plugins=plugins;this.slots=[];this.graphs=new Set();this.listeners=new Set();}
 subscribe(fn){this.listeners.add(fn);return ()=>this.listeners.delete(fn);}
 snapshot(){return structuredClone(this.slots);}
 validate(snapshot){if(!Array.isArray(snapshot)||snapshot.length>8||new Set(snapshot.map(slot=>slot?.id)).size!==snapshot.length)throw new Error("Invalid effects chain (maximum eight slots)");return snapshot.map(slot=>{if(typeof slot.id!=="string"||!slot.id||typeof slot.bypass!=="boolean")throw new Error("Invalid effect slot");return {id:slot.id,pluginId:this.plugins.get(slot.pluginId,"effect").id,bypass:slot.bypass,parameters:this.plugins.settings(slot.pluginId,slot.parameters,"effect")};});}
 replace(snapshot){const next=this.validate(snapshot),previous=this.slots;try{for(const graph of this.graphs)graph.update(next);this.slots=next;}catch(error){for(const graph of this.graphs)graph.update(previous);throw error;}for(const listener of this.listeners)listener();}
 add(pluginId){const slot={id:globalThis.crypto.randomUUID(),pluginId,bypass:false,parameters:this.plugins.settings(pluginId,{},"effect")};this.replace([...this.slots,slot]);return slot;}
 update(id,values){if(!this.slots.some(slot=>slot.id===id))throw new Error("Unknown effect slot");this.replace(this.slots.map(slot=>slot.id===id?{...slot,...values}:slot));}
 remove(id){this.replace(this.slots.filter(slot=>slot.id!==id));}
 move(id,offset){const slots=this.snapshot(),index=slots.findIndex(slot=>slot.id===id),target=index+offset;if(index<0||target<0||target>=slots.length)return;[slots[index],slots[target]]=[slots[target],slots[index]];this.replace(slots);}
 tail(snapshot=this.slots){return snapshot.filter(slot=>!slot.bypass).reduce((sum,slot)=>sum+(this.plugins.get(slot.pluginId,"effect").tail?.(slot.parameters)??0),0);}
 createGraph(context,destination,snapshot=this.snapshot(),{live=false}={}){
 const input=context.createGain();let nodes=[],disposed=false;
 const graph={input,update:slots=>{if(disposed)return;const next=[];try{for(const slot of this.validate(slots)){if(slot.bypass)continue;const instance=this.plugins.get(slot.pluginId,"effect").create(context,slot.parameters);if(!instance?.input?.connect||!instance?.output?.connect||typeof instance.dispose!=="function"){instance?.dispose?.();throw new Error("Effect plugin contract failed");}next.push(instance);}
 for(let i=0;i<next.length;i++)next[i].output.connect(next[i+1]?.input??destination);
 }catch(error){for(const node of next)node.dispose();throw error;}
 input.disconnect();for(const node of nodes)node.dispose();nodes=next;input.connect(nodes[0]?.input??destination);},
 dispose:()=>{if(disposed)return;disposed=true;input.disconnect();for(const node of nodes)node.dispose();nodes=[];this.graphs.delete(graph);}};
 try{graph.update(snapshot);}catch(error){graph.dispose();throw error;}if(live)this.graphs.add(graph);return graph;
 }
}
