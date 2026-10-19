import {IconSystem,ICONS} from "./icon-system.js";
// Desktop-only shortcut surface; window state remains owned by WindowSystem.
export class DesktopIconSystem extends IconSystem{
 mount(workspace,launch){this.element=this.doc.createElement("nav");this.element.className="desktop-icons";this.element.setAttribute("aria-label","Desktop shortcuts");
 for(const [id,{label}]of Object.entries(ICONS)){const button=this.doc.createElement("button");button.type="button";button.className="desktop-shortcut";button.textContent=label;this.decorate(button,id);button.addEventListener("click",()=>launch(id));this.element.append(button);}
 workspace.append(this.element);return this;}
 destroy(){this.element?.remove();this.element=null;}
}
