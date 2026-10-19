import {BrowserApp} from "./browser-app.js?v=environment-1";
import {DesktopSystem} from "./systems/desktop-system.js?v=transport-3";
const browser=new BrowserApp();
const desktop=new DesktopSystem(document.querySelector("#desktop"));
browser.start();desktop.start();
window.addEventListener("pagehide",()=>{desktop.core.transportController.pause();browser.stop();});
window.addEventListener("pageshow",event=>{if(event.persisted){browser.start();desktop.windows.reflow();}});
