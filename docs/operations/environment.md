---
title: 环境与工程锁定
parent: 运行与验收
nav_order: 1
last_modified_date: 2026-11-24
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

---

## 工程结构（关键部分）

下列目录摘自既有运行说明，用于对照脚本职责，不是一次新的仓库扫描。

```
marus2-example/
├── Assets/Scenes/ExampleScene.unity
└── Assets/marus2-modules/marus2-core/Runtime/
    ├── Ros/RosConnection.cs              # gRPC 客户端
    ├── Controllers/
    │   ├── AUVRosController.cs           # ROS 推进指令入口
    │   └── ASVPrimitiveController.cs     # 本地键盘直接改 Transform
    └── Actuators/
        ├── Thruster.cs
        └── ThrusterController.cs         # 求值与施力路径
```

---

## 环境变量占位符说明

文档中使用以下占位符表示本地路径：

| 占位符 | 说明 |
|:-------|:-----|
| `$PROJECT_PATH` | Unity工程根目录 |
| `$ROS2_WS` | ROS 2工作空间目录 |
| `$BACKUP_PATH` | 本地备份目录 |

{: .note }
实际部署时请将占位符替换为您的实际路径。

{: .metadata }
**页面元数据**: 文档整理日期 2026-11-24 · 内容版本: 文档架构迁移 1.0 (标题更新) · 来源: 历史交接锁定版本，未重新实测当前工作区 · 状态: 迁移完成

