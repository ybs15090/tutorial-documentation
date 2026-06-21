# 配套 Chrome 设置说明 · 专用「纯美国」浏览器

> 配合 `clean-us-chrome.bat` 使用。本文件只讲**专用纯美国 Chrome** 的扩展安装与设置;路由/DNS/泄露原理见 `ISP配置说明.md` 第 9 节,操作总览见 `..\CLAUDE.md` 操作 E。

## 0. 前提

1. Clash Verge 已对当前订阅**重新激活**,且入站 `127.0.0.1:7900` 已监听
   (验证:`Test-NetConnection 127.0.0.1 -Port 7900 -InformationLevel Quiet` 返回 `True`)。
2. 双击根目录 `clean-us-chrome.bat` 打开**专用 Chrome**(独立 profile,`E:\APP\clash-VPN\clean-us-profile`,与日常 Chrome 完全隔离)。
3. 下面两个扩展**只在这个专用 profile 里装一次**,不影响日常浏览器。

> 扩展一律从官方 Chrome 网上应用店安装:<https://chrome.google.com/webstore> 。
> 认准**用户量大、评分高**的,警惕同名山寨。

---

## 1. WebRTC 防泄漏(消除真实公网 IP 泄露)

**为什么需要**:代理是 HTTP(只走 TCP),WebRTC 走 UDP 不经代理 → 会直接枚举本机网卡暴露真实中国 IP(`123.112.11.110` / `2001:da8::`)。

> ⚠️ **别"完全禁用 WebRTC"**(踩过):检测站会把"WebRTC 被关"本身判为反指纹工具特征(`WebRTC 已禁用 → 可疑`)。
> 正确做法 = 让 WebRTC **存在但不泄露**:用 **`disable_non_proxied_udp`(禁用非代理 UDP)**。RTCPeerConnection 仍在,但只拿到 `.local`(mDNS)候选——这正是**现代 Chrome 普通用户的默认行为**,既不露真实 IP,也不被判"可疑关闭"。

| 扩展 | 设置 | 说明 |
|------|------|------|
| **WebRTC Network Limiter**(Google 官方,最可信) | 选 **"disable non-proxied UDP"**(**不要**选"完全禁用") | 推荐。WebRTC 仍在,只堵非代理 UDP,最像正常用户 |
| **WebRTC Leak Prevent** | 策略选 `disable_non_proxied_udp` | 同上,可手动选策略 |
| ~~WebRTC Control(全开/全关)~~ | — | **不推荐**:只能全关,会被判"WebRTC 已禁用 → 可疑" |

---

## 2. 时区伪造(消除时区与美国 IP 不符)

**为什么需要**:浏览器默认读 OS 时区 = `Asia/Shanghai`,与美国出口 IP 矛盾,是 VPN 用户最常见破绽。

| 扩展 | 设置 |
|------|------|
| **Change Timezone (Time Shift)**(搜 "Change Timezone") | 把时区固定为 **`America/New_York`**(下拉选 New York / Eastern Time / UTC-05:00) |

> 同类(`Timezone Changer` 等)均可,只要能**固定一个 IANA 时区**并能选 `America/New_York`。
> 它改的是 JS `Date` / `Intl` 时区,正是检测站读取的值。
> 时区取 `America/New_York`(东部)是 10 个美国 IP 的折中值;consistent-hashing 下不同站会命中不同地区 IP,无法逐站精确匹配。

---

## 2.5 浏览器语言(消除语言与美国 IP 不符)

**为什么需要**:`navigator.languages[0]=zh-CN` 与美国 IP 矛盾,是常见破绽。

- 专用 Chrome 里:`chrome://settings/languages` → 添加 **English (United States)** → 拖到**最顶** → 勾"用这种语言显示 Google Chrome" → **重启浏览器**。
- 这样 `navigator.languages` 首位变 `en-US`,`Accept-Language` 也随之变。
- `clean-us-chrome.bat` 已带 `--lang=en-US`(管 UI 语言);但 `navigator.languages` 必须靠上面的设置改,缺一不可。

---

## 3. 装完验证(就在这个专用 Chrome 里)

**① 时区**:按 `F12` 打开控制台,粘贴回车:
```js
Intl.DateTimeFormat().resolvedOptions().timeZone
```
应返回 `"America/New_York"`。

**② WebRTC**:打开 <https://browserleaks.com/webrtc> —— 应**看不到真实公网 IP**(理想是 WebRTC 无任何 IP)。

**③ 语言**:控制台输入 `navigator.languages` → 首位应为 `"en-US"`。

**④ 整体复测**:打开 <https://ping0.cc/env> ,确认:
- `ip_country = US` 单一
- 时区 = `America/New_York`
- 语言 `primary_lang = en-US`
- DNS 不含 CN / HK
- 无 IPv6
- WebRTC **不暴露真实 IP**,且**不是"已禁用"**(应是 `disable_non_proxied_udp` 状态)

把 `ping0.cc/env` 结果填到 `Chrome网络环境检测结果.md` 的"复测结果(待填)"几行;哪项还不干净再针对性调。

---

## 3.5 残留指纹与边界(vanilla Chrome 的天花板)

这套 **Clash + Chrome + 扩展** 解决的是**网络/IP 层**泄露(IP、WebRTC、时区、IPv6、DNS 国别),对 **AI 账号(Claude/ChatGPT/Google)足够**。但有两项**操作系统级指纹**普通 Chrome 触及不到:

| 项 | ping0 评级 | 为什么难修 | 处理 |
|----|-----------|-----------|------|
| **DNS 黑洞**(`resolver_count=0`) | 致命 | "全量走 HTTP 代理 = 远程 DNS = 本机一条 DNS 都不出网"的副产物(其实是 DNS 藏得太干净)。当前非 TUN 架构两难:远程 DNS→黑洞;本地 DNS→又露中国解析器 | AI 账号可忽略(电商风控才用)。要彻底:上 TUN + DoH-over-proxy,或换指纹浏览器 |
| **中文字体**(`has_cn_fonts=true`) | 一般 | 系统装了 SimSun/雅黑,暴露真实 OS 是中文环境;Chrome 无法对网站隐藏已装字体 | 同上,需指纹浏览器伪造字体列表 |

> **要过电商级风控**(Amazon/eBay 等):正解是**专业指纹浏览器**(AdsPower / Multilogin / GoLogin / Dolphin Anty 等)**套同一个 Decodo 美国代理**,它会一并伪造字体/语言/Canvas/WebGL 并让 DNS 看起来正常。本方案专注 AI 账号场景,不覆盖电商级 OS 指纹伪造。

---

## 4. 日常使用约定

- **敏感 AI 账号操作**(登录、注册、长期挂账号)→ 一律用这个专用 Chrome(`clean-us-chrome.bat`),全量走美国 + 无泄露。
- **日常浏览** → 继续用平时的 Chrome(系统代理 7897,分流,不受影响)。
- 两个浏览器的 profile 完全隔离,Cookie / 登录态 / 扩展互不干扰。

## 5. 常见问题

| 现象 | 原因 / 处理 |
|------|------------|
| bat 提示 `127.0.0.1:7900 is NOT listening` | 没重新激活或核心没重载;到 Clash Verge「订阅」页重新激活,再重载核心 |
| 专用 Chrome 打不开任何网页(`ERR_PROXY_CONNECTION_FAILED`) | 7900 没起,同上;或 Decodo 节点超时(看 Decodo 测速 / `logs\service\service_latest.log`) |
| 时区控制台仍显示 `Asia/Shanghai` | 时区扩展没设成 `America/New_York`,或装在了日常浏览器而非专用 profile |
| browserleaks 仍露真实 IP | WebRTC 扩展没启用 / 没设 `disable_non_proxied_udp`;或装错 profile |
| 想锁单一固定美国 IP(更像真人) | 改 LIVE `Script.js` 里 `IN-NAME,clean-us,🅑 美国ISP` 的目标为某单节点(如 `Decodo-03`)→ 重新激活 |
