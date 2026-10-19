import {number,insert,required} from "./workflow-validation.js";
// Routing model only. Web Audio node binding is a separate integration.
export class MixerSystem{
 constructor(){this.tracks=new Map([["master",{id:"master",gain:1,pan:0,mute:false,effects:[]}]]);this.routes=new Map();}
 add(id){return insert(this.tracks,id,{id,gain:1,pan:0,mute:false,effects:[]});}
 setLevel(id,{gain=1,pan=0,mute=false}={}){const track=required(this.tracks,id);number(gain,0,4);number(pan,-1,1);Object.assign(track,{gain,pan,mute:Boolean(mute)});}
 route(from,to){required(this.tracks,from);required(this.tracks,to);if(from==="master")throw new Error("Master cannot route upstream");let cursor=to;const visited=new Set([from]);while(cursor){if(visited.has(cursor))throw new Error("Routing cycle");visited.add(cursor);cursor=this.routes.get(cursor);}this.routes.set(from,to);}
 addEffect(id,descriptor){if(!descriptor||typeof descriptor.type!=="string")throw new TypeError("Effect type required");required(this.tracks,id).effects.push(structuredClone(descriptor));}
}
