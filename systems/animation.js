// Persistent class-based 2D bouncing animation controller.
export class AnimationSystem {
  constructor(track,{speedX=190,speedY=145}={}){
    this.track=track;
    this.speedX=speedX;this.speedY=speedY;
    this.x=40;this.y=40;this.dx=1;this.dy=1;
    this.previous=0;this.frame=null;this.paused=false;
    this.tick=this.tick.bind(this);
  }
  start(){if(this.frame===null)this.frame=requestAnimationFrame(this.tick);return this;}
  tick(timestamp){
    this.advance(timestamp);
    this.applyPosition();
    this.frame=requestAnimationFrame(this.tick);
  }
  advance(timestamp){
    const dt=this.previous?Math.min((timestamp-this.previous)/1000,0.05):0;
    this.previous=timestamp;
    if(this.paused)return;
    const moving=this.track.querySelector("#flying");
    const width=moving?.offsetWidth||Math.min(540,this.track.clientWidth*.75);
    const height=moving?.offsetHeight||100;
    const maxX=Math.max(0,this.track.clientWidth-width);
    const maxY=Math.max(0,this.track.clientHeight-height);
    this.x+=this.dx*this.speedX*dt;
    this.y+=this.dy*this.speedY*dt;
    if(this.x>=maxX){this.x=maxX;this.dx=-1;}
    if(this.x<=0){this.x=0;this.dx=1;}
    if(this.y>=maxY){this.y=maxY;this.dy=-1;}
    if(this.y<=0){this.y=0;this.dy=1;}
  }
  applyPosition(){
    this.track.style.setProperty("--fly-x",this.x+"px");
    this.track.style.setProperty("--fly-y",this.y+"px");
  }
  pause(){this.paused=true;}
  play(){this.paused=false;this.previous=0;this.start();}
  stop(){if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;this.previous=0;}
}
