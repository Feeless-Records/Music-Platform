import {WebGPUSystem} from "./webgpu-system.js";
import {VectorGraphicsSystem} from "./vector-graphics.js";
export class WebTechnologyPanel{
 constructor(core){this.core=core;this.disposed=false;}
 mount(root){
 const doc=root.ownerDocument;this.root=root;root.classList.add("web-technology-panel");this.vector=new VectorGraphicsSystem(doc);
 const node=(tag,text)=>{const el=doc.createElement(tag);if(text)el.textContent=text;return el;};
 root.append(node("h2","Web Technologies"),node("p","WebAssembly lays out the vector title below. WebGPU renders the live studio output when available; SVG provides a scalable fallback. Web Audio uses the same engine as Transport."));
 this.status=node("div");this.status.setAttribute("role","status");this.status.className="technology-status";root.append(this.status);
 this.title=node("div");this.title.className="technology-title";root.append(this.title);
 const frame=node("div");frame.className="technology-waveform";this.canvas=node("canvas");this.canvas.setAttribute("role","img");this.canvas.setAttribute("aria-label","Live studio output waveform rendered by WebGPU");this.canvas.hidden=true;this.wave=this.vector.waveform();frame.append(this.canvas,this.wave.element);root.append(frame);
 this.audioButton=node("button","Enable shared audio engine");this.audioButton.type="button";this.audioButton.className="launcher";this.audioButton.addEventListener("click",async()=>{try{await this.core.transportController.engine.resume();if(!this.disposed)this.updateStatus();}catch(error){if(!this.disposed){this.audioError=error.message;this.updateStatus();}}});root.append(this.audioButton,node("p","Play a Channel Rack pattern through Transport to see its waveform. A flat line means silence. Microphone recording is separate and is not monitored here."));
 this.gpu=new WebGPUSystem({onFallback:()=>{if(!this.disposed){this.canvas.hidden=true;this.wave.element.style.display="";this.updateStatus();}}});
 this.data=new Float32Array(2048);this.samples=new Float32Array(256);this.unsubscribe=this.core.transportController.subscribe(()=>this.updateStatus());this.initialize();this.tick();return this;
 }
 async initialize(){await this.core.webAssembly.initialize();if(this.disposed)return;this.title.replaceChildren(this.vector.textGeometry(this.core.webAssembly.layout("FEELESS AUDIO"),"Feeless Audio — vector text layout"));await this.gpu.initialize(this.canvas);if(this.disposed)return;this.updateStatus();}
 updateStatus(){const engine=this.core.transportController.engine,context=engine.context;this.status.textContent="WebAssembly: "+this.core.webAssembly.backend+" · Graphics: "+this.gpu.backend+(this.gpu.error?" ("+this.gpu.error+")":"")+" · SVG: active vector system · Web Audio: "+(this.audioError??(context?context.state:(globalThis.AudioContext||globalThis.webkitAudioContext?"available, not started":"unavailable")));if(this.audioButton)this.audioButton.disabled=context?.state==="running";}
 tick(){if(this.disposed)return;if(this.root.getClientRects().length){const analyser=this.core.transportController.engine.processing?.analyser;if(analyser){if(this.data.length!==analyser.fftSize)this.data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(this.data);for(let i=0;i<256;i++)this.samples[i]=this.data[Math.floor(i*this.data.length/256)];}else this.samples.fill(0);const rendered=this.gpu.render(this.samples);this.canvas.hidden=!rendered;this.wave.element.style.display=rendered?"none":"";this.wave.element.setAttribute("aria-hidden",String(rendered));if(!rendered)this.wave.update(this.samples);}
 this.frame=requestAnimationFrame(()=>this.tick());}
 dispose(){this.disposed=true;this.unsubscribe?.();cancelAnimationFrame(this.frame);this.gpu.dispose();}
}
