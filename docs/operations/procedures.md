---
title: 可复现操作
parent: 运行与验收
nav_order: 3
last_modified_date: 2026-11-24
---

# 可复现操作
{: .no_toc }

本页提供可复现操作步骤。每个步骤按「目的、操作、预期、验收、异常停止」书写。命令单独放在代码块中，可使用主题提供的复制按钮。

{: .important }
本页的验证结论同样是**历史记录**，不是打开本页时的实时复查。下一工作包「短时速度 / 位移验收」仍待批准，这里不新增未经批准的试验步骤或控制方案。

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 打开工程

| 项 | 内容 |
| --- | --- |
| 目的 | 加载锁定版本的示例场景 |
| 操作 | Unity Hub → 添加工程目录 `$PROJECT_PATH` → 打开 `ExampleScene` |
| 预期 | 场景加载，水面、地形、艇可见 |
| 验收 | 无红色编译错误。粉色地形或水体警告见 [已知问题]({% link docs/issues/known-issues.md %})，不作为本步骤失败的充分条件，但应记下 |
| 异常停止 | 出现红色编译错误或无法打开场景时立即停止，并保留 Console / 编辑器日志，不继续 Play |

---

## 启动适配器（回环）

| 项 | 内容 |
| --- | --- |
| 目的 | 在本机回环地址提供 gRPC 服务，供 Unity 连接 |
| 前置 | 工作目录 `$ROS2_WS`；ROS 2 Jazzy 按锁定方式临时 source |
| 操作 | 在该目录执行下面的启动命令 |
| 预期 / 验收 | 日志出现 `gRPC ROS adapter server running on 127.0.0.1:30052` |
| 异常停止 | 终端按 Ctrl+C 停止。再用检查命令确认端口已释放。不要改监听地址到非回环接口 |

### 启动适配器

```bash
source /opt/ros/jazzy/setup.bash && source install/setup.bash && ros2 launch marus2_ros_adapter ros2_server_launch.py server_ip:=127.0.0.1 server_port:=30052
```

### 确认端口已释放

```bash
ss -ltnp 'sport = :30052'
```

---

## 本地键盘测试

| 项 | 内容 |
| --- | --- |
| 目的 | 验证非物理的 Transform 直接控制是否仍然有效 |
| 操作 | 进入 Play → 确认 `AgentManager.activeAgent` → 点击 Game 视图获取焦点 → 短按 WASD |
| 预期 | 艇体按键移动或转向 |
| 验收 | 能观察到 Transform 路径下的移动或转向。这不能当作推进器动力学证据 |
| 异常停止 | 退出 Play，**不保存场景** |

{: .warning }
出现红色错误或明显异常时立即停止并记录日志。短时速度 / 位移验收的详细步骤待该工作包批准后再补，避免把未批准试验写成可执行清单。

{: .metadata }
**页面元数据**: 文档整理日期 2026-11-24 · 内容版本: 文档架构迁移 1.0 (标题更新) · 来源: 历史交接可复现操作，未重新核对当前工作区 · 状态: 迁移完成

