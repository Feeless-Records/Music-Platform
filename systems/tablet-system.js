import {TouchSystem} from "./touch-system.js?v=web-tech-1";
import {PanelSystem} from "./panel-system.js";
// Tablet owns a split workspace and a persistent app dock.
export class TabletSystem extends TouchSystem{
 constructor(root,options={}){super(root,{...options,layout:"tablet"});}
 createManager(workspace,taskbar){return new PanelSystem(workspace,taskbar,{split:true});}
}
