---
title: 可复现操作
parent: 运行与验收
nav_order: 3
last_modified_date: 2026-11-25
---

# 可复现操作
{: .no_toc }

本页提供可复现操作步骤。每个步骤按「目的、操作、预期、验收、异常停止」书写。命令单独放在代码块中，可使用主题提供的复制按钮。

{: .important }
本页的验证结论是**已整理的操作记录**，不是打开本页时的实时复查。2026-11-25 测试场景中的短时速度 / 位移验收、同日稍后的 GNSS / GPS 核验，以及同日晚间的推进与转向离散短脉冲，均已完成记录，详见下方专节与 [已有验证结果]({% link docs/operations/verification.md %})。日常打开工程仍使用原 `ExampleScene`，不要把测试场景误当成默认主场景。复现或追加试验需要另行批准，不要把本页写成可以自动续做新脉冲、重新测频、补测墙钟频率或加做 `[0.12, −0.12, 0]`。

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

若要对照 2026-11-25 的运动验收、同日 GNSS 核验或同日晚间的推进与转向记录，应打开另存的测试场景 `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`，**不要**覆盖保存原 `ExampleScene`，也不要对 Prefab 执行 Apply。边界见 [源码与状态限定]({% link docs/issues/code-status.md %}#测试场景与原场景边界)。

---

## 启动适配器（回环）

| 项 | 内容 |
| --- | --- |
| 目的 | 在本机回环地址提供 gRPC 服务，供 Unity 连接 |
| 前置 | 工作目录 `$ROS2_WS`；ROS 2 Jazzy 按锁定方式临时 source |
| 操作 | 在该目录执行下面的启动命令 |
| 预期 / 验收 | 日志出现 `gRPC ROS adapter server running on 127.0.0.1:30052` |
| 异常停止 | 终端按 Ctrl+C 停止。再用检查命令确认端口已释放。不要改监听地址到非回环接口 |

2026-11-25 运动验收、同日 GNSS 核验与同日晚间推进与转向三次会话时，`ROS_DOMAIN_ID` 均未设置。下文发布与抽查命令与该次条件一致。本次实际使用的是已发布启动方式 `127.0.0.1:30052`。官方示例 README 里曾经出现过默认端口 50051，**不是**本次使用的端口，也不要把它写成本次必须改用的地址。

### 启动适配器

```bash
source /opt/ros/jazzy/setup.bash && source install/setup.bash && ros2 launch marus2_ros_adapter ros2_server_launch.py server_ip:=127.0.0.1 server_port:=30052
```

### 确认端口已释放

```bash
ss -ltnp 'sport = :30052'
```

2026-11-25 运动验收会话、同日稍后的 GNSS 第 1、第 2 段会话，以及同日晚间推进与转向三次会话结束后，适配器都已用 Ctrl+C 停止；进程正常结束，`ss` 显示 30052 端口已无监听。停止过程中出现过 rosout「publisher's context is invalid」，按 ROS 2 关闭时上下文已失效的常见提示记录，不作为新的项目缺陷列入已知问题。

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
出现红色错误或明显异常时立即停止并记录日志。运动验收应在测试场景中进行，且该场景已关闭 `ASV Primitive Controller`，避免与 ROS 推进路径同时改运动。不要在未另批的情况下，把键盘测试和推进脉冲混在同一次运行里。GNSS 核验会话中**没有**按 WASD，也没有向 `/marus_boat/pwm_out` 发数。同日晚间的推进与转向三次会话中也**没有**按 WASD。

---

## 步骤记录 CSV 目录

`UsvStepLog` 的 CSV 写在 `Application.persistentDataPath/usv-records`。2026-11-25 本机示例工程对应：

```text
$HOME/.config/unity3d/LABUST/marus2-example/usv-records
```

列出记录（只读）：

```bash
ls -lt --time-style=long-iso -- "$HOME/.config/unity3d/LABUST/marus2-example/usv-records"
```

`$HOME/usv-projects/logs` 不是该 CSV 目录；本机在该路径只见过适配器日志。不要把个人主目录的绝对路径写进页面正文。文件存在还不能说明指令已到达或请求已清零，需要核对 CSV 内容。2026-11-25 的 GNSS 核验没有打开 Recording，记录器也没有 GPS 列，因此该项证据在 ROS 话题与 Inspector，不在步骤记录 CSV。同日晚间的推进与转向三次会话打开了 Recording，证据在步骤记录 CSV。

---

## 阶段 1 测试场景运动验收（2026-11-25 已完成记录）

本节记录已经完成的一次受控验收，不是新的待批准试验清单，也不授权自动追加脉冲。

| 项 | 内容 |
| --- | --- |
| 目的 | 在独立测试场景中记录：ROS 输入是否到达推进求值与 `AddForce`，施力后是否出现可观察的速度或位移，以及同一次运行中的显式三零是否清掉请求推力 |
| 场景 | `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`。原 `ExampleScene` 未覆盖保存；仅在测试场景关闭 `marus_boat` 上的 `ASV Primitive Controller`，未 Apply Prefab |
| 前置 | 适配器已在 `127.0.0.1:30052` 运行；`ROS_DOMAIN_ID` 未设置；Unity 已进入 Play 且 Recording 已开启；不要在暂停中发布 |
| 输入 | 话题 `/marus_boat/pwm_out`，消息类型 `std_msgs/msg/Float32MultiArray`。在**查询终端**单次发布，不要占用适配器所在终端 |
| 预期 | CLI 出现 `publishing #1`。`0.12` 在 float32 下可能打印为 `0.11999999731779099`，这是预期舍入。CLI 发布成功还不等于已证明到达，需看 CSV |
| 验收 | 见 [已有验证结果 §阶段 1 测试场景运动验收]({% link docs/operations/verification.md %}#阶段-1-测试场景运动验收)。完成标准是记录到与施力对应的速度或位移，或不响应并记下条件；**不评价动力学精度** |
| 异常停止 | 命令报错、超时或出现新增错误时，按当时批准的退出办法处理，不重试。已暂停时不要在暂停中发布 |

该次实际使用的单次发布命令如下。把 `data` 换成 `[0.12, 0.12, 0.0]` 或 `[0.0, 0.0, 0.0]`，分别对应非零脉冲与显式三零。

```bash
ros2 topic pub --once \
  --wait-matching-subscriptions 1 \
  --max-wait-time-secs 10 \
  --keep-alive 1 \
  --qos-reliability reliable \
  --qos-durability volatile \
  /marus_boat/pwm_out std_msgs/msg/Float32MultiArray \
  '{data: [0.12, 0.12, 0.0]}'
```

需要区分三种「看起来像停力」的情况：

- 超时（约 0.20 秒仿真时间）会停止继续 `AddForce`，但**不会**清掉 `LastForceRequest`。
- 停止发布者、停止适配器或退出 Play，都**不是**显式归零。
- 只有再次发布 `[0, 0, 0]` 并在 CSV 中看到请求推力为 0 N、且新开零力保持窗，才能证明请求已被显式清除。

该次非零脉冲之后，Play 保持运行约 142 秒仿真时间才发布显式三零，是因为等待下一段批准，不是施力窗仍在持续。非零施力窗在各自超时时刻已经结束。较早退出 Play 的那一份脉冲记录，不能用来证明请求已清零。

会话收尾为：Pause → 关闭 Recording → 退出 Play；之后再在适配器终端用 Ctrl+C 停止进程，并用上面的 `ss` 命令确认端口已释放。该次收尾**没有**保存场景。

---

## GNSS / GPS 核验（2026-11-25 已完成记录）

本节记录已经完成的一次受控核验，不是新的待批准试验清单，也不授权自动重新测频、补测墙钟频率或做位移方向检查。完整原数、时间基准与三项结论见 [已有验证结果 §GNSS / GPS 精度、发布频率与坐标系约定]({% link docs/operations/verification.md %}#gnss-gps-约定核验)。

| 项 | 内容 |
| --- | --- |
| 目的 | 在独立测试场景中记录：`/marus_boat/gps` 是否仍能收到完整 `NavSatFix`；发布频率（写清时间基准）；坐标系约定；并按当时条件写明数值正确性是否可核验 |
| 场景 | 与运动验收相同的测试场景 `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`。进入 Play 前确认 `ASV Primitive Controller` 仍关闭。不发推力，不按 WASD，不打开 Recording，不保存场景，不对 Prefab 执行 Apply |
| 前置 | 适配器已在 `127.0.0.1:30052` 运行；`ROS_DOMAIN_ID` 未设置；Unity 已进入 Play 且 `RosConnection` 显示已连接；采样期间不要暂停 Play |
| 验收 | 完成标准是记录到可核对的精度、发布频率或坐标系约定结论，或明确记下当时无法核验的条件。**不把话题有消息写成定位已验收**，也不另设通过或失败阈值 |
| 异常停止 | 命令报错、超时或出现新增红字时停止，不自动重试。该次墙钟 `hz` 因 `--no-daemon` 不被接受而报错，已即停且未重试 |

该次第 1 段在查询终端实际使用的抽查命令如下。只有话题列表里出现 `/marus_boat/gps` 时，才继续 `topic info` 与 `echo`。

```bash
source /opt/ros/jazzy/setup.bash && source "$ROS2_WS/install/setup.bash"
echo "ROS_DOMAIN_ID=${ROS_DOMAIN_ID-<unset>}"
ros2 topic list --no-daemon --spin-time 2
ros2 topic info /marus_boat/gps --no-daemon --spin-time 2
ros2 topic echo /marus_boat/gps --once --timeout 10 --no-daemon --spin-time 2
```

第 2 段在再次确认话题仍在并抽到一条静止样本后，用 Python 订阅 80 条消息，按 `header.stamp`（`TimeHandler.TimeDouble`，不是墙钟）计算间隔。这是该次频率结论的依据。随后尝试的墙钟命令是：

```bash
timeout -s INT 15 ros2 topic hz /marus_boat/gps --window 200 --wall-time --no-daemon --spin-time 2
```

本机返回 `ros2: error: unrecognized arguments: --no-daemon`。该命令**没有**产生正式 `hz` 统计，也不要在未另批的情况下改参数重试。`ros2 param list` 按 origin / latitude / longitude / d2 / LocalOrigin 过滤后为 `matched_lines=0`。

Inspector 中的 100 只是设定值；`TfStreamerGrpc` 的 `UpdateFrequency` 为 1，不是 NavSatFix 频率。会话收尾为：先暂停再退出 Play，弹出保存就选不保存；适配器终端用 Ctrl+C 停止；再用上面的 `ss` 命令确认 30052 已释放。

## 推进与转向闭环核验（2026-11-25 已完成记录）

本节记录已经完成的三次受控短脉冲，不是新的待批准试验清单，也不授权自动追加脉冲、改输入或加做 `[0.12, −0.12, 0]`。完整文件名、SHA256、数值与边界见 [已有验证结果 §推进与转向闭环核验]({% link docs/operations/verification.md %}#推进与转向闭环核验)。

| 项 | 内容 |
| --- | --- |
| 目的 | 在独立测试场景中记录：若干离散输入点上的请求推力是否与官方 T200-V16 对照得上；左右单侧、艏侧与对称倒车是否产生可观察且方向合理的速度、位移或偏航；每次后的显式三零是否清掉请求推力 |
| 场景 | 与运动验收相同的测试场景 `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`。`ASV Primitive Controller` 保持关闭。不按 WASD，不保存场景，不对 Prefab 执行 Apply |
| 前置 | 适配器已在 `127.0.0.1:30052` 运行；`ROS_DOMAIN_ID` 未设置；Unity 已进入 Play 且 Recording 已开启；不要在暂停中发布 |
| 输入 | 话题 `/marus_boat/pwm_out`，消息类型 `std_msgs/msg/Float32MultiArray`。在**查询终端**单次发布，不要占用适配器所在终端。第 1 段为对称前向 `0.12/0.18/0.24/0.36`；第 2 段为 `[0.24, 0, 0]` 与 `[0, 0.24, 0]`；第 2b 段为 `[0, 0, 0.24]` 与 `[−0.12, −0.12, 0]`。每一档之后都发显式 `[0, 0, 0]` |
| 验收 | 完成标准是把到达、请求推力、施力窗、运动与显式清零写入 CSV，并与 T200-V16 离散点对照。**不评价动力学精度**，也不把本节写成可自动续做的试验授权 |
| 异常停止 | 命令报错、超时或出现新增错误时停止，不重试。已暂停时不要在暂停中发布 |

该次实际使用的单次发布形式与运动验收专节相同，只替换 `data`。例如第 2 段左推与随后的显式三零：

```bash
ros2 topic pub --once \
  --wait-matching-subscriptions 1 \
  --max-wait-time-secs 10 \
  --keep-alive 1 \
  --qos-reliability reliable \
  --qos-durability volatile \
  /marus_boat/pwm_out std_msgs/msg/Float32MultiArray \
  '{data: [0.24, 0.0, 0.0]}'
```

超时、停止发布者或退出 Play，都不是显式归零。只有再次发布 `[0, 0, 0]` 并在 CSV 中看到请求推力为 0 N、且新开零力保持窗，才能证明请求已被显式清除。三次会话收尾均为退出 Play 后用 Ctrl+C 停止适配器，并用上面的 `ss` 命令确认 30052 已释放；均未保存场景。

{: .metadata }
**页面元数据**: 文档整理日期 2026-11-25 · 打开工程、启动适配器与 WASD 步骤仍为历史交接操作 · 测试场景运动验收、CSV 目录与显式归零说明为 2026-11-25 本机实测补记 · GNSS 核验专节为同日稍后本机实测补记，不是新试验授权 · 推进与转向专节为同日晚间本机实测补记，不是新试验授权 · 状态: 2026-11-25 已纳入站点，记录阶段 1 推进与转向闭环核验实测
