import {test} from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {TextProcessor} from "../systems/text-processor.js";
import {WebAssemblySystem} from "../systems/webassembly-system.js";
import {WebGPUSystem,waveformVertices} from "../systems/webgpu-system.js";
import {waveformPath} from "../systems/vector-graphics.js";
test("real WASM layout agrees with the JavaScript fallback geometry",async()=>{
 const processor=new TextProcessor();processor.initialize=async()=>{const {instance}=await WebAssembly.instantiate(fs.readFileSync(new URL("../text-layout.wasm",import.meta.url)));processor.wasm=instance.exports;};
 const wasm=new WebAssemblySystem({processor});await wasm.initialize();assert.equal(wasm.backend,"WebAssembly");
 const fallback=new WebAssemblySystem();fallback.processor.initialize=async()=>{throw Error("unsupported");};await fallback.initialize();assert.equal(fallback.backend,"JavaScript fallback");
 for(const text of ["FEELESS AUDIO","","A 123","test\u00e4"]){const expected=wasm.layout(text),actual=fallback.layout(text);assert.equal(actual.width,expected.width);assert.deepEqual(actual.vertices,expected.vertices);}
});
test("waveforms sanitize non-finite values and preserve amplitude limits",()=>{
 assert.equal(waveformPath(new Float32Array()),"");
 assert.equal(waveformPath(new Float32Array([-2,NaN,2]),100,100),"M0.00 100.00 L50.00 50.00 L100.00 0.00");
 assert.deepEqual([...waveformVertices(new Float32Array([-2,NaN,2]))],[-1,-1,0,0,1,1]);
});
test("GPU absence and null adapters select SVG without blocking the tool",async()=>{
 for(const gpu of [null,{requestAdapter:async()=>null}]){
 let fallback=0;const system=new WebGPUSystem({gpu,usage:{VERTEX:1,COPY_DST:2},onFallback:()=>fallback++});
 assert.equal(await system.initialize({}),false);assert.equal(system.backend,"SVG");assert.equal(fallback,1);assert.equal(system.render(new Float32Array(2)),false);system.dispose();
 }
});
test("GPU draws a line-strip and disposes device and buffer",async()=>{
 let draws=0,destroyed=0,bufferDestroyed=0,unconfigured=0;
 const pass={setPipeline(){},setVertexBuffer(){},draw(count){draws=count;},end(){}};
 const device={pushErrorScope(){},popErrorScope:async()=>null,createShaderModule:()=>({}),createRenderPipelineAsync:async()=>({}),createBuffer:()=>({destroy:()=>bufferDestroyed++}),queue:{writeBuffer(){},submit(){}},createCommandEncoder:()=>({beginRenderPass:()=>pass,finish:()=>({})}),lost:new Promise(()=>{}),destroy:()=>destroyed++};
 const context={configure(){},unconfigure(){unconfigured++;},getCurrentTexture:()=>({createView:()=>({})})};
 const canvas={clientWidth:640,clientHeight:180,getContext:()=>context};
 const gpu={requestAdapter:async()=>({requestDevice:async()=>device}),getPreferredCanvasFormat:()=>"bgra8unorm"};
 const system=new WebGPUSystem({gpu,usage:{VERTEX:1,COPY_DST:2}});assert.equal(await system.initialize(canvas),true);assert.equal(system.render(new Float32Array(256)),true);assert.equal(draws,256);
 system.dispose();assert.equal(destroyed,1);assert.equal(bufferDestroyed,1);assert.equal(unconfigured,1);
});
test("closing during adapter request never creates a GPU device",async()=>{
 let resolve,requests=0;const system=new WebGPUSystem({gpu:{requestAdapter:()=>new Promise(r=>resolve=r)},usage:{VERTEX:1,COPY_DST:2}});
 const initialization=system.initialize({});system.dispose();resolve({requestDevice:async()=>{requests++;}});assert.equal(await initialization,false);assert.equal(requests,0);
});
