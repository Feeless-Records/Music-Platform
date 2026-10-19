import {platform} from "./platform-manifest.js?v=workspaces-3";
function element(tag,text,className){const item=document.createElement(tag);if(text)item.textContent=text;if(className)item.className=className;return item;}
export class MusicPlatform{
 constructor(root=document.getElementById("app")){this.root=root;}
 initialize(){
 if(!this.root)throw new Error("Music Platform root element not found.");
 document.title=platform.name;
 const style=element("style");style.textContent=`
 :root{color-scheme:dark;font-family:system-ui,sans-serif;color:#e8ece8;background:#111715}*{box-sizing:border-box}body{margin:0}
 #app{max-width:1180px;margin:auto;padding:54px 24px}header{border-bottom:1px solid #354239;padding-bottom:30px;margin-bottom:32px}
 .label{font-size:11px;letter-spacing:.16em;color:#b9ef84;text-transform:uppercase}h1{font-weight:500;font-size:clamp(32px,5vw,60px);letter-spacing:-.045em;line-height:1.05;max-width:850px}
 p,li{line-height:1.7;color:#aab9af}.workspaces{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
 article{padding:24px;border:1px solid #3a493d;border-radius:12px;background:#1b241f;display:flex;flex-direction:column;align-items:flex-start}h2{font-size:22px;font-weight:500}article p{font-size:14px}ul{padding-left:18px;font-size:13px}
 .state{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#b9ef84}.open{display:inline-block;margin-top:auto;padding:11px 16px;border:1px solid #b9ef84;border-radius:6px;color:#152211;background:#b9ef84;text-decoration:none;font-size:13px}
 .planned{margin-top:auto;font-size:12px;color:#93a197}footer{display:flex;gap:18px;flex-wrap:wrap;margin-top:32px;font-size:12px}footer a{color:#b8cbbd}a:focus-visible{outline:2px solid #fff;outline-offset:4px}
 @media(max-width:800px){.workspaces{grid-template-columns:1fr}#app{padding:30px 18px}}
 `;document.head.append(style);
 const header=element("header");header.append(element("span","FEELESS RECORDS","label"),element("h1",platform.name),element("p","One music platform for listening, broadcasting, editing, performing, and producing."));
 const workspaces=element("section",null,"workspaces");workspaces.setAttribute("aria-label","Music workspaces");
 for(const workspace of platform.workspaces){
 const card=element("article");card.append(element("span",workspace.status==="prototype"?"Working prototype":"Planned workspace","state"),element("h2",workspace.name),element("p",workspace.description));
 const capabilities=element("ul");for(const item of workspace.capabilities)capabilities.append(element("li",item));card.append(capabilities);
 if(workspace.href){const link=element("a","Open DAW prototype","open");link.href=workspace.href;card.append(link);}else card.append(element("span","Workspace development planned","planned"));
 workspaces.append(card);
 }
 const footer=element("footer"),lab=element("a","Audio engine test page");lab.href="./audio-studio.html";footer.append(lab,element("span","Development platform · Features are being integrated."));
 this.root.replaceChildren(header,workspaces,footer);return this;
 }
}
new MusicPlatform().initialize();
