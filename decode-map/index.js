const fs = require('fs');
const path = require('path');
const { SourceMapConsumer } = require('source-map');

const jsPath = path.join(__dirname,'../cache/gatesstsuperlaser/js/1785.b529a2fb.js')

// 1. 读取压缩代码和 .map 文件（替换为你的文件路径）
const minifiedCode = fs.readFileSync(jsPath+'.map', 'utf8');
const sourceMapContent = fs.readFileSync(jsPath, 'utf8');

// 2. 解析 Source Map
async function parseSourceMap() {
  // 初始化 SourceMapConsumer（需传入 .map 文件内容）
  const consumer = await new SourceMapConsumer(sourceMapContent);

  // 打印原始源码的文件列表（sources 字段，即映射的原始文件路径）
  console.log('原始源码文件列表：', consumer.sources);

  // 3. 提取单个原始文件的源码（以第一个文件为例）
  const firstSourcePath = consumer.sources[0];
  const originalSource = consumer.sourceContentFor(firstSourcePath);

  // 4. 保存还原后的源码到本地（可选）
  const outputPath = `./还原后的源码-${firstSourcePath.split('/').pop()}`;
  fs.writeFileSync(outputPath, originalSource, 'utf8');
  console.log(`已保存原始源码到：${outputPath}`);

  // （可选）根据压缩代码的行号/列号，定位原始源码位置
  // 例如：查找压缩代码第 5 行第 10 列对应的原始位置
  const originalPos = consumer.originalPositionFor({
    line: 5,    // 压缩代码的行号（从 1 开始）
    column: 10  // 压缩代码的列号（从 0 开始）
  });
  console.log('压缩代码位置对应的原始源码位置：', originalPos);

  consumer.destroy(); // 释放资源
}

parseSourceMap().catch(err => console.error('解析失败：', err));