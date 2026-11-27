---
title: 已有验证结果
parent: 运行与验收
nav_order: 2
last_modified_date: 2026-11-27
---

# 已有验证结果
{: .no_toc }

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 已有验证记录

| 项目 | 证据摘要 | 边界 | 状态 |
| --- | --- | --- | --- |
| 连接 | 首次 Ping 成功；话题 `/marus_boat/gps` 收到完整 `NavSatFix`。2026-11-25 GNSS 抽查再次收到完整消息 | 仅通道与消息可达，不是定位精度 | 已验证 |
| 推进求值与施力 | 输入示例 → 曲线输出 → 换算后的力；同实例 `FixedUpdate` 的 `AddForceAtPosition` 记录到后显式归零。2026-11-25 测试场景 CSV 再次记录到同一输入点的请求推力 1.961417 N，并在同一次运行中记录到显式三零。同日稍后的离散短脉冲又在 +0.18 / +0.24 / +0.36 / −0.12 以及艏侧 +0.24 处记录到请求推力，并与官方 T200-V16 非加权 Hermite 对照 | 只验证调用链、请求清零与若干离散点上的曲线求值，不是完整 *C*(*u*)，也不是动力学 | 调用链已验证；离散点已记录 |
| 本地键盘 | `ASVPrimitiveController` 直接改 `Transform`，WASD 有效 | 非物理路径；需焦点与 `activeAgent` | 已验证 |
| 艇体速度 / 位移 | 2026-11-25 测试场景已记录到与非零脉冲施力窗对应的前向速度与位移；同一次运行中的显式三零把请求推力清为 0 N，并新开零力保持窗。同日稍后另有多档前向、左右单侧、艏侧与对称倒车的离散短脉冲记录。运动幅度只作对照，不是通过标准 | 仅测试场景；不评价动力学精度；CSV 不能单独证明刚体名为 `marus_boat`；超时停力不等于清零 `LastForceRequest`。详见 [§阶段 1 测试场景运动验收](#阶段-1-测试场景运动验收) 与 [§推进与转向闭环核验](#推进与转向闭环核验) | 已记录（本机实测；精度未评价） |
| 推进与转向离散短脉冲 | 同日稍后三份 CSV 记录了对称前向 0.12/0.18/0.24/0.36、左右单侧 0.24、艏侧 0.24 与对称倒车 −0.12，每次后均有显式三零。通道绑定为 0=左、1=右、2=艏。请求推力与 T200-V16 离散点对照见专节 | 只是短脉冲离散点核对，不是全曲线或动力学精度验收；未做 `[0.12, −0.12, 0]`；`velX` 与 `posX` 的差异未解释清楚。详见 [§推进与转向闭环核验](#推进与转向闭环核验) | 已记录（本机实测；精度未评价） |
| IMU / LiDAR 与 TF 树 | 2026-11-26 至 2026-11-27 在同一测试场景中，静止、无推力、不开 Recording、不保存场景的条件下，核对了 `/marus_boat/imu`、`/marus_boat/lidar` 与 `/tf` 的类型、发布者、消息头时间戳间隔、首帧结构与 12.01 s 静止样本；源码 / Prefab 只读解释了默认仅 3 条 `/tf` 边、缺少 `map -> marus_boat/base_link` 的原因。方案 A 临时在测试场景根实例挂 `TfStreamerGrpc`，6.02 s 内测到第 4 条边，且 `tf2_ros` 全链路 `LOOKUP_OK`；退出 Play 不保存，官方 Prefab 与测试场景 SHA256 与第 0 段一致。详见 [§IMU / LiDAR 与 TF 树核验](#imu-lidar-tf-树核验) | 仅测试场景、静止与临时挂载。不得写成 IMU / LiDAR 已标定或精度已通过，也不得把设定频率写成已测频率。方案 A 未持久写入官方 Prefab 或已保存测试场景。相机 / 声呐流、运动态联动与正式 `ros2 topic hz` 均未做。原始终端全文不作为本站公开附件 | 已记录（本机实测；精度未评价；方案 A 仅为临时验证） |
| GPS 精度 / 频率 / 坐标 | 2026-11-25 测试场景已记录三项结论：发布频率与设定不一致（消息头间隔约 0.0400 s，对应约 25.000 Hz，设定为 100 Hz）；坐标系约定已部分核对；数值正确性按当时条件无法核验 | 不得把话题有消息、协方差、`isRTK` / 状态枚举，或与同一套 `Unity2Geo` 换算链的互相比对升级为定位已验收。墙钟接收频率未测到。详见 [§GNSS / GPS 精度、发布频率与坐标系约定](#gnss-gps-约定核验) | 已记录（本机实测；精度无法核验） |
| 步骤记录器局部行为 | 1153 纯逻辑 196 项检查；原工程经脚本 1220 升级后编译 0 错误、61 警告且未进入 Play；隔离工程手动阶段与四次自动计划已审阅通过 | 合成记录。不是真实 `AddForce`、推进器、水动力、ROS、训练或实艇验收。活动会话直接退出 Editor 的 `OnApplicationQuit` 分支未单测。该范围说明不否定其后测试场景中的真实施力记录 | 局部已验证 |

---

## 推进力单位换算

{% include formula.html %}

---

## 历史验证数值

来源：用户回传的调试输出（转述）。制作本页早期版本时未直接读取原始备份文件。

| 符号 | 含义 | 记录值 | 来源性质 |
| --- | --- | --- | --- |
| *u* | 推进指令输入 | `0.12` | 历史调试记录 |
| *C*(*u*)，即 `curveOut` | 曲线输出 | `0.200008854` kgf | 历史调试记录 |
| *F*<sub>N</sub>，即 `forceN` | 换算后的力 | `1.96141684` N | 历史调试记录 |

用上面的定义做一致性核对（这是算术说明，不是新的测量）：

```
9.80665 × 0.200008854 = 1.961416828…  ≈  1.96141684 N
```

与记录给出的 `1.96141684` N 在该记录位数上一致。同一条记录还写明：该力在同实例 `FixedUpdate` 的 `AddForceAtPosition` 调用位置被记录到，随后显式归零生效。

2026-11-25 测试场景 CSV 在同一输入 `0.12` 处打印的 `forceReq` 为 `1.961417` N，与历史求值 `ThrusterAsset` T200-V16 `Evaluate(0.12) * 9.80665 = 1.96141684` N 在六位小数上一致。这是本机实测核对，不替换上表的历史调试来源，也不提供完整 *C*(*u*) 曲线。同日稍后的离散短脉冲又在其他输入点做了同样的 6 位小数对照，见 [§推进与转向闭环核验](#推进与转向闭环核验)。

{: .warning-title }
> 精度与动力学界限
>
> 这些小数来自调试输出或步骤记录 CSV，不能当成已经过仪器标定的有效数字。历史记录证明「输入 → 求值 → 施力调用 → 归零」，**不能写成动力学已验证**。完整 *C*(*u*) 曲线仍未给出。艇体速度与位移的本机实测记录见下一节；该记录同样不评价动力学精度。

---

## 阶段 1 测试场景运动验收

整理日期：2026-11-25，时区 America/Los_Angeles（PST，UTC-8）。性质：**本机实测**，仅测试场景。CSV 文件名中的时间戳按本站既有约定视为 UTC。

本次记录到阶段 1 原先缺少的「施力之后的速度与位移」，并在同一次运行中记录到显式三零后的零力保持窗。这满足此前写下的短时验收标准：记录到与施力时刻对应的速度或位移，且不评价动力学精度。不必再重做同一脉冲。运动幅度不是显式归零补测的通过标准。

### 场景与输入条件

- 独立测试场景 `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity` 由 `ExampleScene` 另存得到。原 `ExampleScene` 没有被覆盖保存；只在测试场景中关闭了 `marus_boat` 上的 `ASV Primitive Controller`，并且没有对 Prefab 执行 Apply。详见 [源码与状态限定]({% link docs/issues/code-status.md %}#测试场景与原场景边界)。
- 适配器为回环 `127.0.0.1:30052`。ROS 2 Jazzy。`ROS_DOMAIN_ID` 未设置。
- 输入路径：`std_msgs/msg/Float32MultiArray` 话题 `/marus_boat/pwm_out`。命令行发布 `0.12` 时，float32 可能打印为 `0.11999999731779099`，这是预期舍入。CLI 出现 `publishing #1` 还不等于已证明到达，需看 CSV。
- 四份 CSV 中的刚体实例标识均为 `568105589213755872`，推进器通道为 0=`568105589213755698`、1=`568105589213755692`、2=`568105589213755686`（与零输入路径及后续会话一致）。CSV 本身不能证明该刚体的 GameObject 名称是 `marus_boat`。

### 记录文件位置

步骤记录 CSV 写在 `Application.persistentDataPath/usv-records`。本机示例工程对应 `$HOME/.config/unity3d/LABUST/marus2-example/usv-records`。这是实测路径，不是新功能。`$HOME/usv-projects/logs` 不是该 CSV 目录，本机在该路径只见过适配器日志。原始 CSV 不作为本站公开附件；下表以文件名、字节数和 SHA256 标识。

### 必须分开的结论类型

| 类型 | 本项怎么用 |
| --- | --- |
| 本机实测 | 四份 CSV 中的输入、请求推力、施力窗、速度与位移记录 |
| 方案估计 | 无阻力计划对照速度约 `0.002615` m/s，只作对照，不设通过阈值 |
| 未验证（该次运动验收范围内） | 该次未覆盖 GPS 精度 / 频率 / 坐标系（同日稍后另做核验，见 [§GNSS / GPS 精度、发布频率与坐标系约定](#gnss-gps-约定核验)）；完整推进曲线；动力学精度；CSV 所对应的 GameObject 名称 |
| 官方 / 源码结论 | 历史单位换算 1 kgf = 9.80665 N；`force_after` 的 `phase` 为 `after_add_force_call_not_solve`，表示 `AddForce` 调用之后，不是解算之后 |

超时（约 0.20 秒仿真时间）会停止继续 `AddForce`，但不会清掉 `LastForceRequest`。停止发布者、停止适配器或退出 Play，都不是显式归零。

### 无指令基线

`usv_step_20261125_163045_736_89b1d07201b549919d86c0f30cc37842.csv`，97,738 字节，SHA256 `a77edb83403d73728fd60f6fde98d07bed5fad73f97abf580bb4fa0b0ec0041c`。

401 条记录，全部为 `motion_pre_solve`；步进 1–401，`fixedTime` 13.279990–21.279990 秒，共 8.000 秒仿真。最大位置偏移约 1×10<sup>−6</sup> m，最大速度约 6.32×10<sup>−6</sup> m/s。这是低漂移的无指令基线，不能当作施力响应验收。

### 三路零输入

`usv_step_20261125_180322_912_1440246f99734fd9a1a8e9297a81244c.csv`，280,631 字节，SHA256 `fd943426d8412f8f656bff22e2069bed2d387604c08f74b1080a7c154677f255`。

1,150 条记录：1,078 条运动，以及 3 条输入、3 条请求、33 条施力前、33 条施力后。相关标识 `538035ea9383430ea147b31844f740f4` 出现在 16.899990 秒、第 539 步；三路输入与请求推力均为 0 N。随后在 16.919990–17.119990 秒，每路连续 11 对零矢量施力记录。运动时间为 6.139998–27.679990 秒，共 21.54 秒仿真。零指令之后的最大速度约为 9×10<sup>−6</sup> m/s；此前出现过约 0.00149 m/s 的更大速度，不得算进这条零指令。

### 非零脉冲（本次未发显式三零）

`usv_step_20261125_182209_244_d816a5de82dc4038be6de132ecebb7c5.csv`，1,384,342 字节，SHA256 `ea6d3b19b1c4c860a4315aaa033e039361bc4982044c029795100371311c6fbc`。

5,638 条记录：5,566 条运动，以及 3 条输入、3 条请求、33 条施力前、33 条施力后；没有第二组零输入。输入在 18.979990 秒、第 847 步，相关标识 `5ee369fb71c243b187e81e02d4e65c1d`。通道 0/1 输入为 0.120000，请求推力各为 1.961417 N；通道 2 为 0。施力窗为 18.999990–19.199990 秒，每路 11 步。纵向世界力约为 `(-0.000901, -0.089715, 1.959364)` N；艏侧通道为 0。运动时间为 2.059999–113.360000 秒，共 111.30 秒仿真。

开头垂向启动瞬态约为 0.111 m/s，在脉冲前已经稳住。脉冲前最后 5 秒速度不超过约 1.005×10<sup>−5</sup> m/s，位置约在 `(-0.001664, -0.168124, -10.022200)`。前向速度峰值约为 0.002661 m/s，出现在 19.219990 秒；无阻力方案估计约为 0.002615 m/s，只作对照。前向位移约 0.00407 m，最大约 0.00409 m。其后约 10 至 15 秒内因阻尼衰减，不是显式归零。用户较早退出 Play，本文件不能证明 `LastForceRequest` 已被清除。

### 同会话显式归零补测

`usv_step_20261125_183500_131_103ecd64a5364072a03267877e2b9af2.csv`，3,146,961 字节，SHA256 `8562c9648e20772e5aceccd1306a91408fdc63383d5618059e2188ed990147d0`。

12,763 条记录：12,619 条运动，以及 6 条输入、6 条请求、66 条施力前、66 条施力后。运动时间为 1.419999–253.779900 秒，共 252.36 秒仿真。

第一组相关标识 `db39216cfc5c4a11bb497318c3c750b7`，出现在 36.779990 秒、第 1769 步：通道 0/1 输入为 0.120000，请求推力各为 1.961417 N，通道 2 为 0。施力窗为 36.799990–36.999990 秒，每路 11 步，世界力约为 `(-0.000891, -0.089715, 1.959364)` N。

第二组相关标识 `fbc4c74104264101b9980ef82ba22a49`，出现在 178.859900 秒、第 8873 步：三路输入与请求推力均为 0 N。随后新开零力窗 178.879900–179.079900 秒，每路 11 对记录，力矢量全部为 0。

两组相隔 142.079910 秒，是因为当时保持运行以等待下一段批准。非零施力窗在 36.999990 秒已经超时结束，所以后面这段新的 0.20 秒零力窗更能说明 `LastForceRequest` 已被显式清零，并且施力计时被重新打开，而不是第一段脉冲的残留。

运动幅度只作对照，不是本项通过标准。脉冲前最后 5 秒最大速度约为 2×10<sup>−6</sup> m/s；前向速度峰值约为 0.002664 m/s，出现在 37.019990 秒；前向位移最大约 0.00410 m。发出显式三零时艇体已经重新稳住，清零后没有出现新的前向加速，这符合零力作用在已静止艇体上的预期。开头仍有垂向启动瞬态：首个采样 `vy = 0.112653` m/s，约 1.66 秒时速度峰值约 0.182 m/s，不得算进这次脉冲。

### 会话收尾

上述会话结束后已退出 Play 并关闭 Recording。适配器（该次进程号 103897，监听 `127.0.0.1:30052`）随后用 Ctrl+C 停止，进程正常结束，`ss` 显示 30052 端口已无监听。关闭过程中出现过 rosout「publisher's context is invalid」，按 ROS 2 拆除时的常见提示记录，不作为新的项目缺陷写入已知问题清单。

### 本项尚未覆盖

- GPS / GNSS 精度、发布频率与坐标系：该次运动验收未覆盖。同日稍后的核验结论见 [§GNSS / GPS 精度、发布频率与坐标系约定](#gnss-gps-约定核验)，不得把本节读成该项仍完全未经记录，也不得读成定位已验收
- 完整 *C*(*u*) 曲线，以及动力学精度或通过阈值。该次运动验收本身只覆盖对称前向 0.12；同日稍后另有多档前向、左右单侧、艏侧与对称倒车的离散短脉冲记录，见 [§推进与转向闭环核验](#推进与转向闭环核验)，那些记录同样不是完整曲线或动力学精度验收
- 用 CSV 单独证明 GameObject 名称
- 粉色地形与 Vulkan 缺少 `_WaterCameraHeightBuffer` / `_WaterLine` 仍为已知问题；本次 Play 中再次出现，不是新错误，也未自动消失
- 把超时停力、停止发布或退出 Play 写成显式归零

---

---

## GNSS / GPS 精度、发布频率与坐标系约定 {#gnss-gps-约定核验}

整理日期：2026-11-25，时区 America/Los_Angeles（PST，UTC-8）。本机实测约在当天 11:50–12:12（PT）。工程机终端与 Unity Console 的本地日志时间约为 2026-11-26 03:50–04:06，推断为 UTC+8，与 PT 相差 16 小时，互相一致。性质：**本机实测**，仅测试场景。不发推力，不保存场景。

本次记录到已发布完成标准所允许的结论路径：发布频率与坐标系约定有可核对的记录，数值正确性按当时条件无法核验。这满足「记录到可核对的精度、发布频率或坐标系约定结论；或明确记下当时无法核验的条件」。**不得**把话题有消息写成定位已验收，也**不得**写成 GPS 精度已通过。

### 测了什么、没测什么

先分清三种时间基准。不要把它们混成同一个「频率」。

| 时间基准 | 本次怎么用 | 本次结果 |
| --- | --- | --- |
| 设定值 | Inspector 里的 `SampleFrequency` / `GnssGrpc.UpdateFrequency` | 均为 100。这只是配置，**不是**已测到的话题频率。`TfStreamerGrpc.UpdateFrequency` 为 1，那是 TF，不是 NavSatFix 频率 |
| 消息头时间戳间隔 | 用 `/marus_boat/gps` 的 `header.stamp` 计算相邻间隔。该时间戳来自 `TimeHandler.TimeDouble`，**不是**墙钟，也不要把它换算成本次试验的日历时间 | 80 条样本的平均间隔约 0.0400 s，对应约 25.000 Hz，与设定 100 Hz 不一致 |
| 墙钟接收频率 | 订阅端按计算机墙钟统计的接收速率，例如 `ros2 topic hz --wall-time`。官方说明也写了：这可能受机器和 QoS 影响，不必等于发布端设定 | 本次因 `ros2 topic hz` 不接受 `--no-daemon` 报错而即停，未重试，也未另批补测，故**没有**正式 `hz` 统计。Python 抽样的 `elapsed_wall_s=3.520` 只是附带观察（含发现延迟），与 25 Hz 同量级、不像 100 Hz，但不是 `ros2 topic hz` 结果 |

本次还核过：话题是否仍能收到完整 `NavSatFix`；`header.frame_id` 与组件 Frame Id 是否一致；当时实际原点；静止样本是否与 Inspector 的 Point 一致到很高位。本次**没有**做位移方向检查，**没有**独立真值，**没有**把纬度差换算成米作为结论，也**没有**拆开验证频率差异发生在采样、发送还是适配器。

### 场景与连接条件

- 独立测试场景 `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`。原 `ExampleScene` 没有被覆盖保存；`ASV Primitive Controller` 仍关闭；没有对 Prefab 执行 Apply。退出 Play 时不保存。详见 [源码与状态限定]({% link docs/issues/code-status.md %}#测试场景与原场景边界)。
- 适配器为已发布启动方式：回环 `127.0.0.1:30052`。日志出现 `gRPC ROS adapter server running on 127.0.0.1:30052`。ROS 2 Jazzy。`ROS_DOMAIN_ID` 未设置。官方示例 README 里曾经出现过默认端口 50051，**不是**本次使用的端口。
- 第 0 段只读核对该次锁定提交，与已发布锁定一致：example `0f9ec3f8a4a30126bcbed8ddbf90800fafa33f06`；core `747bcee11adfa0f4bbd60db698b24794ab5581c8`；sensors `c88714d750d0b0d99dcfde77694ec5f37d407ec5`；sensors-grpc `485146512c8011a1586570d635e8f240ee43f667`；proto `807af27a08b242748232c6ef87f0d68a675d2040`；adapter `7af7a0b492bb8c55948a2c839a9f077b7cfe4173`。
- 场景里没有 `GeoOrigin`。`ros2 param list --no-daemon --spin-time 2` 按 origin / latitude / longitude / d2 / LocalOrigin 过滤后为 `matched_lines=0`。因此没有在运行时发现 `/d2/LocalOriginLat` 或 `/d2/LocalOriginLon` 被实际写入。
- Prefab 中 `gps` 物体的本地坐标为 `{x: 0, y: 1.35, z: 0.65}`（第 0 段本机 YAML 只读核对）。
- 粉色地形仍存在。Console 可见原有 Vulkan 水体警告（缺少 `_WaterCameraHeightBuffer` / `_WaterLine`），错误计数为 0。这些只记「仍存在」，不作为本包失败条件，也不在本包修理。

第 2 段 Play 运行时，Inspector 手抄值如下（只看，未改）。插图均为当时截图原件，不是生成图。

![Play 运行时 GnssSensor Inspector]({{ '/assets/images/gnss-20261125/01-gnss-sensor-inspector.png' | relative_url }})

`GnssSensor` 启用：Frame Id `marus_boat/gps_frame`，Sample Frequency 100，NoiseType `NoNoise`，isRTK 勾选，Maximum Operating Depth 0.5；Point 纬度为 `44.9999162186072`、经度为 `15.000000067459403`、高度为 `1.1507192966571342`；Origin 纬度为 45、经度为 15、高度为 0。

![Play 运行时 GnssGrpc Inspector]({{ '/assets/images/gnss-20261125/02-gnss-grpc-inspector.png' | relative_url }})

`GnssGrpc` 启用：Update Frequency 100，Address `marus_boat/gps`，Message Queue Size 10000。

![Play 运行时 TfStreamerGrpc Inspector]({{ '/assets/images/gnss-20261125/03-tf-streamer-grpc-inspector.png' | relative_url }})

`TfStreamerGrpc` 启用：Update Frequency 1（这不是 NavSatFix 频率），Parent `marus_boat`，Parent Frame Id `marus_boat/base_link`，Frame Id `marus_boat/gps_frame`。

![Play 运行时 RosConnection Inspector]({{ '/assets/images/gnss-20261125/04-rosconnection-inspector.png' | relative_url }})

`RosConnection`：serverIP `localhost`，serverPort 30052，Realtime Simulation 开，Origin Frame Name `map`，OriginFrameLatitude `/d2/LocalOriginLat`，OriginFrameLongitude `/d2/LocalOriginLon`，DefaultLatitude 45，DefaultLongitude 15。Console 记有 `[04:00:51] Connected to the ROS Server` 与 `[04:06:32] Shut down of grpc channel successful`（工程机本地时钟，推断为 UTC+8）。

![测试场景 Play 中的编辑器与 Console]({{ '/assets/images/gnss-20261125/05-editor-console-scene.png' | relative_url }})

### 必须分开的结论类型

| 类型 | 本项怎么用 |
| --- | --- |
| 本机实测 | 话题抽查、消息字段原数、Inspector 手抄值、`header.stamp` 间隔统计、参数列表过滤结果、收尾时端口已释放 |
| 官方资料 | ROS 2 Jazzy 对 `NavSatStatus` / `position_covariance_type` 的枚举含义；无 `GeoOrigin` 时原点来自 `RosConnection` 默认纬度 / 经度，连接后可被 `/d2/LocalOriginLat`、`/d2/LocalOriginLon` 改写；`Unity2Map` 为 Unity `(x, y, z)` → ENU `(x, z, y)`；`GnssGrpc` 与适配器都未赋值协方差。这些是源码或消息定义，不是本次用位移证明了公式 |
| 附带观察 | Python 抽样的墙钟耗时 `elapsed_wall_s=3.520`，不是 `ros2 topic hz` 结果 |
| 未验证 / 未做 | 数值正确性（无独立真值）；墙钟接收频率的正式 `hz` 统计；频率差异原因；位移方向检查；把纬度差换算成米 |

### 第 1 段：完整消息抽查

话题列表中有 `/marus_boat/gps`。`ros2 topic info` 显示类型为 `sensor_msgs/msg/NavSatFix`，发布者为 1，订阅者为 0。抽到的一条完整消息如下。完整消息指能看到 `header`（含 `stamp` 和 `frame_id`）、`status`、`latitude`、`longitude`、`altitude` 以及协方差相关字段。协方差即使是全 0，也不算消息不完整。

| 字段 | 记录值 |
| --- | --- |
| `header.stamp` | `sec: 1795636358`，`nanosec: 42793751`（`TimeHandler.TimeDouble`，不是墙钟） |
| `header.frame_id` | `marus_boat/gps_frame` |
| `status.status` | 2 |
| `status.service` | 1 |
| `latitude` | `44.99991621787778` |
| `longitude` | `15.000000067510223` |
| `altitude` | `1.150719296657085` |
| `position_covariance` | 9 个 0.0 |
| `position_covariance_type` | 0 |

适配器日志目录为 `$HOME/.ros/log/2026-11-26-03-50-46-300422-ning-wang-ThinkPad-P16-Gen-3-113066`。这一段只证明当时仍能收到完整消息，不能单独结束本包，也不能写成定位已验收。

### 第 2 段：发布频率

设定值见上文 Inspector：采样与 GNSS 发送均为 100。消息头时间戳抽样使用 sensor_data QoS，目标 80 条，超时 8 s，实际 `collected=80`，`elapsed_wall_s=3.520`。结果按原数抄录：

| 项 | 记录值 |
| --- | --- |
| `stamp_first` | `1795637079.2901325` |
| `stamp_last` | `1795637082.4501314` |
| `stamp_span_s` | `3.159998893737793` |
| `dt_count` | 79 |
| `dt_mean_s` | `0.03999998599668093` |
| `dt_min_s` | `0.039999961853027344` |
| `dt_max_s` | `0.040000200271606445` |
| `dt_std_s` | `7.192620921927455e-08` |
| `freq_from_stamp_mean_hz` | `25.000008752077484` |

间隔非常稳定，均值约 0.0400 s，对应约 25.000 Hz，与设定的 100 Hz **不一致**。差异卡在采样、发送还是适配器，本次没有拆开验证。不要另设通过或失败阈值，也不要把 Prefab 或 Inspector 上的 100 写成已经测到的话题频率。

同一次抽样的第一条消息为：`frame_id` `marus_boat/gps_frame`，`status` 2，`service` 1，纬度为 `44.9999162186072`，经度为 `15.000000067453241`，高度为 `1.1507191775872645`，协方差全为 0，`position_covariance_type` 为 0。

墙钟命令 `timeout -s INT 15 ros2 topic hz /marus_boat/gps --window 200 --wall-time --no-daemon --spin-time 2` 失败，报错为 `ros2: error: unrecognized arguments: --no-daemon`。已按报错即停，未重试。因此墙钟接收频率本次没有正式 `hz` 统计。

### 第 2 段：坐标系约定

第 2 段开始时抽到的一条静止样本为：`frame_id` `marus_boat/gps_frame`，`status` 2，`service` 1，纬度为 `44.9999162186072`，经度为 `15.000000067454103`，高度为 `1.150718821082211`，协方差全为 0，`position_covariance_type` 为 0。

- `header.frame_id` 为 `marus_boat/gps_frame`，与 `GnssSensor` 和 TF 组件的 Frame Id 一致。
- 当时原点按纬度 45、经度 15、高度 0 记录。依据是：场景中没有 `GeoOrigin`；参数列表未发现可改写原点的匹配项；Inspector 中 Origin 仍为 45 / 15 / 0，与 `RosConnection` 的 DefaultLatitude / DefaultLongitude 一致。官方源码还写了：连接成功后可以尝试用 `/d2/LocalOriginLat`、`/d2/LocalOriginLon` 改写原点；本次运行没有发现这些参数，所以把 45 / 15 / 0 记为当时实际原点，而不是把默认值写成不可被改写的永久事实。
- 静止样本与 Inspector 的 Point（纬度 `44.9999162186072`、经度 `15.000000067459403`、高度 `1.1507192966571342`）一致到很高位：纬度在第 2 段 echo 与 Python 首条消息中完全相同；经度、高度在最后几位有微小差别。这只说明话题和同一套 `Unity2Geo` 换算链一致，**不是**独立精度。
- 该样本接近原点但并不重合：纬度约小 \(8.378\times 10^{-5}\) 度，经度几乎重合，高度约 1.151 m。这符合传感器挂在 `gps` 子物体上、而不是场景原点这一设定。本次没有另批位移试验，也没有把纬度差换算成米作为结论。
- 官方源码中的 `Unity2Map`（Unity `(x, y, z)` → ENU `(x, z, y)`）只作为约定记录。位移方向检查未批准、未做，因此不能写成这次已经用运动证明了轴向。

### 第 2 段：数值正确性

**无法核验。** 这是已发布完成标准允许的合格路径，不是把精度写成已经通过。

当时条件如下：

- 没有独立于这套换算链的第二数据源或外部真值。
- 噪声类型为 `NoNoise`，不能当作已经过噪声模型标定。
- 协方差全为 0，`position_covariance_type` 为 0。按 ROS 2 Jazzy 的 `NavSatFix` 定义，0 表示 `COVARIANCE_TYPE_UNKNOWN`。官方源码上 `GnssGrpc` 与适配器都未赋值协方差，与本次观测一致。不要把全 0 协方差写成已给出的精度指标。
- `isRTK` 已勾选。消息 `status` 为 2、`service` 为 1。按 ROS 2 Jazzy 的 `NavSatStatus` 定义，2 为 `STATUS_GBAS_FIX`，1 为 `SERVICE_GPS`。这只是枚举对应，不能当精度证据。

枚举定义见：[NavSatFix.msg](https://github.com/ros2/common_interfaces/blob/jazzy/sensor_msgs/msg/NavSatFix.msg)、[NavSatStatus.msg](https://github.com/ros2/common_interfaces/blob/jazzy/sensor_msgs/msg/NavSatStatus.msg)。引用这些定义只说明字段本身的含义，不表示本项目已经按该定义提供了可核验的精度。

### 三项结论汇总

| 项 | 结论 | 不得写成 |
| --- | --- | --- |
| 发布频率 | 设定 100 Hz；消息头时间戳间隔稳定约 0.0400 s，对应约 25.000 Hz，与设定不一致。差异原因未拆开验证。墙钟 `hz` 未测到 | 已按 100 Hz 发布；频率已验收通过或失败（本次未设阈值） |
| 坐标系约定 | `frame_id` 与组件一致；当时原点按 45 / 15 / 0 记录；静止样本与 Inspector Point 一致到很高位（链路一致性）；样本接近原点但不重合，符合传感器在 `gps` 子物体上。未做位移试验 | 地球换算公式已由本次位移证明；独立定位精度已核过 |
| 数值正确性 | 无法核验。条件见上一小节 | 定位已验收；GPS 精度已通过；`isRTK` / GBAS_FIX / 协方差证明了精度 |

### 会话收尾

上述会话结束后已退出 Play，弹出保存则选择不保存。适配器随后用 Ctrl+C 停止，进程正常结束，`ss -ltnp 'sport = :30052'` 仅有表头、无监听。关闭过程中出现过 rosout「publisher's context is invalid」，与既知记录一致，按 ROS 2 拆除时的常见提示记录，不作为新的项目缺陷写入已知问题清单。

### 本项尚未覆盖

- 墙钟接收频率的正式 `hz` 统计；补测须另批，本稿不授权自动重试
- 把发布频率差异拆开到采样、发送或适配器
- 位移方向检查，以及用独立真值核验数值正确性
- 完整 *C*(*u*) 曲线，以及动力学精度（本包范围之外；同日稍后的离散短脉冲见 [§推进与转向闭环核验](#推进与转向闭环核验)，仍不是完整曲线验收，阶段 1 仍为进行中）
- 粉色地形与 Vulkan 缺少 `_WaterCameraHeightBuffer` / `_WaterLine` 仍为已知问题；本次 Play 中再次出现，不是新错误，也未自动消失，不在本包修理

## 推进与转向闭环核验（离散短脉冲） {#推进与转向闭环核验}

整理日期：2026-11-25，时区 America/Los_Angeles（PST，UTC-8）。本机实测约在当天 23:19–23:47（PT）。工程机终端与 Unity Console 的本地日志时间为 2026-11-26 15:19–15:47 CST（UTC+8），与 PT 相差 16 小时，互相一致。性质：**本机实测**，仅测试场景。三次 Play 都走 ROS 话题 `/marus_boat/pwm_out`，每次脉冲后都发了显式三零。

本次记录的是离散短脉冲（约 0.20 s 施力窗）在若干输入点上的请求推力、施力位置、速度、位移与偏航，并把这些请求推力与官方 `T200-V16` 关键点的非加权三次 Hermite 对照。这**不是**完整 *C*(*u*) 曲线验收，也**不是**动力学精度验收，不设通过或失败阈值。阶段 1 仍为进行中。本节不授权自动追加新脉冲。

### 场景与输入条件

- 复用已另存的测试场景 `Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`。三次会话均未覆盖保存原 `ExampleScene`，未对 Prefab 执行 Apply，`ASV Primitive Controller` 保持关闭，也没有与 WASD 混用。
- 适配器为回环 `127.0.0.1:30052`。ROS 2 Jazzy。`ROS_DOMAIN_ID` 未设置。
- 输入路径：`std_msgs/msg/Float32MultiArray` 话题 `/marus_boat/pwm_out`。命令行把 `0.24` 打成 `0.23999999463558197`、把 `-0.12` 打成 `-0.11999999731779099`，这是 float32 的预期舍入；CSV 打印为 `0.240000` / `-0.120000`。CLI 出现 `publishing #1` 还不等于已证明到达，需看 CSV。
- 三份新 CSV 中的刚体实例标识均为 `568105589213755872`，推进器通道为 0=`568105589213755698`、1=`568105589213755692`、2=`568105589213755686`，与 2026-11-25 运动验收会话一致。施力点再次印证通道绑定：0=左（port，约 x=−0.60 m），1=右（starboard，约 x=+0.60 m），2=艏侧（bow，约比质心靠前 2.1 m）。CSV 本身不能证明该刚体的 GameObject 名称是 `marus_boat`。

### 记录文件

步骤记录 CSV 仍写在 `$HOME/.config/unity3d/LABUST/marus2-example/usv-records`。原始 CSV 不作为本站公开附件；下表以文件名、字节数和 SHA256 标识。文件名中的时间戳按本站既有约定视为 UTC。

| 段 | 原文件名 | 字节数 | SHA256 | 墙钟（PT） | 数据行 / 运动行 | `fixedTime_s` |
| --- | --- | ---: | --- | --- | --- | --- |
| 第 1 段对称前向 | `usv_step_20261126_071841_307_58a901f19967470e99b7233ba902eab0.csv` | 1,213,293 | `a7fdcc15c86ceb666b539aa5d3e03df90c4501a9a9e54d3c26e1ca87e88383a8` | 2026-11-25 23:19:11–23:19:38 | 4,962 / 4,386 | 9.039997–96.739970 s |
| 第 2 段左右单侧 | `usv_step_20261126_073340_798_ae9babb5010942949b74fe426cddf36c.csv` | 614,459 | `22b9adb801a4000c49f8059fb6f244f30562f1d033337d148024e3fd339f4fe0` | 2026-11-25 23:33:49–23:34:04 | 2,519 / 2,231 | 1.859999–46.459980 s |
| 第 2b 段艏侧与倒车 | `usv_step_20261126_074613_473_20f7c0cfe2394d1baf1c4e319a5c9ff7.csv` | 481,106 | `93fa0f98bc18cbb345fe0222d060a0a7e8f6f2878024ff7dcdb06b4cff9f3958` | 2026-11-25 23:46:23–23:46:38 | 1,972 / 1,684 | 1.699999–35.359990 s |

三份文件的 33 列表头均与记录器 1153 的 `UsvStepLog.Header` 一致。每次指令都是 3 条 `input` + 3 条 `force_request` + 每路 11 步 `force_before` / `force_after`；显式三零都把三路 `forceReq_N` 清为 0 N，并新开 0.20 s、每路 11 步的零矢量施力窗。超时停力不等于显式清零。

### 与官方 T200-V16 离散点对照

对照方法：用官方 `T200-V16` 关键点的时间、推力（kgf）与斜率，做非加权三次 Hermite，再乘 \(g=9.80665\) 得到牛顿。这**不是**本机对 Unity `AnimationCurve.Evaluate` 的现场调用。CSV 的 `forceReq_N` 按打印的 6 位小数比较。

| 输入 *u* | 实测单路 `forceReq_N` | 非加权 Hermite × 9.80665 | 说明 |
| --- | ---: | ---: | --- |
| +0.12 | +1.961417 N（第 1 段，通道 0=1） | +1.9614170254 N | 与同日运动验收及历史调试记录在 6 位小数上一致 |
| +0.18 | +6.374398 N（第 1 段，通道 0=1） | 一致到 6 位小数 | 双侧对称前向 |
| +0.24 | +11.768060 N（第 1、2、2b 段；第 2b 为通道 2） | +11.7680604129 N | 左、右、艏三路在该点的单路请求推力相同 |
| +0.36 | +26.968430 N（第 1 段，通道 0=1） | +26.968426 N | 相差 0.000004 N，只作记录，不另编阈值 |
| −0.12 | −2.451649 N（第 2b 段，通道 0=1） | −2.4516492639 N | 一致到 6 位小数 |

官方 T200-V16 **并不是**绕 *u*=0 奇对称：靠近 +0.12 的关键点是 +0.2 kgf，靠近 −0.12 的是 −0.25 kgf。因此 `|-0.12|` 的请求推力绝对值比 `+0.12` 大约 0.490232 N。这是曲线既有形状，不是记录器算错，也不写成缺陷或已修复项。资产里最接近 −0.12 的关键点乘 \(g\) 得 −2.4516625 N（有时写成 −2.45166 N），那是关键点本身的乘积，不是恰好在 *u*=−0.12 处的插值。

### 第 1 段：对称前向 0.12 / 0.18 / 0.24 / 0.36

四档双侧对称前向，各跟一次显式三零，全部写入同一份 CSV。每档施力窗均为 11 步、0.200000 s；通道 2 保持 0。位移取该档脉冲前已稳住的状态到下一档（末档到会话结束）的 `posZ` 增量，以便对照运动过程中的滑行，不是只算到三零瞬间。

| 输入 | 单路 `forceReq_N` | 峰值 velZ | 至下一档或结束的 Δz |
| --- | ---: | ---: | ---: |
| 0.12 / 0.12 / 0 | 1.961417 N | 0.002664 m/s | 0.409 cm |
| 0.18 / 0.18 / 0 | 6.374398 N | 0.008656 m/s | 1.342 cm |
| 0.24 / 0.24 / 0 | 11.768060 N | 0.015998 m/s | 2.479 cm |
| 0.36 / 0.36 / 0 | 26.968430 N | 0.036615 m/s | 5.668 cm |

从第一档脉冲前到会话结束，前向净位移约 +0.098977 m（+9.90 cm），横向约 −0.10 mm，垂向约 +0.02 mm，航向变化约 0.0017°。峰值速度与位移随输入严格递增。0.12 档与同日运动验收锚点（峰值 velZ 约 0.002664 m/s、前向位移约 0.00410 m）一致。脉冲前约 30 s 的 `posZ` 保持不变，说明不是刚体被锁死；幅度以厘米计，在拉远的 Scene 视图里容易看起来像没动。本项仍**不评价动力学精度**。

![第 1 段对称前向的请求推力与前向速度、位移]({{ '/assets/images/propulsion-20261125/stage1_propulsion_curves.png' | relative_url }})

### 第 2 段：左右单侧差速

航向由四元数离线计算。Unity 左手系中，把艇体局部前向 `(0, 0, 1)` 旋到世界系：

```
fwd_x = 2 * (rotX * rotZ + rotW * rotY)
fwd_z = 1 - 2 * (rotX² + rotY²)
yaw = atan2(fwd_x, fwd_z)
```

`yaw > 0` 表示前向转向世界 +X（右舷）；从上往下看，这是绕 +Y 的顺时针旋转，也就是右转。`angVelY > 0` 使 yaw 增大。下面两组实测与此约定一致；`angVelY` 的时间积分与 Δyaw 分别只相差约 0.000053° 与 0.000003°。

| 输入 | 活动通道与 `forceReq_N` | 峰值 angVelY | 至三零 Δyaw | 峰值 velZ | 至三零 Δz / Δx |
| --- | --- | --- | --- | ---: | --- |
| `[0.24, 0, 0]`（左 / port） | 通道 0：11.768060 N | +0.005778 rad/s（+0.331055 deg/s） | +0.117031°（右转） | 0.007980 m/s | +1.198 cm / −0.206 cm |
| `[0, 0.24, 0]`（右 / starboard） | 通道 1：11.768060 N | −0.005769 rad/s（−0.330539 deg/s） | −0.116800°（左转） | 0.007994 m/s | +1.203 cm / +0.205 cm |

左右符号相反，幅值相对差约 0.16%–0.39%。单侧 0.24 的峰值前向速度约为第 1 段双侧对称 0.24（0.015998 m/s）的一半，只作量级对照。横摇 / 纵摇角速度与垂向速度在脉冲窗内仍为小量，没有异常大幅摆动。两次相反偏航在会话结束时基本抵消（净 Δyaw 约 +0.000229°），净前向位移约 +2.48 cm。

必须如实记下：`velX` 的时间积分接近 0，解释不了约 ±2.05 mm 的 `posX` 变化。横向位移以 `posX` 为准记录，不能据此写成已经核清的侧漂动力学。单档偏航约 0.12°，在拉远的 Scene 视图里几乎看不出来。本次不评价「这个偏航够不够大」。

![第 2 段左右单侧的请求推力、偏航角速度、航向与俯视轨迹]({{ '/assets/images/propulsion-20261125/stage2_steering_yaw_curves.png' | relative_url }})

### 第 2b 段：艏侧与对称倒车

| 输入 | 活动通道与 `forceReq_N` | 主要运动 | 至三零的位移与航向 |
| --- | --- | --- | --- |
| `[0, 0, 0.24]`（艏侧 / bow） | 通道 2：11.768060 N。首步世界系力约为 `(11.767890, -0.063727, 0.002299)` N，主要沿 +X | 峰值 angVelY +0.010663 rad/s（+0.610945 deg/s）；峰值 velX +0.007748 m/s；velZ 几乎为 0 | Δyaw **+0.213089°**（右转，俯视顺时针）；Δx +0.487 cm；Δz −0.08 mm |
| `[−0.12, −0.12, 0]`（对称倒车） | 通道 0 与 1 各 −2.451649 N，合计 −4.903298 N。首步世界系力约为 `(-0.008019, 0.112138, -2.449070)` N，主要沿 −Z | 峰值 velZ **−0.003318 m/s**；`|angVelY|` 最大约 0.000003 rad/s | Δz **−0.491 cm**（后退）；Δx −0.01 mm；Δyaw −0.000115°（航向几乎不漂） |

艏侧把艏推向右舷，产生右转，与第 2 段的符号约定相符；`angVelY` 积分与 Δyaw 相差约 0.000045°。`velZ` 积分与倒车 Δz 相符（残差约 0.008 mm）。但艏侧的 `velX` 积分约为 +0.008617 m，与 Δx=+0.004870 m 相差约 3.75 mm。横向位移仍以 `posX` 为准记录，这一项与第 2 段属于同一类未解释清楚的现象，不掩饰，也不外推。

与第 1 段对称正向 +0.12（峰值 velZ 约 +0.002664 m/s，前进约 0.410 cm）相比，本次 −0.12 的请求推力绝对值更大，后退速度与位移幅值也略大。这与曲线在 ±0.12 的不对称相一致，不要外推成已经核清的正反向水动力对称性。

从第一档脉冲前到会话结束，净效果大约是艏侧带来的横向位移与右转，加上倒车带来的后退：Δx=+0.495 cm，Δz=−0.513 cm，Δyaw=+0.213°。三次会话的启动垂向瞬态（约 0.14–0.16 m/s）都出现在进入 Play 后的前几秒，不属于这些脉冲，也不算进响应。

![第 2b 段艏侧横向推力与对称倒车的请求推力、速度、航向与俯视轨迹]({{ '/assets/images/propulsion-20261125/stage2b_bow_reverse_curves.png' | relative_url }})

### 本项尚未覆盖

- 完整 *C*(*u*) 曲线，以及动力学精度或通过阈值。本节只核对了若干离散短脉冲，阶段 1 **不标成整体关闭**
- 对称差速 `[0.12, −0.12, 0]`：本次未做
- 用 `velX` 解释横向 `posX` 变化的机制
- 用 CSV 单独证明 GameObject 名称
- 把超时停力、停止发布或退出 Play 写成显式归零
- 粉色地形与 Vulkan 缺少 `_WaterCameraHeightBuffer` / `_WaterLine` 仍为已知问题；三次 Play 中均再次出现（Console 错误计数为 0，警告 4 条），不是新错误，也未自动消失，不在本包修理
- 墙钟接收频率等 GNSS 未补测项；本节不授权那些补测

---

## IMU / LiDAR 与 TF 树核验 {#imu-lidar-tf-树核验}

整理日期：2026-11-26 至 2026-11-27，时区 America/Los_Angeles（PST，UTC-8）。性质：本机实测，仅测试场景。第 1、2 段与方案 A 均无推力、不开 Recording、不写新文件；方案 A 退出 Play 时不保存场景，也不对官方 Prefab 执行 Apply。原始终端全文不作为本站公开附件。本节只记录已测到的话题类型、发布关系、消息头时间戳间隔、关键字段摘要与 `/tf` 实际边集，以及源码 / Prefab 只读核对和一次临时根 TF 验证。

不得据此写成 IMU 或 LiDAR 已标定、精度已通过、噪声模型已验收，或官方 Prefab / 已保存测试场景已持久挂载 `map -> marus_boat/base_link`。不得把 Inspector 或脚本里的设定频率直接写成已经测到的话题频率。阶段 1 总体仍保持进行中。

### 测了什么、没测什么

本轮只做了四件事：

1. 第 0 段只读锁定核验：对照已锁定的六个仓库提交与指定文件 SHA256，确认测试场景仍只额外关闭 `ASVPrimitiveController`，且当时 `30052` 空闲。
2. 第 1 段短时连通与消息结构抽查（3.52 s）：确认 `/marus_boat/imu`、`/marus_boat/lidar`、`/tf`、`/tf_static` 的类型、发布 / 订阅关系与首帧结构。
3. 第 2 段 12.01 s 静止只读采样：统计 IMU、LiDAR 与 `/tf` 的消息头时间戳间隔、墙钟间隔，以及静止样本的字段范围；全程无推力。
4. 方案 A 临时根 TF 验证（6.02 s）：仅在测试场景的 `marus_boat` 根实例临时挂载 `TfStreamerGrpc`，确认可以补出 `map -> marus_boat/base_link`，且 `tf2_ros` 能把该边与既有传感器边连成可查询链路；随后退出 Play 不保存，并以 SHA256 复核文件未被改写。

本轮没有做：推力或运动态下的 IMU / LiDAR / TF 联动；正式 `ros2 topic hz`；相机或声呐话题与图像 / 声呐流；把根 TF 写回已保存测试场景或官方 Prefab；传感器噪声、偏置、标定或精度验收；许可证审计。

### 场景与连接条件

与已发布运动验收、GNSS 核验使用同一测试场景：`Assets/Scenes/ExampleScene_Stage1MotionAcceptance.unity`。该文件由官方 `ExampleScene.unity` 另存得到，只在该实例上关闭 `ASVPrimitiveController`，没有把改动 Apply 回官方 Prefab。第 0 段测得该测试场景 SHA256 为 `bf9b90fe917277b916c7772bf9ad08f1c5cd6e521a1bf7399796851676106c4a`，官方 `marus_boat.prefab` SHA256 为 `e6c360556aa27b0db5aa16b2189f02407840d0b9542a8404e833065828ae56b7`。方案 A 收尾时这两个哈希与第 0 段逐字节一致。

启动方式沿用已发布操作页：先在 `$ROS2_WS` 启动 `marus2_ros_adapter`，再在 Unity 中打开上述测试场景并进入 Play。适配器为回环 `127.0.0.1:30052`。第 1、2 段与方案 A 收尾时，`ss -ltnp 'sport = :30052'` 均空闲。

六个锁定提交与第 0 段核验一致，完整 SHA 如下：

| 仓库 | 完整提交 SHA |
| --- | --- |
| example | `0f9ec3f8a4a30126bcbed8ddbf90800fafa33f06` |
| core | `747bcee11adfa0f4bbd60db698b24794ab5581c8` |
| sensors | `c88714d750d0b0d99dcfde77694ec5f37d407ec5` |
| sensors-grpc | `485146512c8011a1586570d635e8f240ee43f667` |
| proto | `807af27a08b242748232c6ef87f0d68a675d2040` |
| adapter | `7af7a0b492bb8c55948a2c839a9f077b7cfe4173` |

### 必须分开的结论类型

| 结论类型 | 本轮是否成立 | 说明 |
| --- | --- | --- |
| 话题存在且类型已核对 | 是（本机实测） | IMU 为 `sensor_msgs/msg/Imu`，LiDAR 为 `sensor_msgs/msg/PointCloud2`（不是 `LaserScan`），`/tf` 为 `tf2_msgs/msg/TFMessage` |
| 发布者与 QoS 已记录 | 是（本机实测） | 上述三话题均由 `marus2_ros_adapter` 发布（1 publisher，`RELIABLE` / `VOLATILE`）；`/tf_static` 为 0 publisher、1 subscriber，适配器只订阅不发布 |
| 消息头时间戳间隔已记录 | 是（本机实测） | IMU 严格 25.000 Hz，LiDAR 严格 10.000 Hz，默认 `/tf` 约 0.988 Hz。这是消息头时间戳间隔，不是设定值本身 |
| 墙钟到达间隔已记录 | 是（本轮 Python 采样，不是正式 `ros2 topic hz`） | IMU 墙钟 24.826 Hz，LiDAR 9.999 Hz，默认 `/tf` 0.971 Hz。不得把本轮结果回写为 GNSS 已补做正式 `ros2 topic hz` |
| 静止样本字段范围已记录 | 是（本机实测） | 只描述该次静止窗口；不得升级为标定或精度通过 |
| 默认 `/tf` 边集已记录 | 是（本机实测） | 仅 3 条边：`marus_boat/base_link -> gps_frame` / `imu_frame` / `lidar_frame`；`TF_HAS_MAP_TO_BASE_LINK=False`；`/tf_static` 为 0 边 |
| 缺少 `map -> base_link` 与相机 / 声呐边的原因 | 源码 / Prefab 只读静态事实，并与实测边集相符 | 官方 Prefab 未在艇体根挂 `TfStreamerGrpc`；四个相机与 `sonar` 默认 `m_IsActive: 0`。这不是测量遗漏 |
| 方案 A 可临时补出根 TF 且可查询 | 是（本机临时实测） | 仅测试场景实例、未保存、未 Apply。不得写成官方示例已持久验收完整 TF 树 |
| IMU / LiDAR 精度、噪声或标定已通过 | 否 | 未设通过阈值，也未做运动态对照 |
| 官方 Prefab 或已保存测试场景已挂根 TF | 否 | 方案 A 为临时验证；收尾 SHA256 与第 0 段一致 |

### 第 0 段：只读锁定核验

时间：2026-11-26 23:55:29 PST。本段不进入 Play，不启动适配器。

核验结果：`ERRCOUNT=0`，`WARNCOUNT=0`；`PORT_30052 NO_LISTEN`。六个锁定提交与上表一致。脚本对照的 17 项核心文件 SHA256 全部 `HASH_OK`，13 个指定路径全部 `GIT_CLEAN`。

`marus_boat.prefab`（SHA256 `e6c360556aa27b0db5aa16b2189f02407840d0b9542a8404e833065828ae56b7`）与测试场景 `ExampleScene_Stage1MotionAcceptance.unity`（SHA256 `bf9b90fe917277b916c7772bf9ad08f1c5cd6e521a1bf7399796851676106c4a`）确认：测试场景相对官方示例，仅额外关闭了该实例上的 `ASVPrimitiveController`，没有非预期的传感器或 TF 覆盖。

### 第 1 段：短时连通与消息结构抽查

时间：2026-11-27 02:51 PST。探针时长 3.52 s。无推力，不开 Recording，不保存场景。

话题与发布关系：

| 话题 | 类型 | 发布 / 订阅 | QoS（已记录） |
| --- | --- | --- | --- |
| `/marus_boat/imu` | `sensor_msgs/msg/Imu` | 1 publisher：`marus2_ros_adapter` | `RELIABLE` / `VOLATILE` |
| `/marus_boat/lidar` | `sensor_msgs/msg/PointCloud2`（不是 `LaserScan`） | 1 publisher：`marus2_ros_adapter` | `RELIABLE` / `VOLATILE` |
| `/tf` | `tf2_msgs/msg/TFMessage` | 1 publisher：`marus2_ros_adapter` | `RELIABLE` / `VOLATILE` |
| `/tf_static` | （本段未改写类型名） | 0 publisher，1 subscriber | 适配器只订阅，不发布 |

首帧结构：

- IMU：`frame_id='marus_boat/imu_frame'`；三组 9 元协方差全部为 `0.0`。
- LiDAR：`frame_id='marus_boat/lidar_frame'`；`height=1`，`width=136120`，`point_step=24`，`row_step=3266880`，`is_dense=True`。字段布局为 `XYZIRT`：`x` / `y` / `z` / `intensity` 为 `FLOAT32`；`ring` 为 `UINT16`，偏移 16，其后有 2 字节填充；`time` 为 `UINT32`，偏移 20。
- `/tf`：仅见 3 条边，分别是 `marus_boat/base_link -> gps_frame`、`marus_boat/base_link -> imu_frame`、`marus_boat/base_link -> lidar_frame`。未见 `map -> marus_boat/base_link`。

收尾：`ss -ltnp 'sport = :30052'` 空闲。

说明：第 1 段首帧 LiDAR `width=136120`，第 2 段全程恒定为 `width=136116`。两者都是实测值，这里并列记录，不把其中一侧改写成另一侧，也不在此归因。

### 第 2 段：12.01 s 静止只读采样

时间：2026-11-27 02:57 PST。采样窗 12.01 s。无推力，不开 Recording，不写文件。

**IMU**（296 帧）：

- `header.stamp` 严格 **25.000 Hz**：295/295 个间隔全部为 `0.040000 s`。这与 GNSS 设定 100 Hz、实测消息头间隔约 0.0400 s（约 25.000 Hz）的现象同构。差异原因仍未拆开验证。
- 墙钟到达间隔（本轮 Python 采样，不是正式 `ros2 topic hz`）为 24.826 Hz，中位数 `0.040493 s`。
- 线加速度均值：`ax=-0.448709±0.000008`，`ay=+0.053124±0.000001`，`az=+9.799593±0.000103`；模长 `|a|=9.810004±0.000104 m/s²`。该次静止样本中重力沿 `+Z`。
- 角速度接近 0：`max_abs ≤ 5e-6 rad/s`。
- 四元数恒定 `(-0.022877, 0.002705, 0.000167, 0.999735)`，模长 `1.000000`。
- 全部 296 帧的三组协方差均为 `0.0`。

**LiDAR**（118 帧）：

- `header.stamp` 严格 **10.000 Hz**：间隔全部为 `0.100000 s`。墙钟到达间隔 9.999 Hz，与设定 10 Hz 相符。
- `width=136116`（全程恒定），`is_dense=True`。
- 首帧与尾帧解包均为 **100.00%** 有限点，全零点个数为 `0`。
- 测距 `r ∈ [5.256, 119.999] m`，中位数 `80.985 m`，落在设定范围 `[3, 120] m` 内。
- `x ∈ [-119.66, 119.04]`，`y ∈ [-110.86, 118.98]`，`z ∈ [-43.61, 21.35]`，`intensity ∈ [0, 24]`。
- 命中 99 个 ring（`29..127`）。
- `time_u32` 在同一帧内统一，并跨帧递增：`480668694 -> 480680642`。

**TF**：

- 12 s 内稳定仅 3 条边；每条边 11 帧。
- `header.stamp` 为 0.988 Hz，间隔 `1.000~1.020 s`；墙钟 0.971 Hz。
- 变换恒定：`max_dt ≤ 1e-6 m`。
- `/tf_static` 为 0 边。
- `TF_HAS_MAP_TO_BASE_LINK=False`。

收尾：`30052` 空闲。

### 源码与 Prefab 根因核查（只读静态事实）

以下只描述官方锁定副本与官方序列化中的静态事实，并与第 1、2 段测到的边集对照。不修改任何源码、场景或 Prefab。

- 官方 `marus_boat.prefab` 中，四个相机 `camera_bow` / `camera_stern` / `camera_port` / `camera_starboard` 与 `sonar` 默认 `m_IsActive: 0`。这些对象上的相关组件本身为 `m_Enabled: 1`，官方场景也没有覆盖它们的 `m_IsActive`。Unity 不会对未激活对象调用 `Update`，因此运行时不会为这些传感器发布 `/tf`。这与实测只看到 gps / imu / lidar 三条边相符。
- `TfStreamerGrpc.UpdateVehicle()`（约 L84–102）和 `UpdateTransform()`（约 L252–257）在源码中预留了如下路径：组件挂在艇体根上、未设置 `ParentTransform` 时，按 `Unity2Map` 发布 `map -> {车名}/base_link`。官方 Prefab 与官方场景均未挂载该根组件。`RosConnection.OriginFrameName="map"` 只用于 `TfHandler` 的入站原点管理；`TfHandler.UpdateTf()` 只操作 `RosConnection/TfHandler/tf` 镜像子树，不会反向覆盖艇体 Transform。因此，默认看不到 `map -> marus_boat/base_link`，是官方示例的序列化选择，不是第 1、2 段漏测。

以上静态核对只解释默认边集。它本身不是一次新的运行时验收，也不能代替方案 A 的临时实测。

### 方案 A：临时根 TF 验证

时间：2026-11-27 07:31 PST。默认 1 Hz，探针 6.02 s。操作范围仅限测试场景实例：在 `ExampleScene_Stage1MotionAcceptance` 的 `marus_boat` 根上临时挂载 `TfStreamerGrpc`，`ParentTransform=None`，发布 `map -> marus_boat/base_link`，频率 1 Hz。退出 Play 时不保存场景，不对官方 Prefab 执行 Apply。

运行时 `/tf` 实测为 4 条边（在原有 3 条传感器边之外增加根边）；每条边 6 帧；`stamp_hz=0.996`，`wall_hz=0.968~0.969`。

根边 `map -> marus_boat/base_link` 该次测得：

- 平移 `t=(-0.0017, -10.0218, -0.1681)`
- 四元数 `q=(-0.0143, 0.0181, 0.7070, 0.7068)`
- RPY `rpy=(0.31°, 2.62°, 90.03°)`
- 前向 `+X` 指向 ENU 正北 `+Y`

`tf2_ros` 全链路查询全部为 `LOOKUP_OK`：`map -> base_link`、`map -> imu_frame`、`map -> lidar_frame`、`map -> gps_frame` 均解析成功。本稿按终端回传抄录根边的平移、四元数与 RPY；子坐标系查询同样成功，但不把由根边与传感器边推算的数值写成单独测得的查询结果。

收尾零改动复核：`30052` 空闲；`marus_boat.prefab` 与 `ExampleScene_Stage1MotionAcceptance.unity` 的 SHA256 与第 0 段逐字节一致。因此，方案 A 只证明官方预留路径在临时挂载时可以工作，并且 `tf2_ros` 能够把根边与既有传感器边连起来；当前保存的测试场景与官方 Prefab 均未持久挂载 `map -> marus_boat/base_link`。

### 本项尚未覆盖

以下内容本轮明确没有验收，也不得从已有数字外推为已通过：

- 全推力曲线、水动力模型与动力学精度
- IMU / LiDAR 噪声、偏置、标定与精度指标
- 运动态下 IMU / LiDAR / TF 的联动
- 相机与声呐话题、图像或声呐流
- 把根 TF 持久写入官方 Prefab 或已保存测试场景
- 正式 `ros2 topic hz`（本轮墙钟数字来自 Python 采样）
- 许可证审计

阶段 1 总体仍保持进行中。下一步工作包待定，本节不授权新的试验。

---

## 已知现象

### 渲染相关

| 现象 | 影响 | 状态 |
|:-----|:-----|:-----|
| 播放时地形粉色块 | 视觉，待查 | 记录中 |
| Vulkan 报缺少水面高度缓冲 | 控制台警告 | 记录中 |
| `RNG_CS.compute` 缺少 `#pragma kernel` | 编译警告 | 记录中 |

2026-11-25 测试场景在运动验收、其后 GNSS 核验，以及同日晚间推进与转向三次 Play 中均再次出现粉色地形与上述 Vulkan 警告，不作为新错误，也未自动消失。上述会话的 Console 错误计数均为 0；推进与转向三次 Play 各有 4 条既知 Vulkan 警告。这些现象不作为 GNSS 包或推进核验的失败条件。详见 [已知问题清单]({% link docs/issues/known-issues.md %})。

2026-11-26 至 2026-11-27 的 IMU / LiDAR 与 TF 核验是另一次静止、无推力采样，不是对上述粉色地形或 Console 条目的复测。本轮没有把渲染或 Console 现象写成新的结论。IMU 消息头时间戳间隔再次测到严格 25.000 Hz，与 GNSS 设定 100 Hz、实测约 25.000 Hz 的现象同构；原因仍未拆开。默认 `/tf` 只有 3 条传感器边、没有 `map -> marus_boat/base_link`，已由源码 / Prefab 只读核对与方案 A 临时验证分开记录，见 [IMU / LiDAR 与 TF 树核验](#imu-lidar-tf-树核验)。

{: .warning }
现象影响待查，**未归因于显卡驱动**。

---

## 验证边界说明

「历史验证数值」与早期连接、GPS 消息、键盘记录仍为 2026-11-24 交接基线。备份路径只以文字给出，不做可点击的日志链接。制作早期页面时未直接读取该备份目录。

「阶段 1 测试场景运动验收」为 2026-11-25 本机实测，依据已上传的四份 CSV 与当时终端、截图回传。CSV 只以可移植路径和 SHA256 标识，原始文件不作为本站公开附件。

「GNSS / GPS 精度、发布频率与坐标系约定」为同日稍后的本机实测，依据当时终端输出与 Play 中 Inspector / 编辑器截图。截图随文档仓库提供；适配器与 `ros2` 终端全文不作为公开附件。墙钟 `hz` 未测到，补测须另批。

「推进与转向闭环核验（离散短脉冲）」为同日晚间的本机实测，依据已上传的三份 CSV 与当时终端、Console 回传。CSV 只以可移植路径和 SHA256 标识，原始文件不作为本站公开附件。曲线图随文档仓库提供。

「IMU / LiDAR 与 TF 树核验」为 2026-11-26 至 2026-11-27 的本机实测，依据当时终端回传原数整理，不设通过阈值。原始终端全文不作为本站公开附件。本轮墙钟数字来自 Python 采样，不是正式 `ros2 topic hz`，也不能回写为 GNSS 墙钟已测到。方案 A 为未保存的临时挂载，已保存测试场景与官方 Prefab 均未持久挂载 `map -> marus_boat/base_link`。

{: .note-title }
> 内容来源
>
> - **验证记录表**: 迁移自原 `results.md` §已有验证记录；2026-11-25 按测试场景本机实测更新速度 / 位移一行
> - **推进力单位**: 迁移自原 `units.md` §定义
> - **历史验证数值**: 迁移自原 `units.md` §历史记录中的一个输入点；同日补记 CSV 六位小数核对，不替换历史来源
> - **阶段 1 测试场景运动验收**: 2026-11-25 本机实测。整理时对照已上传文件复核了四份 CSV 的字节数、SHA256、行数与输入组
> - **GNSS / GPS 精度、发布频率与坐标系约定**: 2026-11-25 同日稍后本机实测。整理时按回传终端与截图原数抄录，未改数，也未把纬度差换算成米作为结论
> - **推进与转向闭环核验（离散短脉冲）**: 2026-11-25 同日晚间本机实测。整理时对照已上传三份 CSV 复核了字节数、SHA256、行数、指令组与离散点数值，不设通过阈值
> - **IMU / LiDAR 与 TF 树核验**: 2026-11-26 至 2026-11-27 本机实测，含第 0 段只读锁定核验、第 1 段短时结构抽查、第 2 段 12.01 s 静止采样，以及方案 A 临时根 TF 验证。整理时按回传终端原数抄录，未改数，不设通过阈值。原始终端全文不作为本站公开附件
> - **已知现象**: 迁移自原 `results.md` §已知现象；同日补记再次出现，未改归因。2026-11-27 仅交叉引用 IMU 25.000 Hz 与默认 TF 边集，不把本轮写成对粉色地形或 Console 的复测
> - **验证边界说明**: 迁移自原 `results.md` §验证边界说明，并区分历史基线与本次实测
> - **记录器局部验证**: 2026-11-25 已审阅证据。原始终端、Console 全文与 Editor.log 不作为公开附件。本节正文除范围提示外保持原样

---

## 记录器局部验证

整理日期：2026-11-25，时区 America/Los_Angeles（PST，UTC-8）。本节只记录自研步骤记录器的局部验证。带 `Z` 的时间是 UTC，换算 PST 时减 8 小时。CSV 与 run id 里的时间戳同样是 UTC。版本名（1043、1153、1220、0055、1317）只是标识，不能据名称推算日期。

路径只用占位符：`$MARUS_EXAMPLE`（原示例工程）、`$ISOLATION_PROJECT`（独立隔离工程）、`$UNITY_EDITOR`（本机 Unity 6000.5.11f1）、`$EVIDENCE_DIR` 与 `$RECORDS_DIR`（该隔离工程对应的证据目录与 CSV 目录）。本轮隔离验证不依赖 `$ROS2_WS`。

### 范围与边界

记录器是 `UsvStepLog` / `UsvMotionRecorder`。已审阅通过的范围是：1153 的纯逻辑测试与政策门禁；在 `$MARUS_EXAMPLE` 由 1043 升级到 1153 并完成编译；在 `$ISOLATION_PROJECT` 完成手动阶段和四次自动计划。

原示例工程在本阶段早期已经备份、升级并编译。此后的隔离测试不再触碰该工程已有的未保存场景。

受控力日志只调用公开记录接口，不调用 `AddForce`。这是合成记录。连接、推进求值与施力调用链、本地键盘等已有结论仍以本节之前的历史记录为准。本轮没有覆盖的项目，不把那些已有结论改写成未实现。

### 编译失败与 1153 修订

1043 的纯逻辑测试通过 **162** 项检查（checks，不是测试方法数）。该版本第一次在原工程用 Unity 6000.5.11f1 编译时失败：11 处 `GetInstanceID()` 被编译器按已弃用接口报出 **CS0619**，分布为控制器 4 处、推进器 6 处、记录器 1 处。

1153 改为官方 `GetEntityId()`，写盘前用 `EntityId.ToULong` 转为 `ulong` / `ulong?`。随后纯逻辑测试重测为 **196** 项检查通过，结束行为 `ALL PASS (196 checks)`，退出码 0。编译器为 mcs 与 mono 6.8.0.105（这是编译器版本）。测试范围仍是 `UsvStepLog` 与政策门禁，不含 Unity 包装。测试过程中有一条 CS0219 警告，已记录，不构成失败。196 与 162 分属 1153 与 1043，不能互相替代。原始终端已审阅，未作为公开附件。

### 原工程应用与编译

升级脚本 1220 已在 `$MARUS_EXAMPLE` 执行 1043→1153：终端成功，退出码 0，生成新备份。四份记录器相关源码与 1153 一致，`.meta` 与 `BoatPhysics` 未改。随后该原工程在 Unity 6000.5.11f1 下编译成功：**0 个错误、61 个警告，未进入 Play**。证据类型是 Console 截图和 Editor.log，不是只有 Console 文字。61 个警告保留在记录中。脚本身份与这次执行记录都已审阅，见下方证据索引。

### 隔离工程手动阶段

隔离工程在拷入运行器后编译成功，并有 CS0618 过时 API 警告。该警告不否定编译成功，也尚未作为专门整改关闭。

手动阶段已核验：

- 默认关闭时，Play 前、中、后都没有生成 CSV。
- 打开记录后，新建仅含 33 列表头的会话文件。
- 受控采样写入 5 行合成记录：`input`、`force_request`、`force_before`、`force_after`、`motion_pre_solve`。
- Console 中的文件名 `usv_step_20261125_054432_331_1222fe3a8caa4d9da214e46dc5317407.csv` 与刚体标识已和 CSV 交叉核对。
- 该 CSV 的 SHA256 为 `8abe89287c4e54da0b76434f7ee4c70694c89aeae436a4b5f1b894d69e235820`。

证据类型是 Console 运行日志、截图和 CSV。这次是手动测试，没有自动运行器的 Editor.log。这些行是合成日志，不代表实际 `AddForce`。

### 四次自动计划

计划都在 `$ISOLATION_PROJECT`、场景 `Assets/RecorderIsolation/RecorderIsolationTest.unity`、Unity 6000.5.11f1（编辑器修订标识 `5c3a1087d8e4`，不是 SHA256）上执行。单独一个 `ok=true` 或单独一个退出码不作为验收。下列结论来自已审阅的日志、证据 JSON，以及相应 CSV 或终端记录。原始 JSON 不在本页展开。

1. **门禁** `editmode-gates`，run id `emg20261125T105548Z-508032618`。日志开始于 2026-11-25T10:55:48Z（2026-11-25 02:55:48 AM PST）。门禁通过，且有不进入 Play 的正向记录。证据类型：Editor.log、证据 JSON。
2. **同体去重** `dedup-same-body`，run id `dsb20261125T114205Z-144875576`。日志开始于 2026-11-25T11:42:05Z（2026-11-25 03:42:05 AM PST）。同一步对同一刚体两次调用 `RecordMotionPreSolve` 后，CSV 只保留一行 `motion_pre_solve`，`fixedTime` 为 `0.020000`。这是同一步内的记录去重，不是两次物理解算。证据类型：Editor.log、证据 JSON、一份新 CSV。
3. **双体记录** `dedup-two-bodies`，run id `dtb20261125T120126Z-2667013543`。同一 `step=1`、同一时刻，两个不同的 uint64 刚体标识 `568105584918811658` 与 `568105584918811670` 各保留一行，互相不去重。该计划已正常退出 Play 并结束批处理。证据类型：Editor.log、证据 JSON、一份新 CSV。
4. **组件启停** `lifecycle-disable`，run id `lcd20261125T121130Z-1053849`。日志开始于 2026-11-25T12:11:30Z（2026-11-25 04:11:30 AM PST）。先打开第一份会话；禁用组件后会话关闭，但保留期望开关与实例指向；禁用期间再请求开启不新建文件；重新启用后换用不同路径的第二份文件；再关闭并退出 Play。两份新 CSV 都只有 33 列表头、没有数据行。这是本计划不写入采样的预期结果。终端真实退出码 0 表明这次批处理进程已经返回。证据类型：Editor.log、证据 JSON、两份新 CSV，以及终端退出码。

正常批处理退出已经证实：`dedup-two-bodies` 已正常退出 Play 并结束批处理；`lifecycle-disable` 在关闭会话并退出 Play 之后，终端退出码 0，批处理进程已经返回。`editmode-gates` 的结论是门禁通过且不进入 Play。活动会话仍打开时直接退出 Editor、依赖 `OnApplicationQuit` 自动关闭会话的分支没有单独测试。已经证明的正常批处理退出，不代替这个未测分支。

允许的自动计划就是以上四个。这些计划不调用 `AddForce`，也不引入 ROS。没有默认一次跑完全部计划。

### 本轮尚未验收

下列事项不在**记录器隔离验证**当时的结论内。未列入该轮验收，不表示平台其余已确认工作没有实现，也不覆盖或否定其后 2026-11-25 测试场景中的真实施力与运动记录。后者见 [阶段 1 测试场景运动验收](#阶段-1-测试场景运动验收)。

- 真实 `AddForce`、推进器、水动力或船舶动力学
- ROS、训练、实艇
- 活动会话仍打开时直接退出 Editor 的 `OnApplicationQuit` 分支
- Unity 包装测试、跨会话标识稳定性、写盘性能
- 自动计划启动前旧 CSV 未改的独立 inode 证明
- 原工程编译中的 61 个警告，以及隔离运行器中的 CS0618 警告（均未作为专门整改关闭）

### 证据索引

本索引只列已审阅、且适合公开引用的最终身份和文件哈希。SHA256 均写全 64 位。原始日志已审阅，不附带个人路径发布。

当前身份：生产记录器包 `usv-step-recorder-rev-20261124-1153`；在原工程实际执行成功的升级脚本 1220；隔离驱动包 `usv-recorder-isolation-review-20261124-1317`（其中记录器源码为 1153 原样复制）；Editor 运行器最终包装 `usv-recorder-editor-runner-review-20261125-0055`。

| 对象 | SHA256 |
| --- | --- |
| 生产记录器包 `usv-step-recorder-rev-20261124-1153.zip` | `bc2013baabe9eb28c799048d4fb722fecaeef4684f4dd1daa2ce983cb4834640` |
| `UsvMotionRecorder.cs` | `fc7f35018f1b1e15bc9eeb8027d9b5042982538efbbf473e0f9769c907ab0b7e` |
| `UsvMotionRecorder.cs.meta` | `4403ee0412082fa3646b80701934a5e6a0831b3d1a20b67bca1e73a2098ab676` |
| `UsvStepLog.cs` | `b5806710400aa7fb92a194c132a8e38175a31e61066172d3e03cb243a7f8d5c7` |
| `UsvStepLog.cs.meta` | `f51ca0aa78f48f5b443678eeadabd95e6574cde136ef02233dc4e115ece06227` |
| 隔离驱动包 `usv-recorder-isolation-review-20261124-1317.zip` | `a2063821e78cc0525d1febc627d783cfb529ba0c8006cd1a18d2dbf09d2cd393` |
| `UsvRecorderIsolationDriver.cs` | `b499f4e466eacf4cce6d64490a92d750fdf99e9cf77b4e486a301582b3dad67d` |
| `UsvRecorderIsolationDriver.cs.meta` | `04224ce4f6a046a4161afca0e9e838dcbc455a2e5e87646699f1bd5390ded274` |
| 运行器最终包装 `usv-recorder-editor-runner-review-20261125-0055.zip` | `4fb57729c5612d7005acb72e31e9e6c851723d22a615fc9c237f420a1a19e86a` |
| `UsvIsolationEditorRunner.cs` | `894e62d7e70a2c610d672b2f68c8117021b0a81aaa3f6d6b493cea2d7fb8d34d` |
| `UsvIsolationEditorRunner.cs.meta` | `d1ec3645244ae5e1c076b01d6dda8916157d9a38430818de057dee3f762a6aa7` |
| 已在原工程实际执行的升级脚本 1220 | `8a5a0418dc497d5d0febdc78eb6a023066de0e59bb0061d0a03e50b0c89ff36e` |

隔离驱动包中的记录器源码与上表 1153 的 `UsvMotionRecorder.cs`、`UsvMotionRecorder.cs.meta`、`UsvStepLog.cs`、`UsvStepLog.cs.meta` 哈希一致。

| 计划 | run id | 证据 SHA256 |
| --- | --- | --- |
| `editmode-gates` | `emg20261125T105548Z-508032618` | Editor.log `8c7998009d81bd85c8c48eaae83c9c5fae618ff8dc4500c2c64fbe858bb9471d`；证据 JSON `7a4061f65e2c6be00e17e784e8643fb8123cac159acd21ab7ff5baa7a16fc3ad` |
| `dedup-same-body` | `dsb20261125T114205Z-144875576` | Editor.log `015815532c62cd1353976cb26da315d9584bb238e64e65d30239787e20c1c179`；证据 JSON `a81d38f80566630d3946b93404f19c253d02d6d77e566119ded0f32656c95b4e`；新 CSV `7909cf9eb81da9acd37ce2e1a23bd27fcd554aa04b7d683d076e72295a133175` |
| `dedup-two-bodies` | `dtb20261125T120126Z-2667013543` | Editor.log `55e6c1ef129a6d52d4e3f51532618531ba6e806f6741672cda6df63f8d90ee47`；证据 JSON `43b75dfd3aa1a2a42cb518017a84c1c4f3d6ea33b6a7eb71be9815ee7b0624d6`；新 CSV `3bcada39385abca32f90678533a70f09ab5108235beca9aa47b68cbc7b633d66` |
| `lifecycle-disable` | `lcd20261125T121130Z-1053849` | Editor.log `4c88329a7e25eb89cdbcda9566a1146ce34a7572e4db7c3889233504914f6361`；证据 JSON `940a5a9631e6884dc30764dff216f32b09a411f0334f123d3c4a8bc87ad3de65`；两份新 CSV 的内容哈希同为 `037e3640138b35e8cfbf1ccc27e8f96d7c6808f145df1748ae3570fb393c232a`（文本相同，不是同一文件） |

{: .metadata }
**页面元数据**: 文档整理日期 2026-11-27 · 历史验证记录、公式与历史数值仍为 2026-11-24 交接基线，未改写原记录值 · 阶段 1 测试场景运动验收全文、GNSS 三项结论与推进转向离散短脉冲保持已发布正文 · 记录器局部验证正文除范围提示外保持已审阅原文，原始日志未作为公开附件 · 2026-11-26 至 2026-11-27 增补 IMU / LiDAR 与 TF 树核验及方案 A 临时根 TF 验证专节 · 状态: 2026-11-27 已纳入站点，记录阶段 1 IMU / LiDAR 与 TF 树核验及方案 A 临时根 TF 验证
