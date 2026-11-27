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

**当前阶段**：阶段 1 · 原版最小闭环（进行中；速度 / 位移已记录；GNSS 三项结论已记录；推进与转向离散短脉冲已记录；IMU / LiDAR 与 TF 树静止核验已记录）  
**下一步**：下一工程工作包待定（GNSS 正式墙钟 `hz` 仍未补测；不自动授权激活相机 / 声呐、持久挂载根 TF，或新的推进、转向与运动态试验）

{: .warning }
本站工程结论是已整理的验证记录，不是打开页面时的实时复查。速度与位移已有 2026-11-25 测试场景的本机实测记录；同日晚间又记录了多档前向、左右单侧、艏侧与对称倒车的离散短脉冲，仍**不能写成动力学已验证或完整推进曲线已验收**。同日 GNSS 核验已记录发布频率、坐标系约定，以及数值正确性无法核验的条件，仍**不能写成定位已验收或 GPS 精度已通过**。2026-11-26 至 2026-11-27 又记录了静止条件下的 IMU / LiDAR 话题结构、消息头时间戳间隔与默认 `/tf` 边集，并用方案 A 做了未保存的临时根 TF 验证，仍**不能写成 IMU / LiDAR 已标定、精度已通过，或官方 Prefab / 已保存测试场景已持久挂载完整 TF 树**。

---

## 快速导航

<div class="code-example" markdown="1">

### 📐 项目与架构
- [项目总览]({% link docs/architecture/overview.md %}) - 项目分类、数据流、推进力单位与施力关系
- [阶段路线与进度]({% link docs/architecture/roadmap.md %}) - 开发阶段、验收要点、历史验证与本机实测证据

### ⚙️ 运行与验收
- [环境与工程锁定]({% link docs/operations/environment.md %}) - Unity 6000.5.11f1、ROS2 Jazzy、锁定SHA
- [可复现操作]({% link docs/operations/procedures.md %}) - 启动适配器、WASD控制、测试场景运动、GNSS、推进短脉冲与 IMU / LiDAR / TF 的已完成记录
- [已有验证结果]({% link docs/operations/verification.md %}) - 历史验证记录、单位换算、测试场景运动验收、GNSS 三项结论、推进与转向离散短脉冲、IMU / LiDAR 与 TF 树核验

### ⚠️ 问题与记录
- [已知问题清单]({% link docs/issues/known-issues.md %}) - 渲染异常、GNSS / IMU 频率与设定不一致、数值正确性无法核验、推进曲线与动力学精度未验收、官方示例默认 TF 树不含根边
- [源码与状态限定]({% link docs/issues/code-status.md %}) - HEAD差异、原场景未覆盖保存、许可证边界

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

- 所有本地文件路径已替换为环境变量占位符或可移植写法
- 源码遵循MIT许可证
- 欢迎通过 [GitHub Issues](https://github.com/NingWangDMU/usv-docs/issues) 反馈

{: .metadata }
**页面元数据**: 文档整理日期 2026-11-27 · 状态: 2026-11-27 已纳入站点，记录阶段 1 IMU / LiDAR 与 TF 树核验及方案 A 临时根 TF 验证
