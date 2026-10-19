import {DocumentSystem} from "./document.js";
import {EventSystem} from "./event.js";
export class ProjectSystem {
  constructor({id="project-1",name="Audio Studio",bpm=120}={}){this.id=id;this.name=name;this.bpm=bpm;this.documents=new Map();this.events=new EventSystem();}
  addDocument(document){if(!(document instanceof DocumentSystem))throw new TypeError("DocumentSystem expected");this.documents.set(document.id,document);this.events.emit("document:added",document);return document;}
  getDocument(id){return this.documents.get(id)||null;}
  setTempo(bpm){if(!Number.isFinite(bpm)||bpm<=0)throw new RangeError("Tempo must be positive");this.bpm=bpm;this.events.emit("tempo:changed",bpm);}
  serialize(){return JSON.stringify({version:1,id:this.id,name:this.name,bpm:this.bpm,documents:[...this.documents.values()].map(d=>d.snapshot())});}
  static deserialize(json){const v=JSON.parse(json);const p=new ProjectSystem(v);for(const doc of v.documents||[])p.addDocument(DocumentSystem.fromJSON(doc));return p;}
}
