# Music Platform Companion 0.1.0
Permission-free toolbar launcher. Links open the website, studio, Recording, Transport, Channel Rack, or Systems in a new tab. No background worker, content script, microphone capture, tab reading, tracking, storage, or remotely executed code. Normal website requests occur after the user clicks a link.

## Build
Run `node extensions/build.mjs` from the repository root. Requires Node.js and the system ZIP command. Common source is in common/. The build creates icons, three build/ directories with manifests at their root, and downloadable ZIPs under downloads/. Generated build/ directories are intentionally excluded from git; downloads and common assets are tracked for GitHub Pages.

## Browser targets
- Chromium desktop: Chrome, Edge, Brave, Opera, Vivaldi and Chromium. Manifest V3. Load extracted folder through the browser's Developer mode / Load unpacked workflow.
- Firefox desktop 142+: separate Manifest V3 manifest with a stable Gecko ID and no-data-collection declaration. Use about:debugging for temporary development installation. Normal release installation requires Mozilla signing.
- Safari: conversion source, not an installable Safari extension. Requires macOS, Xcode conversion/packaging, compatibility review and signing. No Safari app has been built on this Linux host.
- Other WebExtensions browsers may work but are not claimed as tested. Legacy browsers without compatible APIs are not targeted. Mobile variants are not yet offered.

The 0.1.0 artifacts are development builds, not store listings. No browser has approved these builds yet. Cross-browser real installation tests remain pending.

## Publication
Use each browser's official publisher account, submit the matching package, privacy statement and screenshots, and satisfy its review. Safari additionally needs a containing app. Add verified store URLs to the website only after approval. Do not suggest the development ZIP is a one-click installation. Developer loads have no store automatic-update channel.

## References
- https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings
- https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/
- https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari
- https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/port-chrome-extension
- https://help.opera.com/en/extensions/
- https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave
- https://help.vivaldi.com/desktop/appearance-customization/extensions/
