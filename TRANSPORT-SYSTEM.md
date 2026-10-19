# Transport, audio processing and rendering
Implemented 2026-10-19.

## Composition
StudioCore.transportController is the application controller.
StudioCore.workflow.transport remains its shared beat clock.
AudioEngineSystem owns one lazily-created AudioContext per StudioCore.
AudioSystem sample audition, SimpleSynth live voices and transport SoundSystem use that context and feed the common processing input on the front page.
The desktop has its own StudioCore/audio engine because it is a separate page.

Signal path:
sources → input → low-pass filter → dynamics compressor → output gain → analyser → destination.
The existing front-page master-volume system follows this chain when attached.
The compressor reduces dynamics; it does not guarantee a clipping-free output.

## Controller API
- play(): resumes the engine on user interaction and starts a 25 ms scheduling pump with 120 ms audio lookahead.
- pause(): retains beat position, cancels queued voices, terminates audition sources and stops the scheduling timer.
- stop(): cancels playback and auditions and resets position to zero.
- seek(beat): cancels scheduled voices and resumes from that beat when already playing.
- setTempo(bpm): validates 20–300 BPM, preserves current musical position, and replaces pending notes under the new tempo.
- configure({length,loop}): sets loop/end region (0.25–256 beats), resetting playback.
- render(options): snapshots current sequencer notes, tempo and processing settings and returns an AudioBuffer. Does not change live playback.
- renderer.toWav(buffer): encodes a downloadable 16-bit PCM mono/stereo WAV.
- subscribe(handler): state updates for UI. Returned callback unsubscribes.
- dispose(): stops playback, removes listeners and closes the owned audio engine.

## Offline render
AudioRenderingSystem uses OfflineAudioContext, the same processing chain and SoundSystem envelope as live sequence playback.
Exports one selected beat range, not infinite looping. Defaults: 44.1 kHz stereo with 250 ms processing tail.
Limit: 120 seconds per render, sample rates 8–96 kHz, one or two channels.
Samples outside signed PCM range are clamped during WAV encoding.

## Desktop test
Open Desktop mockup → Channel rack and activate steps.
Open Transport → Play. Pause/Stop, position, tempo, loop, output and cutoff are adjustable.
Render WAV builds the current pattern once and exposes a Download rendered WAV link.
All current rack channels are saw-oscillator notes; channel names do not imply drum synthesis.
Panel close leaves playback under controller ownership; reopen Transport to control it. Page hide pauses playback.
The illustration in Arrangement is not used as audio input.
Background tabs may throttle JavaScript scheduling. This is a browser prototype, not a native real-time audio engine.

## Boundaries
This pass renders synth-note patterns. Imported audio clips, tracker effects, arrangement/session playback, automation binding, multi-bus mixer routing, recording, plug-in hosting and time-stretch DSP are separate integration work.
Auditioned sample/live-keyboard voices are not recorded into exports.
Processing and pattern changes remain in memory; existing project serialization does not yet persist the complete workflow/controller state.

## API reference
https://www.w3.org/TR/webaudio-1.0/
https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext
https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext/startRendering
