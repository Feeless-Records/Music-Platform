export const platform=Object.freeze({
 name:"Feeless Records Music Platform",
 workspaces:Object.freeze([
  Object.freeze({id:"audio-editor",name:"Audio Editor",status:"planned",description:"Edit recordings, prepare samples, and finish audio files.",capabilities:["Waveform editing","Trim, split and fade","Sample processing","Audio export"]}),
  Object.freeze({id:"dj",name:"DJ Workspace",status:"planned",description:"Prepare and perform mixes with a dedicated DJ workspace.",capabilities:["Decks and cue points","Tempo and beat alignment","Crossfader and EQ","Mix recording"]}),
  Object.freeze({id:"daw",name:"Digital Audio Workstation",status:"prototype",href:"./desktop.html",description:"Compose and arrange music using the desktop studio.",capabilities:["Channel Rack patterns","Transport and looping","Synth playback and MIDI","Offline WAV rendering"]}),
  Object.freeze({id:"radio",name:"Radio Workspace",status:"planned",description:"Prepare programmes, manage a radio schedule, and coordinate broadcasts.",capabilities:["Programme playlists","Broadcast scheduling","Live and recorded shows","Stream management"]}),
  Object.freeze({id:"music",name:"Music Workspace",status:"planned",description:"Organize, discover, and listen to your music collection.",capabilities:["Music library and collections","Tracks, artists and releases","Playlists and listening queue","Metadata and search"]}),
  Object.freeze({id:"record-label",name:"Record Label Workspace",status:"planned",description:"Coordinate label artists, releases, distribution, and promotion.",capabilities:["Artist and catalogue management","Release planning and distribution","Rights, credits and royalties","Promotion and label operations"]}),
  Object.freeze({id:"events",name:"Event Organization Workspace",status:"planned",description:"Plan and coordinate festivals, parties, gigs, and other live events.",eventTypes:["Festival","Party","Gig","Concert","Club night","Other live event"],capabilities:["Event calendar and production plans","Lineups, bookings and timetables","Venues, stages and crew","Ticketing, budgets and promotion"]})
 ])
});
