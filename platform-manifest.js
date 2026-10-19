export const platform=Object.freeze({
 name:"Feeless Records Music Platform",
 workspaces:Object.freeze([
  Object.freeze({id:"audio-editor",name:"Audio Editor",status:"planned",description:"Edit recordings, prepare samples, and finish audio files.",capabilities:["Waveform editing","Trim, split and fade","Sample processing","Audio export"]}),
  Object.freeze({id:"dj",name:"DJ Workspace",status:"planned",description:"Prepare and perform mixes with a dedicated DJ workspace.",capabilities:["Decks and cue points","Tempo and beat alignment","Crossfader and EQ","Mix recording"]}),
  Object.freeze({id:"daw",name:"Digital Audio Workstation",status:"prototype",href:"./desktop.html",description:"Compose and arrange music using the desktop studio.",capabilities:["Channel Rack patterns","Transport and looping","Synth playback and MIDI","Offline WAV rendering"]})
 ])
});
