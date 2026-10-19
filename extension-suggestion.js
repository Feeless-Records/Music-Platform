import {BrowserDetectionSystem} from "./browser-detection.js";
export function extensionRecommendation(nav={}){
 const ua=nav.userAgent??"";
 const mobile=nav.userAgentData?.mobile||/Android|iPhone|iPad|iPod|Mobile/i.test(ua)||(/Macintosh/.test(ua)&&(nav.maxTouchPoints??0)>1);
 const {name}=BrowserDetectionSystem.detect(nav);
 if(mobile)return {target:"mobile",text:"Companion extensions are being developed for desktop browsers. You can use every platform tool directly in this browser."};
 if(name==="Firefox")return {target:"firefox",text:"Firefox development build available for temporary testing. Signed installation is not available yet."};
 if(name==="Safari")return {target:"safari",text:"Safari conversion source is available. A signed Safari app is not available yet."};
 if(["Chrome","Chromium","Edge","Opera"].includes(name))return {target:"chromium",text:"Chromium-family desktop development build available. Choose your browser in the installation guide."};
 return {target:"all",text:"Choose your browser to see compatible development builds and installation instructions."};
}
export function createExtensionSuggestion(doc=document,nav=globalThis.navigator){
 const recommendation=extensionRecommendation(nav),section=doc.createElement("section");section.className="extension-suggestion";section.setAttribute("aria-label","Browser companion");
 const heading=doc.createElement("h2");heading.textContent="Keep your studio in the toolbar";
 const text=doc.createElement("p");text.textContent="Optional Music Platform Companion · "+recommendation.text;
 const link=doc.createElement("a");link.href="./extensions.html#"+recommendation.target;link.textContent="Browser extension builds and setup";link.className="open";
 const note=doc.createElement("p");note.textContent="Preview 0.1.0 · Not yet listed in extension stores. The platform works without the companion.";
 section.append(heading,text,link,note);return section;
}
