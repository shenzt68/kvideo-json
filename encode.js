const fs = require('fs');
const bs58 = require('bs58');
const path = require('path');
const https = require('https');

const templateUrl = 'https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/LunaTV-config.json';
const outDir = 'ouotv';
const date = new Date().toISOString().split('T')[0];  // 如 2026-03-21

const jsonFilename = `ouonnki-tv-sources-${date}.json`;
const txtFilename = `ouonnki-tv-sources-${date}.txt`;

const jsonPath = path.join(outDir, jsonFilename);
const txtPath = path.join(outDir, txtFilename);

function downloadJson(url, callback) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);  // 先验证合法性
        callback(null, data);
      } catch (err) {
        callback(err);
      }
    });
  }).on('error', callback);
}

downloadJson(templateUrl, (err, jsonStr) => {
  if (err) {
    console.error('下载或解析失败:', err.message);
    process.exit(1);
  }

  let obj;
  try {
    obj = JSON.parse(jsonStr);
    obj.updated = date;  // 添加/更新日期
    jsonStr = JSON.stringify(obj, null, 2);
  } catch (e) {
    console.error('JSON 处理失败:', e.message);
    process.exit(1);
  }

  // 保存 JSON
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(jsonPath, jsonStr, 'utf8');

  // Base58
  const buf = Buffer.from(jsonStr, 'utf8');
  const encoded = bs58.encode(buf);
  fs.writeFileSync(txtPath, encoded, 'utf8');

  console.log(`生成成功：${jsonFilename} 和 ${txtFilename}`);
});
