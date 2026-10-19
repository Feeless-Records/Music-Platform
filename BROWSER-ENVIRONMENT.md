# Browser and viewport decomposition
Implemented in Music-Platform, 2026-10-19.

| Axis | Responsibility | Module |
| --- | --- | --- |
| Device | Inferred smartphone, tablet, desktop or unknown | browser-device.js / DeviceSystem |
| Responsive profile | Mobile, tablet or desktop layout by viewport/pointer rules | browser-mobile.js, browser-tablet.js, browser-desktop.js |
| Viewport | Layout width/height, visual viewport, offsets, scale, pixel ratio | browser-viewport.js / ViewportSystem |
| Orientation | Portrait/landscape of layout viewport; screen orientation separately | browser-orientation.js / OrientationSystem |
| Browser identity | Advisory name/version from low-entropy hints or UA | browser-detection.js / BrowserDetectionSystem |
| Browser properties | API presence, media/input/graphics/storage capabilities, network hint | browser-properties.js / BrowserPropertiesSystem |
| Composition | Browser environment inspection | browser-system.js / BrowserSystem |
| Page integration | Combines environment and responsive family; updates page attributes | browser-app.js / BrowserApp |
| Persistent key/value data | Explicit namespaced localStorage operations | browser-storage.js / createStorage |
| Temporary session data | Explicit namespaced sessionStorage operations | browser-session.js / BrowserSessionSystem |
| Resource cache | Explicit named Cache API operations | browser-cache.js / BrowserCacheSystem |
| Cookies | Explicit cookie read/write helpers | browser-cookies.js |

## Device/orientation matrix
Smartphone portrait, smartphone landscape, tablet portrait, tablet landscape, desktop portrait, desktop landscape.
Every combination can run different browsers. A narrow desktop window still has an inferred desktop device but uses a mobile layout profile.
Device detection is advisory, including tablets requesting desktop-mode pages. Unknown devices remain supported by responsive profiles.

## Browser properties
Storage: localStorage, sessionStorage, IndexedDB presence, quota-estimate and persistent-status APIs.
Cache: Cache API presence and service-worker API presence.
Input: primary pointer class, touch-point count and pointer-event API.
Media: Web Audio, offline rendering, MIDI and MediaRecorder APIs.
Graphics: WebGPU API and WebAssembly.
Context: secure-context flag, cookie-enabled report and online/offline hint.
Presence does not guarantee permission, quota, working hardware or successful use. Actual operations must handle failures.
Browser names do not enable/disable audio features. No rendering-engine identity is inferred from brand alone.
The online hint does not prove internet reachability.

## State contract
BrowserApp.state retains family/orientation/width/height for compatibility and adds:
- viewport: layout and visual viewport measurements.
- browser.identity: browser name/version and advisory source.
- browser.device: inferred family and confidence.
- browser.properties: capability snapshot.
Page attributes: data-viewport-profile, data-device-family, data-browser, data-orientation.
Legacy data-device remains the responsive profile for current CSS.
browser-window.js remains a compatibility adapter for viewport observation.

## Data handling
Inspection does not write cookies/storage, open databases/caches, register service workers, request MIDI/camera/microphone permission, or request high-entropy browser hints.
BrowserSystem.storageStatus() is an explicit read-only quota/persistence check and handles rejected calls.
Local/session/cache operations run only when explicitly called.
Cache API storage is separate from the browser-managed HTTP cache; this code cannot enumerate or clear the browser's global HTTP cache.
Use a Music-Platform-specific namespace (for example feeless-music-platform:v1); GitHub project sites share the same origin.
No automatic cache installation, offline mode or preference saving is introduced.

## References
https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent
https://developer.mozilla.org/en-US/docs/Web/API/StorageManager
https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
