import {RecordingPanel} from "./recording-panel.js?v=storage-1";
import {IconSystem} from "./icon-system.js?v=industry-1";
import {TransportPanel} from "./transport-panel.js?v=transport-2";
import {StudioCore} from "./studio-core.js?v=industry-1";
function node(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
export class StudioSystem{
 constructor(root,{core=new StudioCore(),layout="desktop",mode="auto",onLayoutChange=()=>{}}={}){this.root=root;this.core=core;this.layout=layout;this.mode=mode;this.onLayoutChange=onLayoutChange;if(!this.core.workflow.patterns.patterns.has("pattern-1"))this.core.workflow.patterns.create("pattern-1");for(const id of ["Kick","Snare","Hat","Bass"])if(!this.core.workflow.channelRack.channels.has(id))this.core.workflow.channelRack.add(id);}
 initialPanels(){return ["arrangement","rack","overview"];}
 start(panels=this.initialPanels()){
 this.icons=new IconSystem();this.root.className="desktop-shell";this.root.dataset.interface=this.layout;
 const top=node("header","desktop-top");
 const brand=node("div","desktop-brand","F / R");const identity=node("div","desktop-identity");identity.append(node("strong","","Music Platform"),node("span","",this.layout.toUpperCase()+" WORKSPACE"));
 const back=node("a","back-link","← Front page");back.href="./index.html";const layoutLabel=node("label","layout-label","Layout ");const layoutSelect=node("select");layoutSelect.setAttribute("aria-label","Interface layout");for(const value of ["auto","mobile","tablet","desktop"]){const option=node("option","",value[0].toUpperCase()+value.slice(1));option.value=value;layoutSelect.append(option);}layoutSelect.value=this.mode;layoutSelect.addEventListener("change",()=>this.onLayoutChange(layoutSelect.value));layoutLabel.append(layoutSelect);top.append(brand,identity,layoutLabel,back);
 const toolbar=node("nav","desktop-tools");toolbar.setAttribute("aria-label","Open studio windows");
 for(const [id,label]of [["transport","Transport"],["recording","Recording"],["overview","Workspace"],["rack","Channel rack"],["arrangement","Arrangement"],["systems","Systems"]]){
 const b=node("button","launcher",label);b.type="button";this.icons.decorate(b,id);b.addEventListener("click",()=>this.launch(id));toolbar.append(b);
 }
 toolbar.append(node("span","mockup-label","STUDIO PROTOTYPE · PATTERN AUDIO ENABLED"));
 const workspace=node("main","desktop-workspace");workspace.setAttribute("aria-label","Studio desktop");
 const watermark=node("div","desktop-watermark");watermark.append(node("span","","FEELESS RECORDS"),node("strong","","Make room for sound."));workspace.append(watermark);
 const footer=node("footer","desktop-taskbar");const label=node("span","taskbar-label",this.layout==="desktop"?"WINDOWS":"TOOLS");const tasks=node("div","task-list");tasks.setAttribute("aria-label","Open windows");footer.append(label,tasks,node("span","lab-status","Test environment"));
 this.root.replaceChildren(top,toolbar,workspace,footer);this.windows=this.createManager(workspace,tasks);this.mountIcons?.(workspace);
 for(const id of panels)this.launch(id);
 this.onResize=()=>this.windows.reflow();this.observer=typeof ResizeObserver==="undefined"?null:new ResizeObserver(this.onResize);this.observer?.observe(workspace);
 this.core.loadPattern("pattern-1");
 }
 launch(id){
 if(this.windows.windows.has(id)){this.windows.restore(id);return;}
 const content=node("div","panel-content");let title,onClose=null,x=24,y=24,width=520,height=320;
 if(id==="transport"){
 title="Transport";x=40;y=40;width=560;height=440;
 const panel=new TransportPanel(this.core.transportController).mount(content);onClose=()=>panel.dispose();
 }else if(id==="recording"){
 title="Recording";width=600;height=500;const panel=new RecordingPanel(this.core.recording).mount(content);onClose=()=>panel.dispose();
 }else if(id==="overview"){
 title="Workspace";x=54;y=36;width=370;height=280;
 content.append(node("span","eyebrow",this.layout.toUpperCase()+" WORKSPACE"),node("h1","",this.layout==="desktop"?"Your studio, in windows.":this.layout==="tablet"?"Your studio, side by side.":"One tool. Full focus."),node("p","",this.layout==="desktop"?"Open tools from the bar above. Drag title bars, resize from the lower corner, or maximize a window.":this.layout!=="desktop"?"Tap Home to open studio apps. Use Back or Recent apps to switch tools. Your pattern stays with you.":"Open tools from the launcher and switch between them using the bottom tabs. Your pattern stays with you."));
 const list=node("ul","");for(const text of (this.layout==="desktop"?["Minimize to the taskbar; click to restore.","Close and reopen tools without resetting the pattern.","Keyboard: focus a title bar or resize handle and use arrow keys."]:["Close and reopen tools without resetting the pattern.",this.layout==="tablet"?"Two tools stay visible together.":"The selected tool fills the workspace.","Use Layout to try another interface."]))list.append(node("li","",text));content.append(list);
 }else if(id==="rack"){
 title="Channel rack";x=450;y=70;width=570;height=320;
 content.append(node("span","eyebrow","PATTERN 01 / 16 STEPS"),node("h2","","Build a rhythm"),node("p","","Toggle steps, then open Transport and press Play. Pattern voices currently use a saw oscillator."));
 const rack=node("div","step-rack");
 for(const [row,channel]of ["Kick","Snare","Hat","Bass"].entries()){
 const line=node("div","step-row");line.append(node("span","channel-name",channel));
 for(let step=0;step<16;step++){
 const button=node("button","step"+(Math.floor(step/4)%2?" alternate":""));button.type="button";
 const enabled=this.core.workflow.patterns.get("pattern-1").notes.some(n=>n.channelId===channel&&n.beat===step/4);
 button.setAttribute("aria-label",channel+" step "+(step+1));button.setAttribute("aria-pressed",String(enabled));
 button.addEventListener("click",()=>{const enabled=button.getAttribute("aria-pressed")!=="true";this.core.workflow.channelRack.setStep("pattern-1",channel,step,{enabled,note:[36,38,42,48][row]});button.setAttribute("aria-pressed",String(enabled));this.core.loadPattern("pattern-1");});
 line.append(button);
 }rack.append(line);
 }content.append(rack);
 }else if(id==="arrangement"){
 title="Arrangement";x=100;y=210;width=780;height=340;
 content.append(node("span","eyebrow","LINEAR WORKSPACE / LAYOUT PREVIEW"),node("h2","","A place for the whole track"));
 const timeline=node("div","arrangement-grid");const ruler=node("div","arrangement-row");ruler.append(node("span","track-name","BARS"));for(let i=1;i<=8;i++)ruler.append(node("span","bar-number",String(i)));timeline.append(ruler);
 for(const [name,start,length]of [["Drums",0,4],["Bass",2,4],["Texture",4,3]]){
 const row=node("div","arrangement-row");row.append(node("span","track-name",name));for(let i=0;i<8;i++)row.append(node("span","bar-cell"+(i>=start&&i<start+length?" clip-cell":"")));timeline.append(row);
 }content.append(timeline,node("p","panel-note","Illustrative clip placement. Editing and playback are the next integration step."));
 }else{
 title="Systems";x=220;y=90;width=420;height=350;
 content.append(node("span","eyebrow","CONNECTED FOUNDATION"),node("h2","","One shared studio core"));
 const list=node("ul","system-list");for(const name of Object.keys(this.core.workflow))list.append(node("li","",name));content.append(list,node("h2","","Audio, sound and music industries"),node("p","","Prototype means an available foundation; planned systems are a domain map, not completed software."));
 for(const domain of this.core.industry.domains){const section=node("details","industry-domain");section.append(node("summary","",domain.name+" · "+domain.systems.length+" systems"));for(const system of domain.systems){const row=node("p","",system.name+" — "+system.status);if(system.tool){const button=node("button","launcher","Open");button.setAttribute("aria-label","Open "+system.name);button.addEventListener("click",()=>this.launch(system.tool));row.append(button);}section.append(row);}content.append(section);}
 }
 const state=this.windows.open({id,title,content,x,y,width,height,onClose});
 this.icons.decorate(state.task,id);
 if(this.layout==="desktop"&&this.windows.area().width<760)this.windows.maximize(id);
 return state;
 }
 stop({stopAudio=true}={}){if(stopAudio)this.core.transportController.stop();this.observer?.disconnect();this.desktopIcons?.destroy();this.windows.destroy();}
}
