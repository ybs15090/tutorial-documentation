@echo off
chcp 65001 >nul
REM ============================================================
REM  日常 Chrome 启动器
REM  数据在 E:\APP\clash-VPN\normal-Chrome(经 C:\...\User Data 目录联接 Junction 指向它)
REM  本启动器只负责选择"是否走本地 Clash 代理(127.0.0.1:7897)"
REM  注意:不带 --user-data-dir,沿用默认路径(=Junction=E 盘),与普通图标共用同一实例锁
REM ============================================================

set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" ( echo [ERROR] 找不到 chrome.exe,请修改本文件 CHROME 路径 & pause & exit /b 1 )

REM Chrome 已在运行 -> 代理选择对已存在进程无效(代理是进程级、启动时决定)
tasklist /fi "imagename eq chrome.exe" | find /i "chrome.exe" >nul
if not errorlevel 1 (
  echo [WARN] 检测到 Chrome 已在运行。
  echo   代理模式只在 Chrome "全新启动" 时生效。要切换模式,请先彻底退出所有 Chrome 窗口再运行本启动器。
  echo.
  pause
)

echo 启动日常 Chrome —— 选择代理模式:
echo   [1] 走本地 Clash 代理 (127.0.0.1:7897)   ^<- 默认(直接回车)
echo   [2] 不走代理(直连,不指定 Clash 端口)
echo.
set "MODE="
set /p "MODE=输入 1 或 2(回车=1): "
if "%MODE%"=="2" goto direct

:proxy
powershell -NoProfile -Command "if (Test-NetConnection 127.0.0.1 -Port 7897 -InformationLevel Quiet) { exit 0 } else { exit 1 }"
if errorlevel 1 ( echo [WARN] 127.0.0.1:7897 未在监听,Clash 可能没开,继续将无法上网。& pause )
echo 启动:走 Clash 代理 127.0.0.1:7897 ...
start "" "%CHROME%" --proxy-server="http://127.0.0.1:7897"
goto end

:direct
echo 启动:不走代理(直连)...
start "" "%CHROME%" --no-proxy-server
goto end

:end
