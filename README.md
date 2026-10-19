# Feeless Records Music Platform
Main development repository for the integrated Feeless Records music software platform.

## Product scope
| Workspace | Scope | Current status |
| --- | --- | --- |
| Audio Editor | Waveform editing, trimming, splitting, fades, sample processing and export | Planned |
| DJ Workspace | Decks, cue points, tempo/beat alignment, crossfader/EQ and mix recording | Planned |
| Digital Audio Workstation | Patterns, composition, sequencing, arrangement, synthesis, MIDI and rendering | Working prototype; partial integration |
| Radio Workspace | Programme playlists, scheduling, live/recorded shows and stream management | Planned |
| Music Workspace | Music library, tracks/artists/releases, playlists, listening queue, metadata and search | Planned |

## Entry points
- index.html loads index.js, which builds the platform entry page.
- platform-manifest.js declares the product name and workspace scope.
- desktop.html opens the DAW desktop prototype and its window system.
- audio-studio.html retains the existing audio-engine test page.

## Shared foundations
The imported Audio Studio foundation includes browser/device families, desktop/window management, StudioCore, workflow models, transport controller, audio processing, MIDI, synthesis and offline WAV export.
See TRANSPORT-SYSTEM.md, WORKFLOW-SYSTEMS.md and DEVICE-FAMILIES.md for implementation details and boundaries.
Current transport playback/rendering covers synth-note patterns. Arrangement/session playback, imported audio-clip editing and complete DJ processing are not yet implemented.

## Local development
Run `node server.js`, then open http://localhost:4173.
Run checks with `node --test tests/*.test.mjs`.

## Repository direction
Use this repository for future integrated platform work and finalization.
Feeless-Records/Audio-Studio remains the historical prototype reference.
The repository is public. GitHub Pages publishes main/root at https://feeless-records.github.io/Music-Platform/.

## Next integration areas
1. Shared project/workspace persistence and undo/redo.
2. Audio Editor buffer operations and waveform editor.
3. DJ dual-deck transport, cueing and mixing.
4. DAW arrangement/session scheduling, automation and mixer audio routing.
5. Cross-workspace media/library integration and export.

No complete DAW, DJ suite or audio editor is claimed at this stage.

Radio covers programme and broadcast operations. Music covers library organization and listening; editing, DJ performance and production remain in their dedicated workspaces. These workspace capabilities are planned and are not yet implemented.
