---
title: 环境与工程锁定
parent: 运行与验收
nav_order: 1
last_modified_date: 2026-11-25
---

# 环境与工程锁定
{: .no_toc }

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 锁定版本

| 组件 | 版本 / 提交 | 备注 |
| --- | --- | --- |
| 操作系统 | Ubuntu 24.04 | 原运行说明中曾写作 Ubuntu 24.04.5 LTS；此处与统一基线保持「24.04」 |
| Unity Editor | 6000.5.11f1 | 与 ProjectVersion.txt 一致 |
| MARUS2 示例工程 | `0f9ec3f8a4a30126bcbed8ddbf90800fafa33f06` | 含子模块与 LFS。该值是主工程仓库 HEAD 的记录 |
| ROS 2 | Jazzy（ros-jazzy-ros-base） | 临时 `source`，不把本页写成已改 `.bashrc` |
| `marus2_ros_adapter` | `7af7a0b492bb8c55948a2c839a9f077b7cfe4173` | 这是适配器**源码仓库**的记录提交，不是整个工作区的 HEAD。原说明记有 colcon 构建成功 |
| `uuv_sensor_msgs` | `afd677faeaf0f4909e069ad17c9ee34e9a670bae` | 原说明记为 ros2 分支；同样不是工作区 HEAD |

{: .warning }
许可证未逐仓库、逐资产核查，**不得把全部子模块和资源统一标成同一许可证**。首次复现按工程锁定版本，不升级 Unity 或相关包。

2026-11-25 GNSS 工作包第 0 段对本机做了只读核对，下列提交与已发布锁定一致。这不是新的锁定，也不是重新扫描整个工作区 HEAD：

| 仓库 | 提交 |
| --- | --- |
| 示例工程（同上） | `0f9ec3f8a4a30126bcbed8ddbf90800fafa33f06` |
| `marus2-core` | `747bcee11adfa0f4bbd60db698b24794ab5581c8` |
| `marus2-sensors` | `c88714d750d0b0d99dcfde77694ec5f37d407ec5` |
| `marus2-sensors-grpc` | `485146512c8011a1586570d635e8f240ee43f667` |
| `marus2-proto` | `807af27a08b242748232c6ef87f0d68a675d2040` |
| `marus2_ros_adapter`（同上） | `7af7a0b492bb8c55948a2c839a9f077b7cfe4173` |

---

## 工程结构（关键部分）

下列目录摘自既有运行说明，并补记 2026-11-25 另存的测试场景。这不是一次新的全仓库扫描。

```
marus2-example/
├── Assets/Scenes/ExampleScene.unity
├── Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity
└── Assets/marus2-modules/marus2-core/Runtime/
    ├── Ros/RosConnection.cs              # gRPC 客户端
    ├── Controllers/
    │   ├── AUVRosController.cs           # ROS 推进指令入口
    │   └── ASVPrimitiveController.cs     # 本地键盘直接改 Transform
    └── Actuators/
        ├── Thruster.cs
        └── ThrusterController.cs         # 求值与施力路径
```

`ExampleScene_Stage1MotionAcceptance.unity` 是 2026-11-25 由 `ExampleScene` **另存**得到的独立测试场景。原 `ExampleScene` 没有被这次验收、其后的 GNSS 核验，或同日晚间的推进与转向三次会话覆盖保存。该测试场景中仅关闭了 `marus_boat` 上的 `ASV Primitive Controller`，并且没有对 Prefab 执行 Apply。详见 [源码与状态限定]({% link docs/issues/code-status.md %}#测试场景与原场景边界)。

---

## 环境变量占位符说明

文档中使用以下占位符表示本地路径：

| 占位符 | 说明 |
|:-------|:-----|
| `$PROJECT_PATH` | Unity工程根目录 |
| `$ROS2_WS` | ROS 2工作空间目录 |
| `$BACKUP_PATH` | 本地备份目录 |

步骤记录器 `UsvStepLog` 的 CSV 写在 `Application.persistentDataPath/usv-records`。2026-11-25 在本机示例工程中，该目录对应 `$HOME/.config/unity3d/LABUST/marus2-example/usv-records`。这是实测路径，不是新功能。该次 GNSS 核验没有打开 Recording，也没有把经纬高写入步骤记录 CSV。同日晚间的推进与转向三次会话在同一目录写下了三份新的步骤记录 CSV。

`$HOME/usv-projects/logs` **不是**上述 CSV 目录。该路径在本机只见过适配器日志（如 `adapter.log`）。隔离工程的记录目录与此不同，见 [已有验证结果 §记录器局部验证]({% link docs/operations/verification.md %}#记录器局部验证) 中的 `$RECORDS_DIR`。

{: .note }
实际部署时请将占位符替换为您的实际路径。不要把个人主目录的绝对路径写进页面正文。

{: .metadata }
**页面元数据**: 文档整理日期 2026-11-25 · 锁定版本表仍为 2026-11-24 交接记录，本次未重新扫描工作区 HEAD · 测试场景与 CSV 目录为 2026-11-25 本机实测补记 · 子模块提交为同日 GNSS 第 0 段只读复核 · 同日晚间补记推进会话仍使用同一测试场景与记录目录 · 状态: 2026-11-25 已纳入站点，记录阶段 1 推进与转向闭环核验实测
