export class TextRenderer {
  constructor(canvas){this.canvas=canvas;this.backend=null;}
  async render(data,text){
    try{await this.renderGpu(this.canvas,data);this.backend="WebGPU";}
    catch(error){console.warn("WebGPU fallback",error);this.svgFallback(this.canvas,data,text);this.backend="SVG";}
    return this.backend;
  }
  async renderGpu(canvas,data) {
  if (!navigator.gpu) throw new Error("WebGPU unsupported");
  const adapter=await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("WebGPU adapter unavailable");
  const device=await adapter.requestDevice();
  const context=canvas.getContext("webgpu");
  if (!context) throw new Error("WebGPU canvas unavailable");
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(canvas.clientWidth*dpr);
  canvas.height=Math.round(canvas.clientHeight*dpr);
  const format=navigator.gpu.getPreferredCanvasFormat();
  context.configure({device,format,alphaMode:"premultiplied"});
  const code=`
struct Uniforms { dimensions: vec2f, textWidth: f32, padding: f32 }
@group(0) @binding(0) var<uniform> u: Uniforms;
@vertex fn vertex(@location(0) p: vec2f) -> @builtin(position) vec4f {
 let scale=min((u.dimensions.x-16.0)/u.textWidth,(u.dimensions.y-16.0)/7.0);
 let origin=vec2f((u.dimensions.x-u.textWidth*scale)*0.5,(u.dimensions.y-7.0*scale)*0.5);
 let pixel=origin+p*scale;
 return vec4f(pixel.x/u.dimensions.x*2.0-1.0,1.0-pixel.y/u.dimensions.y*2.0,0.0,1.0);
}
@fragment fn fragment() -> @location(0) vec4f {return vec4f(1.0,0.71,0.26,1.0);}
`;
  const shader=device.createShaderModule({code});
  const pipeline=device.createRenderPipeline({layout:"auto",
    vertex:{module:shader,entryPoint:"vertex",buffers:[{arrayStride:8,attributes:[{shaderLocation:0,offset:0,format:"float32x2"}]}]},
    fragment:{module:shader,entryPoint:"fragment",targets:[{format}]},
    primitive:{topology:"triangle-list"}
  });
  const vertex=device.createBuffer({size:Math.max(data.vertices.byteLength,4),usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
  device.queue.writeBuffer(vertex,0,data.vertices);
  const uniform=device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
  device.queue.writeBuffer(uniform,0,new Float32Array([canvas.width,canvas.height,data.width,0]));
  const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
  const encoder=device.createCommandEncoder();
  const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),
    clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});
  pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.setVertexBuffer(0,vertex);
  pass.draw(data.vertices.length/2);pass.end();
  device.queue.submit([encoder.finish()]);
  // Rebuild on resize to preserve crisp vector edges.
  return device;
}
  svgFallback(canvas,data,text){
 canvas.style.display="none";
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.setAttribute("viewBox",`0 0 ${data.width} 7`);
 svg.setAttribute("aria-label",text);
 svg.setAttribute("class","flying-vector");
 const path=document.createElementNS("http://www.w3.org/2000/svg","path");
 let commands="";
 for(let i=0;i<data.vertices.length;i+=12){const x=data.vertices[i],y=data.vertices[i+1];commands+=`M${x} ${y}h0.88v0.88h-0.88z`;}
 path.setAttribute("d",commands);path.setAttribute("fill","#ffb542");svg.append(path);canvas.after(svg);
}

}
