# Clash VPN 控制中心 — Claude 工作空间

这个目录是「Clash Verge Rev 美国 ISP 代理分流」配置的控制中心 / 文档与备份中心。
真正生效的配置文件**不在这里**(见下)。本目录存放:操作约定、备份快照、说明文档、安装包。

---

## ⚠️ 改配置前必读(最重要)

1. **真正生效的文件在 AppData,不在本工作空间**:
   `C:\Users\ybs15\AppData\Roaming\io.github.clash-verge-rev.clash-verge-rev\profiles\Script.js`
2. 本目录 `config\Script.js` **只是快照备份**,Clash **不会**读取它。改它没有任何效果。
3. 任何修改都要改 **AppData 里的那个 Script.js**,然后到 Clash Verge **「订阅」页 → 对当前订阅点「重新激活 / 刷新」** 才生效(生成结果写进同目录 `clash-verge.yaml`)。
4. 改完记得把新版同步回 `config\Script.js` 备份(`Copy-Item` 覆盖即可)。
5. 验证语法:`node --check "<AppData>\...\Script.js"`。

> 一句话:**编辑 LIVE 文件 → 重新激活 → 同步备份**。

---

## 文件位置速查

| 用途 | LIVE(生效) | 本工作空间(备份/文档) |
|------|------------|----------------------|
| 分流主脚本(核心) | `…\profiles\Script.js` | `config\Script.js`(快照) |
| Merge 模板(已清空,只留 store-selected) | `…\profiles\Merge.yaml` | `config\Merge.yaml` |
| 生成的运行配置(只读,自动生成) | `…\profiles\clash-verge.yaml` | — |
| DNS 覆盖(干净DoH/关IPv6) | `(profiles 上级)\dns_config.yaml` | `config\dns_config.yaml`(快照) |
| 专用「纯美国」浏览器启动器 | — | `clean-us-chrome.bat`(走 7900 入站) |
| 活动订阅 CokeCloud | `…\profiles\RFgHoEDpXkdm.yaml` | — |
| 核心日志(排错看这里) | `…\logs\service\service_latest.log` | — |
| PowerShell 代理菜单 | `C:\Users\ybs15\Documents\PowerShell\Microsoft.PowerShell_profile.ps1` | `Microsoft.PowerShell_profile.ps1`(已同步) |
| 最新 10 IP 导出 | — | `doc\data (3).txt` |
| Chrome 指纹/泄漏检测 | — | `doc\Chrome网络环境检测结果.md` |
| 专用纯美国 Chrome 设置 | — | `doc\配套Chrome设置说明.md`(扩展安装/验证) |
| 配置详解 | — | `doc\ISP配置说明.md` |
| Clash Verge 安装包 | — | `Clash.Verge_2.1.1_x64-setup.exe` |

`…\profiles\` = `C:\Users\ybs15\AppData\Roaming\io.github.clash-verge-rev.clash-verge-rev\profiles`

---

## 这套配置在做什么

给**特定美国网站**(AI 站为主)分流到**美国 ISP 代理**,其余流量走原订阅节点,实现"美国住宅/ISP IP 上 ChatGPT/Google/Gemini/Claude"。

**代理组(Script.js 生成,注入订阅):**
- `🅑 美国ISP`(select):默认出口 = `🔄 Decodo-LB`;备选 BrightData / IProyal / `🔰 节点选择` / DIRECT。
- `🔄 Decodo-LB`(load-balance, **consistent-hashing**):成员 `Decodo-01..10`,10 个固定美国 IP。同一目标域名固定走同一 IP(账号安全),不同站分摊到 10 IP(不过载)。
- `🔰 节点选择`(订阅自带):脚本把 `🔄 Decodo-LB` 注入到**首位**,作为**全局备选**——想让全部流量走美国时,在这里选它。

**分流规则(Script.js 置顶,从上往下匹配):**
1. `directRules`:IProyal IP / `superproxy.io` / `decodo.com` → **DIRECT**(防 TUN 把"本机连代理"流量二次绕进节点 → 双重代理/超时)。
2. 每个 `US_ISP_DOMAINS` 域名 → `DOMAIN-SUFFIX,<域名>,🅑 美国ISP`。

当前走美国 ISP 的域名(10 个,见 `Script.js` 自定义区 1):
`claude.ai · chatgpt.com · openai.com · oaistatic.com · oaiusercontent.com · gemini.google.com · myaccount.google.com · cloud.google.com · accounts.google.com · google.com`

---

## 常见操作

### A. 增 / 删一个"走美国 IP"的网站
改 LIVE `Script.js` 顶部 **自定义区 1 `US_ISP_DOMAINS`** 数组,加/删主域名(自动匹配所有子域名)→ 重新激活。

### B. 10 个 IP 变了(换套餐/IP 过期)
1. Decodo 后台(<https://dashboard.decodo.com/welcome>)「导出代理」选 **指定 IP** 格式,每行形如
   `https://user-spabrx2pvj-ip-12.12.112.180:密码@isp.decodo.com:10001`
2. 把每行 `-ip-` 后那段 IP,填到 LIVE `Script.js` **自定义区 2a `DECODO.endpoints`** 对应端口的 `ip:`(端口一般不变)。
3. 重新激活。可 `curl` 实测每个端口出口 IP 是否匹配。
4. 同步备份到 `config\Script.js`,并更新 `doc\data (?).txt`。
> 不想每次改 IP:把生成节点处用户名改成 `user-<user>-country-us`(锁美国、IP 自动分配),代价是失去"每站固定 IP"。

### C. 终端 / Claude Code CLI 用代理
开新 PowerShell 时会弹菜单:`[1]` 本地 Clash(127.0.0.1:**7897**) · `[2]` IProyal 美国 ISP · `[n]` 不用。
脚本/API/单连接低并发任务用 ISP(2);日常用本地 Clash(1)。配置见根目录 `Microsoft.PowerShell_profile.ps1`(LIVE 在 `~\Documents\PowerShell\`)。

### D. 想让"全部流量"走美国
代理页 → `🔰 节点选择` → 选 `🔄 Decodo-LB`。它是 10 IP 负载均衡,比单端口稳;但全量重负载时仍可能偏紧,真卡了切回普通节点。

### E. 用专用「纯美国」浏览器(干净环境,做敏感 AI 账号操作)
双击根目录 `clean-us-chrome.bat` → 开一个**独立 Chrome**(独立 profile,与日常 Chrome 隔离),**全部流量**经 Clash 入站 `127.0.0.1:7900` → `🅑 美国ISP` 全量走美国。
- 路由由 `Script.js` 注入:`listeners`(clean-us, http, 7900)+ 规则 `IN-NAME,clean-us,🅑 美国ISP`。改完同样要**重新激活**。
- 首次启动须在该 profile 内**手动各装一个扩展**(只装一次,不影响日常浏览器):① WebRTC 防泄漏(禁用非代理 UDP);② 时区伪造固定 `America/New_York`。
- 想锁单一固定美国 IP:把 `Script.js` 里该规则目标 `🅑 美国ISP` 换成某单节点(如 `Decodo-03`)。
- 原理与泄露治理详见 `doc\ISP配置说明.md` 第 9 节。

---

## 核心教训(踩过的坑,别重犯)

- **ISP/住宅代理并发能力天差地别**。IProyal / BrightData 扛不住浏览器对重型站(Google/ChatGPT 单页几十条并发 + 失败重试风暴)→ 日志狂刷 `forcibly closed` → 站点打不开;Claude 能通只因并发少。**买代理跑浏览器唯一关键指标 = 不限并发连接数**。(排查过:不是 QUIC,日志 UDP=0。)
- **单端口别做全局**。哪怕高并发的 Decodo,单端口被全量流量(几百并发)砸也会 i/o timeout → **必须用 LB 把并发分摊到 10 IP**。
- **负载均衡用 `consistent-hashing`,别用 round-robin**。round-robin 会让同一网站看到 10 个乱跳 IP → 触发异常登录风控。
- **`directRules` 必须有**,否则 TUN 模式下"本机→代理网关"的连接会被再次绕进代理 → 双重代理/超时。
- **分流主要对 Chrome 等生效**;Edge 被 `PROCESS-NAME,msedge.exe,DIRECT` 强制直连(如有该规则)。
- **Decodo 支持 HTTPS-to-proxy**(`tls:true` + `sni:isp.decodo.com`,证书合法,无需 skip-cert-verify);**IProyal 端口 12323 不支持** TLS-to-proxy(仅 HTTP)。
- **指纹/泄漏**(详见 `doc\Chrome网络环境检测结果.md`):换了美国出口 IP 仍可能暴露——① WebRTC 泄漏真实公网 IP;② 浏览器时区仍 Asia/Shanghai 与美国 IP 不符;③ DNS 解析器混入 CN/HK = DNS 泄漏;④ split-tunnel 导致多出口落在不同国家。做"干净美国环境"时要一并处理(WebRTC 策略、改时区、代理自带 DNS/DoH、必要时全局代理)。治理方案已落地,见 `doc\ISP配置说明.md` 第 9 节 + 上面操作 E。
- **IPv6 必须关**。Decodo/IProyal/BrightData 都是 IPv4-only HTTP 代理,开 IPv6 会让 IPv6 流量绕过代理直连 → 暴露真实中国 IPv6(`2001:da8::`=CERNET)。`Script.js` 里 `params.ipv6=false` + `dns_config.yaml` `ipv6:false`(后者阻止 AAAA 解析,是真正切断 IPv6 连接的关键)。
- **DNS 覆盖在 `dns_config.yaml`**,不在订阅里。因 `verge.yaml` `enable_dns_settings:true`,此文件覆盖订阅自带 dns。改后若在 DNS 设置 UI 点保存会被覆盖。
- **防 DNS 泄露靠路由,不靠本地换 Cloudflare**(踩过大坑)。本机在中国,**Cloudflare/Google DoH(`1.1.1.1`/`dns.google`)被墙**——若拿它做 `proxy-server-nameserver`,解析不出 `isp.decodo.com` → **Decodo 全端口超时**。正解:DNS 全用**国内可达**解析器(`dns.alidns.com`/`doh.pub` DoH + `223.5.5.5`/`119.29.29.29` bootstrap)。HTTP 代理按主机名转发,走代理的域名在**美国端解析**,本地 DNS 不碰 → 专用浏览器天然干净美国 DNS。`respect-rules:true`;`ipv6:false`;**别用明文 8.8.8.8**(命中 HK PoP 显示 HK)。
- **WebRTC/时区只能在浏览器层修**(代理/Clash 改不了)。最干净做法 = 专用 Chrome profile(独立 `user-data-dir`)+ Clash 独立入站(`listeners` + `IN-NAME` 规则,全量走美国)+ 该 profile 内装 WebRTC/时区扩展。不污染日常浏览器,见操作 E。mihomo 支持 `listeners` 与 `IN-NAME` 规则。
- **改 LIVE 文件前先备份**:`Script.js` / `dns_config.yaml` 都带 `.bak-<时间戳>` 同目录备份;workspace `config\` 留快照。

---

## 账号 / 节点信息(改账号密码时用)

**Decodo(主力,高并发)** — 后台 <https://dashboard.decodo.com/welcome>
- `server: isp.decodo.com` · 端口 `10001-10010` · `user: spabrx2pvj` · `password: 94pnGqp77XqKiVebt~`
- 用户名格式 `user-spabrx2pvj-ip-<IP>`(锁定 IP)· `tls:true` · `sni:isp.decodo.com`
- 当前 10 IP:10001→12.12.112.180 · 10002→66.93.228.227 · 10003→198.145.174.226 · 10004→66.93.239.152 · 10005→208.240.26.220 · 10006→12.12.118.73 · 10007→66.93.237.43 · 10008→66.227.127.5 · 10009→198.145.174.190 · 10010→66.93.239.89

**BrightData(备用,按 GB,抗并发中等)**
- `brd.superproxy.io:33335` · user `brd-customer-hl_dc8c0b49-zone-isp_proxy1` · pass `xdv58cl2g2lt` · http

**IProyal(备用,并发低,只适合 Claude 轻站/脚本单连接)**
- `37.218.215.154:12323` · user `14abb747972c8` · pass `eee9682ce7` · 仅 HTTP(不支持 TLS-to-proxy)· 静态独享(Virginia, Cox)· 有 100GB 额度

---

## 改完的验证清单

- [ ] `node --check` LIVE `Script.js` 语法通过
- [ ] Clash Verge「订阅」页对当前订阅**重新激活**
- [ ] 代理页能看到 `🅑 美国ISP` / `🔄 Decodo-LB`,出口选对
- [ ] 浏览器/`curl` 实测目标站出口为美国 IP(必要时逐端口验证)
- [ ] 把新版同步回 `config\Script.js` 备份

> 详细的人类可读说明见 `doc\ISP配置说明.md`。
