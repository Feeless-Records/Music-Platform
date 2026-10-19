import {BrowserSystem} from "./browser-system.js";
/** Generic browser/device family module. No business dependencies. */
import {mobileProfile,matchesMobile} from "./browser-mobile.js";
import {tabletProfile,matchesTablet} from "./browser-tablet.js";
import {desktopProfile} from "./browser-desktop.js";
import {observeViewport} from "./browser-window.js?v=environment-1";
import {applyPage} from "./browser-page.js?v=environment-1";
export function selectProfile(viewport){return matchesMobile(viewport)?mobileProfile:matchesTablet(viewport)?tabletProfile:desktopProfile;}
export class BrowserApp {
 constructor({win=window,root=document.documentElement}={}){this.win=win;this.root=root;this.browser=new BrowserSystem(win);}
 start(){if(this.dispose)return;this.dispose=observeViewport(this.win,viewport=>{this.profile=selectProfile(viewport);const environment=this.browser.inspect();this.state={...applyPage(this.root,this.profile,viewport),viewport,browser:environment};this.root.dataset.viewportProfile=this.profile.family;this.root.dataset.deviceFamily=environment.device.family;this.root.dataset.browser=environment.identity.name;});}
 stop(){this.dispose?.();this.dispose=null;}
}
