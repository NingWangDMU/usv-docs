---
title: 单位与施力关系（已迁移）
parent: 项目与架构
nav_exclude: true
---

# 页面已迁移

此页面内容已迁移到 [已有验证结果]({% link docs/operations/verification.md %})。

{: .important }
本页内容已迁移：
- **说明** → [项目总览 §推进力单位与施力关系]({% link docs/architecture/overview.md %}#推进力单位与施力关系)
- **定义（教学说明、单位换算）** → [项目总览 §推进力单位与施力关系]({% link docs/architecture/overview.md %}#推进力单位与施力关系)
- **历史验证数值（0.12输入点）** → [已有验证结果 §历史验证数值]({% link docs/operations/verification.md %}#历史验证数值)

## 锚点映射

| 旧锚点 | 新位置 |
|:-------|:-------|
| `#说明` | [项目总览 §推进力单位与施力关系]({% link docs/architecture/overview.md %}#推进力单位与施力关系) |
| `#定义` | [项目总览 §推进力单位与施力关系]({% link docs/architecture/overview.md %}#推进力单位与施力关系) |
| `#历史记录中的一个输入点` | [已有验证结果 §历史验证数值]({% link docs/operations/verification.md %}#历史验证数值) |

<noscript>
<p><strong>请选择目标页面：</strong></p>
<ul>
  <li><a href="{% link docs/architecture/overview.md %}#推进力单位与施力关系">项目总览 - 推进力单位与施力关系</a>（说明、定义）</li>
  <li><a href="{% link docs/operations/verification.md %}#历史验证数值">已有验证结果 - 历史验证数值</a></li>
</ul>
</noscript>

<script>
(function() {
  var hash = window.location.hash.substring(1);
  if (hash) {
    try {
      hash = decodeURIComponent(hash);
    } catch (e) {
      // 解码失败，使用原始值
    }
  }
  
  if (hash === '历史记录中的一个输入点') {
    window.location.href = '{{ "/docs/operations/verification#历史验证数值" | relative_url }}';
  } else if (hash === '说明' || hash === '定义') {
    window.location.href = '{{ "/docs/architecture/overview#推进力单位与施力关系" | relative_url }}';
  } else if (hash) {
    // 未知hash，安全fallback到overview
    window.location.href = '{{ "/docs/architecture/overview#推进力单位与施力关系" | relative_url }}';
  } else {
    // 无hash，默认到overview
    window.location.href = '{{ "/docs/architecture/overview#推进力单位与施力关系" | relative_url }}';
  }
})();
</script>

---

{: .metadata }
**兼容页**: 文档整理日期 2026-11-24 · 文档架构迁移 1.0 · 状态: 旧URL兼容跳转页
