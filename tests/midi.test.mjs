import assert from "node:assert/strict";
import {test} from "node:test";
import {MIDISystem} from "../systems/midi.js";
class FakeSynth {
  constructor(){this.started=[];this.stopped=[];}
  async noteOn(key,hz,note){this.started.push({key,hz,note});}
  noteOff(key){this.stopped.push(key);}
  retuneNotes(hz){this.tuning=hz;}
}
test("MIDI note on/off, zero velocity, channel isolation",()=>{
 const synth=new FakeSynth(),midi=new MIDISystem(synth);
 midi.receive("a",[0x90,60,100]);midi.receive("a",[0x91,64,80]);
 assert.equal(synth.started.length,2);
 assert.ok(Math.abs(synth.started[0].hz-261.6256)<.01);
 midi.receive("a",[0x90,60,0]);
 assert.equal(synth.stopped.length,1);
 midi.receive("a",[0xb1,123,0]);
 assert.equal(synth.stopped.length,2);
 assert.equal(midi.active.size,0);
});
test("MIDI devices release their own notes and tuning updates",()=>{
 const synth=new FakeSynth(),midi=new MIDISystem(synth);
 midi.receive("a",[0x90,69,80]);midi.receive("b",[0x90,72,80]);
 midi.setTuningReference(442);
 assert.equal(synth.tuning,442);
 midi.releaseDevice("a");
 assert.equal(midi.active.size,1);
 midi.stop();
 assert.equal(midi.active.size,0);
 assert.equal(synth.stopped.length,2);
});
