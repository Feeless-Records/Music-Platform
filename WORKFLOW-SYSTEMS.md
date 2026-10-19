# Workflow systems — first implementation
Research date: 2026-10-19. Independent implementations of common music-production concepts; no vendor source code or project-file compatibility.

## Sources and scope
FL Studio: https://www.image-line.com/fl-studio-learning-content/fl-studio-online-manual/html/basics_workflow.htm
Mixer: https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/mixer.htm
Ableton Live 12: https://www.ableton.com/en/live-manual/12/live-concepts/
Session: https://www.ableton.com/en/live-manual/12/session-view/
Warp: https://www.ableton.com/en/live-manual/12/audio-clips-tempo-and-warping/
Tracker reference (Renoise, selected as a modern tracker specification): https://tutorials.renoise.com/wiki/Tracker_Interface
Effects: https://tutorials.renoise.com/wiki/Pattern_Effect_Commands

## Class registry
All are composed under StudioCore.workflow.
- PatternSystem (pattern.js): reusable patterns with beat length and notes.
- ChannelRackSystem (channel-rack.js): instruments, routing references, step entry.
- PianoRollSystem (piano-roll.js): beat/duration/MIDI/velocity note editing.
- ClipSystem (clip.js): pattern/audio clip definitions with loop metadata.
- ArrangementSystem (arrangement.js): independent clip placements on timeline tracks.
- MixerSystem (mixer.js): level/pan/mute, effect descriptors, cycle-safe routing model. Playlist tracks remain independent of mixer tracks.
- SessionSystem (session.js): track/scene slots, quantized launch queue and active clip state; one active clip per track.
- AutomationSystem (automation.js): sorted breakpoints with linear interpolation.
- WarpSystem (warp.js): monotonic beat/source-second marker mapping.
- TrackerSystem (tracker.js): row/track/note columns, note-off, instrument, volume, hexadecimal effect fields, LPB and pattern order.
- TransportSystem (transport.js): play/pause/seek/stop clock driven by supplied monotonic seconds.
- WorkflowSystem (workflow.js): composes these classes and compiles pattern MIDI notes for the existing sequencer.

## Reconciliation contract
Shared time is beats; seconds are calculated by the existing TimelineSystem.
MIDI notes are 0–127; velocity is 0–127. Tracker effect bytes are 00–FF.
Tracker notation follows the documented Renoise-style field structure; effect commands are stored and validated, not executed.
Step entry and piano-roll entry write the same PatternSystem note list.
StudioCore.loadPattern loads a selected pattern into the existing SequencingSystem; existing sound scheduling remains available through connectAudio/scheduleBars.
Workflow state is currently in memory. ProjectSystem.serialize still saves the existing document model only; workflow persistence/import will be a later step.
The classes are instantiated at startup, but this change adds no DAW editor windows or demo song and changes no existing tuning/control choices.

## Implementation boundaries
Session launch/transport advance are model operations, not a background sample-accurate scheduler.
Mixer routes/effect descriptors are not bound to Web Audio nodes.
Warp marker mapping does not stretch audio or implement proprietary warp algorithms.
Clip loop flags are metadata; arrangement playback/loop expansion is not yet connected.
No FLP/ALS/XRNS/MOD import, VST/AU hosting, recording, export, or collaboration engine is claimed.
Next adjustments can address editors, audio scheduling, persistence and DSP in that order.

## Transport integration update (2026-10-19)
TransportController now binds the beat-clock model to shared real-time audio scheduling and offline synth-pattern rendering. See TRANSPORT-SYSTEM.md for supported controls and remaining arrangement/clip boundaries.
