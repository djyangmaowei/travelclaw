#!/usr/bin/env node
/**
 * ⏰ TravelClaw 健康提醒系统演示
 * 
 * 运行: node scripts/demo_health.mjs
 */

import {
  generateReminder,
  generateDailyReport,
  shouldRemind,
  getCurrentTimeSlot,
  REMINDER_TYPES,
  TIME_SLOTS
} from '../src/core/HealthReminder.js';

console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ⏰  TravelClaw - 微习惯闹钟系统演示  ⏰               ║
║                                                          ║
║          🦞 不仅爱旅行，还关心你的健康！                 ║
╚══════════════════════════════════════════════════════════╝
`);

// 获取当前时间
const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();
console.log(`🕐 当前时间: ${hour}:${minute.toString().padStart(2, '0')}`);

// 测试 1: 当前时间段
console.log('\n📅 【时间段检测】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const currentSlot = getCurrentTimeSlot();
if (currentSlot) {
  const slot = TIME_SLOTS[currentSlot];
  console.log(`当前时段: ${currentSlot} (${slot.start}:00 - ${slot.end}:00)`);
  console.log(`风格: ${slot.style}`);
  console.log(`提醒类型: ${slot.types.join(', ')}`);
} else {
  console.log('当前不在提醒时段内（09:00 - 22:00 之外）');
}

// 测试 2: 生成各类提醒
console.log('\n💧 【喝水提醒示例】（随机5条）');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
for (let i = 1; i <= 5; i++) {
  const reminder = generateReminder(REMINDER_TYPES.HYDRATE, i === 1);
  console.log(`${i}. ${reminder.message.split('\n').pop()}`);
}

console.log('\n🦵 【活动提醒示例】（随机3条）');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
for (let i = 1; i <= 3; i++) {
  const reminder = generateReminder(REMINDER_TYPES.MOVE);
  console.log(`${i}. ${reminder.message}`);
}

console.log('\n🍑 【提肛提醒示例】（随机3条）');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
for (let i = 1; i <= 3; i++) {
  const reminder = generateReminder(REMINDER_TYPES.KEGEL);
  console.log(`${i}. ${reminder.message}`);
}

// 测试 3: 完整提醒格式
console.log('\n✨ 【完整提醒格式】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const fullReminder = generateReminder();
if (fullReminder) {
  console.log(`类型: ${fullReminder.type}`);
  console.log(`图标: ${fullReminder.icon}`);
  console.log(`标题: ${fullReminder.title}`);
  console.log(`提示: ${fullReminder.tip}`);
  console.log('');
  console.log('📱 实际显示效果:');
  console.log('─'.repeat(50));
  console.log(`⏰ 微习惯闹钟`);
  console.log('');
  console.log(fullReminder.message);
  console.log('');
  console.log(`💡 ${fullReminder.tip}`);
  console.log('─'.repeat(50));
}

// 测试 4: 每日报告
console.log('\n📊 【每日健康报告】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const mockStats = { reminders: 15, water: 2625 };
console.log('模拟数据: 15 次提醒, 2625ml 饮水');
console.log('');
for (let i = 1; i <= 3; i++) {
  const report = generateDailyReport(mockStats);
  console.log(`版本 ${i}: ${report}`);
}

// 测试 5: 静默模式检测
console.log('\n🔕 【静默模式检测】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('正常设置:', shouldRemind({ disabled: false }) ? '✅ 会提醒' : '❌ 不提醒');
console.log('已关闭:', shouldRemind({ disabled: true }) ? '✅ 会提醒' : '❌ 不提醒');

// 模拟静默模式
const futureTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
console.log('静默中:', shouldRemind({ disabled: false, silentMode: true, silentUntil: futureTime }) ? '✅ 会提醒' : '❌ 不提醒');

const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString();
console.log('静默已过期:', shouldRemind({ disabled: false, silentMode: true, silentUntil: pastTime }) ? '✅ 会提醒' : '❌ 不提醒');

// 使用说明
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   💡 使用说明                                            ║
║                                                          ║
║   1. 开启提醒: 发送 "健康 开启"                          ║
║   2. 🦞 每 45 分钟自动提醒:                              ║
║      • 💧 喝水 150-200ml                                 ║
║      • 🦵 站立活动 1 分钟                                ║
║      • 🍑 提肛锻炼 10-15 次                              ║
║   3. 专注模式: "健康 静默 60分钟"                        ║
║   4. 查看报告: "健康 报告"                               ║
║                                                          ║
║   📝 文案特点：                                          ║
║   • 50+ 条随机文案，避免重复                             ║
║   • 极短文案，扫一眼即可                                 ║
║   • 根据时段调整风格（高效/轻松/赋能/柔和）              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);
