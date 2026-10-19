import {StudioSystem} from "./studio-system.js?v=android-1";
import {PanelSystem} from "./panel-system.js";
import {ICONS} from "./icon-system.js";
export class MobileSystem extends StudioSystem{
 constructor(root,options={}){super(root,{...options,layout:"mobile"});this.history=[];}
 initialPanels(){return [];}
 createManager(workspace,taskbar){return new PanelSystem(workspace,taskbar);}
 start(panels=this.initialPanels()){
 super.start(panels);
 const doc=this.root.ownerDocument,workspace=this.windows.workspace;
 this.home=doc.createElement("section");this.home.className="mobile-home";this.home.setAttribute("aria-label","Studio home screen");
 const hero=doc.createElement("div");hero.className="mobile-home-hero";
 const time=doc.createElement("time");time.className="mobile-clock";
 const date=doc.createElement("p");const updateClock=()=>{const now=new Date();time.dateTime=now.toISOString();time.textContent=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});date.textContent=now.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"});};
 updateClock();this.clockTimer=setInterval(updateClock,30000);
 const title=doc.createElement("h1");title.textContent="Your sound. Your space.";hero.append(time,date,title);
 const apps=doc.createElement("nav");apps.className="mobile-app-grid";apps.setAttribute("aria-label","Studio apps");
 for(const [id,{label}]of Object.entries(ICONS)){const button=doc.createElement("button");button.type="button";button.className="mobile-app-icon";button.dataset.app=id;button.textContent=label;this.icons.decorate(button,id);button.addEventListener("click",()=>this.launch(id));apps.append(button);}
 const note=doc.createElement("p");note.className="mobile-home-note";note.textContent="FEELESS RECORDS · MUSIC PLATFORM";
 this.home.append(hero,apps,note);workspace.append(this.home);
 this.navigation=doc.createElement("nav");this.navigation.className="mobile-navigation";this.navigation.setAttribute("aria-label","Mobile navigation");
 for(const [label,symbol,action]of [["Back","‹",()=>this.back()],["Home","○",()=>this.showScreen("home")],["Recent apps","▢",()=>this.showScreen("recents")]]){
 const button=doc.createElement("button");button.type="button";button.setAttribute("aria-label",label);const glyph=doc.createElement("span");glyph.setAttribute("aria-hidden","true");glyph.textContent=symbol;const text=doc.createElement("small");text.textContent=label;button.append(glyph,text);button.addEventListener("click",action);this.navigation.append(button);}
 this.root.append(this.navigation);
 this.windows.taskbar.setAttribute("aria-label","Recent studio apps");
 this.windows.taskbar.addEventListener("click",event=>{if(event.target.closest(".task-button"))this.showScreen("app");});
 this.empty=doc.createElement("p");this.empty.className="mobile-recents-empty";this.empty.textContent="No recent apps. Tap Home to open a studio tool.";this.root.querySelector(".desktop-taskbar").append(this.empty);
 workspace.addEventListener("click",()=>{if(!this.windows.windows.size&&this.root.dataset.mobileScreen==="app")this.showScreen("home");});
 this.showScreen(panels.length?"app":"home");
 }
 showScreen(screen){this.root.dataset.mobileScreen=screen;const heading=screen==="home"?"Studio home":screen==="recents"?"Recent apps":this.windows.windows.get(this.windows.active)?.title??"Studio";this.root.querySelector(".desktop-identity strong").textContent=heading;if(this.home)this.home.hidden=screen!=="home";if(this.empty)this.empty.hidden=this.windows.windows.size>0;}
 launch(id){const previous=this.windows.active;if(previous&&previous!==id)this.history.push(previous);const state=super.launch(id);this.showScreen("app");return state;}
 back(){if(this.root.dataset.mobileScreen!=="app"){this.showScreen("home");return;}let id;while(this.history.length){id=this.history.pop();if(this.windows.windows.has(id))break;id=null;}if(id){this.windows.restore(id);this.showScreen("app");}else this.showScreen("home");}
 stop(options){clearInterval(this.clockTimer);super.stop(options);}
}
