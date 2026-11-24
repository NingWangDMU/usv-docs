---
title: 项目目标与阶段（已迁移）
parent: 项目与架构
nav_exclude: true
---

# 页面已迁移

此页面内容已拆分迁移到新的导航结构。

{: .important }
本页内容已拆分迁移：
- **项目分类** → [项目总览 §项目分类]({% link docs/architecture/overview.md %}#项目分类)
- **开发阶段** → [阶段路线与进度 §开发阶段]({% link docs/architecture/roadmap.md %}#开发阶段)
- **下一步** → [阶段路线与进度 §下一步]({% link docs/architecture/roadmap.md %}#下一步)
- **验证证据** → [阶段路线与进度 §验证证据]({% link docs/architecture/roadmap.md %}#验证证据)

## 锚点映射

| 旧锚点 | 新位置 |
|:-------|:-------|
| `#项目分类` | [项目总览 §项目分类]({% link docs/architecture/overview.md %}#项目分类) |
| `#开发阶段` | [阶段路线与进度 §开发阶段]({% link docs/architecture/roadmap.md %}#开发阶段) |
| `#下一步` | [阶段路线与进度 §下一步]({% link docs/architecture/roadmap.md %}#下一步) |
| `#完成标准` | [阶段路线与进度 §完成标准]({% link docs/architecture/roadmap.md %}#完成标准) |
| `#约束条件` | [阶段路线与进度 §约束条件]({% link docs/architecture/roadmap.md %}#约束条件) |
| `#边界说明` | [阶段路线与进度 §边界说明]({% link docs/architecture/roadmap.md %}#边界说明) |
| `#验证证据` | [阶段路线与进度 §验证证据]({% link docs/architecture/roadmap.md %}#验证证据) |

<noscript>
<p><strong>请选择目标页面：</strong></p>
<ul>
  <li><a href="{% link docs/architecture/overview.md %}">项目总览</a> - 项目分类</li>
  <li><a href="{% link docs/architecture/roadmap.md %}">阶段路线与进度</a> - 开发阶段、下一步、验证证据</li>
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
  
  var hashMap = {
    '项目分类': '{{ "/docs/architecture/overview#项目分类" | relative_url }}',
    '开发阶段': '{{ "/docs/architecture/roadmap#开发阶段" | relative_url }}',
    '下一步': '{{ "/docs/architecture/roadmap#下一步" | relative_url }}',
    '完成标准': '{{ "/docs/architecture/roadmap#完成标准" | relative_url }}',
    '约束条件': '{{ "/docs/architecture/roadmap#约束条件" | relative_url }}',
    '边界说明': '{{ "/docs/architecture/roadmap#边界说明" | relative_url }}',
    '验证证据': '{{ "/docs/architecture/roadmap#验证证据" | relative_url }}'
  };
  
  if (hash && hashMap[hash]) {
    window.location.href = hashMap[hash];
  } else {
    window.location.href = '{{ "/docs/architecture/overview" | relative_url }}';
  }
})();
</script>

---

{: .metadata }
**兼容页**: 文档整理日期 2026-11-24 · 文档架构迁移 1.0 · 状态: 旧URL兼容跳转页，根据原URL锚点映射到目标页
