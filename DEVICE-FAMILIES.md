# Browser and device families
The 24 family filenames follow the UNY LIFE scaffold inspected on 19 October 2026.
The source files were comment-only placeholders; implementations here are newly written and business-neutral.

browser-app.js composes device selection, viewport observation and page layout. Audio Studio starts/stops it with its own lifecycle.
Mobile: classification dimension below 600 CSS pixels. Tablet: below 1024. Desktop: remaining viewports. Coarse pointers use the shorter viewport edge to preserve phone/tablet categories during rotation; fine pointers use width.
These are responsive UI categories, not hardware identification. Rotation and resizing re-evaluate the profile without recreating audio.
Each device has app, page, portrait, landscape and storage modules. Storage shares one caller-supplied namespace across devices; rotation does not partition data.
browser-storage.js, browser-cookies.js and browser-cache.js are opt-in utilities; startup writes no cookies, caches or preferences.
Storage handles unavailable/quota-blocked backends. No service worker or offline interception is installed.
All relative imports preserve deployment under /Audio-Studio/. Future business apps can reuse the modules without branding.

See BROWSER-ENVIRONMENT.md for independent device detection, viewport/orientation measurement, browser identity and browser capabilities. Legacy layout families are retained as responsive profiles, not hardware guarantees.
