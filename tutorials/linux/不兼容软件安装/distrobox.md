# Distrobox 运行不兼容软件

> 用 Distrobox 创建与宿主桌面深度集成的容器，在其中运行当前系统不兼容的应用（如依赖新版本库的 AppImage），GUI 可直接显示在宿主桌面上，体验接近原生。

## 目标

完成本教程后，你将能够：

- [ ] 创建、进入、管理 Distrobox 容器
- [ ] 在容器内运行宿主系统不兼容的应用（以 AppImage 为例）
- [ ] 将容器内应用导出到宿主桌面，像原生应用一样从启动器打开
- [ ] 熟练使用日常管理命令

## 前置条件

- 已安装 Docker 或 Podman（推荐 Podman，无需 root 守护进程）
- 已安装 `distrobox`（`distrobox --version` 可正常输出）
- 一个待运行的应用文件，例如某个 AppImage

<details>
<summary>尚未安装？点此展开安装步骤</summary>

```bash
# 1. 安装容器后端（推荐 Podman）
sudo apt install podman

# 2. 安装 distrobox 本体（官方脚本，版本最新）
curl -s https://raw.githubusercontent.com/89luca89/distrobox/main/install | sh

# 3. 脚本默认装到 ~/.local/bin，确认其在 PATH 中
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Ubuntu 20.04 特殊处理**：官方源不含 Podman，需先添加 Kubic 第三方源：

```bash
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_20.04/ /" \
  | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
curl -fsSL https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_20.04/Release.key \
  | sudo apt-key add -
sudo apt update && sudo apt install podman -y
```

</details>

## 步骤

### 第一步：创建容器

指定一个自定义名称和基础镜像。例如创建一个 Ubuntu 22.04 容器，用来运行需要较新依赖的应用：

```bash
distrobox create --name ubuntu22 --image ubuntu:22.04
```

首次创建会拉取镜像，需要等待。常用镜像还有 `fedora:latest`、`archlinux:latest` 等。

### 第二步：进入容器

```bash
distrobox enter ubuntu22
```

进入后终端提示符会变化，此时你已在容器内部，可以像操作独立系统一样使用它。容器与宿主共享家目录（`$HOME`），因此宿主上的文件在容器内可直接访问。

### 第三步：在容器内运行不兼容的应用

以运行 AppImage 为例，先补齐依赖，再赋予执行权限并运行：

```bash
# 容器内执行
sudo apt update
sudo apt install libfuse2 -y          # AppImage 常见依赖
chmod +x ~/App/cc_switch/CC-Switch-v3.14.0-Linux-x86_64.AppImage
~/App/cc_switch/CC-Switch-v3.14.0-Linux-x86_64.AppImage
```

GUI 应用会直接显示在宿主桌面上。

### 第四步：将应用导出到宿主桌面（推荐）

导出后无需每次手动进容器，可像普通应用一样从启动器打开。

**仍在容器内**执行导出（应用需已生成 `.desktop` 文件）：

```bash
distrobox-export --app cc-switch
```

若提示找不到应用（AppImage 未自动注册），先在容器内手动创建 `.desktop` 文件再导出：

```bash
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/cc-switch.desktop << 'EOF'
[Desktop Entry]
Name=CC Switch
Exec=/home/你的用户名/App/cc_switch/CC-Switch-v3.14.0-Linux-x86_64.AppImage
Icon=cc-switch
Type=Application
Categories=Utility;
EOF

distrobox-export --app cc-switch
```

### 第五步：退出容器

```bash
distrobox exit    # 或按 Ctrl+D
```

## 常用管理命令

| 操作 | 命令 |
| --- | --- |
| 查看所有容器状态 | `distrobox list` |
| 停止容器 | `distrobox stop ubuntu22` |
| 删除容器（保留镜像，下次创建更快） | `distrobox rm ubuntu22` |
| 不进交互模式，直接执行单条命令 | `distrobox enter ubuntu22 -- <命令>` |
| 确认当前终端在宿主还是容器 | `cat /etc/os-release \| grep VERSION` |

例如直接从宿主一条命令启动容器内的应用：

```bash
distrobox enter ubuntu22 -- ~/App/cc_switch/CC-Switch-v3.14.0-Linux-x86_64.AppImage
```

## 升级已安装的应用

应用发布新版本时（AppImage 文件名通常带版本号），**无需重建容器或重装依赖**——容器、依赖、导出配置都能复用，只需让相关 `.desktop` 指向新版文件。

由于容器与宿主共享家目录，导出会在 `~/.local/share/applications/` 下生成多个文件：容器侧原始文件、加了 `<容器名>-` 前缀的宿主包装文件，若注册了 URL scheme 还有 `-handler` 变体。用通配符可一并处理。

### 方法一：替换版本号（快速）

```bash
# 1. 给新版加执行权限
chmod +x ~/App/cc_switch/CC-Switch-新版本-Linux-x86_64.AppImage

# 2. 把所有相关 .desktop 里的旧文件名批量替换为新文件名
sed -i 's/CC-Switch-旧版本-Linux-x86_64.AppImage/CC-Switch-新版本-Linux-x86_64.AppImage/g' \
  ~/.local/share/applications/*cc-switch*.desktop

# 3. 刷新桌面数据库
update-desktop-database ~/.local/share/applications
```

### 方法二：稳定软链接（推荐，一劳永逸）

用一个不带版本号的软链接始终指向最新版，`.desktop` 只需配置一次，以后升级只改软链接：

```bash
# 首次：建立稳定名，并把 .desktop 改为指向它
ln -sf ~/App/cc_switch/CC-Switch-新版本-Linux-x86_64.AppImage \
       ~/App/cc_switch/CC-Switch.AppImage
sed -i -E 's#CC-Switch-v[0-9.]+-Linux-x86_64\.AppImage#CC-Switch.AppImage#g' \
  ~/.local/share/applications/*cc-switch*.desktop

# 以后每次升级：只需重建软链接，无需再碰任何 .desktop
ln -sf ~/App/cc_switch/CC-Switch-更新的版本-Linux-x86_64.AppImage \
       ~/App/cc_switch/CC-Switch.AppImage
```

确认新版正常后，旧版本 AppImage 可自行删除以释放空间。

## 验证

```bash
# 宿主上确认容器已创建并可见
distrobox list

# 导出成功后，在宿主的应用启动器中应能搜索到该应用图标
```

预期：`distrobox list` 列出名为 `ubuntu22` 的容器，且应用能从宿主启动器直接打开。

## 注意事项

- **`distrobox-export` 大小写敏感**：若按短名导出失败，改用完整名称，如 `distrobox-export --app "CC Switch"`。
- **`.desktop` 中的 `Exec` 路径**：必须写应用在宿主上的真实绝对路径，将 `你的用户名` 替换为实际用户名。
- **AppImage 依赖**：多数 AppImage 需要 `libfuse2`，缺失时会报无法挂载的错误。
- **家目录共享**：容器与宿主共用 `$HOME`，在容器内误删家目录文件会同步影响宿主，需谨慎。
- **Ubuntu 20.04**：官方源无 Podman，必须先按前置条件中的 Kubic 源方式安装。

## 参考资料

- [Distrobox 官方网站](https://distrobox.it/)
- [Distrobox GitHub 仓库](https://github.com/89luca89/distrobox)

---

### [返回 Linux 教程](../README.md)
