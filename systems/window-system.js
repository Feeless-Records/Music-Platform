export function fitBounds(bounds,area){
 const width=Math.max(1,Math.min(bounds.width,area.width)),height=Math.max(1,Math.min(bounds.height,area.height));
 return {width,height,x:Math.max(0,Math.min(bounds.x,area.width-width)),y:Math.max(0,Math.min(bounds.y,area.height-height))};
}
export class WindowSystem{
 constructor(workspace,taskbar){this.workspace=workspace;this.taskbar=taskbar;this.windows=new Map();this.layer=0;this.active=null;this.resize=()=>this.reflow();window.addEventListener("resize",this.resize);}
 area(){return {width:this.workspace.clientWidth,height:this.workspace.clientHeight};}
 open({id,title,content,x=24,y=24,width=520,height=360,onClose=null}){
 if(this.windows.has(id)){this.restore(id);return;}
 const element=document.createElement("section");element.className="studio-window";element.setAttribute("role","region");element.setAttribute("aria-label",title);
 const header=document.createElement("header");header.className="window-titlebar";
 const handle=document.createElement("button");handle.type="button";handle.className="window-drag";handle.textContent=title;handle.setAttribute("aria-label",title+": drag or use arrow keys to move");
 const actions=document.createElement("div");actions.className="window-actions";
 const action=(label,text,callback)=>{const b=document.createElement("button");b.type="button";b.textContent=text;b.setAttribute("aria-label",label+" "+title);b.addEventListener("click",callback);actions.append(b);return b;};
 action("Minimize","−",()=>this.minimize(id));
 const maxButton=action("Maximize","□",()=>this.maximize(id));
 action("Close","×",()=>this.close(id));
 header.append(handle,actions);
 const body=document.createElement("div");body.className="window-body";body.append(content);
 const grip=document.createElement("button");grip.type="button";grip.className="window-resize";grip.textContent="◢";grip.setAttribute("aria-label","Resize "+title+": drag or use arrow keys");
 element.append(header,body,grip);
 const task=document.createElement("button");task.type="button";task.className="task-button";task.textContent=title;task.addEventListener("click",()=>this.restore(id));
 const state={id,title,onClose,element,task,handle,maxButton,bounds:{x,y,width,height},maximized:false,minimized:false};this.windows.set(id,state);
 this.workspace.append(element);this.taskbar.append(task);
 element.addEventListener("pointerdown",()=>this.focus(id));element.addEventListener("focusin",()=>this.focus(id));
 this.bindPointer(handle,state,false);this.bindPointer(grip,state,true);
 handle.addEventListener("dblclick",()=>this.maximize(id));
 for(const [control,resizing] of [[handle,false],[grip,true]])control.addEventListener("keydown",event=>{
 const directions={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]},delta=directions[event.key];
 if(!delta||state.maximized)return;event.preventDefault();
 if(resizing){state.bounds.width=Math.max(280,state.bounds.width+delta[0]);state.bounds.height=Math.max(180,state.bounds.height+delta[1]);}
 else{state.bounds.x+=delta[0];state.bounds.y+=delta[1];}this.apply(state);
 });
 this.apply(state);this.focus(id);return state;
 }
 bindPointer(control,state,resizing){
 let drag=null;
 control.addEventListener("pointerdown",event=>{
 if(event.button!==0||state.maximized)return;event.preventDefault();this.focus(state.id);
 drag={x:event.clientX,y:event.clientY,bounds:{...state.bounds},pointerId:event.pointerId};control.setPointerCapture(event.pointerId);
 });
 control.addEventListener("pointermove",event=>{
 if(!drag||event.pointerId!==drag.pointerId)return;
 const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
 state.bounds=resizing?{...drag.bounds,width:Math.max(280,drag.bounds.width+dx),height:Math.max(180,drag.bounds.height+dy)}:{...drag.bounds,x:drag.bounds.x+dx,y:drag.bounds.y+dy};this.apply(state);
 });
 const finish=()=>{drag=null;};control.addEventListener("pointerup",finish);control.addEventListener("pointercancel",finish);control.addEventListener("lostpointercapture",finish);
 }
 apply(state){
 const area=this.area();if(!area.width||!area.height)return;
 const b=state.maximized?{x:0,y:0,...area}:fitBounds(state.bounds,area);
 if(!state.maximized)state.bounds=b;
 Object.assign(state.element.style,{left:b.x+"px",top:b.y+"px",width:b.width+"px",height:b.height+"px"});
 state.element.classList.toggle("maximized",state.maximized);state.element.hidden=state.minimized;
 state.maxButton.setAttribute("aria-label",(state.maximized?"Restore ":"Maximize ")+state.title);
 state.task.setAttribute("aria-pressed",String(this.active===state.id&&!state.minimized));
 }
 focus(id){const state=this.windows.get(id);if(!state)return;this.active=id;state.element.style.zIndex=String(++this.layer);for(const s of this.windows.values()){s.element.classList.toggle("active",s.id===id);s.task.setAttribute("aria-pressed",String(s.id===id&&!s.minimized));}}
 minimize(id){const state=this.windows.get(id);if(!state)return;state.minimized=true;this.apply(state);state.task.focus();}
 restore(id){const state=this.windows.get(id);if(!state)return;state.minimized=false;this.apply(state);this.focus(id);state.handle.focus();}
 maximize(id){const state=this.windows.get(id);if(!state)return;state.maximized=!state.maximized;this.apply(state);this.focus(id);}
 close(id){const state=this.windows.get(id);if(!state)return;state.onClose?.();state.element.remove();state.task.remove();this.windows.delete(id);if(this.active===id)this.active=null;this.taskbar.querySelector("button")?.focus();}
 reflow(){for(const state of this.windows.values())this.apply(state);}
 destroy(){window.removeEventListener("resize",this.resize);for(const id of [...this.windows.keys()])this.close(id);}
}
