export function waveformVertices(samples){const vertices=new Float32Array(samples.length*2);for(let i=0;i<samples.length;i++){vertices[i*2]=2*i/Math.max(1,samples.length-1)-1;vertices[i*2+1]=Math.max(-1,Math.min(1,Number.isFinite(samples[i])?samples[i]:0));}return vertices;}
export class WebGPUSystem{
 constructor({gpu=globalThis.navigator?.gpu,usage=globalThis.GPUBufferUsage,onFallback=()=>{}}={}){this.gpu=gpu;this.usage=usage;this.onFallback=onFallback;this.backend="SVG";this.disposed=false;}
 async initialize(canvas){
 this.canvas=canvas;
 try{
 if(!this.gpu||!this.usage)throw new Error("WebGPU API unavailable");
 const adapter=await this.gpu.requestAdapter({powerPreference:"low-power"});if(!adapter)throw new Error("No WebGPU adapter available");
 if(this.disposed)return false;
 this.device=await adapter.requestDevice();if(this.disposed){this.device.destroy();return false;}
 this.context=canvas.getContext("webgpu");if(!this.context)throw new Error("WebGPU canvas unavailable");
 this.context.configure({device:this.device,format:this.gpu.getPreferredCanvasFormat(),alphaMode:"premultiplied"});
 this.device.pushErrorScope("validation");
 const shader=this.device.createShaderModule({code:"@vertex fn vertex(@location(0) point: vec2f)->@builtin(position) vec4f{return vec4f(point,0.0,1.0);}\n@fragment fn fragment()->@location(0) vec4f{return vec4f(0.74,0.94,0.55,1.0);}"});
 this.pipeline=await this.device.createRenderPipelineAsync({layout:"auto",vertex:{module:shader,entryPoint:"vertex",buffers:[{arrayStride:8,attributes:[{shaderLocation:0,offset:0,format:"float32x2"}]}]},fragment:{module:shader,entryPoint:"fragment",targets:[{format:this.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"line-strip"}});
 const error=await this.device.popErrorScope();if(error)throw new Error(error.message);
 if(this.disposed){this.device.destroy();return false;}
 this.buffer=this.device.createBuffer({size:256*2*4,usage:this.usage.VERTEX|this.usage.COPY_DST});
 this.backend="WebGPU";this.device.lost.then(info=>{if(!this.disposed)this.fallback("WebGPU device lost: "+info.reason);});return true;
 }catch(error){this.fallback(error.message);return false;}
 }
 render(samples){
 if(this.backend!=="WebGPU"||this.disposed)return false;
 try{
 const ratio=Math.min(globalThis.devicePixelRatio||1,2),width=Math.max(1,Math.round(this.canvas.clientWidth*ratio)),height=Math.max(1,Math.round(this.canvas.clientHeight*ratio));
 if(this.canvas.width!==width)this.canvas.width=width;if(this.canvas.height!==height)this.canvas.height=height;
 const vertices=waveformVertices(samples.slice(0,256));this.device.queue.writeBuffer(this.buffer,0,vertices);
 const encoder=this.device.createCommandEncoder(),pass=encoder.beginRenderPass({colorAttachments:[{view:this.context.getCurrentTexture().createView(),clearValue:{r:.07,g:.11,b:.08,a:1},loadOp:"clear",storeOp:"store"}]});
 pass.setPipeline(this.pipeline);pass.setVertexBuffer(0,this.buffer);pass.draw(vertices.length/2);pass.end();this.device.queue.submit([encoder.finish()]);return true;
 }catch(error){this.fallback(error.message);return false;}
 }
 fallback(reason){this.backend="SVG";this.error=reason;this.buffer?.destroy();this.context?.unconfigure();this.device?.destroy();this.onFallback(reason);}
 dispose(){this.disposed=true;this.buffer?.destroy();this.context?.unconfigure();this.device?.destroy();}
}
