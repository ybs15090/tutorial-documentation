# 常用命令
## 复制
scp [选项] [源文件] [目标路径]

    -r：递归复制整个目录。
    -P：指定远程主机的 SSH 端口号（默认是 22）。
    -p：保留文件的修改时间、访问时间和权限。
    -v：显示详细的调试信息，有助于排查问题。
    -C：启用压缩，可以加快传输速度。
例如: scp -r 本地文件夹路径 账号名@ip:路径


---


















# 更新
```shell
sudo apt update && sudo apt upgrade
```

# 安装ssh服务器:
```shell
sudo apt install openssh-server
```

# 检查服务器状态
```shell
sudo systemctl status ssh
  or
service ssh status
```

## 如果 SSH 服务没有运行，运行它：
```shell
sudo systemctl enable --now ssh
```

# 配置 UFW 允许 ssh 接入
` sudo ufw allow ssh `
## 关闭防火墙:
```shell
sudo systemctl stop ufw

sudo systemctl disable ufw
```

默认网关: 10.111.48.223
# 查看默认网关:
```shell
ip route | grep default
```

## 查看ip地址:
```shell
ip addr show | grep inet

sudo hostname -I | tr ' ' '\n'
```

# 建立 ssh 连接:
```shell
ssh <客户端用户名>@<服务端ip地址>
```

# 退出ssh:
```shell
Ctrl + D
or
logout
```

---

# 使用优化
1. 生成密钥对
本地客户端生成公私钥：（一路回车默认即可）
```
ssh-keygen
```
上面这个命令会在用户目录.ssh文件夹下创建公私钥:
    id_rsa （私钥）
    id_rsa.pub (公钥)
2. 将公钥上传至树莓派
```
ssh-copy-id -i ~/.ssh/id_rsa.pub 账号@ip
```

---

# 让 GUI 显示在服务端本机屏幕

# 1. 设置正确的 DISPLAY 环境变量

export DISPLAY=:0  # 指向服务端本机第一个显示设备

# 2. 复制有效的 Xauthority 认证令牌

## 	方法一：从当前图形会话用户获取凭证（推荐）

xauth list | grep "$(echo $DISPLAY | sed 's/:/ /')" | xauth merge -

    此命令从当前活跃的图形会话中提取认证令牌，并合并到 SSH 会话的环境。
    
##	方法二：临时放宽权限（仅测试用，不安全）

xhost +local:  # 允许本地所有用户连接（生产环境禁用！）

---

# 让 GUI 显示在客户端屏幕

# 1. 服务端（远程 Linux 服务器）配置

## （1）启用 SSH X11 转发
sudo nano /etc/ssh/sshd_config

确保以下配置项取消注释且值为 yes：
```
X11Forwarding yes
X11UseLocalhost yes  # 增强安全性（推荐）
X11DisplayOffset 10   # 默认值，通常无需修改
```

##（2）安装 xauth 认证工具
sudo apt install xauth -y

##（3）重启 SSH 服务
sudo systemctl restart ssh

---

# 二、连接与使用方法

# 1. 通过 SSH 启用 X11 转发
ssh -Y 用户名@服务器IP     或者 -X（更安全，兼容性略差）
C
#（2）验证配置是否生效
echo $DISPLAY

    - 正常输出：localhost:10.0（表示 X11 转发已激活）。
    - 异常输出：若为空或 :0，说明配置失败。
    
# （3）运行 GUI 程序测试
gedit
or
xeyes

# 优化
GUI 程序启动慢或卡顿
X11 协议对网络延迟敏感

启用 SSH 压缩：` ssh -XC 用户名@服务器IP `

1. 持久化配置（免每次加 -X）
在客户端的 ~/.ssh/config 中添加：
```
Host 服务器别名
    HostName 服务器IP
    User 用户名
    ForwardX11 yes      # 启用可信转发
    ForwardX11Trusted yes  # 启用无限制转发（可选）
```









