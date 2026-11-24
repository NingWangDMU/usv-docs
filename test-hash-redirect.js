#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Hash Redirect Logic Test ===\n');

// 读取构建后的实际JS逻辑
const goalsHtml = fs.readFileSync('_site/docs/architecture/goals/index.html', 'utf8');
const unitsHtml = fs.readFileSync('_site/docs/architecture/units/index.html', 'utf8');

// 提取goals.md的script内容
const goalsScriptMatch = goalsHtml.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
if (!goalsScriptMatch) {
  console.error('❌ 未找到goals页面的script标签');
  process.exit(1);
}
const goalsScript = goalsScriptMatch[1];

// 提取units.md的script内容
const unitsScriptMatch = unitsHtml.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
if (!unitsScriptMatch) {
  console.error('❌ 未找到units页面的script标签');
  process.exit(1);
}
const unitsScript = unitsScriptMatch[1];

console.log('✅ 成功提取构建后的JS逻辑\n');

// 测试用例
const tests = [
  {
    page: 'goals',
    desc: '百分号编码hash: #%E5%BC%80%E5%8F%91%E9%98%B6%E6%AE%B5',
    hash: '%E5%BC%80%E5%8F%91%E9%98%B6%E6%AE%B5',
    expected: '/usv-docs/docs/architecture/roadmap#'
  },
  {
    page: 'goals',
    desc: '未编码中文hash: #项目分类',
    hash: '项目分类',
    expected: '/usv-docs/docs/architecture/overview#'
  },
  {
    page: 'goals',
    desc: '空hash',
    hash: '',
    expected: '/usv-docs/docs/architecture/overview'
  },
  {
    page: 'goals',
    desc: '未知hash: #未知锚点',
    hash: '未知锚点',
    expected: '/usv-docs/docs/architecture/overview'
  },
  {
    page: 'units',
    desc: '百分号编码hash: #%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E4%B8%AD%E7%9A%84%E4%B8%80%E4%B8%AA%E8%BE%93%E5%85%A5%E7%82%B9',
    hash: '%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E4%B8%AD%E7%9A%84%E4%B8%80%E4%B8%AA%E8%BE%93%E5%85%A5%E7%82%B9',
    expected: '/usv-docs/docs/operations/verification#'
  },
  {
    page: 'units',
    desc: '未编码中文hash: #说明',
    hash: '说明',
    expected: '/usv-docs/docs/architecture/overview#'
  },
  {
    page: 'units',
    desc: '空hash',
    hash: '',
    expected: '/usv-docs/docs/architecture/overview#'
  },
  {
    page: 'units',
    desc: '未知hash: #未知',
    hash: '未知',
    expected: '/usv-docs/docs/architecture/overview#'
  }
];

let pass = 0;
let fail = 0;

// 模拟执行JS逻辑
function simulateRedirect(script, hash) {
  const mockWindow = {
    location: {
      hash: '#' + hash,
      href: ''
    }
  };
  
  try {
    // 在隔离的上下文中执行脚本
    const func = new Function('window', script + '\nreturn window.location.href;');
    return func(mockWindow);
  } catch (e) {
    return 'ERROR: ' + e.message;
  }
}

for (const test of tests) {
  const script = test.page === 'goals' ? goalsScript : unitsScript;
  const result = simulateRedirect(script, test.hash);
  
  const success = result.includes(test.expected);
  if (success) {
    console.log(`✅ ${test.page}: ${test.desc}`);
    console.log(`   → ${result}`);
    pass++;
  } else {
    console.log(`❌ ${test.page}: ${test.desc}`);
    console.log(`   期望包含: ${test.expected}`);
    console.log(`   实际得到: ${result}`);
    fail++;
  }
}

console.log(`\n=== 路由逻辑测试结果 ===`);
console.log(`通过: ${pass}/${tests.length}`);
console.log(`失败: ${fail}/${tests.length}`);

// 验证关键修复点
console.log(`\n=== 关键修复验证 ===`);

if (goalsScript.includes('decodeURIComponent')) {
  console.log('✅ goals页面包含decodeURIComponent解码逻辑');
} else {
  console.log('❌ goals页面缺少decodeURIComponent解码逻辑');
  fail++;
}

if (unitsScript.includes('decodeURIComponent')) {
  console.log('✅ units页面包含decodeURIComponent解码逻辑');
} else {
  console.log('❌ units页面缺少decodeURIComponent解码逻辑');
  fail++;
}

if (!unitsHtml.includes('http-equiv="refresh"')) {
  console.log('✅ units页面无meta refresh（不会抢先跳转）');
} else {
  console.log('❌ units页面仍有meta refresh会抢先跳转');
  fail++;
}

if (goalsHtml.includes('<noscript>') && unitsHtml.includes('<noscript>')) {
  console.log('✅ 两页面均保留noscript手动选择说明');
} else {
  console.log('❌ 缺少noscript手动选择说明');
  fail++;
}

process.exit(fail > 0 ? 1 : 0);
