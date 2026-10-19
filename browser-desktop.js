/** Generic browser/device family module. No business dependencies. */
import {createAppProfile} from "./desktop-app.js";
export const desktopProfile=createAppProfile();
export function matchesDesktop({width,height=width,coarse}){
 return (coarse?Math.min(width,height):width)>=1024;
}
