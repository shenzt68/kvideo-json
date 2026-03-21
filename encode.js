const fs = require('fs');
const bs58 = require('bs58');
const path = require('path');
const https = require('https');

const templateUrl = 'https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/LunaTV-config.json';
const outDir = 'ouotv';
const date = new Date().toISOString().split('T')[0];

const jsonFilename = `ouonnki-tv-sources-${date}-array.json`;
const txtFilename = `ouonnki-tv-sources-${date}-array.txt`;

const jsonPath = path.join(outDir, jsonFilename);
const txtPath = path.join(outDir, txtFilename);

https.get(templateUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const original = JSON.parse(data);
      const sitesObj = original.api_site || {};

      // 转成数组格式
      const sitesArray = Object.keys(sitesObj).map(key => {
        const site = sitesObj[key];
        return {
          key: key.replace(/\./g, '_'),  // key 避免点号问题
          name: site.name || key,
          type: 3,
          api: site.api,
          search: 1,
          filter: site.detail ? 1 : 0
        };
      });

      const jsonStr = JSON.stringify(sitesArray, null, 2);

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(jsonPath, jsonStr, 'utf8');

      const buf = Buffer.from(jsonStr, 'utf8');
      const encoded = bs58.encode(buf);
      fs.writeFileSync(txtPath, encoded, 'utf8');

      console.log(`生成数组格式成功：${jsonFilename} 和 ${txtFilename}`);
    } catch (err) {
      console.error('处理失败:', err.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('下载失败:', err.message);
  process.exit(1);
});
