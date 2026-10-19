import {OrientationSystem} from "./browser-orientation.js";
export class ViewportSystem{
 constructor(win){this.win=win;}
 read(){
 const win=this.win,visual=win.visualViewport;
 return {width:win.innerWidth,height:win.innerHeight,coarse:win.matchMedia("(pointer: coarse)").matches,
 orientation:OrientationSystem.viewport(win.innerWidth,win.innerHeight),screenOrientation:OrientationSystem.screen(win.screen),
 pixelRatio:win.devicePixelRatio||1,visual:{width:visual?.width??win.innerWidth,height:visual?.height??win.innerHeight,scale:visual?.scale??1,offsetLeft:visual?.offsetLeft??0,offsetTop:visual?.offsetTop??0}};
 }
 observe(onChange){
 const win=this.win,pointer=win.matchMedia("(pointer: coarse)"),read=()=>onChange(this.read());
 const events=[[win,"resize"],[win.visualViewport,"resize"],[win.visualViewport,"scroll"],[pointer,"change"],[win.screen?.orientation,"change"]];
 for(const [target,event]of events)target?.addEventListener?.(event,read);read();
 return ()=>{for(const [target,event]of events)target?.removeEventListener?.(event,read);};
 }
}
export function observeViewport(win,onChange){return new ViewportSystem(win).observe(onChange);}
