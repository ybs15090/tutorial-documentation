# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库用途

纯 Markdown 文档仓库，用于存放可在 GitHub 上跨设备阅读的操作教程。无构建系统、无测试框架、无依赖。

## 文档规范

**新建教程**：复制 `template.md` 到对应分类目录，文件名使用小写字母和连字符（如 `install-docker.md`）。

**必填章节**（按顺序）：目标 → 前置条件 → 步骤 → 验证 → 注意事项 → 参考资料

**添加教程后需同步更新**：
1. 该分类的 `tutorials/<category>/README.md` — 在教程列表中加链接
2. 根目录 `README.md` 的"快速索引"部分 — 视重要程度决定是否添加

## 目录结构

```
tutorials/
├── linux/       # 系统管理、命令行、环境配置
├── dev-tools/   # Git、Docker、编辑器等工具
├── networking/  # 网络配置、代理、防火墙
└── misc/        # 不属于以上分类的杂项
```

新分类须在根 `README.md` 的分类表格中同步添加一行。
