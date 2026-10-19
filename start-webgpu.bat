@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required to start the WebGPU local server.
  pause
  exit /b 1
)
start "" "http://localhost:4173"
node server.js
pause
