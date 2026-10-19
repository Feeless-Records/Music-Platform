function element(tag,text){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el;}
export class TransportPanel{
 constructor(controller){this.controller=controller;this.url=null;}
 mount(root){
 const controller=this.controller;root.classList.add("transport-panel");
 const title=element("h2","Transport controller"),hint=element("p","Plays Channel Rack pattern 01 through the shared audio engine. Empty steps are silent. Render exports this pattern once.");
 const buttons=element("div");buttons.className="transport-buttons";
 const status=element("output","Stopped · beat 0.00"),message=element("p");message.setAttribute("role","status");
 const run=action=>Promise.resolve().then(action).catch(error=>{console.error("Transport operation failed",error);message.textContent=error.message;});
 const button=(label,action)=>{const b=element("button",label);b.type="button";b.addEventListener("click",()=>run(action));buttons.append(b);return b;};
 this.play=button("Play",()=>controller.play());button("Pause",()=>controller.pause());button("Stop",()=>controller.stop());
 this.render=button("Render WAV",async()=>{
 message.textContent="Rendering pattern…";
 const buffer=await controller.render(),blob=controller.renderer.toWav(buffer);
 if(this.disposed)return;
 if(this.url)URL.revokeObjectURL(this.url);this.url=URL.createObjectURL(blob);
 this.download.href=this.url;this.download.hidden=false;message.textContent="Render ready: "+buffer.duration.toFixed(2)+" s";
 });
 const fields=element("div");fields.className="transport-fields";
 const input=(label,type,value,attrs,change)=>{
 const wrapper=element("label",label+" "),control=element("input");control.type=type;control.value=String(value);Object.assign(control,attrs);control.setAttribute("aria-label",label);
 control.addEventListener("change",()=>run(()=>change(control)));wrapper.append(control);fields.append(wrapper);return control;
 };
 this.tempo=input("Tempo (BPM)","number",controller.core.timeline.bpm,{min:"20",max:"300",step:"1"},c=>controller.setTempo(Number(c.value)));
 this.seek=input("Position (beats)","range",0,{min:"0",max:String(controller.length),step:".0625"},c=>controller.seek(Number(c.value)));
 const loopLabel=element("label","Loop pattern "),loop=element("input");loop.type="checkbox";loop.checked=controller.loop;loop.addEventListener("change",()=>controller.configure({loop:loop.checked}));loopLabel.append(loop);fields.append(loopLabel);
 input("Output (%)","range",controller.engine.settings.gain*100,{min:"0",max:"100",step:"1"},c=>controller.engine.configure({gain:Number(c.value)/100}));
 input("Low-pass cutoff (Hz)","number",controller.engine.settings.cutoff,{min:"20",max:"20000",step:"10"},c=>controller.engine.configure({cutoff:Number(c.value)}));
 this.download=element("a","Download rendered WAV");this.download.download="feeless-pattern.wav";this.download.hidden=true;
 root.append(title,hint,buttons,status,fields,this.download,message);
 this.unsubscribe=controller.subscribe(state=>{
 status.textContent=state.state[0].toUpperCase()+state.state.slice(1)+" · beat "+state.beat.toFixed(2);
 if(document.activeElement!==this.seek)this.seek.value=String(state.beat);
 if(document.activeElement!==this.tempo)this.tempo.value=String(state.bpm);
 this.play.disabled=state.state==="playing"||state.state==="starting";this.render.disabled=state.rendering;
 if(state.error)message.textContent=state.error;
 });
 return this;
 }
 dispose(){this.disposed=true;this.unsubscribe?.();if(this.url)URL.revokeObjectURL(this.url);}
}
