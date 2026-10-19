# Instrument and effects plugins

PluginSystem is a version-one registry of trusted, bundled JavaScript plugin factories. A definition has id, kind (instrument/effect), name, validated numeric parameter schemas, and create(). Duplicate IDs, unknown kinds and invalid values are rejected. It is separate from browser extensions. No remote loading, arbitrary file installation, native VST/AU binary hosting or WAM compatibility is claimed.

InstrumentSystem assigns a plugin and parameters to Kick, Snare, Hat and Bass. Four oscillator synth plugins (sawtooth, sine, triangle, square) expose level and transpose. Their factories return note()/stopAll() adapters over SoundSystem. Channel names are labels, not realistic drum emulations. Changes apply to newly scheduled notes.

EffectsSystem maintains up to eight ordered slots with bypass, parameter editing, movement and removal. Gain, low-pass and single-echo delay factories create Web Audio input/output nodes and a disposer. The live chain runs before existing master filter/compressor/gain. UI effect edits pause playback before reconnecting. Instrument and effect state is shared across desktop/tablet/mobile.

Transport uses instrument players and offline renders snapshot instrument/effect assignments. The same effect factories build an isolated OfflineAudioContext chain; delay tail time is included in the render. Pattern-project JSON and optional local studio saving retain plugin state. Older JSON without plugin settings remains accepted. Imported audio conversion does not apply the studio effect chain; the rendered pattern does. Closing the editor only releases subscriptions, not the shared instrument/effect settings.
