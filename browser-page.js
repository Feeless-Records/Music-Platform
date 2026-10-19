/** Generic browser/device family module. No business dependencies. */
export function applyPage(root,profile,viewport){
 const orientation=viewport.width>viewport.height?"landscape":"portrait";
 const layout=profile.pageLayout(orientation);
 root.dataset.device=profile.family;root.dataset.orientation=orientation;
 root.style.setProperty("--device-max-width",layout.maxWidth+"px");
 root.style.setProperty("--device-gap",layout.gap+"px");
 root.style.setProperty("--viewport-height",viewport.height+"px");
 return {family:profile.family,orientation,...viewport};
}
