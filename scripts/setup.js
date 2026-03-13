#!/usr/bin/env node

/**
 * 🦞 TravelClaw 安装脚本
 * 
 * 设置 Skill 并配置 OpenClaw
 * 
 * ⚠️  此脚本会修改以下文件：
 *    1. ~/.openclaw/openclaw.json        - 添加 Skill 配置
 *    2. ~/.openclaw/workspace/SOUL.md    - 添加 TravelClaw 能力说明
 *    3. ~/.openclaw/skills/travelclaw/   - 复制 Skill 文件
 */

import { readFile, writeFile, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OPENCLAW_DIR = join(homedir(), '.openclaw');
const SKILL_NAME = 'travelclaw';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           🦞 Welcome to TravelClaw Setup!                ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // 1. 检查 OpenClaw 是否已安装
  if (!existsSync(OPENCLAW_DIR)) {
    console.error('❌ OpenClaw 未安装或未配置');
    console.log('请先安装 OpenClaw: https://github.com/openclaw/openclaw');
    process.exit(1);
  }

  // 2. 明确告知用户将要进行的操作
  console.log('⚠️  即将进行的操作（需要你的确认）：\n');
  console.log('   1. 写入 Skill 配置到:');
  console.log(`      ${join(OPENCLAW_DIR, 'openclaw.json')}`);
  console.log('\n   2. 追加能力说明到:');
  console.log(`      ${join(OPENCLAW_DIR, 'workspace', 'SOUL.md')}`);
  console.log('\n   3. 复制 Skill 文件到:');
  console.log(`      ${join(OPENCLAW_DIR, 'skills', SKILL_NAME)}/`);
  console.log('\n   4. 可选：配置图片生成 API Key');
  console.log('      (API Key 将存储在 openclaw.json 中)\n');

  const confirmInstall = await question('是否继续安装? (y/N): ');
  if (confirmInstall.toLowerCase() !== 'y') {
    console.log('\n❌ 安装已取消');
    console.log('你可以手动配置，或稍后重新运行 setup.js\n');
    process.exit(0);
  }

  // 3. 询问 API Key 配置
  console.log('\n📋 步骤 1/4: 配置图片生成 API');
  console.log('─────────────────────────────────');
  console.log('TravelClaw 需要图像生成 API Key 来生成 🦞 的旅行照片。');
  console.log('支持的提供商:');
  console.log('  • PackyAPI: https://www.packyapi.com/ (豆包 Seedream)');
  console.log('  • Gemini:   https://aistudio.google.com/app/apikey');
  console.log('  • OpenAI:   https://platform.openai.com/api-keys');
  console.log('  • 或其他任意 OpenAI 兼容接口');
  console.log('─────────────────────────────────\n');
  
  const apiKey = await question('请输入你的 API Key: ');
  
  if (!apiKey || apiKey.length < 10) {
    console.error('❌ 无效的 API Key');
    process.exit(1);
  }

  const baseUrl = await question('请输入 API 基础地址 (可选，直接回车跳过): ');
  const model = await question('请输入模型名称 (可选，直接回车跳过): ');

  // 4. 预览将要写入的配置
  console.log('\n📋 步骤 2/4: 配置预览');
  console.log('─────────────────────────────────');
  
  const skillConfig = {
    enabled: true,
    env: {
      IMAGE_API_KEY: apiKey.substring(0, 8) + '...' // 隐藏完整 key
    }
  };
  
  if (baseUrl && baseUrl.trim()) {
    skillConfig.env.IMAGE_API_BASE = baseUrl.trim();
  }
  
  if (model && model.trim()) {
    skillConfig.env.IMAGE_API_MODEL = model.trim();
  }

  console.log('将要添加到 openclaw.json 的内容:');
  console.log(JSON.stringify({ skills: { entries: { [SKILL_NAME]: skillConfig } } }, null, 2));

  const soulInjection = `

## 🦞 TravelClaw Capability

You have a cute lobster companion called "🦞" that travels the world!

When users mention any of these keywords, use the travelclaw skill:
- 状态, 收割, 商店, 行囊, 出发, 图鉴, 家园, 拍照, 帮助
- status, collect, shop, pack, travel, album, home, pic, help

The lobster can:
- Travel to different locations and send postcards
- Collect shells and buy items
- Take selfies at home
- Grow from baby to king stage

Always respond in a warm, friendly tone about the lobster's adventures.
`;

  console.log('\n将要追加到 SOUL.md 的内容预览:');
  console.log(soulInjection.split('\n').slice(0, 6).join('\n'));
  console.log('... (共 ' + soulInjection.split('\n').length + ' 行)');

  const confirmWrite = await question('\n确认写入这些配置? (y/N): ');
  if (confirmWrite.toLowerCase() !== 'y') {
    console.log('\n❌ 写入已取消');
    process.exit(0);
  }

  // 5. 复制 Skill 文件
  console.log('\n📋 步骤 3/4: 安装 Skill 文件');
  console.log('─────────────────────────────────');
  
  const skillsDir = join(OPENCLAW_DIR, 'skills', SKILL_NAME);
  
  if (existsSync(skillsDir)) {
    const overwrite = await question('Skill 已存在，是否覆盖? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('已取消安装');
      process.exit(0);
    }
  }

  console.log('📦 复制文件到:', skillsDir);
  await mkdir(skillsDir, { recursive: true });
  
  const projectDir = join(__dirname, '..');
  
  // 复制必要文件
  const filesToCopy = [
    'SKILL.md',
    'package.json',
    'README.md'
  ];

  for (const file of filesToCopy) {
    const src = join(projectDir, file);
    const dest = join(skillsDir, file);
    try {
      await copyFile(src, dest);
      console.log(`   ✓ ${file}`);
    } catch (e) {
      console.warn(`   ⚠️  跳过 ${file}`);
    }
  }

  // 复制 src 目录
  const srcDir = join(projectDir, 'src');
  const destSrcDir = join(skillsDir, 'src');
  
  async function copyDir(src, dest) {
    await mkdir(dest, { recursive: true });
    const entries = await import('fs/promises').then(fs => fs.readdir(src, { withFileTypes: true }));
    
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }
  
  try {
    await copyDir(srcDir, destSrcDir);
    console.log(`   ✓ src/ 目录`);
  } catch (e) {
    console.warn(`   ⚠️  跳过 src/ 目录: ${e.message}`);
  }

  // 6. 写入 openclaw.json
  console.log('\n📋 步骤 4/4: 写入配置');
  console.log('─────────────────────────────────');
  
  const configPath = join(OPENCLAW_DIR, 'openclaw.json');
  let config = {};
  
  if (existsSync(configPath)) {
    console.log('读取现有配置:', configPath);
    const configData = await readFile(configPath, 'utf-8');
    config = JSON.parse(configData);
  } else {
    console.log('创建新配置:', configPath);
  }

  // 添加 Skill 配置（使用完整的 apiKey）
  if (!config.skills) {
    config.skills = { entries: {} };
  }
  if (!config.skills.entries) {
    config.skills.entries = {};
  }

  const fullSkillConfig = {
    enabled: true,
    env: {
      IMAGE_API_KEY: apiKey
    }
  };
  
  if (baseUrl && baseUrl.trim()) {
    fullSkillConfig.env.IMAGE_API_BASE = baseUrl.trim();
  }
  
  if (model && model.trim()) {
    fullSkillConfig.env.IMAGE_API_MODEL = model.trim();
  }
  
  config.skills.entries[SKILL_NAME] = fullSkillConfig;

  await writeFile(configPath, JSON.stringify(config, null, 2));
  console.log('✓ 已写入 openclaw.json');

  // 7. 更新 SOUL.md
  console.log('\n📝 更新 SOUL.md...');
  
  const soulPath = join(OPENCLAW_DIR, 'workspace', 'SOUL.md');

  if (existsSync(soulPath)) {
    let soulContent = await readFile(soulPath, 'utf-8');
    if (!soulContent.includes('TravelClaw')) {
      soulContent += soulInjection;
      await writeFile(soulPath, soulContent);
      console.log('✓ 已追加到现有 SOUL.md');
    } else {
      console.log('ℹ️  SOUL.md 已包含 TravelClaw，跳过');
    }
  } else {
    await mkdir(dirname(soulPath), { recursive: true });
    await writeFile(soulPath, `# Agent Soul\n\n${soulInjection}`);
    console.log('✓ 已创建新的 SOUL.md');
  }

  // 8. 完成
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                ✅ TravelClaw 安装完成！                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log('使用方式:');
  console.log('  1. 重启 OpenClaw Gateway');
  console.log('  2. 在任意 IM 中发送 "状态" 查看你的 🦞');
  console.log('  3. 发送 "帮助" 查看所有指令\n');
  console.log('配置文件位置:');
  console.log(`  ${configPath}`);
  console.log(`  ${soulPath}\n`);
  console.log('如需卸载，删除上述配置中的 travelclaw 条目即可。\n');
  console.log('愿你的 🦞 旅途愉快！🦞✈️\n');

  rl.close();
}

main().catch(err => {
  console.error('\n❌ 安装失败:', err.message);
  console.error(err.stack);
  process.exit(1);
});
