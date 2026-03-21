// encode.js （完整替换成下面内容）

const fs = require('fs');
const bs58 = require('bs58');
const path = require('path');
const https = require('https');

const templateUrl = 'https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/LunaTV-config.json';
const outDir = 'ouotv';

const fixedJsonName = 'ouonnki-tv-sources-latest.json';
const fixedTxtName  = 'ouonnki-tv-sources-latest.txt';

const jsonPath = path.join(outDir, fixedJsonName);
const txtPath  = path.join(outDir, fixedTxtName);

console.log('开始从 hafrey1 下载并处理最新配置...');

https.get(templateUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const original = JSON.parse(data);

      // 可在此处对内容做自定义修改（示例：添加更新时间）
      const now = new Date().toISOString();
      original.updated = now.split('T')[0];           // 只保留日期 2026-03-21
      original._note = `自动更新于 ${now}`;

      const jsonStr = JSON.stringify(original, null, 2);

      // 确保目录存在
      fs.mkdirSync(outDir, { recursive: true });

      // 覆盖写入固定文件名
      fs.writeFileSync(jsonPath, jsonStr, 'utf8');

      // Base58 版本也覆盖
      const buf = Buffer.from(jsonStr, 'utf8');
      const encoded = bs58.encode(buf);
      fs.writeFileSync(txtPath, encoded, 'utf8');

      console.log('生成并覆盖成功（固定文件名）：');
      console.log(`   JSON:  ${fixedJsonName}`);
      console.log(`   Base58:${fixedTxtName}`);
      console.log(`   更新时间: ${original.updated}`);
      console.log(`   Base58 长度: ${encoded.length} 字符`);
    } catch (err) {
      console.error('处理失败:', err.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('下载失败:', err.message);
  process.exit(1);
});
