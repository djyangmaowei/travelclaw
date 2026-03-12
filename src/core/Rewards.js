/**
 * 🎁 TravelClaw 奖励掉落系统
 * 
 * 随机道具、宝箱、幸运奖励
 */

import { getItem, registerSpecialItems } from '../content/items.js';

// 🎲 稀有度定义
export const RARITY = {
  common: { name: '普通', emoji: '⚪', chance: 0.4 },
  uncommon: { name: '优秀', emoji: '🟢', chance: 0.25 },
  rare: { name: '稀有', emoji: '🔵', chance: 0.12 },
  epic: { name: '史诗', emoji: '🟣', chance: 0.05 },
  legendary: { name: '传说', emoji: '🟠', chance: 0.015 },
  mythic: { name: '神话', emoji: '🔴', chance: 0.003 }
};

// 🎁 特殊掉落物品
// 先声明，后面导出
const SPECIAL_DROPS = {
  // 普通
  lucky_shell: {
    id: 'lucky_shell',
    name: '幸运贝壳',
    emoji: '🐚',
    type: 'special',
    rarity: 'common',
    description: '摸起来暖暖的，似乎能带来好运',
    effect: { luck_boost: 0.05, duration: 3600 } // 1小时幸运加成
  },
  pearl_fragment: {
    id: 'pearl_fragment',
    name: '珍珠碎片',
    emoji: '⚪',
    type: 'special',
    rarity: 'common',
    description: '碎掉的珍珠，依然有光泽',
    effect: { sell_price: 5 }
  },
  
  // 优秀
  time_sand: {
    id: 'time_sand',
    name: '时间沙砾',
    emoji: '⏳',
    type: 'special',
    rarity: 'uncommon',
    description: '可以加速 🦞 的旅行（缩短30分钟）',
    effect: { time_reduce: 30 }
  },
  friendship_badge: {
    id: 'friendship_badge',
    name: '友谊徽章',
    emoji: '🎖️',
    type: 'special',
    rarity: 'uncommon',
    description: '增加亲密度的神奇徽章',
    effect: { bond_bonus: 10 }
  },
  
  // 稀有
  mystery_box: {
    id: 'mystery_box',
    name: '神秘小宝箱',
    emoji: '📦',
    type: 'special',
    rarity: 'rare',
    description: '里面可能有好东西！发送"开启宝箱"打开',
    effect: { box_type: 'small' }
  },
  growth_potion: {
    id: 'growth_potion',
    name: '成长药水',
    emoji: '🧪',
    type: 'special',
    rarity: 'rare',
    description: '让 🦞 快速成长（+1天成长值）',
    effect: { growth_bonus: 1 }
  },
  
  // 史诗
  golden_shell: {
    id: 'golden_shell',
    name: '黄金贝壳',
    emoji: '🌟',
    type: 'special',
    rarity: 'epic',
    description: '价值连城的纯金贝壳',
    effect: { sell_price: 100, luck_boost: 0.1, duration: 7200 }
  },
  teleport_stone: {
    id: 'teleport_stone',
    name: '传送石',
    emoji: '💎',
    type: 'special',
    rarity: 'epic',
    description: '让 🦞 立即完成当前旅行',
    effect: { instant_return: true }
  },
  
  // 传说
  dragon_pearl: {
    id: 'dragon_pearl',
    name: '龙珠',
    emoji: '🔮',
    type: 'special',
    rarity: 'legendary',
    description: '传说中的宝物，拥有神奇力量',
    effect: { all_stats_boost: 0.2, duration: 86400, sell_price: 500 }
  },
  ancient_map: {
    id: 'ancient_map',
    name: '古代海图',
    emoji: '🗺️',
    type: 'special',
    rarity: 'legendary',
    description: '标记着传说中的未知地点',
    effect: { unlock_secret_location: true }
  },
  
  // 神话
  claw_crown: {
    id: 'claw_crown',
    name: '虾王之冠',
    emoji: '👑',
    type: 'special',
    rarity: 'mythic',
    description: '只有真正的王者才能拥有的冠冕',
    effect: { instant_king: true, sell_price: 2000 }
  },
  philosophers_stone: {
    id: 'philosophers_stone',
    name: '贤者之石',
    emoji: '✨',
    type: 'special',
    rarity: 'mythic',
    description: '传说中能点石成金的神秘石头',
    effect: { infinite_shells: 1000, sell_price: 9999 }
  }
};

// 📦 宝箱内容配置
export const BOX_CONTENTS = {
  small: {
    name: '小宝箱',
    min_shells: 10,
    max_shells: 50,
    item_chance: 0.3,
    possible_items: ['lucky_shell', 'pearl_fragment', 'time_sand']
  },
  medium: {
    name: '中宝箱',
    min_shells: 50,
    max_shells: 150,
    item_chance: 0.5,
    possible_items: ['time_sand', 'friendship_badge', 'mystery_box', 'growth_potion']
  },
  large: {
    name: '大宝箱',
    min_shells: 150,
    max_shells: 500,
    item_chance: 0.7,
    possible_items: ['mystery_box', 'growth_potion', 'golden_shell', 'teleport_stone']
  },
  legendary: {
    name: '传说宝箱',
    min_shells: 500,
    max_shells: 2000,
    item_chance: 1.0,
    possible_items: ['golden_shell', 'teleport_stone', 'dragon_pearl', 'ancient_map']
  }
};

/**
 * 🎲 计算幸运加成后的掉落概率
 * @param {number} baseLuck - 基础幸运值 (0-1)
 * @param {number} bondLevel - 亲密度等级
 * @returns {number} 最终幸运加成
 */
export function calculateLuckModifier(baseLuck = 0, bondLevel = 0) {
  // 亲密度每10点提供 0.01 幸运加成
  const bondBonus = Math.floor(bondLevel / 10) * 0.01;
  return Math.min(baseLuck + bondBonus, 0.5); // 最高50%额外加成
}

/**
 * 🎁 进行一次掉落判定
 * @param {string} activity - 活动类型: 'collect', 'travel', 'interaction', 'milestone'
 * @param {number} luckModifier - 幸运加成
 * @returns {Object|null} 掉落物品或null
 */
export function rollDrop(activity, luckModifier = 0) {
  // 基础掉落率
  const baseRates = {
    collect: 0.15,      // 收割 15%
    travel: 0.25,       // 旅行归来 25%
    interaction: 0.08,  // 互动 8%
    milestone: 0.5,     // 里程碑 50%
    daily: 0.3,         // 每日任务 30%
    random_event: 0.2   // 随机事件 20%
  };

  const baseRate = baseRates[activity] || 0.1;
  const finalRate = Math.min(baseRate * (1 + luckModifier), 0.8); // 最高80%

  // 判定是否掉落
  if (Math.random() > finalRate) {
    return null;
  }

  // 根据稀有度权重选择物品
  return rollRarityItem(luckModifier);
}

/**
 * 🎲 根据稀有度权重随机选择物品
 * @param {number} luckModifier - 幸运加成
 * @returns {Object} 掉落物品
 */
function rollRarityItem(luckModifier) {
  // 计算调整后的概率
  const adjustedChances = {};
  let totalChance = 0;

  for (const [rarity, data] of Object.entries(RARITY)) {
    // 幸运加成会提高稀有物品概率，降低普通物品概率
    let multiplier = 1;
    if (rarity === 'common') multiplier = 1 - luckModifier * 0.5;
    else if (rarity === 'mythic') multiplier = 1 + luckModifier * 3;
    else if (rarity === 'legendary') multiplier = 1 + luckModifier * 2;
    else if (rarity === 'epic') multiplier = 1 + luckModifier * 1.5;
    else if (rarity === 'rare') multiplier = 1 + luckModifier;
    else if (rarity === 'uncommon') multiplier = 1 + luckModifier * 0.5;

    adjustedChances[rarity] = data.chance * multiplier;
    totalChance += adjustedChances[rarity];
  }

  // 归一化并选择
  let roll = Math.random() * totalChance;
  
  for (const [rarity, chance] of Object.entries(adjustedChances)) {
    roll -= chance;
    if (roll <= 0) {
      // 返回该稀有度的随机物品
      return getRandomItemByRarity(rarity);
    }
  }

  // 默认返回普通物品
  return getRandomItemByRarity('common');
}

/**
 * 🎯 获取指定稀有度的随机物品
 * @param {string} rarity - 稀有度
 * @returns {Object} 物品
 */
function getRandomItemByRarity(rarity) {
  const items = Object.values(SPECIAL_DROPS).filter(item => item.rarity === rarity);
  if (items.length === 0) {
    // 回退到普通
    return SPECIAL_DROPS.lucky_shell;
  }
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * 📦 开启宝箱
 * @param {string} boxType - 宝箱类型
 * @param {number} luckModifier - 幸运加成
 * @returns {Object} 宝箱内容
 */
export function openBox(boxType, luckModifier = 0) {
  const box = BOX_CONTENTS[boxType] || BOX_CONTENTS.small;
  
  // 计算贝壳奖励
  const shellRange = box.max_shells - box.min_shells;
  const shells = box.min_shells + Math.floor(Math.random() * shellRange * (1 + luckModifier));

  // 判定是否获得物品
  const items = [];
  const itemChance = box.item_chance * (1 + luckModifier);
  
  if (Math.random() < itemChance) {
    const possibleItems = box.possible_items;
    const itemId = possibleItems[Math.floor(Math.random() * possibleItems.length)];
    const item = SPECIAL_DROPS[itemId] || getItem(itemId);
    if (item) items.push(item);
  }

  // 大宝箱和传说宝箱有概率额外获得一个物品
  if ((boxType === 'large' || boxType === 'legendary') && Math.random() < 0.3 * (1 + luckModifier)) {
    const extraItem = rollRarityItem(luckModifier);
    if (extraItem) items.push(extraItem);
  }

  return {
    shells,
    items,
    box_name: box.name
  };
}

/**
 * 💝 获取里程碑奖励
 * @param {number} milestone - 里程碑百分比 (10, 20, 30...)
 * @param {string} stage - 当前阶段
 * @returns {Object} 奖励内容
 */
export function getMilestoneReward(milestone, stage) {
  const rewards = {
    10: { shells: 20, item: 'lucky_shell' },
    20: { shells: 30, item: 'time_sand' },
    30: { shells: 50, item: 'friendship_badge' },
    40: { shells: 70, item: 'mystery_box' },
    50: { shells: 100, item: 'growth_potion' },
    60: { shells: 120, item: 'mystery_box' },
    70: { shells: 150, item: 'golden_shell' },
    80: { shells: 180 },
    90: { shells: 200, item: 'teleport_stone' },
    100: { shells: 500, item: 'dragon_pearl' }
  };

  const reward = rewards[milestone] || { shells: 10 };
  const result = {
    milestone,
    shells: reward.shells,
    item: null
  };

  if (reward.item) {
    result.item = SPECIAL_DROPS[reward.item] || null;
  }

  // 阶段越高，奖励越好
  const stageMultiplier = ['baby', 'teen', 'adult', 'mature', 'king'].indexOf(stage) + 1;
  result.shells = Math.floor(result.shells * stageMultiplier * (1 + Math.random() * 0.5));

  return result;
}

/**
 * 📋 获取每日任务
 * @returns {Object} 任务配置
 */
export function generateDailyTask() {
  const tasks = [
    { id: 'collect_shells', name: '收集贝壳', target: 10 + Math.floor(Math.random() * 20), reward: { shells: 30 } },
    { id: 'send_travel', name: '送 🦞 去旅行', target: 1, reward: { shells: 50, item: 'time_sand' } },
    { id: 'take_photo', name: '给 🦞 拍照', target: 1, reward: { shells: 20 } },
    { id: 'check_status', name: '查看 🦞 状态', target: 3, reward: { shells: 10 } },
    { id: 'buy_item', name: '在商店购物', target: 1, reward: { shells: 25, item: 'lucky_shell' } },
    { id: 'decorate_home', name: '装饰家园', target: 1, reward: { shells: 40 } },
    { id: 'interact', name: '和 🦞 互动', target: 5, reward: { shells: 35, item: 'friendship_badge' } }
  ];

  return tasks[Math.floor(Math.random() * tasks.length)];
}

/**
 * 🎲 触发随机事件
 * @param {string} state - 🦞 当前状态
 * @returns {Object|null} 事件配置
 */
export function triggerRandomEvent(state) {
  // 基础触发概率 15%
  if (Math.random() > 0.15) return null;

  const events = {
    at_home: [
      { id: 'found_treasure', name: '发现小宝藏', message: '🦞 在家附近发现了一些闪亮的贝壳！', reward: { shells: 15 } },
      { id: 'met_friend', name: '遇到朋友', message: '🦞 遇到了一只螃蟹朋友，它们聊了很久~', reward: { bond: 5 } },
      { id: 'sunny_day', name: '阳光明媚', message: '今天阳光特别好，🦞 心情很棒！', reward: { luck_boost: 0.1, duration: 1800 } },
      { id: 'practice_pose', name: '练习自拍', message: '🦞 偷偷练习了自拍姿势，下次拍照会更好看！', reward: { photo_quality: 0.1 } }
    ],
    traveling: [
      { id: 'quick_rest', name: '捷径', message: '🦞 发现了一条捷径，会提前回来！', reward: { time_reduce: 10 } },
      { id: 'met_traveler', name: '遇见旅人', message: '🦞 遇到了另一位旅行者，交换了礼物！', reward: { item: 'lucky_shell' } },
      { id: 'beautiful_view', name: '美景', message: '🦞 看到了绝美的风景，迫不及待想分享！', reward: { bond: 3 } },
      { id: 'lucky_find', name: '幸运发现', message: '🦞 在旅途中发现了珍贵的东西！', reward: { item: 'pearl_fragment' } }
    ],
    resting: [
      { id: 'sweet_dream', name: '美梦', message: '🦞 做了一个美梦，醒来精神满满！', reward: { bond: 8 } },
      { id: ' organize_souvenirs', name: '整理特产', message: '🦞 整理了旅行带回来的特产，发现了一些惊喜！', reward: { shells: 25 } }
    ]
  };

  const stateEvents = events[state] || events.at_home;
  return stateEvents[Math.floor(Math.random() * stateEvents.length)];
}

// 注册特殊物品到物品系统（在定义之后）
registerSpecialItems(SPECIAL_DROPS);

// 显式导出 SPECIAL_DROPS（因为定义时没有用 export const）
export { SPECIAL_DROPS };

// 默认导出
export default {
  rollDrop,
  openBox,
  getMilestoneReward,
  generateDailyTask,
  triggerRandomEvent,
  calculateLuckModifier,
  SPECIAL_DROPS,
  RARITY,
  BOX_CONTENTS
};
