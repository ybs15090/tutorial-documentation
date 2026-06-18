# C 盘可清理文件清单

> 生成时间：2026-06-17  
> **警告：请逐项核对后再手动删除，本文件仅供参考，不要盲目清理全部条目。**

---

## 总览（可节省空间估算）

| 类别 | 路径/说明 | 预估大小 | 安全性 |
|------|-----------|----------|--------|
| 用户临时文件 | `%TEMP%` | 123 MB | 安全 |
| JetBrains Transient | ReSharper 临时数据 | 414 MB | 安全 |
| PyCharm 缓存子目录 | caches / log / jcef_cache | ~430 MB | 安全 |
| Gradle 构建缓存 | `~/.gradle/caches` | 1.10 GB | 安全，可重建 |
| Gradle Wrapper 分发包 | `~/.gradle/wrapper` | 146 MB | 删后重新下载 |
| VSCode 缓存数据 | CachedData / logs | ~98 MB | 安全 |
| Windows 日志 | `C:\Windows\Logs` | 54 MB | 安全 |
| 缩略图缓存 | Explorer thumbcache | 8.6 MB | 安全 |
| 错误报告归档 | WER ReportArchive | 82 KB | 安全 |
| **休眠文件** | `C:\hiberfil.sys` | **6.32 GB** | 见说明 |

**保守估算可清理：约 2.5 GB**  
**如禁用休眠，额外节省：6.32 GB**

---

## 一、系统临时文件（可直接删除）

### 1.1 用户临时文件夹

- **路径**：`C:\Users\ybs15\AppData\Local\Temp`
- **文件数**：618 个
- **大小**：123.34 MB
- **说明**：直接删除目录内所有文件和子文件夹。正在运行的程序可能占用部分文件，提示"无法删除"时跳过即可。

### 1.2 Windows 系统临时文件夹

- **路径**：`C:\Windows\Temp`
- **当前状态**：已为空（0 文件），无需处理

---

## 二、Windows 系统缓存

### 2.1 Windows Update 下载缓存

- **路径**：`C:\Windows\SoftwareDistribution\Download`
- **大小**：11 KB（当前几乎为空）
- **说明**：确认近期系统更新已完成后可删除。清理前需先停止 Windows Update 服务（`net stop wuauserv`），删除后再启动（`net start wuauserv`）。

### 2.2 Windows 错误报告归档

- **路径**：`C:\ProgramData\Microsoft\Windows\WER\ReportArchive`
- **文件数**：3 个
- **大小**：82 KB
- **说明**：旧版崩溃报告，可安全删除。

### 2.3 缩略图缓存

- **路径**：`C:\Users\ybs15\AppData\Local\Microsoft\Windows\Explorer`
- **文件**：`thumbcache_*.db` 和 `iconcache_*.db` 文件
- **大小**：8.62 MB（共 33 个文件）
- **说明**：关闭资源管理器后可删除 `.db` 文件，Windows 会自动重建。

### 2.4 Windows 系统日志

- **路径**：`C:\Windows\Logs`
- **文件数**：445 个
- **大小**：53.93 MB
- **子目录重点**：
  - `C:\Windows\Logs\CBS\` — 13.58 MB，组件存储日志，可删除旧文件（保留最近的 `CBS.log`）
- **说明**：日志文件，与系统运行无关，可安全删除旧日志。

### 2.5 预读取文件

- **路径**：`C:\Windows\Prefetch`
- **当前状态**：已为空（0 文件），无需处理

### 2.6 DirectX 着色器缓存

- **路径**：`C:\Users\ybs15\AppData\Local\D3DSCache`
- **文件数**：88 个
- **大小**：4.27 MB
- **说明**：GPU 着色器编译缓存，删除后首次运行游戏/应用会自动重建。

---

## 三、开发工具缓存（最大收益区域）

### 3.1 Gradle 构建缓存（推荐清理）

- **路径**：`C:\Users\ybs15\.gradle\caches`
- **大小**：**1.10 GB**
- **子目录**：
  - `C:\Users\ybs15\.gradle\caches\9.4.1\` — 619 MB
  - `C:\Users\ybs15\.gradle\caches\jars-9\` — 314 MB
  - `C:\Users\ybs15\.gradle\caches\modules-2\` — 190 MB
- **说明**：Gradle 构建缓存，删除后下次构建会自动重新下载，不影响源代码。可完整删除 caches 文件夹内所有内容。

### 3.2 Gradle Wrapper 分发包

- **路径**：`C:\Users\ybs15\.gradle\wrapper`
- **大小**：145.75 MB
- **说明**：Gradle 版本分发包解压内容，删后下次构建会重新下载。磁盘紧张时可删，否则建议保留（省去重新下载时间）。

### 3.3 Gradle 守护进程日志

- **路径**：`C:\Users\ybs15\.gradle\daemon`
- **大小**：6.20 MB
- **说明**：Gradle daemon 运行日志，可安全删除。

### 3.4 PyCharm 缓存目录（推荐清理）

关闭 PyCharm 后可删除以下子目录（重启 PyCharm 后自动重建）：

| 子目录 | 路径 | 大小 | 说明 |
|--------|------|------|------|
| caches | `C:\Users\ybs15\AppData\Local\JetBrains\PyCharm2025.3\caches` | 157 MB | 索引缓存 |
| log | `C:\Users\ybs15\AppData\Local\JetBrains\PyCharm2025.3\log` | 96 MB | 运行日志 |
| jcef_cache | `C:\Users\ybs15\AppData\Local\JetBrains\PyCharm2025.3\jcef_cache` | 84 MB | 内嵌浏览器缓存 |
| full-line | `C:\Users\ybs15\AppData\Local\JetBrains\PyCharm2025.3\full-line` | 85 MB | AI 补全本地模型缓存 |
| index | `C:\Users\ybs15\AppData\Local\JetBrains\PyCharm2025.3\index` | 406 MB | 项目索引（重建耗时较长，按需删除） |
| tmp | `C:\Users\ybs15\AppData\Local\JetBrains\PyCharm2025.3\tmp` | 245 KB | 临时文件 |

> **不要删除**：`plugins\`（已安装插件 388 MB）、`python_stubs\`（类型提示 34 MB）

### 3.5 JetBrains Transient（ReSharper 临时数据）

- **路径**：`C:\Users\ybs15\AppData\Local\JetBrains\Transient\ReSharperPlatformVs18`
- **大小**：413.79 MB
- **说明**：ReSharper 临时分析数据，关闭 Visual Studio 后可安全删除，重新打开 VS 会重建。

### 3.6 VSCode 缓存数据

| 子目录 | 路径 | 大小 | 说明 |
|--------|------|------|------|
| CachedData | `C:\Users\ybs15\AppData\Roaming\Code\CachedData` | 95 MB | 扩展运行时缓存 |
| logs | `C:\Users\ybs15\AppData\Roaming\Code\logs` | 3.20 MB | 运行日志 |
| workspaceStorage | `C:\Users\ybs15\AppData\Roaming\Code\User\workspaceStorage` | 22 MB | 旧工作区状态 |

---

## 四、浏览器缓存（当前较小，可选）

| 浏览器 | 路径 | 大小 |
|--------|------|------|
| Chrome Cache | `C:\Users\ybs15\AppData\Local\Google\Chrome\User Data\Default\Cache` | 562 KB |
| Chrome Code Cache | `C:\Users\ybs15\AppData\Local\Google\Chrome\User Data\Default\Code Cache` | 86 KB |
| Edge Cache | `C:\Users\ybs15\AppData\Local\Microsoft\Edge\User Data\Default\Cache` | 256 KB |
| Firefox Profiles | `C:\Users\ybs15\AppData\Local\Mozilla\Firefox\Profiles` | 12.60 MB |

> 建议直接在浏览器设置中清理缓存，而不是手动删除文件夹。

---

## 五、回收站

- **路径**：`C:\$Recycle.Bin`
- **大小**：2 KB（当前几乎为空）
- **说明**：可在资源管理器中右键回收站 → 清空回收站。

---

## 六、系统特殊文件（需谨慎）

### 6.1 休眠文件（慎重操作）

- **路径**：`C:\hiberfil.sys`
- **大小**：**6.32 GB**
- **说明**：Windows 休眠功能保存内存状态的文件。
  - **如果不使用"休眠"功能**（睡眠/关机都不用休眠），可以禁用休眠来删除此文件，节省 6.32 GB
  - **禁用命令**（以管理员运行 cmd）：`powercfg /hibernate off`
  - **如果使用休眠**：不要删除此文件

### 6.2 交换文件

- **路径**：`C:\swapfile.sys`
- **大小**：256 MB
- **说明**：现代应用（UWP）使用的交换文件，**不建议删除**，系统会自动管理。

### 6.3 Windows 组件存储（WinSxS）

- **路径**：`C:\Windows\WinSxS`
- **说明**：无法直接删除，但可以通过以下命令清理已不需要的旧版组件（以管理员运行，耗时较长）：
  ```
  DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase
  ```
  此命令可能释放数 GB 空间，但执行后无法回滚到旧版系统更新。

---

## 七、Downloads 文件夹（人工审查）

- **路径**：`C:\Users\ybs15\Downloads`
- 以下文件**需要你自己判断是否保留**：

| 文件名 | 大小 | 备注 |
|--------|------|------|
| `JLink_Windows_V620h.exe` | 25.58 MB | J-Link 安装包，安装完可删 |
| `在校大学生搞了个AI神器...html` | 12.40 MB | 网页存档 |
| `基于RRT~_的机械臂避障路径规划...caj` | 6.28 MB | 论文文件 |
| `如何学好信号与系统？ - 知乎.html` | 6.05 MB | 知乎存档 |
| `如何学好信号与系统2？ - 知乎.html` | 1.55 MB | 知乎存档 |

---

## 八、不建议删除的目录（仅供参考）

以下目录**不要删除**，它们是实际安装的软件或重要数据：

- `C:\Users\ybs15\AppData\Local\JetBrains\Installations` — 3.25 GB（JetBrains 工具箱管理的应用本体）
- `C:\Users\ybs15\AppData\Local\JetBrains\PyCharm2025.3\plugins` — 388 MB（已安装插件）
- `C:\pagefile.sys` — 系统页面文件，不要删除

---

## 清理建议执行顺序

1. **立刻清理（无风险）**：用户 TEMP → VSCode logs → Gradle daemon → WER ReportArchive → D3DSCache
2. **关闭程序后清理**：PyCharm caches/log/jcef_cache → JetBrains Transient → VSCode CachedData
3. **按需清理**：Gradle caches（重建耗时）→ Gradle wrapper（需重下载）
4. **谨慎决策**：hiberfil.sys（确认不用休眠再禁用）→ Windows Logs → WinSxS 组件清理（用 DISM 命令）

---

## 九、额外发现的大型缓存（补充）

以下缓存未包含在前面章节，此次软件扫描时发现：

### 9.1 NVIDIA DirectX 着色器缓存（强烈推荐清理）

- **路径**：`C:\Users\ybs15\AppData\Local\NVIDIA\DXCache`
- **大小**：**3.08 GB**
- **说明**：NVIDIA 显卡的 DirectX/Vulkan 着色器编译缓存，删除后首次运行游戏会自动重建（重建时可能卡顿数秒）。可直接删除目录内所有内容。

### 9.2 npm 包缓存

- **路径**：`C:\Users\ybs15\AppData\Local\npm-cache`
- **大小**：**1.91 GB**
- **说明**：npm 下载包的本地缓存，可安全清理。推荐用命令清理：
  ```
  npm cache clean --force
  ```

### 9.3 应用崩溃转储

- **路径**：`C:\Users\ybs15\AppData\Local\CrashDumps`
- **大小**：75.86 MB
- **说明**：应用崩溃时生成的转储文件，可安全删除。

### 9.4 淘宝客户端缓存

- **路径**：`C:\Users\ybs15\AppData\Roaming\taobao\Cache` + `Code Cache`
- **大小**：约 491 MB（Cache 388 MB + Code Cache 103 MB）
- **说明**：淘宝客户端的浏览器缓存，可在淘宝设置中清理，或直接删除这两个子文件夹。

---

## 十、C 盘大型软件清单（由你决定是否卸载）

> 以下列表仅列出安装在 C 盘的软件，安装在其他盘（E:、H: 等）的不在此列。  
> **卸载方式**：设置 → 应用 → 已安装应用，搜索对应名称卸载。

### 10.1 超大型软件（>2 GB）

| 软件 | 安装路径 | 占用空间 | 建议 |
|------|----------|----------|------|
| Microsoft Visual Studio | `C:\Program Files\Microsoft Visual Studio` | **7.83 GB** | 如不再开发 C#/.NET，可卸载；仅用 VSCode 的话可考虑精简 |
| WPS Office 数据（wps + wps_international） | `C:\Users\ybs15\AppData\Roaming\kingsoft\` | **9.96 GB** | 这是 WPS 的云同步文件缓存，不是卸载项；若云盘同步了大量文件可在 WPS 设置中减少本地缓存 |
| Microsoft Office | `C:\Program Files\Microsoft Office` | **5.16 GB** | 与 WPS 功能重叠，二选一考虑卸载其中一个 |
| National Instruments (LabVIEW) | `C:\Program Files\National Instruments` + `C:\Program Files (x86)\National Instruments` | **5.08 GB** | 如不再使用 LabVIEW，可卸载（同时卸载 NI SystemLink、NI Runtime 等组件） |
| Adobe Acrobat DC | `C:\Program Files\Adobe` | **2.57 GB** | 若已有 Foxit PDF 或 Edge 看 PDF，可考虑替代 |
| Windows SDK（多版本） | `C:\Program Files (x86)\Windows Kits` | **2.15 GB** | 安装了 3 个不同版本的 Windows SDK，可在 Visual Studio Installer 中只保留最新版 |
| Microsoft (Edge/EdgeWebView 等) | `C:\Program Files (x86)\Microsoft` | **2.96 GB** | 包含 Edge 浏览器（1.98 GB）+ EdgeWebView2 Runtime（1.99 GB），系统组件，不建议卸载 |
| MathWorks (MATLAB) | `C:\Users\ybs15\AppData\Local\MathWorks\ServiceHost` | **2.17 GB** | MATLAB 本地数据，如不再使用可连同 MATLAB 一起卸载 |

### 10.2 中大型软件（300 MB ~ 2 GB）

| 软件 | 安装路径 | 占用空间 | 建议 |
|------|----------|----------|------|
| Epic Games Launcher | `C:\Program Files (x86)\Epic Games` + AppData | **~921 MB** | 如无 Epic 游戏可卸载 |
| Ubisoft Connect | `C:\Program Files (x86)\Ubisoft` + AppData | **~576 MB** | 如无 Ubisoft 游戏可卸载 |
| Adobe Creative Cloud | AppData（无 C 盘安装路径） | **~822 MB** | 若不使用 Adobe 套件可卸载 |
| Foxit Software（福昕 PDF） | `C:\Users\ybs15\AppData\Roaming\Foxit Software` | **392 MB** | 与 Adobe Acrobat 功能重叠，二选一 |
| 淘宝客户端（安装包） | `C:\Users\ybs15\AppData\Local\Programs\taobao` | **444 MB** | 可用网页版替代 |
| Obsidian | AppData（无 C 盘安装路径） | **~992 MB** | 笔记软件，按需保留 |
| Google Chrome | `C:\Program Files\Google` | **938 MB** | 与 Edge 功能重叠，二选一 |
| dotnet（.NET 运行时） | `C:\Program Files\dotnet` + x86 | **2.22 GB** | 系统运行时，不建议手动删除；可通过 VS Installer 管理 |
| PowerToys | `C:\Users\ybs15\AppData\Local\PowerToys` | **990 MB** | 微软官方工具，注册表也有重复条目（1.75 GB），实际约 1 GB |
| GitHub Desktop | `C:\Users\ybs15\AppData\Local\GitHubDesktop` | **1.01 GB** | 如使用命令行 Git，可考虑卸载 |
| Thunder Network（迅雷） | `C:\Users\ybs15\AppData\Local\Thunder Network` | **1.47 GB** | 如不下载大文件可卸载 |
| 搜狗 PDF（sogoupdf） | `C:\Users\ybs15\AppData\Local\sogoupdf` | **927 MB** | 已有 Adobe/Foxit，可考虑卸载 |
| Opera 浏览器 | `C:\Users\ybs15\AppData\Local\Opera Software` | **226 MB** | 三款浏览器（Chrome/Edge/Opera），二选一 |
| Paradox Interactive Launcher | `C:\Users\ybs15\AppData\Local\Programs\Paradox Interactive` | **414 MB** | 如不玩 Paradox 游戏可卸载 |
| playway-launcher | `C:\Users\ybs15\AppData\Local\playway-launcher` | **250 MB** | 游戏启动器，如不用可卸载 |

### 10.3 小型但可卸载的软件

| 软件 | 安装路径 | 占用空间 | 建议 |
|------|----------|----------|------|
| Microsoft Silverlight | `C:\Program Files\Microsoft Silverlight` | **94 MB** | 已被所有现代浏览器废弃，建议卸载 |
| MSN Play | `C:\Program Files\MSN Play` | **260 MB** | 微软预装游戏入口，可卸载 |
| DriverDoc | `C:\Program Files\DriverDoc` | **29 MB** | 第三方驱动更新工具，Windows Update 已内置驱动更新 |
| Java（x86）| `C:\Program Files (x86)\Java` | **201 MB** | 如无需要 32 位 Java 的老软件，可卸载 |
| LxWallpaper | `C:\Program Files (x86)\LxWallpaper` | **95 MB** | 动态壁纸软件，按需保留 |
| Lenovo（联想相关） | `C:\Program Files (x86)\Lenovo` + AppData | **1.07 GB** | 联想预装服务软件，如不需要可卸载 |
| taobao-updater | `C:\Users\ybs15\AppData\Local\taobao-updater` | **324 MB** | 淘宝自动更新程序，卸载淘宝后可一并删除 |
| obsidian-updater | `C:\Users\ybs15\AppData\Local\obsidian-updater` | **282 MB** | Obsidian 自动更新程序 |
| cokecloud-updater | `C:\Users\ybs15\AppData\Local\cokecloud-updater` | **125 MB** | CokeCloud 自动更新程序 |
| bitwarden-updater | `C:\Users\ybs15\AppData\Local\bitwarden-updater` | **160 MB** | Bitwarden 自动更新程序 |
| dmghg-updater | `C:\Users\ybs15\AppData\Local\dmghg-updater` | **100 MB** | 未知来源更新程序 |
| msnplay-updater | `C:\Users\ybs15\AppData\Local\msnplay-updater` | **75 MB** | MSN Play 更新程序 |
| AlibabaProtect | `C:\Program Files (x86)\AlibabaProtect` | **365 MB** | 阿里巴巴安全组件（随淘宝/钉钉安装），卸载后需从控制面板单独卸载 |
| 动漫共和国 | 注册表显示 407 MB | **407 MB** | 按需保留 |

### 10.4 开发工具多版本问题（建议精简）

- **Windows SDK 三版本并存**：
  - `10.0.26100.8249`、`10.0.26100.7705`、`10.0.26100.6901`（各约 2.3 GB）
  - 建议：在 Visual Studio Installer → 修改 → 单个组件中只保留最新版，其余通过"添加/删除程序"卸载
  - **可释放约 4.6 GB**

- **Playwright 浏览器二进制**：
  - `C:\Users\ybs15\AppData\Local\ms-playwright` — **683 MB**
  - `C:\Users\ybs15\AppData\Local\ms-playwright-go` — **90 MB**
  - 说明：Playwright 自动化测试框架下载的浏览器，若不再使用可删除

---

## 更新后的总览

| 类别 | 大小 | 操作 |
|------|------|------|
| 用户 TEMP | 123 MB | 直接删除 |
| NVIDIA DXCache | **3.08 GB** | 直接删除 |
| npm 缓存 | **1.91 GB** | `npm cache clean --force` |
| Gradle 缓存 | 1.10 GB | 直接删除 |
| PyCharm 缓存 | ~830 MB | 关闭 PyCharm 后删除 |
| JetBrains Transient | 414 MB | 关闭 VS 后删除 |
| VSCode 缓存 | 98 MB | 直接删除 |
| 淘宝缓存 | 491 MB | 删除 Cache + Code Cache |
| 崩溃转储 | 76 MB | 直接删除 |
| Windows 日志 | 54 MB | 直接删除 |
| 其他（缩略图/WER 等） | ~13 MB | 直接删除 |
| **小计（缓存类）** | **~8.2 GB** | — |
| Windows SDK 旧版本 | ~4.6 GB | 通过 VS Installer 卸载 |
| 休眠文件（可选） | **6.32 GB** | `powercfg /hibernate off` |
