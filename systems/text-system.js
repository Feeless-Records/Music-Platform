import {TextProcessor} from "./text-processor.js";
import {TextRenderer} from "./text-renderer.js";
export class TextSystem {
  constructor(canvas){this.processor=new TextProcessor();this.renderer=new TextRenderer(canvas);}
  async initialize(){await this.processor.initialize();return this;}
  async render(message){
    const geometry=this.processor.process(message);
    const backend=await this.renderer.render(geometry,message);
    return {backend,glyphCount:message.length,vertexCount:geometry.vertices.length/2};
  }
}
