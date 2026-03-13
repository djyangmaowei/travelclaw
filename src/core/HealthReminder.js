/**
 * ⏰ TravelClaw 问候调度系统 - "Claw 的贴心陪伴"
 * 
 * 🦞 Claw 主动关心主人的新方式
 * - 早上 9 点到晚上 10 点，每小时一次问候
 * - 每个整点区间内随机时间点推送
 * - 早安/日常/晚安，三种模式自然切换
 */

import {
  generateMorningGreeting,
  generateEveningGreeting,
  generateDailyGreeting
} from '../content/Greetings.js';

// 提醒类型（用于兼容旧版健康提醒）
export const REMINDER_TYPES = {
  MORNING: 'morning',   // 早安
  DAILY: 'daily',       // 日常
  EVENING: 'evening'    // 晚安
};

/**
 * 生成每日推送时间表
 * 9:00-22:00，每小时一个随机时间点
 */
export function generateDailySchedule() {
  const slots = [];
  for (let hour = 9; hour <= 21; hour++) {
    // 每小时 0-59 分钟随机
    const minute = Math.floor(Math.random() * 60);
    slots.push({ 
      hour, 
      minute, 
      done: false,
      timestamp: new Date().setHours(hour, minute, 0, 0)
    });
  }
  return {
    date: new Date().toDateString(),
    slots,
    firstGreetingDone: false,
    eveningGreetingDone: false
  };
}

/**
 * 检查是否需要生成新的时间表
 */
export function shouldGenerateNewSchedule(claw) {
  if (!claw.greetingSchedule) return true;
  
  const today = new Date().toDateString();
  return claw.greetingSchedule.date !== today;
}

/**
 * 获取或生成今日时间表
 */
export function getTodaySchedule(claw) {
  if (shouldGenerateNewSchedule(claw)) {
    claw.greetingSchedule = generateDailySchedule();
    // 重置每日统计
    claw.dailyStats = {
      date: new Date().toDateString(),
      interactions: 0,
      shells: 0,
      travel: null,
      taskCompleted: false,
      bond: 0,
      greetingCount: 0
    };
  }
  return claw.greetingSchedule;
}

/**
 * 检查是否应该发送问候
 * @returns {Object|null} 问候信息或 null
 */
export function checkGreeting(claw) {
  const schedule = getTodaySchedule(claw);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // 只在 9:00-22:00 之间
  if (currentHour < 9 || currentHour > 21) return null;
  
  // 找到当前小时对应的 slot
  const slot = schedule.slots.find(s => s.hour === currentHour);
  if (!slot || slot.done) return null;
  
  // 当前时间是否已过随机时间点
  if (currentMinute < slot.minute) return null;
  
  // 标记为已完成
  slot.done = true;
  
  // 判断问候类型
  let greetingType;
  if (!schedule.firstGreetingDone && currentHour < 11) {
    greetingType = REMINDER_TYPES.MORNING;
    schedule.firstGreetingDone = true;
  } else if (currentHour >= 20 && !schedule.eveningGreetingDone) {
    greetingType = REMINDER_TYPES.EVENING;
    schedule.eveningGreetingDone = true;
  } else {
    greetingType = REMINDER_TYPES.DAILY;
  }
  
  // 更新统计
  if (claw.dailyStats) {
    claw.dailyStats.greetingCount++;
  }
  
  return {
    type: greetingType,
    hour: currentHour,
    minute: slot.minute
  };
}

/**
 * 生成问候消息
 */
export function generateGreeting(claw, greetingType, context = {}) {
  switch (greetingType) {
    case REMINDER_TYPES.MORNING:
      return generateMorningGreeting(
        claw, 
        context.nightActivity,
        context.travelSummary
      );
      
    case REMINDER_TYPES.EVENING:
      return generateEveningGreeting(
        claw,
        claw.dailyStats || {
          interactions: 0,
          shells: 0,
          travel: null,
          taskCompleted: false,
          bond: 0
        }
      );
      
    case REMINDER_TYPES.DAILY:
    default:
      // 根据时间选择健康提醒类型
      const hour = new Date().getHours();
      let healthType = 'hydrate';
      if (hour % 3 === 1) healthType = 'move';
      else if (hour % 3 === 2) healthType = 'kegel';
      
      return generateDailyGreeting(claw, healthType);
  }
}

/**
 * 获取下次问候时间（用于显示）
 */
export function getNextGreetingTime(claw) {
  const schedule = getTodaySchedule(claw);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // 找到下一个未完成的 slot
  for (const slot of schedule.slots) {
    if (slot.done) continue;
    
    // 当前小时但时间还没到
    if (slot.hour === currentHour && currentMinute < slot.minute) {
      return `${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`;
    }
    // 未来的小时
    if (slot.hour > currentHour) {
      return `${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`;
    }
  }
  
  return null; // 今天的问候都完成了
}

/**
 * 获取今日问候统计
 */
export function getTodayGreetingStats(claw) {
  const schedule = getTodaySchedule(claw);
  const completed = schedule.slots.filter(s => s.done).length;
  const total = schedule.slots.length;
  
  return {
    completed,
    total,
    nextTime: getNextGreetingTime(claw),
    todayCount: claw.dailyStats?.greetingCount || 0
  };
}

/**
 * 更新每日统计（供 GameEngine 调用）
 */
export function updateDailyStats(claw, type, amount = 1) {
  if (!claw.dailyStats) {
    claw.dailyStats = {
      date: new Date().toDateString(),
      interactions: 0,
      shells: 0,
      travel: null,
      taskCompleted: false,
      bond: 0,
      greetingCount: 0
    };
  }
  
  // 检查日期
  if (claw.dailyStats.date !== new Date().toDateString()) {
    // 跨天了，重置
    claw.dailyStats = {
      date: new Date().toDateString(),
      interactions: 0,
      shells: 0,
      travel: null,
      taskCompleted: false,
      bond: 0,
      greetingCount: claw.dailyStats.greetingCount || 0
    };
  }
  
  switch (type) {
    case 'interaction':
      claw.dailyStats.interactions += amount;
      break;
    case 'shells':
      claw.dailyStats.shells += amount;
      break;
    case 'travel':
      claw.dailyStats.travel = amount; // amount 是 {location, souvenir} 对象
      break;
    case 'task':
      claw.dailyStats.taskCompleted = true;
      break;
    case 'bond':
      claw.dailyStats.bond += amount;
      break;
  }
}

/**
 * 检查健康设置（兼容旧版静默模式）
 * @deprecated 新版问候系统暂不支持静默模式，保留接口
 */
export function shouldRemind(settings = {}) {
  // 检查是否开启提醒
  if (settings.disabled) return false;
  
  // 检查是否在静默模式
  if (settings.silentMode) {
    const now = new Date();
    const silentEnd = new Date(settings.silentUntil);
    if (now < silentEnd) return false;
    settings.silentMode = false;
  }
  
  return true;
}

/**
 * 获取时间段配置（兼容旧版）
 * @deprecated 新版使用小时随机时间
 */
export function getCurrentTimeSlot() {
  const hour = new Date().getHours();
  
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14.5) return 'noon';
  if (hour >= 14.5 && hour < 18.5) return 'afternoon';
  if (hour >= 18.5 && hour < 22) return 'evening';
  return null;
}

// 兼容旧版导出
export default {
  generateDailySchedule,
  getTodaySchedule,
  checkGreeting,
  generateGreeting,
  getNextGreetingTime,
  getTodayGreetingStats,
  updateDailyStats,
  shouldRemind,
  getCurrentTimeSlot,
  REMINDER_TYPES
};
