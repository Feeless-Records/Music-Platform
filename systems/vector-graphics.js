const NS="http://www.w3.org/2000/svg";
export function waveformPath(samples,width=640,height=180){
 if(!samples.length)return "";const values=Array.from(samples);return values.map((value,index)=>(index?"L":"M")+(index*width/Math.max(1,values.length-1)).toFixed(2)+" "+((1-Math.max(-1,Math.min(1,Number.isFinite(value)?value:0)))*height/2).toFixed(2)).join(" ");
}
export class VectorGraphicsSystem{
 constructor(doc=document){this.doc=doc;}
 svg(label,viewBox){const svg=this.doc.createElementNS(NS,"svg");svg.setAttribute("viewBox",viewBox);svg.setAttribute("role","img");svg.setAttribute("aria-label",label);svg.setAttribute("class","technology-vector");return svg;}
 path(svg,d){const path=this.doc.createElementNS(NS,"path");path.setAttribute("d",d);svg.append(path);return path;}
 textGeometry(data,label){const svg=this.svg(label,"0 0 "+data.width+" 7");let commands="";for(let i=0;i<data.vertices.length;i+=6)commands+="M"+data.vertices[i]+" "+data.vertices[i+1]+"L"+data.vertices[i+2]+" "+data.vertices[i+3]+"L"+data.vertices[i+4]+" "+data.vertices[i+5]+"Z";const path=this.path(svg,commands);path.setAttribute("fill","currentColor");return svg;}
 waveform(){const svg=this.svg("Live studio output waveform","0 0 640 180"),path=this.path(svg,waveformPath(new Float32Array(256)));path.setAttribute("fill","none");path.setAttribute("stroke","currentColor");path.setAttribute("stroke-width","2");path.setAttribute("vector-effect","non-scaling-stroke");return {element:svg,update:samples=>path.setAttribute("d",waveformPath(samples))};}
}
