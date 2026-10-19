# Import, export and audio encoding

ImportSystem decodes browser-supported audio (maximum 25 MiB and 120 seconds) into session assets. Originals are retained for conversion; decodeAudioData resamples to the shared context rate. Imported audio is not placed on the arrangement or sequencer automatically.

ExportSystem writes a versioned pattern-project JSON containing the current four-beat pattern, tempo and project name. Import validates all fields before replacing that pattern and tempo. Recordings, media assets and other workspaces are not embedded in the JSON.

AudioEncodingSystem converts files, recording takes or the rendered Channel Rack pattern to mono/stereo at 44.1, 48 or 96 kHz. WAV encodes offline as 16/24-bit signed PCM or 32-bit IEEE float. Supported WebM/Opus, Ogg/Opus and MP4/AAC formats are detected through MediaRecorder.isTypeSupported. Compressed conversion uses a buffer source connected only to a MediaStreamAudioDestinationNode, not speakers or microphone, and takes real time. Encoding can be cancelled; closing the tool cancels its current encoder job. Compressed PCM feed is 48 kHz; native output sample rate and bitrate remain browser/codec-controlled. WAV sample-rate selection applies only to WAV. Browser bitrate is a hint, not a guarantee. MP3/FLAC encoding, multitrack arrangement import and full project archive interchange remain future work.

Downloads are local Blob URLs. No uploads occur. Imported files and encoded downloads are session-only; download what you need before reloading. Pattern edits participate in existing optional studio storage.

References: https://www.w3.org/TR/webaudio-1.0/ · https://www.w3.org/TR/mediastream-recording/
