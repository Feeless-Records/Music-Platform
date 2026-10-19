// Shared pane manager for touch interfaces; no floating-window behavior.
export class PanelSystem{
 constructor(workspace,taskbar,{split=false}={}){this.workspace=workspace;this.taskbar=taskbar;this.split=split;this.windows=new Map();this.active=null;this.previous=null;workspace.classList.add("pane-workspace");}
 area(){return {width:this.workspace.clientWidth,height:this.workspace.clientHeight};}
 open({id,title,content,onClose=null}){
 if(this.windows.has(id)){this.restore(id);return;}
 const element=document.createElement("section");element.className="platform-pane";element.setAttribute("role","region");element.setAttribute("aria-label",title);
 const header=document.createElement("header");header.className="pane-title";
 const heading=document.createElement("h2");heading.textContent=title;
 const close=document.createElement("button");close.type="button";close.textContent="×";close.setAttribute("aria-label","Close "+title);close.addEventListener("click",()=>this.close(id));header.append(heading,close);
 const body=document.createElement("div");body.className="window-body";body.append(content);element.append(header,body);
 const task=document.createElement("button");task.type="button";task.className="task-button";task.textContent=title;task.addEventListener("click",()=>this.restore(id));
 const state={id,title,element,task,onClose,handle:heading};this.windows.set(id,state);this.workspace.append(element);this.taskbar.append(task);
 element.addEventListener("pointerdown",()=>{if(this.active!==id)this.focus(id);});element.addEventListener("focusin",()=>{if(this.active!==id)this.focus(id);});
 this.focus(id);return state;
 }
 focus(id){
 if(!this.windows.has(id))return;if(this.active!==id){this.previous=this.active;this.active=id;}this.reflow();
 }
 restore(id){this.focus(id);}
 maximize(id){this.focus(id);}
 minimize(id){if(this.active===id)this.focus([...this.windows.keys()].find(key=>key!==id));}
 close(id){
 const state=this.windows.get(id);if(!state)return;state.onClose?.();state.element.remove();state.task.remove();this.windows.delete(id);
 if(this.previous===id)this.previous=null;
 if(this.active===id){this.active=[...this.windows.keys()].at(-1)??null;this.previous=[...this.windows.keys()].find(key=>key!==this.active)??null;}
 this.reflow();
 }
 reflow(){
 const visible=[this.active];if(this.split&&this.previous&&this.windows.has(this.previous))visible.unshift(this.previous);
 for(const state of this.windows.values()){state.element.hidden=!visible.includes(state.id);state.element.classList.toggle("active",state.id===this.active);state.task.setAttribute("aria-pressed",String(state.id===this.active));}
 this.workspace.dataset.panes=String(visible.filter(Boolean).length);
 }
 destroy(){for(const id of [...this.windows.keys()])this.close(id);this.workspace.classList.remove("pane-workspace");}
}
