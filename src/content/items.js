/**
 * 🦞 TravelClaw 道具系统
 * 
 * 所有道具定义都在这里
 */

// 🍽️ 食物类 - 影响旅行时间和恢复
export const FOODS = {
  seaweed_salad: {
    id: 'seaweed_salad',
    name: '海藻沙拉',
    emoji: '🥗',
    price: 10,
    type: 'food',
    description: '新鲜的海藻，🦞 的基础食物',
    effect: { energy: 20, duration_mod: 1.0 }
  },
  plankton_ball: {
    id: 'plankton_ball',
    name: '浮游生物团',
    emoji: '🦠',
    price: 15,
    type: 'food',
    description: '营养丰富的浮游生物，轻便易携带',
    effect: { energy: 25, duration_mod: 0.8 }
  },
  dead_fish: {
    id: 'dead_fish',
    name: '死鱼',
    emoji: '🐟',
    price: 25,
    type: 'food',
    description: '🦞 的最爱！腐食爱好者的美味',
    effect: { energy: 40, duration_mod: 1.2 }
  },
  hydrothermal_nugget: {
    id: 'hydrothermal_nugget',
    name: '热泉硫化物',
    emoji: '♨️',
    price: 50,
    type: 'food',
    description: '来自深海热泉的神秘食物，充满能量',
    effect: { energy: 60, duration_mod: 1.0, luck: 0.1 }
  },
  shipwreck_biscuit: {
    id: 'shipwreck_biscuit',
    name: '沉船饼干',
    emoji: '🍪',
    price: 80,
    type: 'food',
    description: '从古老沉船中找到的饼干，据说能带来好运',
    effect: { energy: 50, duration_mod: 1.5, luck: 0.2, rare_find: true }
  }
};

// 🎒 装备类 - 影响旅行目的地和成功率
export const GEAR = {
  old_shell_charm: {
    id: 'old_shell_charm',
    name: '褪下的旧壳',
    emoji: '🐚',
    price: 30,
    type: 'gear',
    description: '🦞 褪下的壳，带来好运和安全感',
    effect: { luck: 0.15, safety: true }
  },
  strong_claw: {
    id: 'strong_claw',
    name: '强壮的右钳',
    emoji: '💪',
    price: 60,
    type: 'gear',
    description: '强大的钳子，可以打开坚硬的贝壳和宝箱',
    effect: { strength: 20, can_open: ['shell', 'chest'] }
  },
  diving_goggles: {
    id: 'diving_goggles',
    name: '潜水镜',
    emoji: '🥽',
    price: 45,
    type: 'gear',
    description: '深潜必备，解锁深海目的地',
    effect: { unlock_regions: ['deep_sea'] }
  },
  tiny_paddle: {
    id: 'tiny_paddle',
    name: '小划水桨',
    emoji: '🚣',
    price: 40,
    type: 'gear',
    description: '帮助 🦞 游得更快，减少旅行时间',
    effect: { duration_mod: 0.7, swim_speed: 1.5 }
  },
  waterproof_map: {
    id: 'waterproof_map',
    name: '防水地图',
    emoji: '🗺️',
    price: 100,
    type: 'gear',
    description: '标注了神秘地点的地图，增加发现新地点的概率',
    effect: { new_location_chance: 0.3, unlock_count: 2 }
  },
  compass: {
    id: 'compass',
    name: '指南针',
    emoji: '🧭',
    price: 55,
    type: 'gear',
    description: '🦞 不会迷路了，可以到达更远的地方',
    effect: { max_distance: 1.5, lost_chance: -0.2 }
  }
};

// 🏠 家园装饰类 - 纯视觉，提升幸福感
export const DECORATIONS = {
  coral_branch: {
    id: 'coral_branch',
    name: '珊瑚枝',
    emoji: '🪸',
    price: 20,
    type: 'decoration',
    description: '插在洞口的美丽珊瑚',
    position: 'entrance'
  },
  sea_anemone: {
    id: 'sea_anemone',
    name: '海葵',
    emoji: '🌸',
    price: 35,
    type: 'decoration',
    description: '会随风摇摆的可爱海葵',
    position: 'corner'
  },
  ship_wheel: {
    id: 'ship_wheel',
    name: '沉船舵轮',
    emoji: '☸️',
    price: 150,
    type: 'decoration',
    description: '来自古老沉船的舵轮，稀有家具',
    position: 'wall'
  },
  anchor: {
    id: 'anchor',
    name: '船锚',
    emoji: '⚓',
    price: 80,
    type: 'decoration',
    description: '放在家门口的船锚，很有安全感',
    position: 'entrance'
  },
  message_bottle: {
    id: 'message_bottle',
    name: '漂流瓶',
    emoji: '🍾',
    price: 45,
    type: 'decoration',
    description: '里面有一张神秘的纸条',
    position: 'table'
  },
  fishing_net: {
    id: 'fishing_net',
    name: '渔网',
    emoji: '🕸️',
    price: 30,
    type: 'decoration',
    description: '挂在墙上当窗帘用',
    position: 'window'
  },
  shell_wind_chime: {
    id: 'shell_wind_chime',
    name: '贝壳风铃',
    emoji: '🎐',
    price: 50,
    type: 'decoration',
    description: '风吹过时会发出悦耳的声音',
    position: 'ceiling'
  }
};

// 🎁 特产类 - 旅行带回，用于收藏
export const SOUVENIRS = {
  // 普通贝壳
  scallop_shell: {
    id: 'scallop_shell',
    name: '扇贝贝壳',
    emoji: '🐚',
    type: 'souvenir',
    rarity: 'common',
    description: '来自附近海滩的普通贝壳'
  },
  conch_shell: {
    id: 'conch_shell',
    name: '海螺贝壳',
    emoji: '🐌',
    type: 'souvenir',
    rarity: 'common',
    description: '可以听到海浪声的海螺'
  },
  
  // 稀有物品
  pearl: {
    id: 'pearl',
    name: '珍珠',
    emoji: '⚪',
    type: 'souvenir',
    rarity: 'rare',
    description: '从牡蛎那里换来的美丽珍珠'
  },
  pirate_coin: {
    id: 'pirate_coin',
    name: '海盗金币',
    emoji: '🪙',
    type: 'souvenir',
    rarity: 'rare',
    description: '来自沉船遗址的古老金币'
  },
  
  // 传说物品
  mermaid_scale: {
    id: 'mermaid_scale',
    name: '美人鱼鳞片',
    emoji: '✨',
    type: 'souvenir',
    rarity: 'legendary',
    description: '传说中的物品，据说遇到美人鱼才能得到'
  },
  
  // 各地特产（按地点）
  sand_bottle: {
    id: 'sand_bottle',
    name: '沙粒小瓶',
    emoji: '🧪',
    type: 'souvenir',
    rarity: 'common',
    description: '来自不同海滩的沙粒，装在小瓶子里'
  },
  lighthouse_photo: {
    id: 'lighthouse_photo',
    name: '灯塔照片',
    emoji: '📷',
    type: 'souvenir',
    rarity: 'common',
    description: '🦞 在灯塔前的打卡照'
  },
  garlic_butter: {
    id: 'garlic_butter',
    name: '法式蒜蓉黄油',
    emoji: '🧈',
    type: 'souvenir',
    rarity: 'uncommon',
    description: '等等...这是给 🦞 的吗？！😱'
  }
};

// 🎁 特殊掉落物品（从 Rewards.js 导入时会合并）
export const SPECIAL_ITEMS = {};

// 获取所有可购买的物品
export function getShopItems() {
  return {
    ...FOODS,
    ...GEAR,
    ...DECORATIONS
  };
}

// 根据 ID 获取物品
export function getItem(id) {
  const allItems = {
    ...FOODS,
    ...GEAR,
    ...DECORATIONS,
    ...SOUVENIRS,
    ...SPECIAL_ITEMS
  };
  return allItems[id] || null;
}

// 注册特殊物品（由 Rewards.js 调用）
export function registerSpecialItems(items) {
  Object.assign(SPECIAL_ITEMS, items);
}
