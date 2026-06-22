# Junction 迁移命令速查

> 执行前提：软件已关闭，数据已用 robocopy 搬到目标盘，原文件夹已删除。
> 完整流程见 [Junction迁移软件到其他磁盘.md](Junction迁移软件到其他磁盘.md)

目标盘根目录统一用 `E:\Moved\`，按需修改。

---

## 低风险（推荐优先迁移）

```cmd
REM VS Code 扩展（2.6 GB）
cmd /c mklink /J "%USERPROFILE%\.vscode\extensions" "E:\Moved\vscode-extensions"

REM VS Code 用户数据（1.9 GB）
cmd /c mklink /J "%APPDATA%\Code" "E:\Moved\vscode-data"

REM Android SDK（2.0 GB）
cmd /c mklink /J "%LOCALAPPDATA%\Android\Sdk" "E:\Moved\android-sdk"

REM JetBrains 工具箱（1.8 GB）
cmd /c mklink /J "%LOCALAPPDATA%\JetBrains" "E:\Moved\jetbrains"

REM npm 全局包（858 MB）
cmd /c mklink /J "%APPDATA%\npm" "E:\Moved\npm"

REM npm 缓存（597 MB）
cmd /c mklink /J "%LOCALAPPDATA%\npm-cache" "E:\Moved\npm-cache"

REM Playwright 浏览器（683 MB）
cmd /c mklink /J "%LOCALAPPDATA%\ms-playwright" "E:\Moved\ms-playwright"

REM PowerToys（990 MB）
cmd /c mklink /J "%LOCALAPPDATA%\PowerToys" "E:\Moved\powertoys"
```

---

## 中等风险（更新后检查一次链接是否还在）

```cmd
REM 迅雷（1.5 GB）
cmd /c mklink /J "%LOCALAPPDATA%\Thunder Network" "E:\Moved\thunder-network"

REM MathWorks / MATLAB（1.2 GB）
cmd /c mklink /J "%LOCALAPPDATA%\MathWorks" "E:\Moved\mathworks"

REM Opera（227 MB）
cmd /c mklink /J "%LOCALAPPDATA%\Opera Software" "E:\Moved\opera"

REM Ubisoft（116 MB）
cmd /c mklink /J "%LOCALAPPDATA%\Ubisoft Game Launcher" "E:\Moved\ubisoft"
```

---

## 验证所有链接

```cmd
REM 查看 AppData\Local 下的所有 Junction
cmd /c dir /a:l "%LOCALAPPDATA%"

REM 查看 AppData\Roaming 下的所有 Junction
cmd /c dir /a:l "%APPDATA%"

REM 查看用户根目录下的 Junction（含 .vscode）
cmd /c dir /a:l "%USERPROFILE%"
```

---

## 链接失效后修复（更新程序覆盖了 Junction）

```cmd
REM 以 VS Code 扩展为例，其他同理
REM 1. 删掉更新程序重建的普通文件夹（E 盘数据不受影响）
rmdir /s "%USERPROFILE%\.vscode\extensions"

REM 2. 重建 Junction
cmd /c mklink /J "%USERPROFILE%\.vscode\extensions" "E:\Moved\vscode-extensions"
```

---

## robocopy 搬迁模板（完整流程）

```cmd
REM 第一步：搬数据（以 VS Code 扩展为例）
robocopy "%USERPROFILE%\.vscode\extensions" "E:\Moved\vscode-extensions" /E /MOVE /R:0 /W:0

REM 第二步：删原文件夹
rmdir "%USERPROFILE%\.vscode\extensions"

REM 第三步：建 Junction
cmd /c mklink /J "%USERPROFILE%\.vscode\extensions" "E:\Moved\vscode-extensions"
```
