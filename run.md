---
title: 运行与验收
layout: default
nav_order: 2
description: 环境锁定、可复现操作步骤，以及已经留下记录的验收结果。
---

# 运行与验收
{: .no_toc }

本页整理已锁定的环境、可复现操作入口，以及已经留下记录的验收结果。每个步骤按「目的、操作、预期、验收、异常停止」书写。命令单独放在代码块中，可使用主题提供的复制按钮。

{: .important }
本页的验证结论同样是**历史记录**，不是打开本页时的实时复查。下一工作包「短时速度 / 位移验收」仍待批准，这里不新增未经批准的试验步骤或控制方案。

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 环境与锁定版本

| 组件 | 版本 / 提交 | 备注 |
| --- | --- | --- |
| 操作系统 | Ubuntu 24.04 | 原运行说明中曾写作 Ubuntu 24.04.5 LTS；此处与统一基线保持「24.04」 |
| Unity Editor | 6000.5.11f1 | 与 ProjectVersion.txt 一致 |
| MARUS2 示例工程 | `0f9ec3f8a4a30126bcbed8ddbf90800fafa33f06` | 含子模块与 LFS。该值是主工程仓库 HEAD 的记录 |
| ROS 2 | Jazzy（ros-jazzy-ros-base） | 临时 `source`，不把本页写成已改 `.bashrc` |
| `marus2_ros_adapter` | `7af7a0b492bb8c55948a2c839a9f077b7cfe4173` | 这是适配器**源码仓库**的记录提交，不是整个工作区的 HEAD。原说明记有 colcon 构建成功 |
| `uuv_sensor_msgs` | `afd677faeaf0f4909e069ad17c9ee34e9a670bae` | 原说明记为 ros2 分支；同样不是工作区 HEAD |

许可证未逐仓库、逐资产核查，**不得把全部子模块和资源统一标成同一许可证**。首次复现按工程锁定版本，不升级 Unity 或相关包。

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

## 已有验证结果

| 项目 | 证据摘要 | 边界 | 状态 |
| --- | --- | --- | --- |
| 连接 | 首次 Ping 成功；话题 `/marus_boat/gps` 收到完整 `NavSatFix` | 仅通道与消息可达 | 已验证 |
| 推进求值与施力 | 输入 `0.12` → `curveOut≈0.200008854` kgf → `forceN≈1.96141684` N；同实例 `FixedUpdate` 的 `AddForceAtPosition` 记录到后显式归零 | 只验证调用链，不是动力学 | 调用链已验证 |
| 本地键盘 | `ASVPrimitiveController` 直接改 `Transform`，WASD 有效 | 非物理路径；需焦点与 `activeAgent` | 已验证 |
| 艇体速度 / 位移 | 尚未记录到与施力对应的速度或位移 | 待批准的下一工作包 | 待验证 |
| GPS 精度 / 频率 / 坐标 | 尚无验收结果 | 不得把收到消息写成定位正确 | 待验证 |

施力单位关系、教学换算与历史数字的对照见 [项目总览 · 单位与施力关系]({{ "/" | relative_url }}#单位与施力关系)。那里的公式是标准 kgf→N 定义；`u = 0.12` 那一组数字才是历史记录。

## 可复现操作：打开工程

| 项 | 内容 |
| --- | --- |
| 目的 | 加载锁定版本的示例场景。 |
| 操作 | Unity Hub → 添加工程目录 `$PROJECT_PATH` → 打开 `ExampleScene`。 |
| 预期 | 场景加载，水面、地形、艇可见。 |
| 验收 | 无红色编译错误。粉色地形或水体警告见 [已知问题]({{ "/issues/" | relative_url }})，不作为本步骤失败的充分条件，但应记下。 |
| 异常停止 | 出现红色编译错误或无法打开场景时立即停止，并保留 Console / 编辑器日志，不继续 Play。 |

## 可复现操作：启动适配器（回环）

| 项 | 内容 |
| --- | --- |
| 目的 | 在本机回环地址提供 gRPC 服务，供 Unity 连接。 |
| 前置 | 工作目录 `$ROS2_WS`；ROS 2 Jazzy 按锁定方式临时 source。 |
| 操作 | 在该目录执行下面的启动命令。 |
| 预期 / 验收 | 日志出现 `gRPC ROS adapter server running on 127.0.0.1:30052`。 |
| 异常停止 | 终端按 Ctrl+C 停止。再用检查命令确认端口已释放。不要改监听地址到非回环接口。 |

启动适配器：

```bash
source /opt/ros/jazzy/setup.bash && source install/setup.bash && ros2 launch marus2_ros_adapter ros2_server_launch.py server_ip:=127.0.0.1 server_port:=30052
```

确认端口已释放：

```bash
ss -ltnp 'sport = :30052'
```

## 可复现操作：本地键盘测试

| 项 | 内容 |
| --- | --- |
| 目的 | 验证非物理的 Transform 直接控制是否仍然有效。 |
| 操作 | 进入 Play → 确认 `AgentManager.activeAgent` → 点击 Game 视图获取焦点 → 短按 WASD。 |
| 预期 | 艇体按键移动或转向。 |
| 验收 | 能观察到 Transform 路径下的移动或转向。这不能当作推进器动力学证据。 |
| 异常停止 | 退出 Play，**不保存场景**。 |

出现红色错误或明显异常时立即停止并记录日志。短时速度 / 位移验收的详细步骤待该工作包批准后再补，避免把未批准试验写成可执行清单。
