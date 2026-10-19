export class MasterVolumeSystem {
  constructor(value=100){this.value=100;this.outputs=new Set();this.setValue(value);}
  attach(context,input){
    const gain=context.createGain();
    gain.gain.value=this.value/100;
    input.connect(gain);
    gain.connect(context.destination);
    this.outputs.add(gain);
    return gain;
  }
  setValue(value){
    this.value=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
    for(const gain of this.outputs){
      const now=gain.context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(this.value/100,now,.008);
    }
    return this.value;
  }
  dispose(){for(const gain of this.outputs)gain.disconnect();this.outputs.clear();}
}
export class MasterVolumeKnob {
  constructor(element,display,system){
    this.element=element;this.display=display;this.system=system;
    this.drag=null;
    this.down=this.down.bind(this);this.move=this.move.bind(this);
    this.up=this.up.bind(this);this.key=this.key.bind(this);
  }
  start(){
    this.element.addEventListener("pointerdown",this.down);
    this.element.addEventListener("pointermove",this.move);
    this.element.addEventListener("pointerup",this.up);
    this.element.addEventListener("pointercancel",this.up);
    this.element.addEventListener("lostpointercapture",this.up);
    this.element.addEventListener("keydown",this.key);
    this.render();
    return this;
  }
  down(event){
    if(event.button!==0)return;
    event.preventDefault();
    this.drag={id:event.pointerId,y:event.clientY,value:this.system.value};
    this.element.setPointerCapture(event.pointerId);
    this.element.focus();
  }
  move(event){
    if(!this.drag||this.drag.id!==event.pointerId)return;
    // 150 px of upward movement corresponds to the full 0–100 range.
    this.system.setValue(this.drag.value+(this.drag.y-event.clientY)*100/150);
    this.render();
  }
  up(event){if(this.drag?.id===event.pointerId)this.drag=null;}
  key(event){
    const delta={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:10,PageDown:-10}[event.key];
    if(delta===undefined&&event.key!=="Home"&&event.key!=="End")return;
    event.preventDefault();
    this.system.setValue(event.key==="Home"?0:event.key==="End"?100:this.system.value+delta);
    this.render();
  }
  render(){
    const value=this.system.value;
    this.element.style.setProperty("--knob-angle",(-135+value*2.7)+"deg");
    this.element.setAttribute("aria-valuenow",String(value));
    this.element.setAttribute("aria-valuetext",value+"%");
    this.display.textContent=value+"%";
  }
  stop(){
    this.element.removeEventListener("pointerdown",this.down);
    this.element.removeEventListener("pointermove",this.move);
    this.element.removeEventListener("pointerup",this.up);
    this.element.removeEventListener("pointercancel",this.up);
    this.element.removeEventListener("lostpointercapture",this.up);
    this.element.removeEventListener("keydown",this.key);
  }
}
