# Web technologies

Web Technologies is available in desktop, tablet and mobile launchers.

- WebAssemblySystem loads the existing text-layout.wasm module through TextProcessor and uses its layout_text export to position vector glyphs. A JavaScript layout path is used if loading or instantiation fails. It is not a WASM audio DSP engine.
- WebGPUSystem obtains an adapter and device and renders live audio sample vertices using a WGSL line-strip pipeline. It checks actual initialization, handles null adapters and device loss, and releases buffers, context and device on disposal. Rendering is visual; no GPU audio processing is claimed.
- VectorGraphicsSystem renders a scalable SVG waveform and vector text geometry. SVG also underlies the shared icon system. SVG takes over when WebGPU is unavailable.
- Web Audio uses the existing shared AudioEngineSystem/AudioProcessingSystem, including analyser, gain, filter and compressor, and the existing offline WAV renderer. Audio activation occurs through the Enable shared audio engine or Transport controls. No automatic microphone permission or duplicate AudioContext is introduced.

The waveform displays studio output, not microphone input. Rendering is suspended visually for hidden tools, and animation resources are disposed when closing. Existing text-renderer.js remains the earlier text-page renderer; WebGPUSystem is the main studio waveform renderer.

References: https://www.w3.org/TR/webgpu/ · https://www.w3.org/TR/SVG/ · https://webassembly.org/getting-started/js-api/
