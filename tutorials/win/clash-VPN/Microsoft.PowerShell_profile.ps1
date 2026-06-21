# Set-Location ~

# 询问使用哪个代理
Write-Host "请选择代理:" -ForegroundColor Cyan
Write-Host "  [1] 本地 Clash      (127.0.0.1:7897)   <- 默认, 回车即选"
Write-Host "  [2] IProyal 美国ISP (37.218.215.154:12323)  适合 Claude Code / 脚本"
Write-Host "  [n] 不使用代理"
$userInput = Read-Host "请输入选项 (1/2/n)"

# 统一设置代理环境变量(大小写都设, 兼容各类 CLI 含 Claude Code)
function Set-ProxyEnv($url) {
    $env:http_proxy  = $url; $env:https_proxy  = $url
    $env:HTTP_PROXY  = $url; $env:HTTPS_PROXY  = $url
}

if ($userInput -eq '1' -or [string]::IsNullOrEmpty($userInput)) {
    Set-ProxyEnv "http://127.0.0.1:7897"
    Write-Host "已选择: 本地 Clash 代理" -ForegroundColor Green
} elseif ($userInput -eq '2') {
    Set-ProxyEnv "http://14abb747972c8:eee9682ce7@37.218.215.154:12323"
    Write-Host "已选择: IProyal 美国 ISP 代理" -ForegroundColor Green
} elseif ($userInput -eq 'n' -or $userInput -eq 'N') {
    Set-ProxyEnv $null
    Write-Host "未开启代理。" -ForegroundColor Yellow
} else {
    Set-ProxyEnv "http://127.0.0.1:7897"
    Write-Host "输入无效, 默认使用本地 Clash 代理。" -ForegroundColor Red
}

# 自动输出配置文件路径和代理状态(显示时隐藏密码)
$displayHttp  = if ($env:http_proxy)  { $env:http_proxy  -replace '://([^:]+):([^@]+)@', '://$1:****@' } else { "NONE" }
$displayHttps = if ($env:https_proxy) { $env:https_proxy -replace '://([^:]+):([^@]+)@', '://$1:****@' } else { "NONE" }
Write-Host "`n=========================" -ForegroundColor Cyan
Write-Host "PowerShell 配置文件 : $PROFILE"
Write-Host "http_proxy     : $displayHttp"
Write-Host "https_proxy    : $displayHttps"
Write-Host "===========================" -ForegroundColor Cyan
