---
title: 数据流与系统架构
parent: 项目与架构
nav_order: 2
---

# 数据流与系统架构
{: .no_toc }

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 数据流概述

**必须按方向分开看，不要画成一条单向链。** 第一行是控制指令进入 Unity 并走到刚体施力（该链路在图中拆成两行，方向都是从左到右）；第二段是 GPS 观测从 Unity 回到 ROS 话题；第三段是本地键盘，直接改 `Transform`，不走推进器物理路径。适配器默认只在回环地址监听。

- <i class="sw-ros"></i>ROS 侧
- <i class="sw-adp"></i>适配器 `marus2_ros_adapter`
- <i class="sw-unity"></i>Unity / MARUS 原版模块
- <i class="sw-key"></i>本地键盘（非物理、独立）
{: .legend }

{% include dataflow.html %}

---

## 新手术语解释

| 术语 | 说明 |
|:-----|:-----|
| **gRPC** | Unity（`RosConnection`）与 ROS 适配器之间的远程调用协议 |
| **FixedUpdate** | Unity 按物理步进调用的更新函数，推进力在此经 `AddForceAtPosition` 施加 |
| **NavSatFix** | ROS 常用卫星定位消息；已验证的是消息可达，不是精度或坐标约定 |
| **Transform** | 位置与朝向（本地键盘直接改它） |
| **Rigidbody** | 刚体（推进器路径的终点） |

{: .note }
以上术语解释基于当前复用基线的技术栈，不代表最终架构锁定。

