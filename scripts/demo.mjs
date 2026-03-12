#!/usr/bin/env node
/**
 * 🦞 TravelClaw 新功能演示脚本
 * 
 * 运行: node scripts/demo.mjs
 */

import { Claw } from '../src/core/Claw.js';
import { 
  calculateLuckModifier,
  generateDailyTask,
  triggerRandomEvent,
  SPECIAL_DROPS,
  openBox
} from '../src/core/Rewards.js';

console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     🦞  TravelClaw - 即时反馈 & 掉落系统演示  🦞         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

// 创建测试 🦞
const claw = new Claw('demo_user');

console.log('💕 【亲密度系统】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('初始状态:', claw.getBondTitle().emoji, claw.getBondTitle().name, `(等级 ${claw.bond_level})`);

// 模拟互动
console.log('\n📝 模拟与 🦞 互动...');
for (let i = 0; i < 5; i++) {
  claw.learnFromInteraction('🦞 真可爱！');
  process.stdout.write(`  互动 ${i + 1}: 亲密度 +1 = ${claw.bond_level}\n`);
}

console.log('\n🚀 送 🦞 去旅行 (+3 亲密度)...');
claw.addBond(3);
console.log('  当前亲密度:', claw.bond_level);
console.log('  亲密度等级:', claw.getBondTitle().emoji, claw.getBondTitle().name);

const luck = calculateLuckModifier(0, claw.bond_level);
console.log(`\n🍀 当前幸运加成: ${(luck * 100).toFixed(1)}%`);

console.log('\n\n📋 【每日任务系统】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const task = generateDailyTask();
console.log(`今日任务: ${task.name}`);
console.log(`目标: ${task.target} 次`);
console.log(`奖励: ${task.reward.shells} 贝壳${task.reward.item ? ' + 神秘道具' : ''}`);

console.log('\n\n🎁 【特殊道具一览】（共 12 种）');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const rarities = { common: '⚪普通', uncommon: '🟢优秀', rare: '🔵稀有', epic: '🟣史诗', legendary: '🟠传说', mythic: '🔴神话' };

Object.values(SPECIAL_DROPS).forEach(item => {
  console.log(`${rarities[item.rarity]} ${item.emoji} ${item.name}`);
  console.log(`   ${item.description}`);
});

console.log('\n\n📦 【宝箱系统演示】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('开启 3 个小宝箱（模拟）...\n');

for (let i = 1; i <= 3; i++) {
  const result = openBox('small', luck);
  console.log(`宝箱 ${i}: 💰 ${result.shells} 贝壳` + (result.items.length > 0 ? ` + ${result.items[0].emoji} ${result.items[0].name}` : ''));
}

console.log('\n\n🎲 【随机事件系统】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('触发概率: 15%\n');

const states = ['at_home', 'traveling', 'resting'];
states.forEach(state => {
  const event = triggerRandomEvent(state);
  const stateName = state === 'at_home' ? '在家' : state === 'traveling' ? '旅行中' : '休息中';
  if (event) {
    console.log(`[${stateName}] 🎉 触发: ${event.name}`);
    console.log(`         ${event.message}`);
  } else {
    console.log(`[${stateName}] 无事件触发`);
  }
});

console.log('\n\n🏆 【里程碑系统】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('模拟 🦞 成长到第 20 天...\n');
claw.total_days = 20;
const milestones = claw.checkMilestones();
if (milestones.length > 0) {
  console.log('达成里程碑:', milestones.map(m => m + '%').join(', '));
  console.log('每个里程碑都会获得丰厚奖励！');
} else {
  console.log('当前阶段无新里程碑');
}

console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ✅ 演示完成！发送 "帮助" 查看所有指令                  ║
║                                                          ║
║   新增指令:                                              ║
║     • 任务   - 查看每日任务                              ║
║     • 背包   - 查看特殊道具                              ║
║     • 开箱   - 开启宝箱                                  ║
║     • 亲密度 - 查看羁绊关系                              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);
