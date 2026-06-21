# 检测网址: https://ping0.cc/env

# 公网 IPv4（WebRTC）
高风险检测项命中
实测值：123.112.11.110

# IP 国家 ↔ 时区
IP 所在国与浏览器时区不一致（例：美国 IP 但时区是 Asia/Shanghai），是 VPN 用户最常见的破绽。修法：在浏览器里手动改时区，或用支持时区伪造的 anti-detect 浏览器。
实测值：ip_country=US · tz=Asia/Shanghai

# DNS 解析器 ↔ IP 国家
至少有一个 DNS 解析器落在 IP 出口国之外（例：IP 是美国但有解析器走中国电信），属于 DNS 泄漏。即使部分解析器在本国，只要混入外国解析器就足以让平台识别。修法：改用代理自带的 DNS、或全局走 DoH/DoT。
实测值：ip_country=US · dns_countries=CN,US,HK · foreign_countries=CN,HK

# WebRTC IP ↔ HTTP IP
WebRTC 暴露的公网 IP 和 HTTP 请求 IP 不一致，VPN 经典泄漏。修法：在浏览器里把 WebRTC IP 处理策略设为 default_public_interface_only，或装 WebRTC Control 类扩展。
实测值：rtc_public_ip=123.112.11.110 · http_ip=198.145.174.226 · net_ipv4_ip=198.145.174.226

# 多出口出口国家一致性
多出口检测中拿到的多个公网 IP，经服务端权威反查后落在不同国家 —— split-tunnel VPN / 路由白名单的铁证：一部分流量走 VPN 出口，另一部分走本地直连。修法：检查 VPN 客户端的代理规则（智能分流、PAC、TUN 模式）改成全局代理。
实测值：distinct_v4=66.93.239.89,66.227.127.5,66.93.237.43… · distinct_v6=2001:da8:208:38:be2f:b12e:5554:1b90 · distinct_ip_country=US,CN · sources=[66.93.239.89,66.…

---

# 修复记录(2026-06-21)

治理方案详见 `doc\ISP配置说明.md` 第 9 节。已落地的改动:

| # | 泄露项 | 修复手段 | 状态 |
|---|--------|----------|------|
| 1 | IPv6 → 真实中国 IPv6 | `Script.js` `params.ipv6=false` + `dns_config.yaml` `ipv6:false` | ✅ 已改配置,待复测 |
| 2 | DNS 落 CN/HK | `dns_config.yaml` 删明文8.8.8.8/fallback + `respect-rules:true`,全用国内可达 DoH(alidns/doh.pub);防泄露靠路由(走代理域名在美国端解析),不靠本地 Cloudflare(中国被墙,会令 Decodo 超时) | ✅ 已改配置,待复测 |
| 3 | WebRTC 暴露真实 IP | 专用 profile 内装 WebRTC 防泄漏扩展 | ✅ 真实 IP 已不泄露 |
| 4 | 时区 Asia/Shanghai | 专用 profile 内装时区扩展,固定 America/New_York | ✅ 真实站点已显示纽约 |
| 5 | 多出口 US+CN | 专用「纯美国」浏览器(`clean-us-chrome.bat` → 入站 7900 → 全量美国);日常浏览器保持分流 | ✅ 单一 US |

## 复测结果(2026-06-21,专用 Chrome)

**原 5 项全部消除** ✅:WebRTC 真实 IP、时区、IPv6、DNS 落 CN/HK、多出口 US+CN 均已不再命中。

**复测新发现(更高阶的指纹项)**:

| 项 | 评级 | 实测 | 处理 |
|----|------|------|------|
| WebRTC「已禁用」本身可疑 | 一般 | WebRTC=已禁用 | 改扩展为 `disable_non_proxied_udp`(别全关)→ WebRTC 存在但不泄露 |
| IP↔浏览器语言 | 一般 | `ip_country=US · primary_lang=zh-CN` | `chrome://settings/languages` 把 English(US) 置顶 |
| IP↔中文字体 | 一般 | `has_cn_fonts=true` | OS 级指纹,vanilla Chrome 改不掉;需指纹浏览器(电商场景) |
| **DNS 黑洞(fake-ip)** | **致命** | `resolver_count=0` | HTTP 代理远程 DNS 的副产物;AI 账号可忽略,电商需 TUN+DoH-over-proxy 或指纹浏览器 |

> 详见 `配套Chrome设置说明.md` 第 2.5 / 3.5 节。结论:**网络/IP 层泄露已全清,AI 账号够用**;DNS 黑洞 + 中文字体属 OS 级指纹,要过电商级风控才需上专业指纹浏览器(套同一 Decodo 代理)。

> **最终决定(2026-06-21)**:目标 = **AI 账号场景**,当前状态即为**验收终态**。`DNS 黑洞` + `中文字体` 两项为**已知并接受的残留**,**不再处理**(非 bug,勿重复修);如将来要过电商级风控再考虑专业指纹浏览器。仅剩 2 个易修项可选做:WebRTC 改 `disable_non_proxied_udp`(别全关)、浏览器语言置顶 `en-US`。

**终态快照(2026-06-21,验收通过)**:

| 检测项 | 结果 | 评价 |
|--------|------|------|
| 出口 IP 国家 | `US`(单一) | ✅ 干净 |
| 时区 | `America/New_York` | ✅ 干净 |
| WebRTC↔HTTP | 真实公网 IP 不泄露 | ✅ 干净 |
| IPv6 | 无(已关) | ✅ 干净 |
| DNS 国家 | 不含 CN/HK | ✅ 干净 |
| 多出口国家 | 单一 `US` | ✅ 干净 |
| WebRTC 状态 | 已禁用(可选改 `disable_non_proxied_udp` 更自然) | 🟡 可接受 |
| 浏览器语言 | `zh-CN`(可选置顶 `en-US`) | 🟡 可接受 |
| 中文字体 | `has_cn_fonts=true` | ⚪ 接受残留(OS 级指纹,不修) |
| DNS 黑洞 | `resolver_count=0` | ⚪ 接受残留(远程 DNS 副产物,不修) |

**结论**:面向 **AI 账号场景已验收通过**。✅=已消除的原始泄露;🟡=可选小优化(WebRTC 模式 / 语言),不做也不影响;⚪=已知并接受的 OS 级残留指纹,**不再处理**(详见上方「最终决定」)。

> 若日后实际重测拿到新数值(尤其做了 🟡 两项后),把数据贴来即可更新本表。