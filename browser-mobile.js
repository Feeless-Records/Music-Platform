/** Generic browser/device family module. No business dependencies. */
import {createAppProfile} from "./mobile-app.js";
export const mobileProfile=createAppProfile();
export function matchesMobile({width,height=width,coarse}){
 return (coarse?Math.min(width,height):width)<600;
}
