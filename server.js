// Zero-dependency local development server for WebGPU's secure localhost context.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const types = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".wasm": "application/wasm", ".wav": "audio/wav", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  if (!["systems/studio-system.js","systems/mobile-system.js","systems/tablet-system.js","systems/panel-system.js","systems/interface-system.js","browser-session.js","browser-system.js","browser-detection.js","browser-device.js","browser-properties.js","browser-orientation.js","browser-viewport.js","index.js","audio-studio.html","platform-manifest.js","systems/audio-engine.js","systems/audio-processing.js","systems/audio-rendering.js","systems/transport-controller.js","systems/transport-panel.js","desktop.html","desktop.css","desktop.js","systems/desktop-system.js","systems/window-system.js","systems/arrangement.js","systems/automation.js","systems/channel-rack.js","systems/clip.js","systems/mixer.js","systems/pattern.js","systems/piano-roll.js","systems/session.js","systems/tracker.js","systems/transport.js","systems/warp.js","systems/workflow-validation.js","systems/workflow.js","index.html", "app.js", "browser-app.js", "browser-cache.js", "browser-cookies.js", "browser-desktop.js", "browser-mobile.js", "browser-page.js", "browser-storage.js", "browser-tablet.js", "browser-window.js", "desktop-app.js", "desktop-landscape.js", "desktop-page.js", "desktop-portrait.js", "desktop-storage.js", "mobile-app.js", "mobile-landscape.js", "mobile-page.js", "mobile-portrait.js", "mobile-storage.js", "tablet-app.js", "tablet-landscape.js", "tablet-page.js", "tablet-portrait.js", "tablet-storage.js", "text-layout.wasm", "Perkele!.wav", "quint-circle.jpg", "systems/audio.js", "systems/master-volume.js", "systems/simple-synth.js", "systems/keyboard.js", "systems/midi.js", "systems/chord.js", "systems/fft-analyzer.js", "systems/animation.js", "systems/layout.js", "systems/theme.js", "systems/text-processor.js", "systems/text-renderer.js", "systems/text-system.js", "systems/event.js", "systems/document.js", "systems/project.js", "systems/timeline.js", "systems/sequencing.js", "systems/parametric.js", "systems/frequency.js", "systems/velocity.js", "systems/sound.js", "systems/sampling.js", "systems/studio-core.js"].includes(file)) {
    res.writeHead(404); res.end("Not found"); return;
  }
  fs.readFile(path.join(root, file), (err, contents) => {
    if (err) { res.writeHead(500); res.end("Read failed"); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(file)], "Cache-Control": "no-store" });
    res.end(contents);
  });
});
server.listen(4173, "127.0.0.1", () => console.log("Audio Studio: http://localhost:4173"));
