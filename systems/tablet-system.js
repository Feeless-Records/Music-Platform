import {StudioSystem} from "./studio-system.js?v=android-1";
import {PanelSystem} from "./panel-system.js";
export class TabletSystem extends StudioSystem{
 constructor(root,options={}){super(root,{...options,layout:"tablet"});}
 initialPanels(){return ["rack","transport"];}
 createManager(workspace,taskbar){return new PanelSystem(workspace,taskbar,{split:true});}
}
