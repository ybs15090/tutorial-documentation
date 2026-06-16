# 1. 确认当前网络连接名称
```shell
nmcli connection show
```

# 2. 调整WiFi连接的优先级（永久生效）
metric值越小，优先级越高
将WiFi的metric值设为低于有线网络(默认100)（例如50）：
```shell
sudo nmcli connection modify "READMI_K80" ipv4.route-metric 50
or
sudo nmcli connection modify "USTB-Student" ipv4.route-metric 50
```
# 3. 禁止有线连接作为默认路由（关键步骤）
（永久生效）
```shell
sudo nmcli connection modify "Wired_connection_name" ipv4.never-default yes
```
- 替换"Wired connection 1"为实际有线连接名称。
- 此设置会保留有线连接的局域网路由，但阻止其成为默认上网出口。

# 4. 重新激活连接
使配置生效：
```shell

sudo nmcli connection down "Wired_connection_name" && sudo nmcli connection up "Wired_connection_name"

sudo nmcli connection down "READMI_K80" && sudo nmcli connection up "READMI_K80"
```
sudo nmcli connection down "USTB-Student" && sudo nmcli connection up "USTB-Student"

# READMI_K80 密码：11223344


---
必须满足的核心配置:
- 有线连接需设置 ipv4.never-default yes
- 有线与WiFi需处于不同子网






# 其他命令

## 查看所有默认路由的实时metric
ip route show default

## 临时禁用所有手动配置：
sudo nmcli connection modify "连接名称" ipv4.route-metric -1  # 重置为默认
sudo systemctl restart NetworkManager















