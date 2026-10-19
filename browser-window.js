/** Generic browser/device family module. No business dependencies. */
export function observeViewport(win, onChange) {
  const pointer=win.matchMedia("(pointer: coarse)");
  const read=()=>onChange({width:win.innerWidth,height:win.innerHeight,coarse:pointer.matches});
  pointer.addEventListener?.("change",read);win.addEventListener("resize",read);win.visualViewport?.addEventListener("resize",read);read();
  return ()=>{pointer.removeEventListener?.("change",read);win.removeEventListener("resize",read);win.visualViewport?.removeEventListener("resize",read);};
}
