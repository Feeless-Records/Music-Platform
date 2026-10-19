import {StudioSystem} from "./studio-system.js?v=icons-1";
import {PanelSystem} from "./panel-system.js";
export class MobileSystem extends StudioSystem{
 constructor(root,options={}){super(root,{...options,layout:"mobile"});}
 initialPanels(){return ["rack"];}
 createManager(workspace,taskbar){return new PanelSystem(workspace,taskbar);}
}
