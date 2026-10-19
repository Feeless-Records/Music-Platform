export class FFTAnalyzer {
  constructor(canvas,sources=[]){
    this.canvas=canvas;
    this.ctx=canvas.getContext("2d");
    this.sources=sources;
    this.frame=0;
    this.tick=this.tick.bind(this);
    this.levels=new Float32Array(16).fill(-60);
  }
  start(){if(!this.frame)this.frame=requestAnimationFrame(this.tick);}
  stop(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;}
  tick(){this.sample();this.draw();this.frame=requestAnimationFrame(this.tick);}
  sample(){
    const source=this.sources.find(s=>s.held||s.voices?.size>0)||this.sources.find(s=>s.playing);
    const analyser=source?.analyser;
    if(!analyser){this.levels.fill(-60);return;}
    const data=new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(data);
    const nyquist=analyser.context.sampleRate/2;
    for(let band=0;band<16;band++){
      const low=20*Math.pow(1000,band/16);
      const high=Math.min(nyquist,20*Math.pow(1000,(band+1)/16));
      const start=Math.max(1,Math.floor(low/nyquist*data.length));
      const end=Math.min(data.length,Math.max(start+1,Math.ceil(high/nyquist*data.length)));
      let peak=-60;
      for(let i=start;i<end;i++)peak=Math.max(peak,data[i]);
      this.levels[band]=Math.max(-60,Math.min(0,Number.isFinite(peak)?peak:-60));
    }
  }
  draw(){
    const ratio=Math.min(window.devicePixelRatio||1,2);
    const width=this.canvas.clientWidth,height=this.canvas.clientHeight;
    if(!width||!height)return;
    const pw=Math.round(width*ratio),ph=Math.round(height*ratio);
    if(this.canvas.width!==pw||this.canvas.height!==ph){this.canvas.width=pw;this.canvas.height=ph;}
    const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.clearRect(0,0,width,height);
    const left=34,right=5,top=9,bottom=18;
    const plotW=width-left-right,plotH=Math.max(1,height-top-bottom);
    ctx.font="10px system-ui";ctx.textAlign="right";ctx.textBaseline="middle";
    for(const db of [0,-10,-20,-30,-60]){
      const y=top+(-db/60)*plotH;
      ctx.strokeStyle="#424c64";ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(width-right,y);ctx.stroke();
      ctx.fillStyle="#aeb5c6";ctx.fillText(String(db),left-5,y);
    }
    const gap=3,barWidth=Math.max(1,plotW/16-gap);
    for(let i=0;i<16;i++){
      const value=this.levels[i],barH=(value+60)/60*plotH;
      ctx.fillStyle=value>-10?"#f97316":value>-30?"#ffb542":"#5dbaae";
      ctx.fillRect(left+i*plotW/16+gap/2,top+plotH-barH,barWidth,barH);
    }
    ctx.fillStyle="#aeb5c6";ctx.textAlign="left";ctx.textBaseline="bottom";
    ctx.fillText("20 Hz",left,height-2);
    ctx.textAlign="right";ctx.fillText("20 kHz",width-right,height-2);
  }
}
