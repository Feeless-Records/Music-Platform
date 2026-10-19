import {test} from "node:test";
import assert from "node:assert/strict";
import {IconSystem,ICONS} from "../systems/icon-system.js";
import {DesktopIconSystem} from "../systems/desktop-icon-system.js";
function element(){return {children:[],attributes:{},listeners:{},textContent:"",setAttribute(k,v){this.attributes[k]=v;},append(...nodes){this.children.push(...nodes);},replaceChildren(...nodes){this.children=nodes;},addEventListener(k,fn){this.listeners[k]=fn;},remove(){this.removed=true;}};}
const doc={createElement:element,createElementNS:element};
test("shared icon labels remain visible and SVGs are decorative",()=>{
 const icons=new IconSystem({doc}),button=element();button.textContent="Transport";icons.decorate(button,"transport");
 assert.equal(button.children[0].attributes["aria-hidden"],"true");assert.equal(button.children[1].textContent,"Transport");
 assert.throws(()=>icons.create("unknown"),TypeError);
});
test("desktop shortcuts launch the matching tool and dispose independently",()=>{
 const icons=new DesktopIconSystem({doc}),workspace=element(),launched=[];icons.mount(workspace,id=>launched.push(id));
 assert.equal(icons.element.children.length,Object.keys(ICONS).length);
 for(const button of icons.element.children)button.listeners.click();
 assert.deepEqual(launched,Object.keys(ICONS));const surface=icons.element;icons.destroy();assert.equal(surface.removed,true);assert.equal(icons.element,null);
});
