#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

console.log('Lunr loaded from npm');

// Load CJK lunr patch and apply to lunr
const cjkLunrPath = path.join(__dirname, '_site', 'assets', 'js', 'cjk-lunr.js');
if (!fs.existsSync(cjkLunrPath)) {
  console.error('cjk-lunr.js not found. Run: bundle exec jekyll build');
  process.exit(1);
}

const cjkCode = fs.readFileSync(cjkLunrPath, 'utf8');
const cjkModule = {};
eval(`(function(module, exports) { ${cjkCode} })(cjkModule, cjkModule);`);

// Apply CJK patch to lunr
if (typeof cjkModule.exports !== 'undefined' && cjkModule.exports.install) {
  cjkModule.exports.install(lunr);
  console.log('CJK patch applied');
} else {
  // Try global installation function
  global.lunr = lunr;
  eval(cjkCode);
  console.log('CJK patch applied via global');
}

// Load search data
const searchDataPath = path.join(__dirname, '_site', 'assets', 'js', 'search-data.json');
if (!fs.existsSync(searchDataPath)) {
  console.error('search-data.json not found. Run: bundle exec jekyll build');
  process.exit(1);
}

const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf8'));

console.log('Building search index with', Object.keys(searchData).length, 'documents...\n');

// Build index
const idx = lunr(function () {
  this.ref('id');
  this.field('title', { boost: 200 });
  this.field('content', { boost: 2 });
  this.field('url');
  this.metadataWhitelist = ['position'];

  for (const id in searchData) {
    this.add({
      id: id,
      title: searchData[id].title,
      content: searchData[id].content,
      url: searchData[id].url
    });
  }
});

// Test queries with expected results
const queries = [
  { query: '推进器', desc: '中文：推进器', expectedMin: 1 },
  { query: '归零', desc: '中文：归零', expectedMin: 4 },
  { query: 'GPS', desc: '英文：GPS', expectedMin: 8 },
  { query: 'ROS', desc: '英文：ROS', expectedMin: 1 },
  { query: 'Unity', desc: '英文：Unity', expectedMin: 1 },
  { query: '', desc: '空字符串', expectedMin: 24, shouldReturnAll: true },
  { query: 'nonexistent_xyz_123', desc: '不存在的词', expectedMin: 0, expectedMax: 0 }
];

console.log('=== Search Test Results ===\n');

const testResults = [];

queries.forEach(({ query, desc, expectedMin, expectedMax, shouldReturnAll }) => {
  try {
    const results = idx.search(query);
    console.log(`${desc}: "${query}"`);
    console.log(`  结果数: ${results.length}`);
    
    // Validate expectations
    let passed = true;
    if (expectedMin !== undefined && results.length < expectedMin) {
      console.log(`  ❌ FAIL: Expected at least ${expectedMin} results, got ${results.length}`);
      passed = false;
    }
    if (expectedMax !== undefined && results.length > expectedMax) {
      console.log(`  ❌ FAIL: Expected at most ${expectedMax} results, got ${results.length}`);
      passed = false;
    }
    if (shouldReturnAll && results.length !== Object.keys(searchData).length) {
      console.log(`  ❌ FAIL: Expected all ${Object.keys(searchData).length} documents, got ${results.length}`);
      passed = false;
    }
    
    if (passed && expectedMin !== undefined) {
      console.log(`  ✅ PASS: Result count meets expectations`);
    }
    
    if (results.length > 0) {
      console.log('  前3条结果:');
      results.slice(0, 3).forEach((result, i) => {
        const doc = searchData[result.ref];
        const preview = doc.content.substring(0, 50).replace(/\s+/g, ' ');
        console.log(`    ${i + 1}. ${doc.title} (${doc.url})`);
        console.log(`       预览: ${preview}...`);
        
        // Verify URL has baseurl
        if (!doc.url.startsWith('/usv-docs/')) {
          console.log(`       ⚠️  WARNING: URL missing /usv-docs/ prefix: ${doc.url}`);
        }
      });
    }
    console.log('');
    
    testResults.push({ desc, query, passed });
  } catch (err) {
    console.log(`${desc}: ERROR - ${err.message}\n`);
    testResults.push({ desc, query, passed: false, error: err.message });
  }
});

// Verify specific requirements
console.log('=== Verification ===\n');

const gpsResults = idx.search('GPS');
const thrusterResults = idx.search('推进器');
const resetResults = idx.search('归零');

const checks = [
  { name: 'GPS搜索有结果', pass: gpsResults.length > 0, count: gpsResults.length },
  { name: '推进器搜索有结果', pass: thrusterResults.length > 0, count: thrusterResults.length },
  { name: '归零搜索有结果', pass: resetResults.length > 0, count: resetResults.length },
  { name: 'GPS结果包含issues页', pass: gpsResults.some(r => searchData[r.ref].url.includes('issues')) }
];

checks.forEach(check => {
  const status = check.pass ? '✅ PASS' : '❌ FAIL';
  const extra = check.count !== undefined ? ` (${check.count}条结果)` : '';
  console.log(`${status}: ${check.name}${extra}`);
});

console.log('\n=== Summary ===\n');

const queryTestsPassed = testResults.every(t => t.passed);
const verificationPassed = checks.every(c => c.pass);

console.log(`Query tests: ${testResults.filter(t => t.passed).length}/${testResults.length} passed`);
console.log(`Verification checks: ${checks.filter(c => c.pass).length}/${checks.length} passed`);

if (!queryTestsPassed) {
  console.log('\n❌ Some query tests failed:');
  testResults.filter(t => !t.passed).forEach(t => {
    console.log(`  - ${t.desc}: "${t.query}"${t.error ? ` (${t.error})` : ''}`);
  });
}

console.log('\n=== Test Complete ===');

const allPassed = queryTestsPassed && verificationPassed;
process.exit(allPassed ? 0 : 1);
