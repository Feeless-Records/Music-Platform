import {test} from "node:test";
import assert from "node:assert/strict";
import {PluginSystem} from "../systems/plugin-system.js";
import {registerBuiltinPlugins} from "../systems/builtin-plugins.js";
import {InstrumentSystem} from "../systems/instrument-system.js";
import {EffectsSystem} from "../systems/effects-system.js";
import {StudioCore} from "../systems/studio-core.js?v=plugins-1";
import {MobileSystem} from "../systems/mobile-system.js";
function context(){
 const nodes=[],waves=[];const parameter=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){}});
 const node=()=>{const value={connections:[],disconnections:0,gain:parameter(),frequency:parameter(),Q:parameter(),delayTime:parameter(),connect(target){this.connections.push(target);},disconnect(){this.disconnections++;},start(){waves.push({wave:this.type,frequency:this.frequency.value});},stop(){}};nodes.push(value);return value;};
 return {nodes,waves,currentTime:0,sampleRate:48000,createGain:node,createBiquadFilter:node,createDelay:node,createOscillator:node,destination:node()};
}
test("plugin registry rejects duplicate IDs, wrong kinds and invalid parameter values",()=>{
 const registry=registerBuiltinPlugins(new PluginSystem());assert.equal(registry.list("instrument").length,4);assert.equal(registry.list("effect").length,3);
 assert.throws(()=>registry.register(registry.get("effect.gain")),/duplicate/);
 assert.throws(()=>registry.get("effect.gain","instrument"),/Unknown/);
 assert.throws(()=>registry.settings("effect.gain",{gain:99}),/Invalid/);
 assert.throws(()=>registry.settings("effect.gain",{unknown:1}),/Unknown/);
 assert.throws(()=>registry.settings("instrument.sine",{transpose:1.5}),/Invalid/);
});
test("channel assignments drive oscillator waveform and transpose, with isolated render snapshots",()=>{
 const registry=registerBuiltinPlugins(new PluginSystem()),instruments=new InstrumentSystem(registry),ctx=context();
 instruments.assign("Bass","instrument.sine",{level:.5,transpose:12});const snapshot=instruments.snapshot();
 const frozen=instruments.createPlayer(ctx,ctx.destination,snapshot),live=instruments.createPlayer(ctx,ctx.destination);
 instruments.assign("Bass","instrument.square");
 frozen.note({channelId:"Bass",frequency:110,velocity:100});live.note({channelId:"Bass",frequency:110,velocity:100});
 assert.deepEqual(ctx.waves,[{wave:"sine",frequency:220},{wave:"square",frequency:110}]);
 frozen.stopAll();live.stopAll();assert.equal(snapshot.find(channel=>channel.channelId==="Bass").pluginId,"instrument.sine");
});
test("effect order, bypass, parameter updates and graph disposal remain consistent",()=>{
 const registry=registerBuiltinPlugins(new PluginSystem()),effects=new EffectsSystem(registry),ctx=context();
 const gain=effects.add("effect.gain"),delay=effects.add("effect.delay");effects.update(delay.id,{parameters:{time:.5,mix:.3}});assert.equal(effects.tail(),.5);
 const graph=effects.createGraph(ctx,ctx.destination,undefined,{live:true});assert.equal(effects.graphs.size,1);
 effects.move(delay.id,-1);assert.equal(effects.slots[0].id,delay.id);
 effects.update(delay.id,{bypass:true});assert.equal(effects.tail(),0);assert.ok(ctx.nodes.some(node=>node.disconnections>0));
 assert.throws(()=>effects.update(gain.id,{parameters:{gain:3}}));assert.equal(effects.slots.find(slot=>slot.id===gain.id).parameters.gain,1);
 effects.remove(gain.id);assert.equal(effects.slots.length,1);graph.dispose();assert.equal(effects.graphs.size,0);
 for(let i=0;i<7;i++)effects.add("effect.gain");assert.throws(()=>effects.add("effect.gain"),/maximum/);
});
test("project JSON retains plugins and rejects unknown plugins before mutating the pattern",async()=>{
 const source=new StudioCore();new MobileSystem({}, {core:source});source.instruments.assign("Kick","instrument.triangle");source.effects.add("effect.lowpass");
 source.workflow.channelRack.setStep("pattern-1","Kick",0,{enabled:true,note:36});const blob=source.exporter.project();
 const target=new StudioCore();new MobileSystem({}, {core:target});await target.importer.project(blob);
 assert.equal(target.instruments.channels.get("Kick").pluginId,"instrument.triangle");assert.equal(target.effects.slots[0].pluginId,"effect.lowpass");assert.equal(target.sequencer.notes.length,1);
 const invalid=JSON.parse(await blob.text());invalid.plugins.effects[0].pluginId="effect.unknown";invalid.notes=[];
 await assert.rejects(target.importer.project(new Blob([JSON.stringify(invalid)])),/Unknown/);assert.equal(target.sequencer.notes.length,1);
});
test("transport export captures instrument and effects snapshots without replacing the shared systems",async()=>{
 const core=new StudioCore();new MobileSystem({}, {core});core.effects.add("effect.delay");let captured;
 core.transportController.renderer={render:async options=>{captured=options;return "rendered";}};
 assert.equal(await core.transportController.render(),"rendered");core.effects.update(core.effects.slots[0].id,{bypass:true});
 assert.equal(captured.effectsSystem,core.effects);assert.equal(captured.instrumentSystem,core.instruments);
 assert.equal(captured.effectsSnapshot[0].bypass,false);assert.equal(captured.instrumentSnapshot.length,4);
});
