import {test} from "node:test";
import assert from "node:assert/strict";
import {selectInterface} from "../systems/interface-system.js";
import {MobileSystem} from "../systems/mobile-system.js";
import {TabletSystem} from "../systems/tablet-system.js";
import {DesktopSystem} from "../systems/desktop-system.js?v=interfaces-1";
import {StudioCore} from "../systems/studio-core.js?v=transport-3";
import {PanelSystem} from "../systems/panel-system.js";
test("automatic interfaces follow viewport profile; explicit choice is independent",()=>{
 assert.equal(selectInterface({width:390,height:844,coarse:true}),"mobile");
 assert.equal(selectInterface({width:844,height:390,coarse:true}),"mobile");
 assert.equal(selectInterface({width:820,height:1180,coarse:true}),"tablet");
 assert.equal(selectInterface({width:1440,height:900,coarse:false}),"desktop");
 assert.equal(selectInterface({width:390,height:844,coarse:true},"desktop"),"desktop");
 assert.throws(()=>selectInterface({width:800,height:600},"invalid"));
});
test("three interface systems reuse one project and preserve notes",()=>{
 const core=new StudioCore(),mobile=new MobileSystem({}, {core});
 core.workflow.channelRack.setStep("pattern-1","Kick",0,{enabled:true,note:36});core.loadPattern("pattern-1");
 const tablet=new TabletSystem({}, {core}),desktop=new DesktopSystem({}, {core});
 assert.equal(mobile.core,tablet.core);assert.equal(tablet.core,desktop.core);
 assert.equal(core.workflow.patterns.get("pattern-1").notes.length,1);assert.equal(core.sequencer.notes.length,1);
 assert.deepEqual(mobile.initialPanels(),[]);assert.deepEqual(tablet.initialPanels(),[]);
});
function element(){
 const classes=new Set();return {children:[],attributes:{},hidden:false,clientWidth:800,clientHeight:600,
 classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),toggle:(c,on)=>on?classes.add(c):classes.delete(c)},
 append(...children){for(const child of children){child.parent=this;this.children.push(child);}},
 setAttribute(k,v){this.attributes[k]=v;},addEventListener(){},remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);},dataset:{}};
}
test("mobile shows one tool and tablet shows two; close releases panel resources",()=>{
 const previous=globalThis.document;globalThis.document={createElement:element};
 try{
 for(const split of [false,true]){
 const manager=new PanelSystem(element(),element(),{split});let closed=0;
 for(const id of ["rack","transport","systems"])manager.open({id,title:id,content:element(),onClose:()=>closed++});
 assert.equal([...manager.windows.values()].filter(s=>!s.element.hidden).length,split?2:1);
 manager.restore("rack");assert.equal(manager.active,"rack");
 manager.close("rack");assert.equal(closed,1);assert.equal(manager.windows.size,2);
 manager.destroy();assert.equal(closed,3);assert.equal(manager.windows.size,0);
 }
 }finally{globalThis.document=previous;}
});

test("mobile Back skips closed tools and returns home without changing audio",()=>{
 const screens=[],restored=[];
 const mobile={root:{dataset:{mobileScreen:"app"}},history:["rack","closed"],windows:{windows:new Map([["rack",{}]]),restore:id=>restored.push(id)},showScreen:screen=>screens.push(screen)};
 MobileSystem.prototype.back.call(mobile);assert.deepEqual(restored,["rack"]);assert.deepEqual(screens,["app"]);
 MobileSystem.prototype.back.call(mobile);assert.equal(screens.at(-1),"home");
 mobile.root.dataset.mobileScreen="recents";MobileSystem.prototype.back.call(mobile);assert.equal(screens.at(-1),"home");
});

test("tablet shares touch navigation but independently enables split panels",()=>{
 const previous=globalThis.document;globalThis.document={createElement:element};
 try{const core=new StudioCore(),tablet=new TabletSystem({}, {core}),mobile=new MobileSystem({}, {core});
 assert.equal(tablet.layout,"tablet");assert.equal(mobile.layout,"mobile");
 const tabletPanels=tablet.createManager(element(),element()),mobilePanels=mobile.createManager(element(),element());
 assert.equal(tabletPanels.split,true);assert.equal(mobilePanels.split,false);
 assert.equal(tablet.back,mobile.back);assert.equal(tablet.core,mobile.core);
 }finally{globalThis.document=previous;}
});
