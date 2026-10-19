import {BrowserApp} from "./browser-app.js?v=environment-1";
import {InterfaceSystem} from "./systems/interface-system.js?v=recording-2";
const browser=new BrowserApp();
const interfaces=new InterfaceSystem(document.querySelector("#desktop"));
browser.start();interfaces.start();
window.addEventListener("pagehide",()=>{interfaces.pause();interfaces.core.recording.stop();browser.stop();});
window.addEventListener("pageshow",event=>{if(event.persisted){browser.start();interfaces.current?.windows.reflow();}});
