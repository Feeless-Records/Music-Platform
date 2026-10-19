@echo off
setlocal
cd /d "%~dp0"
if not exist "index.html" (
    echo ERROR: index.html was not found in %CD%
    pause
    exit /b 1
)
start "" "%CD%\index.html"
endlocal
