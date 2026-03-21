const fs = require('fs');
const bs58 = require('bs58');
const path = require('path');

const templatePath = path.join('ouotv', 'template.json');
const date = new Date().toISOString().split('T')[0];  // 2026-03-23
const jsonFilename = `ouonnki-tv-sources-${date}.json`;
const txtFilename = `ouonnki-tv-sources-${date}.txt`;
const outDir = 'ouotv';

const jsonPath = path.join(outDir, jsonFilename);
const txtPath = path.join(outDir, txtFilename);

try {
  let jsonStr = fs.readFileSync(templatePath, 'utf8');

  // 添加/更新日期字段（可选，根据需要修改）
  const jsonObj = JSON.parse(jsonStr);
  jsonObj.updated = date;
  jsonStr = JSON.stringify(jsonObj, null, 2);

  // 保存带日期的 JSON
  fs.writeFileSync(jsonPath, jsonStr, 'utf8');

  // Base58 编码
  const buf = Buffer.from(jsonStr, 'utf8');
  const encoded = bs58.encode(buf);
  fs.writeFileSync(txtPath, encoded, 'utf8');

  console.log(`生成成功：${jsonFilename} 和 ${txtFilename}`);
} catch (err) {
  console.error('生成失败：', err.message);
  process.exit(1);
}
