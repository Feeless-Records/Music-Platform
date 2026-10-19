export class RecordingPanel{
 constructor(recording){this.recording=recording;this.urls=[];}
 mount(root){
 const recording=this.recording;const doc=root.ownerDocument;this.root=root;root.classList.add("recording-panel");
 const heading=doc.createElement("h2");heading.textContent="Audio recording";
 const note=doc.createElement("p");note.textContent="Record microphone or audio-interface input. Start requests browser permission. Monitoring is off. Takes stay in this tab until downloaded; reloading loses unsaved takes. Export uses the browser’s supported audio format.";
 this.status=doc.createElement("output");this.status.setAttribute("aria-live","polite");
 const controls=doc.createElement("div");controls.className="transport-buttons";this.buttons={};
 for(const [label,action]of [["Start recording",()=>recording.start()],["Pause recording",()=>recording.pause()],["Resume recording",()=>recording.resume()],["Stop recording",()=>recording.stop()]]){
 const b=doc.createElement("button");b.type="button";b.textContent=label;b.addEventListener("click",async()=>{try{await action();}catch(error){this.status.textContent=error.message;}});this.buttons[label]=b;controls.append(b);}
 this.list=doc.createElement("div");root.append(heading,note,this.status,controls,this.list);this.unsubscribe=recording.subscribe(()=>this.render());return this;
 }
 render(){
 const r=this.recording;this.status.textContent=r.error??("Microphone: "+r.state+" · "+r.takes.length+" takes");
 this.buttons["Start recording"].disabled=!["idle","error"].includes(r.state);
 this.buttons["Pause recording"].disabled=r.state!=="recording";this.buttons["Resume recording"].disabled=r.state!=="paused";this.buttons["Stop recording"].disabled=!["requesting","recording","paused"].includes(r.state);
 for(const url of this.urls)URL.revokeObjectURL(url);this.urls=[];this.list.replaceChildren();
 for(const take of r.takes){const row=this.root.ownerDocument.createElement("div");row.className="recording-take";const title=this.root.ownerDocument.createElement("h3");title.textContent=take.name;const audio=this.root.ownerDocument.createElement("audio");audio.controls=true;const url=URL.createObjectURL(take.blob);this.urls.push(url);audio.src=url;const link=this.root.ownerDocument.createElement("a");link.href=url;link.download=take.id+(take.mime.includes("mp4")?".m4a":take.mime.includes("ogg")?".ogg":".webm");link.textContent="Download "+take.name;row.append(title,audio,link);this.list.append(row);}
 }
 dispose(){this.unsubscribe?.();for(const url of this.urls)URL.revokeObjectURL(url);this.urls=[];}
}
