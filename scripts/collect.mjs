#!/usr/bin/env node
// 浏览器 → 磁盘的搬运工。
//
//   node scripts/collect.mjs [输出文件=scripts/collected.txt] [端口=8766]
//
// 为什么需要它:node 直连 awwwards 被 Cloudflare 挡,名单只能在浏览器里取;
// 而浏览器写不了磁盘。没有它就得靠人肉把几百行名单抄进文件——扫描规模
// 卡在这一步上。开着它,浏览器里 fetch 完直接 POST 过来。
//
// 浏览器侧(在 awwwards 页面的控制台/注入里跑):
//   fetch('http://localhost:8766', { method:'POST', body: text })
// https 页面 POST 到 http://localhost 是允许的(localhost 属可信来源,
// 不受混合内容拦截)。

import { createServer } from 'node:http';
import { writeFileSync } from 'node:fs';

const OUT = process.argv[2] || 'scripts/collected.txt';
const PORT = +(process.argv[3] || 8766);

createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');            // 跨源必须
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.end();
  if (req.method !== 'POST') return res.end('POST here');

  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    writeFileSync(OUT, body);
    const lines = body.split('\n').filter(l => l.trim()).length;
    console.log(`收到 ${body.length} 字节 / ${lines} 行 → ${OUT}`);
    res.end(String(lines));
  });
}).listen(PORT, () => console.log(`collector listening on http://localhost:${PORT} → ${OUT}`));
