# Audio, sound and music systems

IndustrySystem is the explicit domain catalog spanning engineering, creation, performance, broadcasting, assets, label business, events and platform operations. Catalog entries are specifications, not empty executable implementations. Planned workflows remain labelled planned; prototype links identify narrow available capabilities. This is a broad extensible baseline, not an exhaustive claim about every industry.

## AudioRecordingSystem
Start explicitly requests microphone permission using getUserMedia. MediaRecorder chooses a supported browser codec. Pause, resume and stop preserve a take; stop releases all microphone tracks. Pending requests can be cancelled, and late streams are immediately released. There is no microphone monitoring or automatic upload. Takes are session memory, shared across interface switches; download before reload. This first version is microphone/audio-interface input capture, not multitrack, system audio, mix-bus capture or WAV recording. Playback is through a separate browser audio element. Closing the Recording tool does not stop an active take; use Stop or leave the page. Leaving stops capture.

Specification: https://www.w3.org/TR/mediastream-recording/
