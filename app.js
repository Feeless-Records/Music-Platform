import {BrowserApp} from "./browser-app.js?v=environment-1";
import {AnimationSystem} from "./systems/animation.js";
import {LayoutSystem} from "./systems/layout.js";
import {ThemeSystem} from "./systems/theme.js";
import {TextSystem} from "./systems/text-system.js";
import {AudioSystem} from "./systems/audio.js?v=transport-3";
import {SimpleSynth} from "./systems/simple-synth.js?v=transport-3";
import {FFTAnalyzer} from "./systems/fft-analyzer.js";
import {StudioCore} from "./systems/studio-core.js?v=transport-3";
import {KeyboardSystem} from "./systems/keyboard.js";
import {ChordSystem} from "./systems/chord.js";
import {MIDISystem} from "./systems/midi.js";
import {MasterVolumeSystem,MasterVolumeKnob} from "./systems/master-volume.js";
class AudioStudioApp {
  constructor(){
    this.browser=new BrowserApp();
    this.core=new StudioCore({bpm:120});
    this.theme=new ThemeSystem();
    this.master=new MasterVolumeSystem(100);
    this.core.transportController.engine.master=this.master;
    this.audio=new AudioSystem("./Perkele!.wav",this.master,this.core.transportController.engine);
    this.saw=new SimpleSynth(this.master,this.core.transportController.engine);
    this.chords=new ChordSystem();
    this.keyboard=new KeyboardSystem(this.saw,{onError:error=>{this.status.textContent="Keyboard audio error: "+error.message;},onNotesChanged:notes=>{this.keyboardNotes=notes;this.updateChord();}});
    this.midiNotes=[];
    this.keyboardNotes=[];
    this.midi=new MIDISystem(this.saw,{onNotesChanged:notes=>{this.midiNotes=notes;this.updateChord();},onStatus:state=>{this.midiStatus=state;this.updateMIDIStatus();},onDevicesChanged:devices=>this.renderMIDIDevices(devices),onError:error=>console.warn("MIDI:",error)});
    this.layout=new LayoutSystem(document.querySelector("#app"));
    this.animation=new AnimationSystem(document.querySelector(".fly-track"));
    this.text=new TextSystem(document.querySelector("#flying"));
    this.label=document.querySelector("#flying-label");
    this.status=document.querySelector("#status");
    this.message="Saatana! Perkele!";
  }
  async start(){
    this.browser.start();
    this.theme.apply("dark");
    const controls=this.layout.renderWelcome("FEELESS DAW","Welcome to Feeless Records Audio Studio.");
    this.masterKnob=new MasterVolumeKnob(controls.masterKnob,controls.masterValue,this.master).start();
    this.startButton=controls.startButton;
    this.simpleSynthButton=controls.simpleSynthButton;
    this.frequencySlider=controls.frequencySlider;
    this.frequencyValue=controls.frequencyValue;
    this.chordField=controls.chordField;
    this.midiDeviceStatus=controls.midiStatus;
    this.midiInputsList=controls.midiInputs;
    this.midiOutputsList=controls.midiOutputs;
    this.renderMIDIDevices({inputs:[],outputs:[]});
    this.updateMIDIStatus();
    this.quintButton=controls.quintButton;
    this.quintButton.addEventListener("click",()=>this.toggleQuintCircle());
    this.updateChord([]);
    this.fft=new FFTAnalyzer(controls.fftCanvas,[this.saw,this.audio]);
    this.fft.start();
    this.startButton.addEventListener("click",()=>this.playSound(this.startButton));
    this.configureSaw();
    this.keyboard.start();
    this.midi.start();
    this.label.textContent=this.message;
    this.animation.start();
    window.addEventListener("pagehide",()=>this.stop());
    window.addEventListener("pageshow",event=>{if(event.persisted)this.resume();});
    try{
      await this.text.initialize();
      const result=await this.text.render(this.message);
      this.label.hidden=true;
      this.status.textContent="WASM + "+result.backend+" vector renderer + shared animation";
    }catch(error){
      this.status.textContent="HTML fallback + shared animation: "+error.message;
      console.error(error);
    }

  }
  updateMIDIStatus(){if(this.midiDeviceStatus)this.midiDeviceStatus.textContent=this.midiStatus||"Checking MIDI access…";}
  renderMIDIDevices(devices){
    if(!this.midiInputsList||!this.midiOutputsList)return;
    const render=(list,ports)=>{
      list.replaceChildren();
      if(!ports.length){const item=document.createElement("li");item.textContent="No devices detected";list.append(item);return;}
      for(const port of ports){
        const item=document.createElement("li");
        const name=document.createElement("strong");name.textContent=port.name;
        const detail=document.createElement("small");detail.textContent=[port.manufacturer,port.state,port.connection].filter(Boolean).join(" · ");
        item.append(name,detail);list.append(item);
      }
    };
    render(this.midiInputsList,devices.inputs);
    render(this.midiOutputsList,devices.outputs);
  }
  toggleQuintCircle(){
    if(!this.quintCircle){
      this.quintCircle=document.createElement("img");
      this.quintCircle.id="quintCircle";
      this.quintCircle.src="./quint-circle.jpg";
      this.quintCircle.alt="Квинтовый круг: мажорные и минорные тональности";
      this.quintCircle.hidden=true;
      document.body.append(this.quintCircle);
    }
    this.quintCircle.hidden=!this.quintCircle.hidden;
    const visible=!this.quintCircle.hidden;
    this.quintButton.setAttribute("aria-pressed",String(visible));
    this.quintButton.textContent=visible?"Hide quint circle":"Show quint circle";
  }
  updateChord(notes=this.keyboardNotes){
    this.keyboardNotes=notes;
    notes=[...notes,...this.midiNotes];
    if(!this.chordField)return;
    const result=this.chords.describe(notes);
    this.chordField.textContent="Аккорд: "+result.chord+" | "+result.notes;
  }
  configureSaw(){
    const button=this.simpleSynthButton;
    const release=()=>this.releaseSaw();
    button.addEventListener("pointerdown",event=>{
      if(event.button!==0||this.saw.held)return;
      event.preventDefault();button.setPointerCapture(event.pointerId);
      this.pressSaw();
    });
    button.addEventListener("pointerup",release);
    button.addEventListener("pointercancel",release);
    button.addEventListener("lostpointercapture",release);
    button.addEventListener("keydown",event=>{
      if((event.code==="Space"||event.code==="Enter")&&!event.repeat){
        event.preventDefault();this.pressSaw();
      }
    });
    button.addEventListener("keyup",event=>{
      if(event.code==="Space"||event.code==="Enter"){event.preventDefault();release();}
    });
    window.addEventListener("blur",release);
    document.addEventListener("visibilitychange",()=>{if(document.hidden)release();});
    this.frequencySlider.addEventListener("input",()=>this.updateFrequency());
    this.frequencySlider.addEventListener("dblclick",()=>this.resetFrequency());
    this.updateFrequency();
  }
  resetFrequency(){
    this.frequencySlider.value=String(Math.round(1000*Math.log(440/20)/Math.log(1000)));
    this.updateFrequency();
  }
  updateFrequency(){
    const position=Number(this.frequencySlider.value)/1000;
    const frequency=Math.round(20*Math.pow(1000,position));
    this.saw.setFrequency(frequency);
    this.keyboard.setTuningReference(frequency);
    this.midi.setTuningReference(frequency);
    this.frequencyValue.textContent=frequency.toLocaleString("ru-RU")+" Hz";
  }
  async pressSaw(){
    this.simpleSynthButton.classList.add("is-playing");
    this.simpleSynthButton.setAttribute("aria-pressed","true");
    try{await this.saw.press();}
    catch(error){this.status.textContent="Saw audio error: "+error.message;this.releaseSaw();}
  }
  releaseSaw(){
    this.saw.release();
    this.simpleSynthButton.classList.remove("is-playing");
    this.simpleSynthButton.setAttribute("aria-pressed","false");
  }
  async playSound(button){
    if(this.audio.playing)return;
    button.classList.add("is-playing");
    button.setAttribute("aria-pressed","true");
    button.disabled=true;
    try{await this.audio.play();}
    catch(error){console.error(error);this.status.textContent="Audio error: "+error.message;}
    finally{
      button.classList.remove("is-playing");
      button.setAttribute("aria-pressed","false");
      button.disabled=false;
    }
  }
  resume(){this.masterKnob?.start();this.browser.start();this.keyboard.start();this.midi.start();this.animation.start();this.fft?.start();}
  stop(){this.core?.transportController.stop();this.masterKnob?.stop();this.audio.stop();this.browser.stop();this.keyboard.stop();this.midi.stop();this.releaseSaw();this.animation.stop();this.fft?.stop();}
}
new AudioStudioApp().start();
