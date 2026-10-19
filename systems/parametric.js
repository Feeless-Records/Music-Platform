export class ParametricSystem {
  constructor(){this.params=new Map();}
  define(name,{value=0,min=-Infinity,max=Infinity}={}){this.params.set(name,{value:Math.max(min,Math.min(max,value)),min,max});return this;}
  set(name,value){const p=this.params.get(name);if(!p)throw new Error("Unknown parameter: "+name);if(!Number.isFinite(value))throw new TypeError("Parameter must be finite");p.value=Math.max(p.min,Math.min(p.max,value));return p.value;}
  get(name){return this.params.get(name)?.value;}
  snapshot(){return Object.fromEntries([...this.params].map(([k,v])=>[k,v.value]));}
}
