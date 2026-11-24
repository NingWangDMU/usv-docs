---
nav_exclude: true
---

# 文档信息架构迁移映射表

**迁移日期**: 2026-11-24  
**基线**: main ca31eed5b994e07b3b0ed55450267093c9f15251  
**分支**: cursor/docs-restructure-2fe3

## 新结构树

```
docs/
├── architecture/ (项目与架构)
│   ├── overview.md (项目总览)
│   └── roadmap.md (阶段路线与进度)
├── operations/ (运行与验收)
│   ├── environment.md (环境与工程锁定)
│   ├── verification.md (已有验证结果)
│   └── procedures.md (可复现操作)
└── issues/ (问题与记录)
    ├── known-issues.md (已知问题)
    └── code-status.md (源码与状态限定)
```

## 内容迁移详细映射

### 1. 项目总览 (overview.md) ← 合并多源
| 源文件 | 源章节/锚点 | 迁移内容 | 保留 | 说明 |
|--------|-------------|----------|------|------|
| goals.md | #项目分类 | 完整迁移 | ✅ | 四类区分：原版/环境/适配/未来 |
| dataflow.md | 完整页面 | 完整迁移 | ✅ SVG图+图例 | 包含_includes/dataflow.html SVG |
| dataflow.md | #新手术语解释 | 完整迁移 | ✅ | gRPC/FixedUpdate/NavSatFix/Transform/Rigidbody |
| units.md | #说明 | 概述部分 | ✅ | 教学定义说明迁移至项目总览 |

### 2. 阶段路线与进度 (roadmap.md) ← 从goals拆分
| 源文件 | 源章节/锚点 | 迁移内容 | 保留 | 说明 |
|--------|-------------|----------|------|------|
| goals.md | #开发阶段 | 完整表格 | ✅ | 阶段0-3，当前状态，验收要点 |
| goals.md | #下一步 | 完整章节 | ✅ | 工作包/完成标准/约束/边界 |
| goals.md | #验证证据 | 完整表格 | ✅ | 连接/GPS/推进/艇体/键盘/源码/许可证 |

### 3. 环境与工程锁定 (environment.md) ← 保留原文件
| 源文件 | 源章节/锚点 | 迁移内容 | 保留 | 说明 |
|--------|-------------|----------|------|------|
| environment.md | 完整页面 | 完整保留 | ✅ | Unity 6000.5.11f1, 工程0f9ec3f8..., adapter 7af7a0b..., 占位符 |

### 4. 已有验证结果 (verification.md) ← 合并results + units数值
| 源文件 | 源章节/锚点 | 迁移内容 | 保留 | 说明 |
|--------|-------------|----------|------|------|
| results.md | #已有验证记录 | 完整表格 | ✅ | 连接/推进/键盘/艇体/GPS，含单位链接 |
| units.md | #定义 + #历史记录 | 完整迁移 | ✅ 公式HTML+数值 | 包含_includes/formula.html, 0.12→0.200...kgf→1.961...N |
| results.md | #已知现象 | 完整迁移 | ✅ | 渲染相关三问题，指向已知问题页 |
| results.md | #验证边界说明 | 完整保留 | ✅ | 历史基线说明 |

### 5. 可复现操作 (procedures.md) ← 保留原文件
| 源文件 | 源章节/锚点 | 迁移内容 | 保留 | 说明 |
|--------|-------------|----------|------|------|
| procedures.md | 完整页面 | 完整保留 | ✅ | 打开工程/adapter 127.0.0.1:30052/本地键盘，全部命令 |

### 6. 已知问题 (known-issues.md) ← 从known-issues拆分主体
| 源文件 | 源章节/锚点 | 迁移内容 | 保留 | 说明 |
|--------|-------------|----------|------|------|
| known-issues.md | #问题一览 | 保留前4行 | ✅ | 移除"源码与状态"行 |
| known-issues.md | #粉色块+Vulkan | 完整保留 | ✅ | 视觉异常，未归因驱动 |
| known-issues.md | #RNG_CS | 完整保留 | ✅ | #pragma kernel警告 |
| known-issues.md | #艇体速度 | 完整保留 | ✅ | 施力调用已验证，运动未验收 |
| known-issues.md | #GPS精度 | 完整保留 | ✅ | 消息可达，数值未验证 |

### 7. 源码与状态限定 (code-status.md) ← 从known-issues拆分
| 源文件 | 源章节/锚点 | 迁移内容 | 保留 | 说明 |
|--------|-------------|----------|------|------|
| known-issues.md | #源码与工作区状态限定说明 | 完整表格 | ✅ | 三脚本相对HEAD无差异/未跟踪.bak/场景未保存/许可证 |

## URL兼容策略

### 完全兼容（保留原文件名）
| 旧URL | 新URL | 状态 | 说明 |
|-------|-------|------|------|
| /docs/operations/environment | /docs/operations/environment | ✅ 完全兼容 | 仅标题改为"环境与工程锁定" |
| /docs/operations/procedures | /docs/operations/procedures | ✅ 完全兼容 | 仅标题改为"可复现操作" |

### 需要兼容跳转页
| 旧URL | 新位置 | 兼容方案 | 锚点迁移 |
|-------|--------|----------|----------|
| /docs/architecture/goals | 拆分到overview + roadmap | 保留旧文件作兼容页，说明迁移位置 | #项目分类→overview#项目分类<br>#开发阶段→roadmap#开发阶段<br>#验证证据→roadmap#验证证据 |
| /docs/architecture/dataflow | 迁移到overview | 保留旧文件作兼容页 | #数据流概述→overview#数据流概述<br>#新手术语→overview#新手术语解释 |
| /docs/architecture/units | 迁移到verification | 保留旧文件作兼容页 | #定义→verification#推进力单位换算<br>#历史记录→verification#历史验证数值 |
| /docs/operations/results | 迁移到verification | 保留旧文件作兼容页 | #已有验证记录→verification#已有验证记录 |
| /docs/issues/known-issues | 拆分到known-issues + code-status | 保留旧文件作兼容页 | #问题一览→known-issues#问题一览<br>#源码与状态→code-status |

### 锚点映射表（详细）
#### goals.md 锚点
- `#项目分类` → `overview.md#项目分类`
- `#开发阶段` → `roadmap.md#开发阶段`
- `#下一步` → `roadmap.md#下一步`
- `#完成标准` → `roadmap.md#完成标准`
- `#约束条件` → `roadmap.md#约束条件`
- `#边界说明` → `roadmap.md#边界说明`
- `#验证证据` → `roadmap.md#验证证据`

#### dataflow.md 锚点
- `#数据流概述` → `overview.md#数据流概述`
- `#新手术语解释` → `overview.md#新手术语解释`

#### units.md 锚点
- `#说明` → `verification.md#推进力单位与施力关系`
- `#定义` → `verification.md#推进力单位换算`
- `#历史记录中的一个输入点` → `verification.md#历史验证数值`

#### results.md 锚点
- `#已有验证记录` → `verification.md#已有验证记录`
- `#已知现象` → `verification.md#已知现象`
- `#验证边界说明` → `verification.md#验证边界说明`

#### known-issues.md 锚点（保留大部分）
- `#问题一览` → `known-issues.md#问题一览` (保留)
- `#播放时地形粉色块--vulkan-水体缓冲区警告` → 保留
- `#rng_cscompute-缺少-pragma-kernel` → 保留
- `#艇体速度--位移响应未验收` → 保留
- `#gps-精度频率与坐标约定未验证` → 保留
- `#源码与工作区状态限定说明` → `code-status.md`

## 保留内容清单（不得删除）

### 必须保留的所有事实内容
- ✅ 项目分类四类区分
- ✅ 开发阶段0-3完整表格
- ✅ 完整数据流SVG图 (_includes/dataflow.html)
- ✅ 图例样式 (sw-ros/sw-adp/sw-unity/sw-key)
- ✅ 推进力公式HTML+MathML (_includes/formula.html)
- ✅ 历史数值: 0.12→0.200008854 kgf→1.96141684 N
- ✅ FixedUpdate施力调用/显式归零验证
- ✅ Unity 6000.5.11f1
- ✅ 工程commit 0f9ec3f8a4a30126bcbed8ddbf90800fafa33f06
- ✅ adapter 7af7a0b492bb8c55948a2c839a9f077b7cfe4173
- ✅ uuv_sensor_msgs afd677faeaf0f4909e069ad17c9ee34e9a670bae
- ✅ /marus_boat/gps话题
- ✅ adapter 127.0.0.1:30052完整命令
- ✅ 所有bash命令结构
- ✅ 四个已知问题详细描述
- ✅ 源码三文件限定说明

### 必须保留的所有资源
- ✅ _sass/custom/custom.scss (main全部规则不动)
- ✅ _includes/dataflow.html (SVG图)
- ✅ _includes/formula.html (MathML+HTML公式)
- ✅ Gemfile, Gemfile.lock, package.json, package-lock.json

## 安全与变更约束
- ✅ 保留main custom.scss全部字节不变
- ✅ author/committer: Cursor Agent <noreply@cursor.com>
- ✅ 完整commit message无Co-authored-by个人邮箱
- ✅ 所有个人路径继续使用占位符 $PROJECT_PATH/$ROS2_WS/$BACKUP_PATH
- ✅ 保留相对脚本路径不变
- ✅ 保留所有完整commit SHA不缩短

## 验收清单
- [ ] 本地Jekyll构建成功
- [ ] npm test通过
- [ ] 新7子页全部可访问
- [ ] 旧URL兼容跳转页工作
- [ ] 所有SVG/公式/图例显示正常
- [ ] 所有内部链接正确
- [ ] CI全绿
- [ ] 源码ZIP交付(/opt/cursor/artifacts/)
- [ ] 迁移映射表审阅

## 长期规划（仅记录，不建空页）
未来可能扩展的栏目（待用户确认后实施）：
- 工程设计与接口/ (船体推进/环境传感器/感知决策/运动控制/能源数据记录/接口约定数据流)
- 操作手册/
- 验证证据/
- 问题排查/
- 决策与变更记录/

**注意**: 训练/实艇只写未来阶段目标，不冒充开展。长期子栏目名待确认，本轮不落实空栏目。
