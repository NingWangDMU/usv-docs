---
title: 源码与状态限定
parent: 问题与记录
nav_order: 2
last_modified_date: 2026-11-27
---

# 源码与状态限定
{: .no_toc }

本页记录源码范围、工作区状态的限定说明。**不能概括为整个工程干净**。

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 源码与工作区状态限定说明

| 项 | 内容 |
| --- | --- |
| 已确认（历史） | 清理诊断代码后，仅 `Thruster.cs`、`ThrusterController.cs`、`AUVRosController.cs` 相对 HEAD 无差异 |
| 不得概括为干净 | 仍有未跟踪的备份文件；主工程此前存在图片暂存差异 |
| 场景 | 当时场景显示未保存，且说明未写入磁盘。当前原 `ExampleScene` 是否仍有未保存标记，本次未再核对 |
| 许可证 | 未逐项核查；旧运行说明中把相关仓库统一写成同一许可证的概括已收回，不再沿用 |

{: .note }
新问题或状态变化时应同步更新本页，并关联具体日志或提交；不要在没有新证据时改写归因。

## 记录器升级与隔离边界

2026-11-25 已审阅的记录器工作与上一节历史限定同时成立，范围不同。

- 原示例工程早期已经备份，并由脚本 1220 从记录器 1043 应用到 1153。四份记录器相关源码与 1153 一致，`.meta` 与 `BoatPhysics` 未改。随后在 Unity 6000.5.11f1 编译为 0 个错误、61 个警告，未进入 Play。
- 后期隔离测试在独立工程进行，不触碰原工程已有的未保存场景。
- 这次升级不把整个工程标成干净，也不改写「清理诊断代码后仅 `Thruster.cs`、`ThrusterController.cs`、`AUVRosController.cs` 相对当时 HEAD 无差异」的历史限定。本次文档没有重新 diff 当前工作区。当前原场景是否仍未保存，也未再核对。

计数、计划标识和完整 SHA256 见 [已有验证结果 §记录器局部验证]({% link docs/operations/verification.md %}#记录器局部验证)。

## 测试场景与原场景边界

2026-11-25 阶段 1 运动验收使用了独立测试场景 `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`。该文件由 `ExampleScene` **另存（Saved As）** 得到。

- 原 `ExampleScene` **没有**被这次验收覆盖保存，不能把本次结果读成主示例场景已经改写。
- 只在上述测试场景中关闭了 `marus_boat` 上的 `ASV Primitive Controller`，并且该关闭已随测试场景保存。这是为了让 ROS 推进路径与本地键盘的非物理 `Transform` 路径分开。
- **没有**对 Prefab 执行 Apply。因此该禁用只作用于测试场景中的该实例，不应理解为工程里的 Prefab 资产已被改成默认关闭。
- 上述限定是这次验收的场景边界，不改写上一节「原 `ExampleScene` 当时是否未保存」的历史记录，本次整理也没有重新打开编辑器核对原场景的当前脏标记。

同日稍后的 GNSS / GPS 核验复用了同一测试场景：进入 Play 前确认 `ASV Primitive Controller` 仍关闭；会话中不发推力、不对 Prefab 执行 Apply；退出 Play 时不保存场景。因此这次 GNSS 记录同样不能读成主示例场景或 Prefab 已被改写。同日晚间的推进与转向三次会话也复用该测试场景：发送了离散短脉冲与显式三零，但同样未覆盖保存原 `ExampleScene`，未对 Prefab 执行 Apply，也没有按 WASD。

2026-11-26 至 2026-11-27 的 IMU / LiDAR 与 TF 树核验再次复用同一测试场景：第 0 段只读锁定核验确认测试场景仍只额外关闭 `ASV Primitive Controller`，官方 `marus_boat.prefab` SHA256 为 `e6c360556aa27b0db5aa16b2189f02407840d0b9542a8404e833065828ae56b7`，测试场景 SHA256 为 `bf9b90fe917277b916c7772bf9ad08f1c5cd6e521a1bf7399796851676106c4a`。第 1、2 段无推力、不开 Recording、不保存场景、不对 Prefab 执行 Apply。方案 A 仅在该测试场景的 `marus_boat` 根实例上临时挂载 `TfStreamerGrpc`，退出 Play 时不保存，也不对 Prefab 执行 Apply；收尾时上述两个 SHA256 与第 0 段逐字节一致。因此方案 A 不能读成已保存测试场景或官方 Prefab 已被改写。

运动记录、CSV 与显式归零证据见 [已有验证结果 §阶段 1 测试场景运动验收]({% link docs/operations/verification.md %}#阶段-1-测试场景运动验收)。同日晚间的推进与转向离散短脉冲见 [已有验证结果 §推进与转向闭环核验]({% link docs/operations/verification.md %}#推进与转向闭环核验)。GNSS 三项结论见 [已有验证结果 §GNSS / GPS 精度、发布频率与坐标系约定]({% link docs/operations/verification.md %}#gnss-gps-约定核验)。IMU / LiDAR 与 TF 树核验及方案 A 收尾哈希见 [已有验证结果 §IMU / LiDAR 与 TF 树核验]({% link docs/operations/verification.md %}#imu-lidar-tf-树核验)。

{: .note-title }
> 内容来源
>
> 迁移自原 `known-issues.md` §源码与工作区状态限定说明。记录器升级与隔离边界为 2026-11-25 增补。测试场景与原场景边界为同日运动验收补记，并补记同日 GNSS 与推进会话均未保存、未 Apply Prefab。2026-11-26 至 2026-11-27 再补记 IMU / LiDAR / TF 会话与方案 A 均未保存、未 Apply，且收尾 SHA256 与第 0 段一致

{: .metadata }
**页面元数据**: 文档整理日期 2026-11-27 · 历史三文件限定仍为交接记录，本次未重新 diff 工作区 · 记录器 1220 升级与隔离边界已按已审阅证据写入 · 测试场景另存与 Prefab 未 Apply 为 2026-11-25 本机实测边界，并补记同日推进会话以及 2026-11-26 至 2026-11-27 的 IMU / LiDAR / TF 会话与方案 A · 状态: 2026-11-27 已纳入站点，记录阶段 1 IMU / LiDAR 与 TF 树核验及方案 A 临时根 TF 验证
