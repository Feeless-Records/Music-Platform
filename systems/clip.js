import {number,insert,required} from "./workflow-validation.js";
export class ClipSystem{
 constructor(patterns){this.patterns=patterns;this.clips=new Map();}
 create(id,{type="pattern",patternId=null,source=null,length=4,loop=true}={}){
 if(!["pattern","audio"].includes(type))throw new TypeError("Unsupported clip type");number(length,Number.EPSILON);
 if(type==="pattern")this.patterns.get(patternId);else if(typeof source!=="string"||!source)throw new TypeError("Audio source required");
 return insert(this.clips,id,{id,type,patternId,source,length,loop:Boolean(loop)});
 }
 get(id){return required(this.clips,id);}
}
