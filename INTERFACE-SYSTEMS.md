# Mobile, tablet and desktop interface systems
Implemented in Music-Platform, 2026-10-19.

| Class | Presentation |
| --- | --- |
| MobileSystem | Single active full-screen tool, horizontally scrollable tool launcher and bottom task navigation |
| TabletSystem | Two active panes; side by side in landscape and stacked in portrait |
| DesktopSystem | Floating windows with drag, resize, minimize, maximize, close and taskbar restoration |
| WindowSystem | Desktop window geometry, focus, stacking and lifecycle |
| PanelSystem | Touch-interface pane visibility, active tool and close lifecycle |
| StudioSystem | Shared studio shell and tool content |
| InterfaceSystem | Automatic/manual interface selection and transition coordination |

## Entry point
desktop.html is now the adaptive studio workspace. It remains reachable from the platform's DAW prototype link.
The header Layout selector offers Auto, Mobile, Tablet and Desktop for testing and user choice.
Automatic selection follows the responsive viewport profile; hardware/browser identity does not lock the interface.
The front-page catalogue follows the same responsive profiles (one/two/three columns).

## Shared state
InterfaceSystem owns one StudioCore. Changing presentation does not replace the project, pattern notes, sequencer or audio engine.
The open-tool list and active tool are carried into the next layout.
Transport-panel subscriptions are released when the old UI is removed and reattached by the new panel.
Playback may continue across layout changes. Page hide pauses playback; it does not automatically resume audio.
A closed tool can be reopened from the launcher. Closing all tools leaves the launcher available.
Layout choice is held in memory and is not automatically saved to browser storage.

## Orientation and touch
Tablet portrait uses stacked panes; landscape uses columns.
Mobile supports portrait/landscape as one pane and can scroll wide editors horizontally.
Touch interfaces have larger step controls. Mobile safe-area padding leaves space for system navigation.
Desktop windows stay within the workspace after resize; existing keyboard move/resize controls are retained.
The mobile and tablet systems do not create floating desktop windows.
No Microsoft Windows operating-system dependency is introduced.

## Scope
The shared shell currently hosts the DAW prototype's tools.
Other platform workspaces remain at their documented implementation status.
These are browser interface systems, not native operating systems.


## Icon systems
IconSystem provides a shared local SVG registry for all interface launchers and tool tabs. Every icon retains a visible text label and is decorative to assistive technology.
DesktopIconSystem is a separate desktop-only shortcut surface built on that vocabulary. Single click, Enter, or Space opens or restores the corresponding WindowSystem window. It does not own windows or project state. Mobile and tablet use their existing tool launchers and tabs, without desktop shortcuts.

## Android-inspired mobile shell
Mobile opens on a home screen with a local clock and labelled studio app icons. Back follows the previously opened tools, Home returns to the launcher, and Recent apps lists open tools. Navigation changes presentation without stopping audio or replacing project state. This is a browser interface, not an Android emulator; system permissions and notifications remain browser-managed.
