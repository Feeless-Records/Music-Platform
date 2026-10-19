import {TextProcessor} from "./text-processor.js";
export class WebAssemblySystem{
 constructor({processor=new TextProcessor()}={}){this.processor=processor;this.backend="Not initialized";this.error=null;}
 initialize(){return this.ready??=(async()=>{try{await this.processor.initialize();this.backend="WebAssembly";}catch(error){this.backend="JavaScript fallback";this.error=error.message;}return this;})();}
 layout(text){
 if(this.backend==="Not initialized")throw new Error("Initialize WebAssemblySystem first");
 if(this.backend==="WebAssembly")return this.processor.process(text);
 const ascii=new TextEncoder().encode(text.toUpperCase().replace(/[^\x20-\x7e]/g,"?")).slice(0,100),positions=new Int32Array(ascii.length*3),vertices=[];
 for(let i=0;i<ascii.length;i++){positions[i*3]=ascii[i];positions[i*3+1]=i*6;this.processor.appendGlyph(positions,i,vertices);}
 return {vertices:new Float32Array(vertices),width:Math.max(6,ascii.length*6)};
 }
}
