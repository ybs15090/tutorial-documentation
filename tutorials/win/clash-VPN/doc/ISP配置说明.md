# 美国 ISP 代理 · Clash Verge 配置说明

> 操作约定与速查见上级 `..\CLAUDE.md`;本文件是配置原理与详细参考。

## 1. 目标

让 **ChatGPT / Google / Gemini / Claude** 等特定网站走**美国 ISP/住宅 IP**,其余流量走原订阅节点(港台机房)。既能用美国 AI 服务,又不把全部流量塞进代理。

## 2. 生效文件与流程

- 核心:`…\profiles\Script.js`(全局扩展脚本,JavaScript)。它在订阅激活时,把**节点、代理组、规则**注入到 CokeCloud 订阅生成的配置里。
- 改完 **必须**到 Clash Verge「订阅」页**重新激活**,生成结果在 `…\profiles\clash-verge.yaml`。
- `…\profiles\` = `C:\Users\ybs15\AppData\Roaming\io.github.clash-verge-rev.clash-verge-rev\profiles`
- 本工作空间 `config\Script.js` 是**快照备份**,不被读取。

## 3. 三家 ISP(都 `type: http`)

| 节点 | 地址 | 并发 | 用途 | TLS-to-proxy |
|------|------|------|------|------|
| **Decodo**(主力) | `isp.decodo.com:10001-10010` | 高 | 浏览器重型站 | ✅ `tls:true`,`sni:isp.decodo.com`(证书合法) |
| BrightData(备用) | `brd.superproxy.io:33335` | 中 | 轻站/按 GB | ❌ |
| IProyal(备用) | `37.218.215.154:12323` | **低** | 仅 Claude 轻站/脚本单连接 | ❌(12323 仅 HTTP) |

Decodo 是原 Smartproxy,标称高并发。10 个端口各绑一个固定美国 IP,用户名 `user-spabrx2pvj-ip-<IP>`。

## 4. 代理组结构

- `Decodo-01..10` → **`🔄 Decodo-LB`**(`load-balance` + **`consistent-hashing`**)→ **`🅑 美国ISP`**(`select`,默认出口=LB)。
- `🔄 Decodo-LB` 同时被注入 **`🔰 节点选择`** 首位,作为**全局备选**(想全部走美国时选它)。

**为什么 consistent-hashing**:同一目标域名永远命中同一个后端 IP → 网站看到的是稳定的美国 IP(不触发"异地/异常登录");同时不同网站被哈希分散到 10 个 IP → 不会把并发全压在一个端口。
**为什么不 round-robin**:它每次轮换出口,网站会看到你的 IP 在 10 个之间乱跳 → 风控。

## 5. 分流规则(Script.js 置顶,顺序匹配)

1. **直连代理网关**(防双重代理):
   - `IP-CIDR,37.218.215.154/32,DIRECT,no-resolve`(IProyal)
   - `DOMAIN-SUFFIX,superproxy.io,DIRECT`(BrightData)
   - `DOMAIN-SUFFIX,decodo.com,DIRECT`(Decodo)
2. **指定站走美国**:对 `US_ISP_DOMAINS` 每个域名生成 `DOMAIN-SUFFIX,<域名>,🅑 美国ISP`。
3. 脚本有幂等过滤,避免重复激活时规则叠加。

当前域名(10):`claude.ai · chatgpt.com · openai.com · oaistatic.com · oaiusercontent.com · gemini.google.com · myaccount.google.com · cloud.google.com · accounts.google.com · google.com`

## 6. 改 IP 的步骤(IP 变了才需要)

1. Decodo 后台 <https://dashboard.decodo.com/welcome> →「导出代理」选 **指定 IP** 格式。
2. 每行 `…-ip-12.12.112.180:…@isp.decodo.com:10001` 里的 IP,填到 `Script.js` **自定义区 2a `DECODO.endpoints`** 对应端口的 `ip:`。
3. 重新激活 → `curl` 逐端口验证出口 IP。
4. 同步 `config\Script.js`,更新 `doc\data (?).txt`。

> 免维护替代:用户名改 `user-spabrx2pvj-country-us`(锁国家、IP 自动分配),不用再管 IP 变化,但失去"每站固定 IP"。

## 7. 当前 10 IP 映射

| 端口 | IP | 端口 | IP |
|------|------|------|------|
| 10001 | 12.12.112.180 | 10006 | 12.12.118.73 |
| 10002 | 66.93.228.227 | 10007 | 66.93.237.43 |
| 10003 | 198.145.174.226 | 10008 | 66.227.127.5 |
| 10004 | 66.93.239.152 | 10009 | 198.145.174.190 |
| 10005 | 208.240.26.220 | 10010 | 66.93.239.89 |

(来源:`doc\data (3).txt`)

## 8. 常见故障对照

| 现象 | 原因 | 处理 |
|------|------|------|
| 只有 Claude 能开,ChatGPT/Google 超时 | ISP 并发太低,被重型站连接风暴限流(`forcibly closed`) | 换 Decodo + 负载均衡;别用 IProyal/BrightData 跑浏览器 |
| 选了 ISP 全局后全网打不开 | 单端口被全量流量砸 → i/o timeout | 用 `🔄 Decodo-LB`(10 IP 分摊),别拿单端口做全局 |
| 网站频繁要求重新验证/异常登录 | 出口 IP 在多个之间乱跳 | 负载均衡用 `consistent-hashing` |
| 终端连不上代理 / 超时 | TUN 把"连代理"流量又绕进代理 | 确认 `directRules`(decodo.com/superproxy.io/IProyalIP → DIRECT) |
| 美国 IP 但仍被识别为代理 | WebRTC/时区/DNS 泄漏、split-tunnel | 见 `doc\Chrome网络环境检测结果.md`,治理方案见下「9. 泄露治理」 |

## 9. 泄露治理 · 干净美国环境(2026-06-21)

针对 `doc\Chrome网络环境检测结果.md` 的 5 类泄露,做了两层处理:**Clash 全局修复**(惠及所有流量)+ **专用「纯美国」浏览器**(隔离敏感 AI 账号操作)。

> 关键认知:对真正经 Decodo(按域名 CONNECT)的 AI 站,**DNS / IPv6 不会直接泄露给站点**——真正到达 AI 站的破绽是 **WebRTC + 时区**(浏览器层)。DNS/IPv6/多出口主要是检测站对整体分流的「体检报告」。
>
> ⚠️ **重要:防 DNS 泄露靠「路由」,不是靠本地换 Cloudflare。** HTTP 代理是按主机名 CONNECT 转发的,走代理的域名在 **代理端(美国 Decodo)解析**,本地 DNS 根本不碰 → 专用浏览器天然干净美国 DNS。本机在中国,**Cloudflare/Google DoH(1.1.1.1/dns.google)被墙**,若拿它当 `proxy-server-nameserver` 会解析不出 `isp.decodo.com` → **Decodo 全端口超时**(踩过)。所以 DNS 全部用**国内可达**解析器,泄露问题由代理路由解决。

### 9.1 Clash 全局修复(LIVE 文件)

| 泄露 | 根因 | 修复 |
|------|------|------|
| IPv6 → 真实中国 IPv6(`2001:da8::`) | `ipv6:true` + 代理都是 IPv4-only,IPv6 绕过代理直连 | `Script.js` 加 `params.ipv6=false`;`dns_config.yaml` `ipv6:false`(阻止 AAAA 解析) |
| DNS 解析器落 CN/HK | 旧配置混了明文 `8.8.8.8`(走 HK PoP) | 删明文 8.8.8.8 与 `fallback`;`respect-rules:true`;**全部用国内可达 DoH**(`dns.alidns.com`/`doh.pub`)。防泄露靠路由(见上方 ⚠️),不靠本地 DoH 国别 |

**最终 DNS(国内可达 + 路由防泄露)**:`ipv6:false` · `enhanced-mode:fake-ip` · `respect-rules:true` · `default-nameserver: 223.5.5.5 / 119.29.29.29`(明文 bootstrap)· `proxy-server-nameserver` 与 `nameserver` 均为 `https://dns.alidns.com/dns-query` + `https://doh.pub/dns-query`。不设 `nameserver-policy`(全表统一,无需分流)。

**DNS 配置位置**:`…\dns_config.yaml`(因 `verge.yaml` 里 `enable_dns_settings:true`,此文件**覆盖**订阅自带 dns)。备份在 `config\dns_config.yaml`。
> 注意:之后若在 Clash Verge「设置 → DNS」UI 里点保存,会覆盖手改的此文件。以后改 DNS 优先走 UI,或重改此文件后重载核心。

### 9.2 专用「纯美国」浏览器(隔离方案)

不动日常浏览器的分流,新开一个**独立 Chrome**,全部流量走美国 + 关 WebRTC + 伪造时区:

- **路由**:`Script.js` 注入独立入站 `listeners`(name=`clean-us`, http, `127.0.0.1:7900`)+ 最优先规则 `IN-NAME,clean-us,🅑 美国ISP`。该入站的**全部流量**进 Decodo-LB(全量美国,consistent-hashing → 命中 10 个美国 IP 之一,**全 US**,检测站 `distinct_ip_country=US` 通过)。日常浏览器(系统代理 7897)分流**完全不受影响**。
  - 想锁**单一固定美国 IP**(更像真人):把规则目标 `🅑 美国ISP` 换成某单节点如 `Decodo-03`。
- **浏览器**:根目录 `clean-us-chrome.bat` 启动 → 独立 `user-data-dir=E:\APP\clash-VPN\clean-us-profile` + `--proxy-server=127.0.0.1:7900`。
- **WebRTC + 时区**:在该 profile 内**手动各装一个扩展**(只装一次,只影响本 profile,不波及日常浏览器):
  1. WebRTC 防泄漏(WebRTC Control / WebRTC Leak Shield)→ 禁用非代理 UDP;
  2. 时区伪造 → 固定 **America/New_York**。
  > Chrome 已无单条命令行关 WebRTC;机器级注册表策略会波及日常浏览器,故用「专用 profile 内装扩展」实现隔离。

### 9.3 多出口 US+CN

分流的固有现象(只 10 个 AI 域名走美国)。日常浏览器接受此现象;敏感 AI 账号操作改用 **9.2 的专用浏览器**(全量美国,检测站只见单一 US)。

## 10. 改完后的生效与复测

1. `node --check` LIVE `Script.js`(已过)。
2. Clash Verge「订阅」页**重新激活**(应用 Script.js)+ **重启/重载核心**(应用 dns_config.yaml)。
3. 验证:生成的 `clash-verge.yaml` 顶层 `ipv6:false`、含 `IN-NAME,clean-us` 规则、DNS 段为新内容;`Test-NetConnection 127.0.0.1 -Port 7900` 通。
4. 开 `clean-us-chrome.bat`,装两扩展,到 `ping0.cc/env` + `browserleaks.com/webrtc` + `whoer.net` 复测:WebRTC 无真实 IP、时区=America/New_York、`ip_country=US` 单一、DNS 不含 CN/HK、无 IPv6。
5. 日常浏览器(7897)分流与国内站访问无回归。
