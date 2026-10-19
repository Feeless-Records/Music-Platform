export class DocumentSystem {
  constructor({id="document-1",name="Untitled",tracks=[],metadata={}}={}){this.id=id;this.name=name;this.tracks=structuredClone(tracks);this.metadata={...metadata};this.version=1;}
  addTrack({id,name,events=[]}){if(this.tracks.some(t=>t.id===id))throw new Error("Duplicate track");this.tracks.push({id,name,events:[...events]});this.version++;return this;}
  addEvent(trackId,event){const track=this.tracks.find(t=>t.id===trackId);if(!track)throw new Error("Track not found");track.events.push({...event});this.version++;return this;}
  snapshot(){return {id:this.id,name:this.name,tracks:structuredClone(this.tracks),metadata:{...this.metadata},version:this.version};}
  static fromJSON(value){const doc=new DocumentSystem(value);doc.version=value.version||1;return doc;}
}
