@echo off
REM ============================================================
REM  Clean-US Chrome launcher
REM  - isolated user-data-dir (separate from your everyday Chrome)
REM  - all traffic -> Clash inbound 127.0.0.1:7900 -> US ISP group
REM  After first launch, install two extensions in THIS profile only:
REM    1) WebRTC leak prevention (e.g. WebRTC Control) -> disable non-proxied UDP
REM    2) Timezone spoof -> set to America/New_York
REM  Note: Clash must be running; port 7900 is injected by profiles\Script.js,
REM        so you must "re-activate" the subscription in Clash Verge first.
REM ============================================================

set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" (
  echo [ERROR] chrome.exe not found. Edit the CHROME path in this file.
  pause
  exit /b 1
)

REM Check that Clash inbound 7900 is listening
powershell -NoProfile -Command "if (Test-NetConnection 127.0.0.1 -Port 7900 -InformationLevel Quiet) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  echo [WARN] 127.0.0.1:7900 is NOT listening.
  echo   Re-activate the subscription in Clash Verge and reload the core first,
  echo   otherwise this browser cannot reach the internet ^(proxy refused^).
  echo.
  pause
  exit /b 1
)

echo Launching Clean-US Chrome ^(isolated profile, via 127.0.0.1:7900^) ...
start "" "%CHROME%" --user-data-dir="E:\APP\clash-VPN\clean-us-profile" --proxy-server="http://127.0.0.1:7900" --lang=en-US --no-first-run --no-default-browser-check
timeout /t 2 >nul
