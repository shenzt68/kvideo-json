const fs = require('fs');
const bs58 = require('bs58');
const path = require('path');
const https = require('https');

const templateUrl = 'https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/LunaTV-config.json';
const outDir = 'ouotv';
const date = new Date().toISOString().split('T')[0];

const jsonFilename = `ouonnki-tv-sources-${date}.json`;
const txtFilename = `ouonnki-tv-sources-${date}.txt`;

const jsonPath = path.join(outDir, jsonFilename);
const txtPath = path.join(outDir, txtFilename);

console.log(`开始生成 ${date} 的配置...`);

https.get(templateUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      // 解析 hafrey1 原文件
      const obj = JSON.parse(data);
      obj.updated = date;                    // 加入日期
      const jsonStr = JSON.stringify(obj, null, 2);

      // 创建目录并保存文件
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(jsonPath, jsonStr, 'utf8');

      // Base58 编码
      const buf = Buffer.from(jsonStr, 'utf8');
      const encoded = bs58.encode(buf);
      fs.writeFileSync(txtPath, encoded, 'utf8');

      console.log(`✅ 生成成功！`);
      console.log(`   📄 JSON:  ouotv/${jsonFilename}`);
      console.log(`   📝 Base58: ouotv/${txtFilename}`);
      console.log(`   长度: ${encoded.length} 字符`);
    } catch (err) {
      console.error('❌ 处理失败:', err.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('❌ 下载失败:', err.message);
  process.exit(1);
});
