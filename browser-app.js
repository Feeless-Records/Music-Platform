/** Generic browser/device family module. No business dependencies. */
import {mobileProfile,matchesMobile} from "./browser-mobile.js";
import {tabletProfile,matchesTablet} from "./browser-tablet.js";
import {desktopProfile} from "./browser-desktop.js";
import {observeViewport} from "./browser-window.js";
import {applyPage} from "./browser-page.js";
export function selectProfile(viewport){return matchesMobile(viewport)?mobileProfile:matchesTablet(viewport)?tabletProfile:desktopProfile;}
export class BrowserApp {
 constructor({win=window,root=document.documentElement}={}){this.win=win;this.root=root;}
 start(){if(this.dispose)return;this.dispose=observeViewport(this.win,viewport=>{this.profile=selectProfile(viewport);this.state=applyPage(this.root,this.profile,viewport);});}
 stop(){this.dispose?.();this.dispose=null;}
}
