# Unity无人艇工程文档

基于 [Just the Docs](https://just-the-docs.github.io/just-the-docs/) 主题的无人艇工程技术文档站点。

## 🚀 在线访问

部署后可访问：**https://ningwangdmu.github.io/usv-docs/**

## 📖 文档内容

- **项目总览** - 项目目标、数据流、施力关系与阶段规划
- **运行与验收** - 环境配置、操作步骤与验收标准
- **已知问题** - 记录的现象、影响与状态跟踪

## 🛠️ 技术栈

- **主题**: Just the Docs 0.12.0 (MIT)
- **构建**: Jekyll 4.4.1
- **部署**: GitHub Pages + GitHub Actions
- **搜索**: Lunr.js + CJK分词支持

## ✨ 特性

- ✅ 中文搜索支持（推进器、归零、GPS等关键词）
- ✅ MathML公式渲染
- ✅ SVG数据流图
- ✅ 代码块复制按钮
- ✅ 响应式设计
- ✅ 暗色主题支持

## 🔧 本地开发

需要 Ruby ≥ 3.1 和 Bundler：

```bash
# 安装依赖
bundle install

# 本地预览（默认运行在 http://localhost:4000/usv-docs/）
bundle exec jekyll serve

# 或指定其他端口
bundle exec jekyll serve --port 4001
```

## 📝 内容更新

主要文档文件：

- `index.md` - 项目总览
- `run.md` - 运行与验收
- `issues.md` - 已知问题
- `_config.yml` - 站点配置
- `_includes/dataflow.html` - 数据流SVG
- `_includes/formula.html` - 施力公式MathML

更新内容后提交到 `main` 分支，GitHub Actions 会自动构建并部署。

## 🔒 安全与隐私

本仓库已完成敏感信息审查，详见 [`SECURITY-REVIEW.md`](SECURITY-REVIEW.md)。

- ✅ 移除本地绝对路径
- ✅ 清理用户名信息
- ✅ 排除构建产物
- ✅ 保留必要的第三方许可证

## 📄 许可证

- **文档内容**: 项目文档
- **Just the Docs 主题**: MIT License（详见 [`LICENSE-just-the-docs.txt`](LICENSE-just-the-docs.txt)）
- **第三方组件**: 详见 [`NOTICE`](NOTICE)

## 🔗 相关链接

- [Just the Docs 文档](https://just-the-docs.github.io/just-the-docs/)
- [Jekyll 文档](https://jekyllrb.com/docs/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)

---

**注意**: 本文档记录的工程结论为历史验证基线，不代表打开页面时的实时状态。
