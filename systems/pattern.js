import {number,insert,required} from "./workflow-validation.js";
export class PatternSystem{
 constructor(){this.patterns=new Map();}
 create(id,{name=id,length=4}={}){number(length,Number.EPSILON);return insert(this.patterns,id,{id,name,length,notes:[]});}
 get(id){return required(this.patterns,id);}
 snapshot(){return structuredClone([...this.patterns.values()]);}
}
