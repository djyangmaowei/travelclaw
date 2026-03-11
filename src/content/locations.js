/**
 * 🦞 TravelClaw 旅行地点系统
 * 
 * 🦞 可以去世界各地旅行！
 */

export const REGIONS = {
  nearby_beach: {
    id: 'nearby_beach',
    name: '附近海滩',
    emoji: '🏖️',
    unlock_stage: 'baby',
    description: '🦞 的家门口，熟悉而温暖',
    base_duration: 30, // 分钟
    locations: ['sunny_beach', 'rocky_shore', 'tide_pool']
  },
  
  nearby_city: {
    id: 'nearby_city',
    name: '附近城市',
    emoji: '🏙️',
    unlock_stage: 'teen',
    description: '沿海的繁华城市',
    base_duration: 60,
    locations: ['harbor', 'fish_market', 'coastal_park']
  },
  
  domestic: {
    id: 'domestic',
    name: '国内名胜',
    emoji: '🇨🇳',
    unlock_stage: 'adult',
    description: '祖国的大好河山',
    base_duration: 180,
    locations: ['great_wall', 'west_lake', 'li_river', 'yellow_mountain']
  },
  
  international: {
    id: 'international',
    name: '国际旅行',
    emoji: '🌍',
    unlock_stage: 'mature',
    description: '世界各地的精彩',
    base_duration: 360,
    locations: ['eiffel_tower', 'santorini', 'mount_fuji', 'sydney_opera']
  },
  
  global_adventure: {
    id: 'global_adventure',
    name: '全球冒险',
    emoji: '🌎',
    unlock_stage: 'king',
    description: '传说中的神秘之地',
    base_duration: 720,
    locations: ['antarctica', 'deep_sea_trench', 'atlantis_ruins']
  }
};

export const LOCATIONS = {
  // 附近海滩
  sunny_beach: {
    id: 'sunny_beach',
    name: '阳光沙滩',
    emoji: '☀️',
    region: 'nearby_beach',
    description: '金色的沙滩，温暖的海风',
    activities: ['晒太阳', '堆沙堡', '捡贝壳'],
    souvenirs: ['scallop_shell', 'sand_bottle']
  },
  rocky_shore: {
    id: 'rocky_shore',
    name: '礁石海岸',
    emoji: '🪨',
    region: 'nearby_beach',
    description: '布满礁石的海岸线',
    activities: ['攀爬礁石', '寻找螃蟹', '躲猫猫'],
    souvenirs: ['conch_shell', 'seaweed_salad']
  },
  tide_pool: {
    id: 'tide_pool',
    name: '潮间水洼',
    emoji: '💧',
    region: 'nearby_beach',
    description: '退潮后留下的水洼，充满生机',
    activities: ['观察小生物', '泡水', '照镜子'],
    souvenirs: ['starfish', 'sea_urchin']
  },
  
  // 附近城市
  harbor: {
    id: 'harbor',
    name: '渔港',
    emoji: '⚓',
    region: 'nearby_city',
    description: '渔船来往的繁忙港口',
    activities: ['看大船', '闻鱼腥', '和渔民聊天'],
    souvenirs: ['fishing_net', 'rope']
  },
  fish_market: {
    id: 'fish_market',
    name: '鱼市场',
    emoji: '🐟',
    region: 'nearby_city',
    description: '各种海鲜琳琅满目',
    activities: ['逛街', '躲起来', '看人类'],
    souvenirs: ['ice_cube', 'lemon_slice']
  },
  coastal_park: {
    id: 'coastal_park',
    name: '海滨公园',
    emoji: '🌳',
    region: 'nearby_city',
    description: '适合散步的海边公园',
    activities: ['散步', '看日落', '听海鸥'],
    souvenirs: ['lighthouse_photo', 'seagull_feather']
  },
  
  // 国内名胜
  great_wall: {
    id: 'great_wall',
    name: '万里长城',
    emoji: '🧱',
    region: 'domestic',
    description: '雄伟壮观的古代建筑',
    activities: ['爬楼梯', '看风景', '感叹历史'],
    souvenirs: ['great_wall_brick', 'chinese_knot']
  },
  west_lake: {
    id: 'west_lake',
    name: '杭州西湖',
    emoji: '🌸',
    region: 'domestic',
    description: '欲把西湖比西子，淡妆浓抹总相宜',
    activities: ['赏荷花', '走断桥', '喝龙井'],
    souvenirs: ['lotus_leaf', 'silk_scarf']
  },
  li_river: {
    id: 'li_river',
    name: '桂林漓江',
    emoji: '⛰️',
    region: 'domestic',
    description: '山水甲天下',
    activities: ['竹筏漂流', '看山峰', '画风景'],
    souvenirs: ['bamboo_segment', 'ink_painting']
  },
  yellow_mountain: {
    id: 'yellow_mountain',
    name: '黄山',
    emoji: '🌄',
    region: 'domestic',
    description: '五岳归来不看山，黄山归来不看岳',
    activities: ['看云海', '爬天都峰', '看迎客松'],
    souvenirs: ['pine_needle', 'cloud_stone']
  },
  
  // 国际旅行
  eiffel_tower: {
    id: 'eiffel_tower',
    name: '埃菲尔铁塔',
    emoji: '🗼',
    region: 'international',
    description: '巴黎的浪漫地标',
    activities: ['仰望铁塔', '在草坪休息', '吃法棍'],
    souvenirs: ['mini_tower', 'garlic_butter']
  },
  santorini: {
    id: 'santorini',
    name: '圣托里尼',
    emoji: '🏛️',
    region: 'international',
    description: '蓝白相间的梦幻岛屿',
    activities: ['看日落', '游地中海', '拍美照'],
    souvenirs: ['blue_dome', 'olive_oil']
  },
  mount_fuji: {
    id: 'mount_fuji',
    name: '富士山',
    emoji: '🗻',
    region: 'international',
    description: '日本的圣山，完美的锥形',
    activities: ['看樱花', '泡温泉', '吃寿司'],
    souvenirs: ['sakura_petal', 'onsen_egg']
  },
  sydney_opera: {
    id: 'sydney_opera',
    name: '悉尼歌剧院',
    emoji: '🎭',
    region: 'international',
    description: '独特的帆船造型建筑',
    activities: ['看海景', '听歌剧', '晒太阳'],
    souvenirs: ['shell_opera', 'tim_tam']
  },
  
  // 全球冒险（传说级）
  antarctica: {
    id: 'antarctica',
    name: '南极',
    emoji: '🐧',
    region: 'global_adventure',
    description: '冰雪覆盖的极地世界',
    activities: ['看企鹅', '滑冰雪', '极光'],
    souvenirs: ['ice_crystal', 'penguin_feather']
  },
  deep_sea_trench: {
    id: 'deep_sea_trench',
    name: '马里亚纳海沟',
    emoji: '🌊',
    region: 'global_adventure',
    description: '地球上最深的地方',
    activities: ['深潜', '看深海生物', '发光'],
    souvenirs: ['pressure_stone', 'anglerfish_lure']
  },
  atlantis_ruins: {
    id: 'atlantis_ruins',
    name: '亚特兰蒂斯遗址',
    emoji: '🏛️',
    region: 'global_adventure',
    description: '传说中的失落文明',
    activities: ['探险', '寻宝', '解谜'],
    souvenirs: ['ancient_coin', 'mermaid_scale']
  }
};

// 获取地点
export function getLocation(id) {
  return LOCATIONS[id] || null;
}

// 获取某区域的所有地点
export function getLocationsByRegion(regionId) {
  return Object.values(LOCATIONS).filter(loc => loc.region === regionId);
}

// 获取适合某成长阶段的地点
export function getLocationsForStage(stage) {
  const availableRegions = Object.values(REGIONS)
    .filter(r => r.unlock_stage === stage || isStageBefore(r.unlock_stage, stage))
    .map(r => r.id);
  
  return Object.values(LOCATIONS).filter(loc => 
    availableRegions.includes(loc.region)
  );
}

// 辅助函数：判断 stage1 是否在 stage2 之前
function isStageBefore(stage1, stage2) {
  const order = ['baby', 'teen', 'adult', 'mature', 'king'];
  return order.indexOf(stage1) <= order.indexOf(stage2);
}
