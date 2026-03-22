const fs = require('fs');
const bs58 = require('bs58');
const path = require('path');
const https = require('https');

const templateUrl = 'https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/LunaTV-config.json';
const outDir = 'ouotv';

const fixedJson = 'ouonnki-tv-sources-latest.json';  // 数组版
const fixedTxt  = 'ouonnki-tv-sources-latest.txt';

const jsonPath = path.join(outDir, fixedJson);
const txtPath  = path.join(outDir, fixedTxt);

https.get(templateUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const original = JSON.parse(data);
      const apiSites = original.api_site || {};

      // 转成 TVBox 常见的数组格式
      const arrayConfig = Object.entries(apiSites).map(([domain, info]) => ({
        key: domain.replace(/\./g, '_'),  // 避免点号问题
        name: info.name || domain,
        type: 3,                           // CMS 接口
        api: info.api,
        search: 1,
        quickSearch: 1,
        filter: !!info.detail
      }));

      const jsonStr = JSON.stringify(arrayConfig, null, 2);

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(jsonPath, jsonStr, 'utf8');

      const buf = Buffer.from(jsonStr, 'utf8');
      const encoded = bs58.encode(buf);
      fs.writeFileSync(txtPath, encoded, 'utf8');

      console.log(`生成数组格式 latest 文件成功`);
      console.log(`JSON: ${fixedJson}`);
      console.log(`Base58: ${fixedTxt}`);
    } catch (err) {
      console.error('失败:', err.message);
      process.exit(1);
    }
  });
}).on('error', err => {
  console.error('下载失败:', err.message);
  process.exit(1);
});
