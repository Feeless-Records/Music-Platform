import {StudioSystem} from "./studio-system.js?v=interfaces-1";
import {WindowSystem} from "./window-system.js";
export class DesktopSystem extends StudioSystem{
 constructor(root,options={}){super(root,{...options,layout:"desktop"});}
 createManager(workspace,taskbar){return new WindowSystem(workspace,taskbar);}
}
