import {DesktopIconSystem} from "./desktop-icon-system.js?v=industry-1";
import {StudioSystem} from "./studio-system.js?v=industry-1";
import {WindowSystem} from "./window-system.js";
export class DesktopSystem extends StudioSystem{
 constructor(root,options={}){super(root,{...options,layout:"desktop"});}
 mountIcons(workspace){this.desktopIcons=new DesktopIconSystem();this.desktopIcons.mount(workspace,id=>this.launch(id));}
 createManager(workspace,taskbar){return new WindowSystem(workspace,taskbar);}
}
