/**
 * ⏰ TravelClaw 健康提醒系统 - "微习惯闹钟"
 * 
 * 🦞 不仅爱旅行，还关心你的健康！
 * 每 45 分钟温柔提醒：喝水、活动、提肛
 */

// 提醒类型
export const REMINDER_TYPES = {
  HYDRATE: 'hydrate',    // 喝水
  MOVE: 'move',          // 站立/活动
  KEGEL: 'kegel'         // 提肛
};

// 时间段配置
export const TIME_SLOTS = {
  morning: {     // 09:00 - 12:00 高效办公期
    start: 9,
    end: 12,
    style: '高效',
    types: [REMINDER_TYPES.HYDRATE, REMINDER_TYPES.MOVE, REMINDER_TYPES.KEGEL]
  },
  noon: {        // 12:00 - 14:30 代谢高峰期
    start: 12,
    end: 14.5,
    style: '轻松',
    types: [REMINDER_TYPES.HYDRATE, REMINDER_TYPES.MOVE]
  },
  afternoon: {   // 14:30 - 18:30 专注冲刺期
    start: 14.5,
    end: 18.5,
    style: '赋能',
    types: [REMINDER_TYPES.HYDRATE, REMINDER_TYPES.KEGEL, REMINDER_TYPES.MOVE]
  },
  evening: {     // 18:30 - 22:00 夜间恢复期
    start: 18.5,
    end: 22,
    style: '柔和',
    types: [REMINDER_TYPES.MOVE, REMINDER_TYPES.HYDRATE]
  }
};

// 📝 文案库 - 每个类型 50+ 条随机文案
export const REMINDER_MESSAGES = {
  [REMINDER_TYPES.HYDRATE]: {
    icon: '💧',
    title: '该补水了',
    tips: '小口慢饮 150-200ml',
    messages: [
      '该喝第一口温水了。',
      '你的水杯快干了，喂～',
      '水是最好的咖啡伴侣，来一口？',
      '细胞在喊渴，快给它们点水喝。',
      '喝水时间到！150ml 就行。',
      '咕噜咕噜，该喝水啦。',
      '身体燃料箱需要补充 💧',
      '一杯温水，唤醒沉睡的代谢。',
      '记得补水，促进循环。',
      '水，生命之源，喝一口吧。',
      '你的肾脏在感谢你（如果你喝水的话）。',
      '下午茶时间，水比奶茶香。',
      '今日份水分摄入进度 +1',
      '嘴巴干了吗？该喝水了。',
      '深呼吸，然后喝口水。',
      ' hydration check! 💧',
      '水是免费的护肤品，多喝点。',
      '别让身体 drought（干旱）了。',
      '喝口水，再继续战斗。',
      '小口慢饮，温润身心。',
      '水，最好的饮料，没有之一。',
      '你的大脑需要水来思考。',
      '补水时刻，暂停 30 秒。',
      '一杯水，一份关怀。',
      '喝水不是任务，是对自己好。',
      '该浇水了（对你的身体）。',
      '水，让身体流动起来。',
      '脱水警告 ⚠️ 快喝水！',
      '今日水分 KPI 还差一点点。',
      '喝水，是最简单的养生。',
      '来，干杯（对水杯）。',
      '💧 滴，补水卡',
      '身体像海绵，需要水分。',
      '喝水时间，别找借口。',
      '一杯温水，肠胃喜欢。',
      '水是身体的润滑油。',
      '现在喝水，等会精神。',
      '补水，从这一口开始。',
      '你的细胞在翘首以盼。',
      '喝口水，润润喉。',
      '水，让血液流动更顺畅。',
      '别等渴了才喝，现在就来。',
      '每日 8 杯水，这是第 N 杯。',
      '喝水，给身体降降温。',
      '一杯水，一份清醒。',
      '水，是最好的排毒剂。',
      '喝口水，再继续刷手机。',
      '💧 滴答，喝水时间',
      '身体燃料不足，请补水。',
      '温水入喉，舒服～'
    ]
  },
  [REMINDER_TYPES.MOVE]: {
    icon: '🦵',
    title: '该活动了',
    tips: '离开座位，站立 1 分钟',
    messages: [
      '离开椅子，站立 30 秒。',
      '拒绝久坐，站起来走两步。',
      '屁股离椅，健康加分！',
      '站起来，看看窗外。',
      '久坐是隐形杀手，快起来！',
      '离开座位，伸个懒腰。',
      '站立 1 分钟，血液循环起来。',
      '起来活动活动，别当土豆。',
      '放下手机，离开沙发。',
      '站起来，扭扭腰。',
      '久坐提醒：你该动了！',
      '离开工位，走两步。',
      '站起来，垫垫脚。',
      '活动一下，别僵住了。',
      '起身，阔胸深呼吸。',
      '久坐族，该起义了！',
      '站起来，比坐着帅。',
      '离开座位 60 秒，计时开始。',
      '屁股抗议了，快起来！',
      '站立模式，启动！',
      '起来走走，脑子更清醒。',
      '久坐伤身，站立救命。',
      '离开椅子，做个人吧。',
      '站起来，你就是巨人。',
      '活动筋骨，预防职业病。',
      '起身，去倒杯水（顺便喝水）。',
      '站立 1 分钟，燃烧 1 卡路里。',
      '别焊在椅子上了，起来！',
      '久坐 = 慢性自杀，快中断！',
      '站起来，世界不一样。',
      '起身，扭胯 10 次。',
      '离开座位，看看远方。',
      '站立，是最好的休息。',
      '起来活动，别让肌肉睡着。',
      '久坐提醒 ⏰ 该动了！',
      '站起来，像 🦞 一样伸展！',
      '离开椅子，自由 1 分钟。',
      '起身，做个深呼吸。',
      '站立，让脊柱放松一下。',
      '起来走走，效率更高。',
      '久坐不好，站着挺好。',
      '离开座位，去窗边看看。',
      '站起来，活动活动腿脚。',
      '久坐中断！快起来！',
      '站立 1 分钟，健康一整天。',
      '起来，别窝着了。',
      '离开椅子，给屁股放个假。',
      '站立模式 ON',
      '久坐警报 🚨 请离开座位！',
      '站起来，你行的！'
    ]
  },
  [REMINDER_TYPES.KEGEL]: {
    icon: '🍑',
    title: '提肛时间',
    tips: '收缩 3-5 秒，放松 5 秒，重复 10-15 次',
    messages: [
      '收缩盆底肌（提肛）15 次，保持核心稳定。',
      '提肛大神正在看着你 👀',
      '隐形锻炼：提肛 10 次，无人知晓。',
      '坚持提肛，它是你久坐的防弹衣。',
      '悄悄提肛，默默变强。',
      '提肛运动，现在开始。',
      '收缩 3 秒，放松 5 秒，重复 10 次。',
      '提肛，是最好的隐形健身。',
      '别人看不出，但你在变强。',
      '提肛 15 次，保护前列腺/盆底肌。',
      '悄悄做，大声笑（提肛）。',
      '提肛打卡，无人知道。',
      '隐形锻炼，提肛开始！',
      '收缩，保持，放松。重复。',
      '提肛，让下半身更强壮。',
      '现在提肛，未来受益。',
      '提肛 10 次，健康投资。',
      '别人刷手机，你提肛。赢！',
      '提肛，是成年人的秘密武器。',
      '收缩盆底肌， silently。',
      '提肛时间，别告诉别人 🤫',
      '做 10 次提肛，奖励自己。',
      '提肛，预防痔疮和尿失禁。',
      '隐形运动，提肛开始。',
      '收缩，保持，释放。重复 10 次。',
      '提肛，是给自己的礼物。',
      '现在提肛，老了不后悔。',
      '提肛 15 次，计时开始。',
      '悄悄变强，从提肛开始。',
      '提肛，最简单的健身。',
      '别人看不出你在锻炼。',
      '提肛，让核心更稳定。',
      '收缩肌肉，保持 3 秒。',
      '提肛打卡 ✓',
      '隐形锻炼大师，就是你了。',
      '提肛 10 次，现在！',
      '保护盆底肌，从提肛开始。',
      '提肛，是自律的体现。',
      '收缩 5 秒，放松 5 秒。',
      '提肛，久坐族的救星。',
      '现在做提肛，没人知道。',
      '提肛 15 次，开始！',
      '悄悄提肛，惊艳所有人。',
      '盆底肌训练时间到！',
      '提肛，是最好的保健。',
      '收缩，保持，放松。10 次。',
      '提肛大神，请开始表演。',
      '隐形健身，提肛为先。',
      '提肛，让下半身更年轻。',
      '做提肛，做更好的自己。'
    ]
  }
};

// 开场白和结束语
export const GREETINGS = {
  morning: [
    '早安！🦞 开始今天的健康之旅吧～',
    '新的一天，新的健康！🦞 来提醒你了。',
    '早上好！准备好保持健康了吗？',
    '🦞 已上线，健康提醒开始！'
  ],
  generic: [
    '🦞 提醒你：',
    '健康小助手 🦞 来了：',
    '微习惯时间：',
    '🦞 敲了敲你：'
  ]
};

// 每日报告模板
export const DAILY_REPORT_TEMPLATES = [
  '📊 今日健康报告：你打败了全国 {percent}% 的久坐族，喝水量达成 {water}ml！',
  '🎉 今日战绩：完成 {reminders} 次提醒，{water}ml 水分摄入，超越 {percent}% 用户！',
  '🌟 健康日报：{reminders} 次微习惯完成，{water}ml 水，你是前 {percent}%！',
  '💪 今日成就：久坐中断 {reminders} 次，补水 {water}ml，打败了 {percent}% 的人！'
];

/**
 * 获取当前时间段
 * @returns {string} 时间段名称
 */
export function getCurrentTimeSlot() {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = hour + minute / 60;
  
  for (const [slotName, slot] of Object.entries(TIME_SLOTS)) {
    if (time >= slot.start && time < slot.end) {
      return slotName;
    }
  }
  return null; // 不在提醒时间段内
}

/**
 * 获取当前应该提醒的类型
 * @returns {string} 提醒类型
 */
export function getCurrentReminderType() {
  const slotName = getCurrentTimeSlot();
  if (!slotName) return null;
  
  const slot = TIME_SLOTS[slotName];
  const types = slot.types;
  
  // 根据时间循环选择类型
  const minutes = new Date().getHours() * 60 + new Date().getMinutes();
  const index = Math.floor(minutes / 45) % types.length;
  
  return types[index];
}

/**
 * 生成提醒消息
 * @param {string} type - 提醒类型
 * @param {boolean} isFirst - 是否是当天第一条
 * @returns {Object} 提醒内容
 */
export function generateReminder(type = null, isFirst = false) {
  if (!type) {
    type = getCurrentReminderType();
  }
  
  if (!type || !REMINDER_MESSAGES[type]) {
    return null;
  }
  
  const config = REMINDER_MESSAGES[type];
  const message = config.messages[Math.floor(Math.random() * config.messages.length)];
  
  // 选择开场白
  let greeting = '';
  if (isFirst) {
    const hour = new Date().getHours();
    if (hour < 12) {
      greeting = GREETINGS.morning[Math.floor(Math.random() * GREETINGS.morning.length)] + '\n\n';
    }
  }
  
  if (!greeting && Math.random() < 0.3) {
    greeting = GREETINGS.generic[Math.floor(Math.random() * GREETINGS.generic.length)] + '\n';
  }
  
  return {
    type,
    icon: config.icon,
    title: config.title,
    message: greeting + config.icon + ' ' + message,
    tip: config.tips,
    timestamp: new Date().toISOString()
  };
}

/**
 * 生成每日报告
 * @param {Object} stats - 统计数据
 * @returns {string} 报告内容
 */
export function generateDailyReport(stats) {
  const template = DAILY_REPORT_TEMPLATES[Math.floor(Math.random() * DAILY_REPORT_TEMPLATES.length)];
  
  // 计算百分比（模拟算法）
  const basePercent = Math.min(50 + stats.reminders * 2 + Math.floor(stats.water / 100), 95);
  const percent = basePercent + Math.floor(Math.random() * 5);
  
  return template
    .replace('{percent}', percent)
    .replace('{water}', stats.water || 0)
    .replace('{reminders}', stats.reminders || 0);
}

/**
 * 检查是否应该发送提醒
 * @param {Object} settings - 用户设置
 * @returns {boolean}
 */
export function shouldRemind(settings = {}) {
  // 检查是否开启提醒
  if (settings.disabled) return false;
  
  // 检查是否在静默模式
  if (settings.silentMode) {
    const now = new Date();
    const silentEnd = new Date(settings.silentUntil);
    if (now < silentEnd) return false;
    // 静默期结束，自动关闭
    settings.silentMode = false;
  }
  
  // 检查是否在有效时间段
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = hour + minute / 60;
  
  // 默认 09:00 - 22:00
  const start = settings.startTime || 9;
  const end = settings.endTime || 22;
  
  if (time < start || time >= end) return false;
  
  return true;
}

/**
 * 获取下次提醒时间
 * @param {number} intervalMinutes - 间隔分钟数
 * @returns {Date}
 */
export function getNextReminderTime(intervalMinutes = 45) {
  const now = new Date();
  const next = new Date(now.getTime() + intervalMinutes * 60 * 1000);
  return next;
}

/**
 * 获取提醒间隔的文案
 * @returns {string}
 */
export function getIntervalMessage() {
  const messages = [
    '（每 45 分钟提醒一次）',
    '（45 分钟后见～）',
    '（下次提醒：45 分钟后）',
    ''
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export default {
  REMINDER_TYPES,
  TIME_SLOTS,
  REMINDER_MESSAGES,
  generateReminder,
  generateDailyReport,
  shouldRemind,
  getCurrentTimeSlot,
  getCurrentReminderType,
  getNextReminderTime,
  getIntervalMessage
};
