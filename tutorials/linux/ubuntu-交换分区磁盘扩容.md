# Ubuntu 根分区扩容：合并左侧闲置 Swap 分区

> 将物理位置位于根分区左侧的闲置 swap 分区（`/dev/nvme0n1p2`）删除，并将释放的空间合并进根分区（`/dev/nvme0n1p3`）。

## 目标

完成后根分区容量从 ~92 GiB 增加至 ~100 GiB，系统 swap 继续由 `/swapfile` 提供，不受影响。

## 当前分区布局（操作前参考）

```
nvme0n1        953.9G
├─nvme0n1p1    476M   vfat   /boot/efi
├─nvme0n1p2    7.6G   swap   （未挂载，待删除）
├─nvme0n1p3    92.2G  ext4   /
├─nvme0n1p4    851.7G ntfs   Data（Windows 数据盘）
└─nvme0n1p5    2G     ntfs   WINRE_DRV
```

**确认 swap 分区未在使用中**（操作前验证）：

```bash
swapon --show
```

预期输出中只有 `/swapfile`，无 `/dev/nvme0n1p2`，说明可安全删除。

## 前置条件

- 已将重要数据备份至外部设备
- 笔记本连接电源适配器（全程不可断电）
- 准备好 Ubuntu 20.04 Live USB（U 盘）

## 步骤

### 第一阶段：进入 Live USB 环境

1. 将 Live USB 插入电脑并重启。
2. 开机出现联想 Logo 时按 **F12**（或 Fn+F12）进入启动项菜单，选择从 U 盘启动。
3. 引导菜单中选择 **Try Ubuntu**，进入临时桌面（不要选 Install）。

### 第二阶段：GParted 分区调整

1. 打开应用菜单，搜索并启动 **GParted**。
2. 右上角磁盘下拉菜单选择 `/dev/nvme0n1`（约 953.87 GiB）。
3. 右键点击 `/dev/nvme0n1p2`（linux-swap，约 7.63 GiB）→ 选择 **Delete**。  
   该分区释放后显示为灰色 `unallocated`（未分配）状态。
4. 右键点击 `/dev/nvme0n1p3`（ext4，约 92.18 GiB）→ 选择 **Resize/Move**。
5. 在调整窗口中，将分区方块的**左侧边缘向左拖到底**，使 **"Free space preceding (MiB)"** 变为 `0`。
6. 点击 **Resize/Move** 确认。
7. 点击顶部工具栏的绿色对号图标（**Apply All Operations**）执行所有更改。

> 由于未分配空间位于根分区**左侧**，GParted 需要将数十 GiB 的数据在底层物理扇区上整体向左平移，耗时可能达数十分钟，请耐心等待进度条完成，**切勿中断**。

### 第三阶段：重启验证

1. GParted 提示操作成功后关闭软件。
2. 重启，在重启过程中拔掉 U 盘，引导进入 Ubuntu 硬盘系统。

## 验证

```bash
# 确认根分区容量已增加（约 99–100 GiB）
df -h /

# 确认 swap 仍由 /swapfile 提供，状态正常
free -h
swapon --show
```

预期输出（`swapon --show`）：

```
NAME      TYPE SIZE  USED PRIO
/swapfile file   2G    …   -2
```

## 注意事项

- **为什么必须用 Live USB**：Linux 不允许对当前挂载为 `/` 的活动分区执行移动或缩放，因此必须在 Live 环境中以卸载状态操作。
- **为什么耗时长**：右侧扩容只需改分区表末尾指针，速度极快；左侧扩容必须平移整个分区的物理数据，数据量越大耗时越长。
- **Windows 分区安全**：`nvme0n1p4`（Data）和 `nvme0n1p5`（WINRE_DRV）不涉及本次操作，无需担心。
