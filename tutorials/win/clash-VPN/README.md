# Clash VPN 控制中心

> Clash Verge Rev「美国 ISP 代理分流」配置的**控制中心 / 文档 / 备份**仓库。
> 真正生效的配置文件**不在这里**(在 AppData,见下),本仓库存:操作约定、配置快照、说明文档、启动器、安装包。

---

## ⚠️ 最重要:生效文件在 AppData,不在本仓库

真正被 Clash 读取的文件在:
`C:\Users\ybs15\AppData\Roaming\io.github.clash-verge-rev.clash-verge-rev\`

本仓库 `config\` 里的 `Script.js` / `dns_config.yaml` / `Merge.yaml` **只是快照备份**,改它们没有任何效果。

**改配置的正确流程:编辑 AppData 里的 LIVE 文件 → Clash Verge「订阅」页重新激活(DNS 改动还要重载核心)→ 把新版同步回本仓库 `config\` 备份。**

详细操作约定见 [`CLAUDE.md`](CLAUDE.md)。

---

## 这套配置在做什么

给**特定美国网站**(Claude / ChatGPT / Google / Gemini 等)分流到**美国 ISP 代理**(Decodo 10 IP 负载均衡,每站固定 IP),其余流量走原订阅节点。实现"美国住宅/ISP IP 上用 AI 服务",并治理了 WebRTC / 时区 / DNS / IPv6 等泄露。

- **主力出口**:Decodo `isp.decodo.com:10001-10010`,`🔄 Decodo-LB`(consistent-hashing)→ `🅑 美国ISP`。
- **分流域名**:见 `config\Script.js` 自定义区 1。
- **专用纯美国浏览器**:`clean-us-chrome.bat` 开独立 Chrome,全量走美国 + 防泄露(给敏感 AI 账号用)。

---

## 目录结构

```
clash-VPN/
├─ README.md                       本文件(入口/导航)
├─ CLAUDE.md                       操作约定 + 速查 + 核心教训(最常看)
├─ clean-us-chrome.bat             专用「纯美国」Chrome 启动器(独立 profile,走 7900)
├─ Microsoft.PowerShell_profile.ps1  终端代理菜单(LIVE 在 ~\Documents\PowerShell\)
├─ Clash.Verge_2.1.1_x64-setup.exe   安装包(已 gitignore)
├─ 软件安装位置.txt                软件/浏览器安装路径备忘
├─ config/                         LIVE 文件的快照备份(不被读取)
│  ├─ Script.js                    分流主脚本
│  ├─ dns_config.yaml              DNS 覆盖(干净 DoH / 关 IPv6)
│  └─ Merge.yaml                   Merge 模板
├─ doc/                            详细文档
│  ├─ ISP配置说明.md               配置原理详解 + 泄露治理(第 9 节)
│  ├─ 配套Chrome设置说明.md        专用 Chrome 扩展安装/语言/验证
│  ├─ Chrome网络环境检测结果.md    泄露检测与复测记录
│  └─ data (3).txt                 当前 10 个 Decodo IP 导出
└─ clean-us-profile/              专用 Chrome 的数据(Cookie/扩展/登录态,已 gitignore)
```

---

## 文档导航

| 想做什么 | 看哪里 |
|----------|--------|
| 改配置的约定、速查表、踩坑教训 | [`CLAUDE.md`](CLAUDE.md) |
| 增删走美国的网站、换 Decodo IP、故障对照 | [`CLAUDE.md`](CLAUDE.md) 常见操作 A/B + [`doc\ISP配置说明.md`](doc/ISP配置说明.md) |
| 配置原理、代理组结构、DNS、泄露治理 | [`doc\ISP配置说明.md`](doc/ISP配置说明.md) |
| 专用纯美国 Chrome:扩展安装、语言、验证 | [`doc\配套Chrome设置说明.md`](doc/配套Chrome设置说明.md) |
| 泄露检测结果与终态验收 | [`doc\Chrome网络环境检测结果.md`](doc/Chrome网络环境检测结果.md) |

---

## 常见操作(速查)

- **增删走美国的网站**:改 LIVE `Script.js` 自定义区 1 `US_ISP_DOMAINS` → 重新激活。
- **Decodo IP 变了**:改 LIVE `Script.js` 自定义区 2a `endpoints` 的 `ip` → 重新激活 → 同步备份。
- **全部流量走美国**:代理页 `🔰 节点选择` → 选 `🔄 Decodo-LB`。
- **干净美国环境做敏感 AI 操作**:双击 `clean-us-chrome.bat`(详见 `doc\配套Chrome设置说明.md`)。
- **终端用代理**:开新 PowerShell 时按菜单选(本地 Clash / IProyal / 不用)。

---

## 注意事项

- `clean-us-profile/`(专用 Chrome 数据,含 **Cookie / 登录态 / 密码库**)、`*.7z` 备份、安装包均已在 `.gitignore` 中排除,**不要提交或外泄**。
- 账号 / 节点 / 密码等敏感信息记录在 `CLAUDE.md`;本仓库为**私有控制中心**,勿公开。
- 改 LIVE 文件前先备份(`.bak-<时间戳>`),改完同步回 `config\`。
