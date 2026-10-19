import assert from "node:assert/strict";
import {test} from "node:test";
import {StudioCore} from "../systems/studio-core.js";
import {ProjectSystem} from "../systems/project.js";
import {TimelineSystem} from "../systems/timeline.js";
import {FrequencySystem} from "../systems/frequency.js";
import {VelocitySystem} from "../systems/velocity.js";
test("project persists document and track",()=>{
  const core=new StudioCore();
  core.document.addTrack({id:"lead",name:"Lead"});
  core.document.addEvent("lead",{beat:0,note:69});
  const restored=ProjectSystem.deserialize(core.project.serialize());
  assert.equal(restored.getDocument("arrangement").tracks[0].events[0].note,69);
});
test("timing and sequencing",()=>{
  const core=new StudioCore({bpm:120});
  core.sequencer.addNote({beat:2,duration:1,frequency:440,velocity:100});
  assert.equal(core.timeline.beatToSeconds(2),1);
  assert.equal(core.sequencer.inRange(0,4).length,1);
  core.setTempo(60);
  assert.equal(core.timeline.beatToSeconds(2),2);
});
test("log frequency and MIDI",()=>{
  assert.ok(Math.abs(FrequencySystem.fromNormalized(.5)-Math.sqrt(20*20000))<.001);
  assert.equal(FrequencySystem.midiToHz(69),440);
  assert.ok(Math.abs(FrequencySystem.toNormalized(440)-Math.log(22)/Math.log(1000))<1e-10);
});
test("velocity and parameters",()=>{
  const core=new StudioCore();
  assert.equal(VelocitySystem.toGain(127),1);
  assert.equal(VelocitySystem.toGain(0),0);
  assert.equal(core.parameters.set("cutoff",30000),20000);
});
