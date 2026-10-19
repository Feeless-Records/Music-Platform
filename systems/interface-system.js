import {MobileSystem} from "./mobile-system.js?v=plugins-1";
import {TabletSystem} from "./tablet-system.js?v=plugins-1";
import {DesktopSystem} from "./desktop-system.js?v=plugins-1";
import {StudioCore} from "./studio-core.js?v=plugins-1";
import {selectProfile} from "../browser-app.js?v=environment-1";
import {observeViewport} from "../browser-viewport.js";
export function selectInterface(viewport,mode="auto"){
 if(!["auto","mobile","tablet","desktop"].includes(mode))throw new TypeError("Unknown interface mode");
 return mode==="auto"?selectProfile(viewport).family:mode;
}
export class InterfaceSystem{
 constructor(root,{win=window,core=new StudioCore()}={}){this.root=root;this.win=win;this.core=core;this.mode="auto";this.current=null;this.viewport=null;}
 start(){if(this.unobserve)return;this.unobserve=observeViewport(this.win,viewport=>{this.viewport=viewport;this.reconcile();});const tool=new URLSearchParams(this.win.location?.search??"").get("tool");if(["transport","recording","rack","arrangement","systems","overview","technology","media","plugins"].includes(tool))this.current?.launch(tool);}
 setMode(mode){selectInterface(this.viewport,mode);this.mode=mode;this.reconcile(true);}
 reconcile(force=false){
 const type=selectInterface(this.viewport,this.mode);if(!force&&this.current?.layout===type){this.current.windows.reflow();return;}
 const previous=this.current,panels=previous?[...previous.windows.windows.keys()]:undefined,active=previous?.windows.active;
 previous?.stop({stopAudio:false});
 const System={mobile:MobileSystem,tablet:TabletSystem,desktop:DesktopSystem}[type];
 this.current=new System(this.root,{core:this.core,mode:this.mode,onLayoutChange:mode=>this.setMode(mode)});
 this.current.start(panels);if(active&&this.current.windows.windows.has(active))this.current.windows.restore(active);
 }
 pause(){this.core.transportController.pause();}
 stop(){this.unobserve?.();this.unobserve=null;this.current?.stop();this.current=null;}
}
