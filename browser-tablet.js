/** Generic browser/device family module. No business dependencies. */
import {createAppProfile} from "./tablet-app.js";
export const tabletProfile=createAppProfile();
export function matchesTablet({width,height=width,coarse}){
 const size=coarse?Math.min(width,height):width;return size>=600&&size<1024;
}
