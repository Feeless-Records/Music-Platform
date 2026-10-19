// Shared, local SVG vocabulary. Icons supplement visible labels.
export const ICONS=Object.freeze({
 recording:{label:"Recording",path:"M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0Z M6 10v2a6 6 0 0 0 12 0v-2 M12 18v4 M8 22h8"},
 transport:{label:"Transport",path:"M8 5 19 12 8 19Z"},
 overview:{label:"Workspace",path:"M3 3h18v18H3Z M3 8h18 M8 8v13"},
 rack:{label:"Channel rack",path:"M3 5h3v3H3Z M10 5h3v3h-3Z M17 5h3v3h-3Z M3 11h3v3H3Z M10 11h3v3h-3Z M17 11h3v3h-3Z M3 17h3v3H3Z M10 17h3v3h-3Z M17 17h3v3h-3Z"},
 arrangement:{label:"Arrangement",path:"M3 4v16h18 M6 6h8v3H6Z M10 11h10v3H10Z M6 16h11v3H6Z"},
 systems:{label:"Systems",path:"M9 3h6v6H9Z M3 15h6v6H3Z M15 15h6v6h-6Z M12 9v3 M6 15v-3h12v3"}
});
export class IconSystem{
 constructor({doc=document}={}){this.doc=doc;}
 create(id){const definition=ICONS[id];if(!definition)throw new TypeError("Unknown icon: "+id);
 const svg=this.doc.createElementNS("http://www.w3.org/2000/svg","svg");
 for(const [key,value]of Object.entries({viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.6","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"studio-icon"}))svg.setAttribute(key,value);
 const path=this.doc.createElementNS("http://www.w3.org/2000/svg","path");path.setAttribute("d",definition.path);svg.append(path);return svg;}
 decorate(button,id){const label=this.doc.createElement("span");label.textContent=button.textContent;button.replaceChildren(this.create(id),label);return button;}
}
