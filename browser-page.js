import {OrientationSystem} from "./browser-orientation.js";
/** Generic browser/device family module. No business dependencies. */
export function applyPage(root,profile,viewport){
 const orientation=OrientationSystem.viewport(viewport.width,viewport.height);
 const layout=profile.pageLayout(orientation);
 root.dataset.device=profile.family;root.dataset.orientation=orientation;
 root.style.setProperty("--device-max-width",layout.maxWidth+"px");
 root.style.setProperty("--device-gap",layout.gap+"px");
 root.style.setProperty("--viewport-height",viewport.height+"px");
 return {family:profile.family,orientation,...viewport};
}
