import {test} from "node:test";
import assert from "node:assert/strict";
import {StudioCore} from "../systems/studio-core.js";
test("step and piano roll share patterns and compile into existing sequencer",()=>{
 const core=new StudioCore(),w=core.workflow;
 w.patterns.create("beat");w.channelRack.add("lead");
 w.channelRack.setStep("beat","lead",0,{note:69});
 w.pianoRoll.addNote("beat",{channelId:"lead",beat:1,duration:.5,note:72});
 assert.equal(core.loadPattern("beat"),2);assert.equal(core.sequencer.notes[0].frequency,440);
 w.channelRack.setStep("beat","lead",0,{enabled:false});assert.equal(w.patterns.get("beat").notes.length,1);
 assert.throws(()=>w.pianoRoll.addNote("beat",{channelId:"lead",beat:3,duration:2}));
 assert.throws(()=>w.patterns.create("beat"));assert.throws(()=>w.patterns.create("bad",{length:NaN}));
});
test("clips reconcile arrangement positions and quantized session scenes",()=>{
 const w=new StudioCore().workflow;w.patterns.create("p");w.clips.create("c",{patternId:"p"});
 w.arrangement.place("c",{trackId:"track",beat:8});assert.equal(w.arrangement.inRange(9,10).length,1);
 w.session.setSlot("track",0,"c");w.session.setSlot("other",0,"c");
 const launches=w.session.launchScene(0,{beat:1,quantization:4});assert.ok(launches.every(x=>x.at===4));
 assert.equal(w.session.advance(3).length,0);assert.equal(w.session.advance(4).length,2);
 w.session.stop("track");assert.equal(w.session.playing.size,1);
 assert.throws(()=>w.clips.create("bad",{patternId:"missing"}));
});
test("automation interpolates and mixer rejects routing feedback",()=>{
 const w=new StudioCore().workflow;w.automation.setPoint("cutoff",0,100);w.automation.setPoint("cutoff",4,500);
 assert.equal(w.automation.valueAt("cutoff",2),300);assert.equal(w.automation.valueAt("cutoff",8),500);
 w.mixer.add("a");w.mixer.add("b");w.mixer.route("a","b");assert.throws(()=>w.mixer.route("b","a"));
 w.mixer.route("b","master");assert.throws(()=>w.mixer.setLevel("a",{pan:2}));
});
test("warp validates monotonic markers and tracker aligns rows to beats",()=>{
 const w=new StudioCore().workflow;w.warp.setMarkers([{beat:0,seconds:0},{beat:4,seconds:2}]);
 assert.equal(w.warp.secondsAt(2),1);assert.throws(()=>w.warp.setMarkers([{beat:0,seconds:2},{beat:4,seconds:1}]));
 w.tracker.create("p",{rows:16});w.tracker.setCell("p",{row:4,note:60,instrument:0,effect:"0A0F"});
 w.tracker.setOrder(["p","p"]);assert.deepEqual(w.tracker.events().map(e=>e.beat),[1,5]);
 assert.equal(w.tracker.constructor.parseHex("FF"),255);assert.throws(()=>w.tracker.constructor.parseHex("FG"));
 assert.throws(()=>w.tracker.setCell("p",{row:16}));
});
test("transport pause and seek use shared timeline",()=>{
 const core=new StudioCore({bpm:120}),t=core.workflow.transport;t.play(10);
 assert.equal(t.position(11),2);t.pause(12);assert.equal(t.position(20),4);
 t.seek(8,20);t.play(20);assert.equal(t.position(21),10);t.stop();assert.equal(t.position(21),0);
});
