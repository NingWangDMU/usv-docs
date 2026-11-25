---
title: 已有验证结果
parent: 运行与验收
nav_order: 2
last_modified_date: 2026-11-25
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
| 连接 | 首次 Ping 成功；话题 `/marus_boat/gps` 收到完整 `NavSatFix` | 仅通道与消息可达 | 已验证 |
| 推进求值与施力 | 输入示例 → 曲线输出 → 换算后的力；同实例 `FixedUpdate` 的 `AddForceAtPosition` 记录到后显式归零 | 只验证调用链，不是动力学 | 调用链已验证 |
| 本地键盘 | `ASVPrimitiveController` 直接改 `Transform`，WASD 有效 | 非物理路径；需焦点与 `activeAgent` | 已验证 |
| 艇体速度 / 位移 | 尚未记录到与施力对应的速度或位移 | 待批准的下一工作包 | 待验证 |
| GPS 精度 / 频率 / 坐标 | 尚无验收结果 | 不得把收到消息写成定位正确 | 待验证 |
| 步骤记录器局部行为 | 1153 纯逻辑 196 项检查；原工程经脚本 1220 升级后编译 0 错误、61 警告且未进入 Play；隔离工程手动阶段与四次自动计划已审阅通过 | 合成记录。不是真实 `AddForce`、推进器、水动力、ROS、训练或实艇验收。活动会话直接退出 Editor 的 `OnApplicationQuit` 分支未单测 | 局部已验证 |

---

## 推进力单位换算

{% include formula.html %}

---

## 历史验证数值

来源：用户回传的调试输出（转述）。制作本页时未直接读取原始备份文件。

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

{: .warning-title }
> 精度与动力学界限
>
> 这些小数来自调试输出，不能当成已经过仪器标定的有效数字。本记录只证明「输入 → 求值 → 施力调用 → 归零」，**不能写成动力学已验证**。艇体速度与位移响应仍待验收；完整 *C*(*u*) 曲线也未给出。

---

## 已知现象

### 渲染相关

| 现象 | 影响 | 状态 |
|:-----|:-----|:-----|
| 播放时地形粉色块 | 视觉，待查 | 记录中 |
| Vulkan 报缺少水面高度缓冲 | 控制台警告 | 记录中 |
| `RNG_CS.compute` 缺少 `#pragma kernel` | 编译警告 | 记录中 |

详见 [已知问题清单]({% link docs/issues/known-issues.md %})。

{: .warning }
现象影响待查，**未归因于显卡驱动**。

---

## 验证边界说明

以上为历史验证基线。备份路径只以文字给出，不做可点击的日志链接。制作本页时未直接读取该备份目录。

{: .note-title }
> 内容来源
>
> - **验证记录表**: 迁移自原 `results.md` §已有验证记录
> - **推进力单位**: 迁移自原 `units.md` §定义
> - **历史验证数值**: 迁移自原 `units.md` §历史记录中的一个输入点
> - **已知现象**: 迁移自原 `results.md` §已知现象
> - **验证边界说明**: 迁移自原 `results.md` §验证边界说明
> - **记录器局部验证**: 2026-11-25 已审阅证据。原始终端、Console 全文与 Editor.log 不作为公开附件

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

下列事项不在本轮结论内。未列入本轮验收，不表示平台其余已确认工作没有实现。

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
**页面元数据**: 文档整理日期 2026-11-25 · 历史验证记录、公式与历史数值仍为 2026-11-24 交接基线，本次未改写、未重新实测 · 记录器局部验证整理自 2026-11-25 已审阅证据，原始日志未作为公开附件 · 状态: 历史基线保留，记录器阶段结论已写入
