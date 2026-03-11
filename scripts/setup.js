#!/usr/bin/env node

/**
 * 🦞 TravelClaw 安装脚本
 * 
 * 设置 Skill 并配置 OpenClaw
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
  console.log('🦞 Welcome to TravelClaw Setup!\n');

  // 1. 检查 OpenClaw 是否已安装
  if (!existsSync(OPENCLAW_DIR)) {
    console.error('❌ OpenClaw 未安装或未配置');
    console.log('请先安装 OpenClaw: https://github.com/openclaw/openclaw');
    process.exit(1);
  }

  // 2. 询问 Gemini API Key
  console.log('TravelClaw 需要 PackyAPI Key 来生成图片。');
  console.log('获取地址: https://www.packyapi.com/\n');
  console.log('模型: doubao-seedream-5.0-lite (豆包即梦)\n');
  
  const apiKey = await question('请输入你的 PackyAPI Key: ');
  
  if (!apiKey || apiKey.length < 10) {
    console.error('❌ 无效的 API Key');
    process.exit(1);
  }

  // 3. 安装 Skill
  const skillsDir = join(OPENCLAW_DIR, 'skills', SKILL_NAME);
  
  if (existsSync(skillsDir)) {
    const overwrite = await question('Skill 已存在，是否覆盖? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('已取消安装');
      process.exit(0);
    }
  }

  // 4. 复制文件
  console.log('\n📦 安装 Skill...');
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
    } catch (e) {
      console.warn(`⚠️  跳过 ${file}`);
    }
  }

  // 5. 配置 openclaw.json
  console.log('⚙️  配置 OpenClaw...');
  
  const configPath = join(OPENCLAW_DIR, 'openclaw.json');
  let config = {};
  
  if (existsSync(configPath)) {
    const configData = await readFile(configPath, 'utf-8');
    config = JSON.parse(configData);
  }

  // 添加 Skill 配置
  if (!config.skills) {
    config.skills = { entries: {} };
  }
  if (!config.skills.entries) {
    config.skills.entries = {};
  }

  config.skills.entries[SKILL_NAME] = {
    enabled: true,
    env: {
      PACKY_API_KEY: apiKey
    }
  };

  await writeFile(configPath, JSON.stringify(config, null, 2));

  // 6. 更新 SOUL.md
  console.log('📝 更新 SOUL.md...');
  
  const soulPath = join(OPENCLAW_DIR, 'workspace', 'SOUL.md');
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

  if (existsSync(soulPath)) {
    let soulContent = await readFile(soulPath, 'utf-8');
    if (!soulContent.includes('TravelClaw')) {
      soulContent += soulInjection;
      await writeFile(soulPath, soulContent);
    }
  } else {
    await mkdir(dirname(soulPath), { recursive: true });
    await writeFile(soulPath, `# Agent Soul\n\n${soulInjection}`);
  }

  console.log('\n✅ TravelClaw 安装完成！');
  console.log('\n使用方式:');
  console.log('  1. 重启 OpenClaw Gateway');
  console.log('  2. 在任意 IM 中发送 "状态" 查看你的 🦞');
  console.log('  3. 发送 "帮助" 查看所有指令\n');

  console.log('愿你的 🦞 旅途愉快！🦞✈️\n');

  rl.close();
}

main().catch(err => {
  console.error('❌ 安装失败:', err);
  process.exit(1);
});
