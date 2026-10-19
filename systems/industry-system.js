// Domain map, not a claim that every industry workflow is implemented.
export const INDUSTRY_DOMAINS=Object.freeze([
 {
  "id": "audio",
  "name": "Audio engineering",
  "systems": [
   {
    "id": "audio.audio-recording",
    "name": "Audio recording",
    "status": "prototype",
    "tool": "recording"
   },
   {
    "id": "audio.input-and-device-routing",
    "name": "Input and device routing",
    "status": "planned"
   },
   {
    "id": "audio.multitrack-capture",
    "name": "Multitrack capture",
    "status": "planned"
   },
   {
    "id": "audio.audio-editing",
    "name": "Audio editing",
    "status": "planned"
   },
   {
    "id": "audio.sampling",
    "name": "Sampling",
    "status": "planned"
   },
   {
    "id": "audio.synthesis",
    "name": "Synthesis",
    "status": "planned"
   },
   {
    "id": "audio.effects-processing",
    "name": "Effects processing",
    "status": "prototype",
    "tool": "transport"
   },
   {
    "id": "audio.mixing",
    "name": "Mixing",
    "status": "planned"
   },
   {
    "id": "audio.mastering",
    "name": "Mastering",
    "status": "planned"
   },
   {
    "id": "audio.metering-and-loudness",
    "name": "Metering and loudness",
    "status": "planned"
   },
   {
    "id": "audio.audio-restoration",
    "name": "Audio restoration",
    "status": "planned"
   },
   {
    "id": "audio.spatial-audio",
    "name": "Spatial audio",
    "status": "planned"
   },
   {
    "id": "audio.audio-rendering",
    "name": "Audio rendering",
    "status": "prototype",
    "tool": "transport"
   },
   {
    "id": "audio.encoding-and-transcoding",
    "name": "Encoding and transcoding",
    "status": "planned"
   }
  ]
 },
 {
  "id": "music",
  "name": "Music creation",
  "systems": [
   {
    "id": "music.composition",
    "name": "Composition",
    "status": "planned"
   },
   {
    "id": "music.music-theory",
    "name": "Music theory",
    "status": "planned"
   },
   {
    "id": "music.notation-and-scores",
    "name": "Notation and scores",
    "status": "planned"
   },
   {
    "id": "music.midi-and-controllers",
    "name": "MIDI and controllers",
    "status": "planned"
   },
   {
    "id": "music.sequencing",
    "name": "Sequencing",
    "status": "prototype",
    "tool": "rack"
   },
   {
    "id": "music.patterns-and-piano-roll",
    "name": "Patterns and piano roll",
    "status": "prototype",
    "tool": "rack"
   },
   {
    "id": "music.arrangement",
    "name": "Arrangement",
    "status": "planned"
   },
   {
    "id": "music.automation",
    "name": "Automation",
    "status": "planned"
   },
   {
    "id": "music.instrument-management",
    "name": "Instrument management",
    "status": "planned"
   },
   {
    "id": "music.presets-and-sound-design",
    "name": "Presets and sound design",
    "status": "planned"
   }
  ]
 },
 {
  "id": "performance",
  "name": "Live performance and DJ",
  "systems": [
   {
    "id": "performance.dj-decks",
    "name": "DJ decks",
    "status": "planned"
   },
   {
    "id": "performance.beat-analysis-and-sync",
    "name": "Beat analysis and sync",
    "status": "planned"
   },
   {
    "id": "performance.cue-and-loop-management",
    "name": "Cue and loop management",
    "status": "planned"
   },
   {
    "id": "performance.dj-mix-recording",
    "name": "DJ mix recording",
    "status": "planned"
   },
   {
    "id": "performance.live-set-management",
    "name": "Live set management",
    "status": "planned"
   },
   {
    "id": "performance.stage-playback",
    "name": "Stage playback",
    "status": "planned"
   },
   {
    "id": "performance.live-sound-routing",
    "name": "Live sound routing",
    "status": "planned"
   },
   {
    "id": "performance.show-control",
    "name": "Show control",
    "status": "planned"
   }
  ]
 },
 {
  "id": "broadcast",
  "name": "Radio and broadcasting",
  "systems": [
   {
    "id": "broadcast.radio-programme-planning",
    "name": "Radio programme planning",
    "status": "planned"
   },
   {
    "id": "broadcast.broadcast-scheduling",
    "name": "Broadcast scheduling",
    "status": "planned"
   },
   {
    "id": "broadcast.playout-and-automation",
    "name": "Playout and automation",
    "status": "planned"
   },
   {
    "id": "broadcast.live-streaming",
    "name": "Live streaming",
    "status": "planned"
   },
   {
    "id": "broadcast.podcast-production",
    "name": "Podcast production",
    "status": "planned"
   },
   {
    "id": "broadcast.broadcast-logging",
    "name": "Broadcast logging",
    "status": "planned"
   },
   {
    "id": "broadcast.stream-monitoring",
    "name": "Stream monitoring",
    "status": "planned"
   }
  ]
 },
 {
  "id": "catalogue",
  "name": "Music library and assets",
  "systems": [
   {
    "id": "catalogue.artists-and-contributors",
    "name": "Artists and contributors",
    "status": "planned"
   },
   {
    "id": "catalogue.tracks-and-works",
    "name": "Tracks and works",
    "status": "planned"
   },
   {
    "id": "catalogue.albums-and-releases",
    "name": "Albums and releases",
    "status": "planned"
   },
   {
    "id": "catalogue.playlists-and-collections",
    "name": "Playlists and collections",
    "status": "planned"
   },
   {
    "id": "catalogue.metadata-and-identifiers",
    "name": "Metadata and identifiers",
    "status": "planned"
   },
   {
    "id": "catalogue.media-asset-storage",
    "name": "Media asset storage",
    "status": "planned"
   },
   {
    "id": "catalogue.search-and-discovery",
    "name": "Search and discovery",
    "status": "planned"
   },
   {
    "id": "catalogue.archive-and-preservation",
    "name": "Archive and preservation",
    "status": "planned"
   }
  ]
 },
 {
  "id": "label",
  "name": "Record label and commerce",
  "systems": [
   {
    "id": "label.artist-management",
    "name": "Artist management",
    "status": "planned"
   },
   {
    "id": "label.release-planning",
    "name": "Release planning",
    "status": "planned"
   },
   {
    "id": "label.digital-distribution",
    "name": "Digital distribution",
    "status": "planned"
   },
   {
    "id": "label.physical-manufacturing",
    "name": "Physical manufacturing",
    "status": "planned"
   },
   {
    "id": "label.promotion-and-campaigns",
    "name": "Promotion and campaigns",
    "status": "planned"
   },
   {
    "id": "label.sales-and-merchandising",
    "name": "Sales and merchandising",
    "status": "planned"
   },
   {
    "id": "label.licensing",
    "name": "Licensing",
    "status": "planned"
   },
   {
    "id": "label.contracts",
    "name": "Contracts",
    "status": "planned"
   },
   {
    "id": "label.rights-and-ownership",
    "name": "Rights and ownership",
    "status": "planned"
   },
   {
    "id": "label.publishing",
    "name": "Publishing",
    "status": "planned"
   },
   {
    "id": "label.royalty-accounting",
    "name": "Royalty accounting",
    "status": "planned"
   },
   {
    "id": "label.statements-and-payments",
    "name": "Statements and payments",
    "status": "planned"
   }
  ]
 },
 {
  "id": "events",
  "name": "Events and festivals",
  "systems": [
   {
    "id": "events.event-planning",
    "name": "Event planning",
    "status": "planned"
   },
   {
    "id": "events.festival-and-party-production",
    "name": "Festival and party production",
    "status": "planned"
   },
   {
    "id": "events.artist-booking",
    "name": "Artist booking",
    "status": "planned"
   },
   {
    "id": "events.venue-and-stage-management",
    "name": "Venue and stage management",
    "status": "planned"
   },
   {
    "id": "events.lineups-and-timetables",
    "name": "Lineups and timetables",
    "status": "planned"
   },
   {
    "id": "events.crew-and-logistics",
    "name": "Crew and logistics",
    "status": "planned"
   },
   {
    "id": "events.technical-riders",
    "name": "Technical riders",
    "status": "planned"
   },
   {
    "id": "events.ticketing-and-access",
    "name": "Ticketing and access",
    "status": "planned"
   },
   {
    "id": "events.event-budgets",
    "name": "Event budgets",
    "status": "planned"
   },
   {
    "id": "events.event-safety-planning",
    "name": "Event safety planning",
    "status": "planned"
   }
  ]
 },
 {
  "id": "platform",
  "name": "Platform operations",
  "systems": [
   {
    "id": "platform.projects-and-sessions",
    "name": "Projects and sessions",
    "status": "prototype",
    "tool": "overview"
   },
   {
    "id": "platform.collaboration-and-versions",
    "name": "Collaboration and versions",
    "status": "planned"
   },
   {
    "id": "platform.import-and-export",
    "name": "Import and export",
    "status": "planned"
   },
   {
    "id": "platform.accessibility-and-localization",
    "name": "Accessibility and localization",
    "status": "planned"
   },
   {
    "id": "platform.device-and-browser-capabilities",
    "name": "Device and browser capabilities",
    "status": "planned"
   },
   {
    "id": "platform.permissions-and-consent",
    "name": "Permissions and consent",
    "status": "planned"
   },
   {
    "id": "platform.backup-and-recovery",
    "name": "Backup and recovery",
    "status": "planned"
   }
  ]
 }
].map(domain=>Object.freeze({...domain,systems:Object.freeze(domain.systems.map(Object.freeze))})));
export class IndustrySystem{
 constructor(){this.domains=INDUSTRY_DOMAINS;this.systems=new Map(this.domains.flatMap(domain=>domain.systems.map(system=>[system.id,system])));}
 get(id){const system=this.systems.get(id);if(!system)throw new TypeError("Unknown industry system: "+id);return system;}
 list({domain,status}={}){return this.domains.filter(item=>!domain||item.id===domain).flatMap(item=>item.systems).filter(item=>!status||item.status===status);}
}
