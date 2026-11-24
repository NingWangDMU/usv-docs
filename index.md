---
title: 首页
layout: home
nav_order: 1
description: Unity无人艇工程：项目蓝图、可复现验证记录与新手指南
permalink: /
---

# Unity无人艇工程
{: .fs-9 }

建设以Unity3D为核心、贯通仿真建模、算法开发、智能训练、系统测试与实艇验证的一体化平台。
{: .fs-6 .fw-300 }

[快速开始](#快速导航){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[查看仓库](https://github.com/NingWangDMU/usv-docs){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## 项目概况

**MARUS 2.0 是当前复用基线**，不是项目的最终目标。现阶段先完成最小闭环复现与接口验证，再逐步接入自有模块。

**当前阶段**：阶段 1 · 原版最小闭环（进行中）  
**下一步**：短时速度/位移验收（待批准）

{: .warning }
本站工程结论是历史验证基线，不是打开页面时的实时复查。

---

## 快速导航

<div class="code-example" markdown="1">

### 📐 项目与架构
- [项目总览]({% link docs/architecture/overview.md %}) - 项目分类、数据流、推进力单位与施力关系
- [阶段路线与进度]({% link docs/architecture/roadmap.md %}) - 开发阶段、验收要点、历史验证证据

### ⚙️ 运行与验收
- [环境与工程锁定]({% link docs/operations/environment.md %}) - Unity 6000.5.11f1、ROS2 Jazzy、锁定SHA
- [可复现操作]({% link docs/operations/procedures.md %}) - 启动适配器、WASD控制
- [已有验证结果]({% link docs/operations/verification.md %}) - 历史验证记录、单位换算、施力公式

### ⚠️ 问题与记录
- [已知问题清单]({% link docs/issues/known-issues.md %}) - 渲染异常、GPS待验证、响应未验收
- [源码与状态限定]({% link docs/issues/code-status.md %}) - HEAD差异、未保存场景、许可证边界

</div>

---

## 技术栈

| 组件 | 版本 |
|:-----|:-----|
| Unity Editor | 6000.5.11f1 |
| ROS 2 | Jazzy |
| 操作系统 | Ubuntu 24.04 |
| 仿真基线 | MARUS 2.0 |

---

## 关于本文档

本文档使用 [Just the Docs](https://just-the-docs.com) Jekyll主题构建，托管在GitHub Pages。

- 所有本地文件路径已替换为环境变量占位符
- 源码遵循MIT许可证
- 欢迎通过 [GitHub Issues](https://github.com/NingWangDMU/usv-docs/issues) 反馈

