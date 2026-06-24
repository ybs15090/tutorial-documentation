#!/usr/bin/env bash
set -u

PROXY_CLASH="http://127.0.0.1:7897"
PROXY_ISP="http://14abb747972c8:eee9682ce7@37.218.215.154:12323"

set_proxy() {
    local url="$1"
    export http_proxy="$url"
    export https_proxy="$url"
    export HTTP_PROXY="$url"
    export HTTPS_PROXY="$url"
    export no_proxy="localhost,127.0.0.1,::1"
    export NO_PROXY="$no_proxy"
}

unset_proxy() {
    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY no_proxy NO_PROXY
}

show_proxy() {
    local http_val https_val
    http_val="${http_proxy:-NONE}"
    https_val="${https_proxy:-NONE}"

    if [[ "$http_val" != "NONE" ]]; then
        http_val="$(echo "$http_val" | sed -E 's#(https?://[^:/]+:)[^@]+@#\1****@#')"
    fi
    if [[ "$https_val" != "NONE" ]]; then
        https_val="$(echo "$https_val" | sed -E 's#(https?://[^:/]+:)[^@]+@#\1****@#')"
    fi

    echo "========================="
    echo "http_proxy  : $http_val"
    echo "https_proxy : $https_val"
    echo "no_proxy    : ${no_proxy:-NONE}"
    echo "========================="
}

case "${1:-menu}" in
    clash)
        set_proxy "$PROXY_CLASH"
        echo "已选择: 本地 Clash 代理"
        ;;
    isp)
        set_proxy "$PROXY_ISP"
        echo "已选择: IProyal 美国 ISP 代理"
        ;;
    off)
        unset_proxy
        echo "未开启代理"
        ;;
    menu|*)
        echo "请选择代理:"
        echo "  [1] 本地 Clash      (127.0.0.1:7897)   <- 默认, 回车即选"
        echo "  [2] IProyal 美国ISP (37.218.215.154:12323)  适合 Claude Code / 脚本"
        echo "  [n] 不使用代理"
        read -r -p "请输入选项 (1/2/n): " userInput

        if [[ -z "${userInput}" || "$userInput" == "1" ]]; then
            set_proxy "$PROXY_CLASH"
            echo "已选择: 本地 Clash 代理"
        elif [[ "$userInput" == "2" ]]; then
            set_proxy "$PROXY_ISP"
            echo "已选择: IProyal 美国 ISP 代理"
        elif [[ "$userInput" == "n" || "$userInput" == "N" ]]; then
            unset_proxy
            echo "未开启代理"
        else
            set_proxy "$PROXY_CLASH"
            echo "输入无效, 默认使用本地 Clash 代理"
        fi
        ;;
esac

show_proxy