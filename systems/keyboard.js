import {FrequencySystem} from "./frequency.js";
export class KeyboardSystem {
  // Physical key codes: independent of the selected OS keyboard layout.
  static KEY_NOTES = new Map([
    ["KeyQ",60],["Digit2",61],["KeyW",62],["Digit3",63],["KeyE",64],
    ["KeyR",65],["Digit5",66],["KeyT",67],["Digit6",68],["KeyY",69],
    ["Digit7",70],["KeyU",71],["KeyI",72],["Digit9",73],["KeyO",74],
    ["Digit0",75],["KeyP",76],["BracketLeft",77],["Equal",78],["BracketRight",79],
    ["KeyZ",48],["KeyS",49],["KeyX",50],["KeyD",51],["KeyC",52],
    ["KeyV",53],["KeyG",54],["KeyB",55],["KeyH",56],["KeyN",57],
    ["KeyJ",58],["KeyM",59],["Comma",60],["KeyL",61],
    ["Period",62],["Semicolon",63],["Slash",64]
  ]);
  constructor(synth,{onError=console.error,onNotesChanged=()=>{}}={}){
    this.synth=synth;this.onError=onError;this.onNotesChanged=onNotesChanged;this.pressed=new Set();this.tuningReference=440;
    this.keyDown=this.keyDown.bind(this);this.keyUp=this.keyUp.bind(this);
    this.releaseAll=this.releaseAll.bind(this);this.onVisibility=this.onVisibility.bind(this);
  }
  setTuningReference(hz){this.tuningReference=hz;this.synth.retuneNotes(hz);}
  start(){
    window.addEventListener("keydown",this.keyDown);
    window.addEventListener("keyup",this.keyUp);
    window.addEventListener("blur",this.releaseAll);
    document.addEventListener("visibilitychange",this.onVisibility);
    return this;
  }
  isTyping(target){
    if(!(target instanceof HTMLElement))return false;
    // Range controls must not suppress the musical keyboard after a click.
    if(target instanceof HTMLInputElement && target.type==="range")return false;
    return target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(target.tagName);
  }
  keyDown(event){
    const note=KeyboardSystem.KEY_NOTES.get(event.code);
    if(note===undefined||event.repeat||this.isTyping(event.target)||event.ctrlKey||event.altKey||event.metaKey)return;
    event.preventDefault();
    if(this.pressed.has(event.code))return;
    this.pressed.add(event.code);
    this.notifyNotes();
    this.synth.noteOn(event.code,FrequencySystem.midiToHz(note)*this.tuningReference/440,note).catch(this.onError);
  }
  keyUp(event){
    if(!this.pressed.has(event.code))return;
    event.preventDefault();this.pressed.delete(event.code);
    this.synth.noteOff(event.code);
    this.notifyNotes();
  }
  onVisibility(){if(document.hidden)this.releaseAll();}
  releaseAll(){this.pressed.clear();this.synth.releaseAllNotes();this.notifyNotes();}
  notifyNotes(){this.onNotesChanged([...this.pressed].map(code=>KeyboardSystem.KEY_NOTES.get(code)));}
  stop(){
    this.releaseAll();
    window.removeEventListener("keydown",this.keyDown);
    window.removeEventListener("keyup",this.keyUp);
    window.removeEventListener("blur",this.releaseAll);
    document.removeEventListener("visibilitychange",this.onVisibility);
  }
}
