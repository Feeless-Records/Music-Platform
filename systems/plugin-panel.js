export class PluginPanel{
 constructor(core){this.core=core;}
 mount(root){
 this.root=root;const doc=root.ownerDocument;this.node=(tag,text)=>{const el=doc.createElement(tag);if(text!==undefined)el.textContent=text;return el;};
 root.classList.add("plugin-panel");root.append(this.node("h2","Instruments, effects & plugins"),this.node("p","Bundled Web Audio plugins. Instrument changes affect new notes. Effect edits pause Transport so the chain can reconnect cleanly; press Play to continue. Effects process studio output before the existing master filter, compressor and gain."));
 this.status=this.node("output","Ready");this.status.setAttribute("role","status");
 this.instruments=this.node("section");this.effects=this.node("section");root.append(this.instruments,this.effects,this.status,this.node("p","These are local JavaScript plugins, separate from the browser companion extension. Native VST/AU binaries and third-party plugin installation are not supported in this version."));
 this.uninstrument=this.core.instruments.subscribe(()=>this.renderInstruments());this.uneffects=this.core.effects.subscribe(()=>this.renderEffects());this.renderInstruments();this.renderEffects();return this;
 }
 run(action){try{action();this.status.textContent="Plugin settings updated";}catch(error){this.status.textContent=error.message;}}
 select(label,options,value,change){const wrapper=this.node("label",label+" "),select=this.node("select");select.setAttribute("aria-label",label);for(const option of options){const item=this.node("option",option.name);item.value=option.id;select.append(item);}select.value=value;select.addEventListener("change",()=>this.run(()=>change(select.value)));wrapper.append(select);return wrapper;}
 parameters(container,definition,current,change,prefix){for(const [id,rule]of Object.entries(definition.parameters)){const label=this.node("label",id+" "),input=this.node("input");input.type="number";Object.assign(input,{min:String(rule.min),max:String(rule.max),step:String(rule.step??.01),value:String(current[id])});input.setAttribute("aria-label",prefix+" "+id);input.addEventListener("change",()=>this.run(()=>change({...current,[id]:Number(input.value)})));label.append(input);container.append(label);}}
 renderInstruments(){
 this.instruments.replaceChildren(this.node("h3","Channel instruments"));
 for(const channel of this.core.instruments.snapshot()){
 const card=this.node("fieldset"),legend=this.node("legend",channel.channelId);card.append(legend,this.select(channel.channelId+" instrument",this.core.plugins.list("instrument"),channel.pluginId,id=>this.core.instruments.assign(channel.channelId,id)));
 this.parameters(card,this.core.plugins.get(channel.pluginId),channel.parameters,parameters=>this.core.instruments.assign(channel.channelId,channel.pluginId,parameters),channel.channelId);this.instruments.append(card);
 }
 }
 changeEffects(action){this.core.transportController.pause();action();}
 renderEffects(){
 this.effects.replaceChildren(this.node("h3","Master effects chain"));
 const choices=this.node("div");let selected="effect.gain";
 choices.append(this.select("Effect plugin",this.core.plugins.list("effect"),selected,id=>selected=id));
 const add=this.node("button","Add effect");add.type="button";add.disabled=this.core.effects.slots.length>=8;add.addEventListener("click",()=>this.run(()=>this.changeEffects(()=>this.core.effects.add(selected))));choices.append(add);this.effects.append(choices);
 if(!this.core.effects.slots.length)this.effects.append(this.node("p","No inserted effects. The existing master processing remains active."));
 for(const [index,slot]of this.core.effects.snapshot().entries()){
 const definition=this.core.plugins.get(slot.pluginId),card=this.node("fieldset");card.append(this.node("legend",(index+1)+". "+definition.name));
 const label=this.node("label","Bypass "),bypass=this.node("input");bypass.type="checkbox";bypass.checked=slot.bypass;bypass.setAttribute("aria-label","Bypass effect "+(index+1));bypass.addEventListener("change",()=>this.run(()=>this.changeEffects(()=>this.core.effects.update(slot.id,{bypass:bypass.checked}))));label.append(bypass);card.append(label);
 this.parameters(card,definition,slot.parameters,parameters=>this.changeEffects(()=>this.core.effects.update(slot.id,{parameters})),"Effect "+(index+1));
 for(const [name,action,disabled]of [["Move up",()=>this.core.effects.move(slot.id,-1),index===0],["Move down",()=>this.core.effects.move(slot.id,1),index===this.core.effects.slots.length-1],["Remove",()=>this.core.effects.remove(slot.id),false]]){const button=this.node("button",name);button.type="button";button.disabled=disabled;button.setAttribute("aria-label",name+" effect "+(index+1));button.addEventListener("click",()=>this.run(()=>this.changeEffects(action)));card.append(button);}this.effects.append(card);
 }
 }
 dispose(){this.uninstrument?.();this.uneffects?.();}
}
