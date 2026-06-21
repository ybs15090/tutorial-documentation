// ============================================================
//  【自定义区 1】走"美国ISP代理"组的网站(增删主域名即可)
//  只写主域名,会自动匹配其所有子域名(DOMAIN-SUFFIX)
//  改完保存 → 到「订阅」页重新激活一次生效
// ============================================================
const US_ISP_DOMAINS = [
  "claude.ai",            // Claude
  "chatgpt.com",          // ChatGPT
  "openai.com",           // ChatGPT 登录/接口(必需)
  "oaistatic.com",        // ChatGPT 静态资源(必需)
  "oaiusercontent.com",   // ChatGPT 用户内容(必需)
  "gemini.google.com",    // Gemini
  "myaccount.google.com", // Google 账号
  "cloud.google.com",     // Google Cloud 及其子站
  "accounts.google.com",  // Google 登录(保证账号 IP 一致)
  "google.com",           // search服务
];

// ============================================================
//  【自定义区 2a】Decodo 高并发主力(10端口负载均衡,每端口绑定一个固定美国IP)
//  https://dashboard.decodo.com/welcome
//  ★★★ IP 变了 / 换套餐,只改下面 endpoints 数组里的 ip 值 ★★★
//  来源:Decodo 后台「导出代理」选 "指定IP"(=你给的 data(2).txt),每行形如
//        https://user-spabrx2pvj-ip-12.12.112.180:密码@isp.decodo.com:10001
//        把每行 "-ip-" 后面那段 IP 填到对应端口的 ip: 即可(端口一般不变)。
//  改完保存 →「订阅」页重新激活。账号变改 user,密码变改 password。
//
//  免维护替代:不想每次改IP的话,把"1a生成节点"处用户名改成
//        "user-"+DECODO.user+"-country-us"(锁美国、IP自动分配),就无需管IP变化,
//        代价是失去"每站固定IP",按需取舍。
// ============================================================
const DECODO = {
  server: "isp.decodo.com",
  user: "spabrx2pvj",            // ← 账号(用户名)变了改这里
  password: "94pnGqp77XqKiVebt~", // ← 密码变了改这里
  tls: true,  // HTTPS 加密"本机→代理"这一跳(证书已验证合法)
  // ↓↓↓ IP 变了改这里:每个端口对应一个固定美国IP ↓↓↓
  endpoints: [
    { port: 10001, ip: "12.12.112.180" },
    { port: 10002, ip: "66.93.228.227" },
    { port: 10003, ip: "198.145.174.226" },
    { port: 10004, ip: "66.93.239.152" },
    { port: 10005, ip: "208.240.26.220" },
    { port: 10006, ip: "12.12.118.73" },
    { port: 10007, ip: "66.93.237.43" },
    { port: 10008, ip: "66.227.127.5" },
    { port: 10009, ip: "198.145.174.190" },
    { port: 10010, ip: "66.93.239.89" },
  ],
};

// ============================================================
//  【自定义区 2b】其它单端口 ISP(备用,并发低,只适合轻站/脚本)
// ============================================================
const US_ISP_PROXIES = [
  { // BrightData — 抗并发中等(备用,按GB计费)
    name: "BrightData-ISP-US",
    type: "http",
    server: "brd.superproxy.io",
    port: 33335,
    username: "brd-customer-hl_dc8c0b49-zone-isp_proxy1",
    password: "xdv58cl2g2lt",
    tls: false
  },
  { // IProyal — 并发低(备用,只适合 claude 轻站或脚本单连接)
    name: "IProyal-ISP-US",
    type: "http",
    server: "37.218.215.154",
    port: 12323,
    username: "14abb747972c8",
    password: "eee9682ce7",
    tls: false
  }
];

// ============================================================
//  【自定义区 3】注入「🔰 节点选择」做全局的节点(留空=不做全局)
//  🔄 Decodo-LB 是负载均衡(10IP分摊),可做全局备选;
//  单端口 ISP(BrightData/IProyal)并发低,别放进来做全局
// ============================================================
const EXPOSE_IN_SELECTOR = ["🔄 Decodo-LB"];
// ============================================================

// Define main function (script entry)
function main(params) {
  const GROUP_NAME = "🅑 美国ISP";
  const LB_NAME = "🔄 Decodo-LB";
  const SELECTOR = "🔰 节点选择";

  const CLEAN_LISTENER = "clean-us"; // 专用纯美国浏览器的独立入站(端口 7900)

  if (!Array.isArray(params.proxies)) params.proxies = [];
  if (!Array.isArray(params["proxy-groups"])) params["proxy-groups"] = [];
  if (!Array.isArray(params.rules)) params.rules = [];
  if (!Array.isArray(params.listeners)) params.listeners = [];

  // 0. 关闭 IPv6:HTTP 代理(Decodo/IProyal)都是 IPv4-only,开 IPv6 会让
  //    IPv6 流量绕过代理直连 → 暴露真实中国 IPv6(2001:da8:: = CERNET)。
  params.ipv6 = false;

  // 0b. 专用「纯美国」入站:浏览器用 --proxy-server 127.0.0.1:7900 连这里,
  //     配合下方 IN-NAME 规则把它的全部流量送进 🅑 美国ISP(全量走美国)。
  if (!params.listeners.some(l => l && l.name === CLEAN_LISTENER)) {
    params.listeners.unshift({
      name: CLEAN_LISTENER,
      type: "http",
      listen: "127.0.0.1",
      port: 7900
    });
  }

  // 1a. 生成 Decodo 多端口节点(去重)
  const decodoNames = [];
  DECODO.endpoints.forEach(function (ep, i) {
    const name = "Decodo-" + String(i + 1).padStart(2, "0");
    decodoNames.push(name);
    if (!params.proxies.some(p => p && p.name === name)) {
      params.proxies.unshift({
        name: name,
        type: "http",
        server: DECODO.server,
        port: ep.port,
        username: "user-" + DECODO.user + "-ip-" + ep.ip, // 绑定固定美国IP
        password: DECODO.password,
        tls: DECODO.tls,
        sni: DECODO.server
      });
    }
  });

  // 1b. 其它单端口 ISP 节点(去重)
  for (const proxy of US_ISP_PROXIES) {
    if (!params.proxies.some(p => p && p.name === proxy.name)) {
      params.proxies.unshift(proxy);
    }
  }

  // 2a. Decodo 负载均衡组:consistent-hashing = 同一目标网站固定走同一IP
  //     既保证每个站静态IP(账号安全),又把不同站点分散到10个IP(不过载)
  if (!params["proxy-groups"].some(g => g && g.name === LB_NAME)) {
    params["proxy-groups"].unshift({
      name: LB_NAME,
      type: "load-balance",
      strategy: "consistent-hashing",
      proxies: decodoNames,
      url: "https://www.gstatic.com/generate_204",
      interval: 300
    });
  }

  // 2b. 🅑 美国ISP 选择组(默认出口 = Decodo 负载均衡)
  if (!params["proxy-groups"].some(g => g && g.name === GROUP_NAME)) {
    const groupProxies = [LB_NAME].concat(US_ISP_PROXIES.map(p => p.name));
    if (params["proxy-groups"].some(g => g && g.name === SELECTOR)) {
      groupProxies.push(SELECTOR);
    }
    groupProxies.push("DIRECT");
    params["proxy-groups"].unshift({
      name: GROUP_NAME, type: "select", proxies: groupProxies
    });
  }

  // 2.5 将指定节点注入「🔰 节点选择」做全局(默认留空)
  const selectorGroup = params["proxy-groups"].find(g => g && g.name === SELECTOR);
  if (selectorGroup && Array.isArray(selectorGroup.proxies)) {
    for (const name of EXPOSE_IN_SELECTOR.slice().reverse()) {
      if (!selectorGroup.proxies.includes(name)) {
        selectorGroup.proxies.unshift(name);
      }
    }
  }

  // 3. 规则置顶(从上往下匹配)
  // 3a. 直连各 ISP 代理端点:防止 TUN 把"本机连代理"流量绕进节点(双重代理/超时)
  const directRules = [
    "IP-CIDR,37.218.215.154/32,DIRECT,no-resolve", // IProyal 静态IP
    "DOMAIN-SUFFIX,superproxy.io,DIRECT",           // BrightData 网关
    "DOMAIN-SUFFIX,decodo.com,DIRECT",              // Decodo 网关
  ];
  // 3b. 专用入站 clean-us 的全部流量 → 🅑 美国ISP(全量走美国,不分流)
  //     放在 ispRules 前:该浏览器访问任何站都命中此规则走美国;7897 日常分流不受影响。
  //     想让专用浏览器锁单一固定美国IP,把 GROUP_NAME 换成某个单节点如 "Decodo-03"。
  const cleanRules = [`IN-NAME,${CLEAN_LISTENER},${GROUP_NAME}`];

  // 3c. 指定网站走「美国ISP」组
  const ispRules = US_ISP_DOMAINS.map(d => `DOMAIN-SUFFIX,${d},${GROUP_NAME}`);

  // 幂等:移除本脚本以前加过的同类规则,避免叠加
  params.rules = params.rules.filter(r => !(typeof r === "string" && (
    r.includes(`,${GROUP_NAME}`) ||
    r.includes(`IN-NAME,${CLEAN_LISTENER}`) ||
    r.includes("37.218.215.154") ||
    r.includes("superproxy.io") ||
    r.includes("decodo.com")
  )));
  params.rules = directRules.concat(cleanRules).concat(ispRules).concat(params.rules);

  return params;
}
