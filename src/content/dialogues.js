/**
 * 🦞 TravelClaw 对话文案系统
 * 
 * 🦞 的各种台词和消息模板
 */

// 状态消息
export const STATUS_MESSAGES = {
  // 🦞 在家时
  at_home: [
    "🦞 正在家啃海藻，看起来很满足~",
    "🦞 在整理它的钳子，闪闪发光呢！",
    "🦞 正在睡觉，发出轻轻的泡泡声... 💤",
    "🦞 在洞口晒太阳，懒洋洋的~",
    "🦞 正在数收藏的贝壳，一副财迷样 😄"
  ],
  
  // 🦞 准备出发
  preparing: [
    "🦞 正在收拾行囊，看起来要出远门了！",
    "🦞 在检查地图，目的地是...？",
    "🦞 把食物塞进背包，准备出发！",
    "🦞 在镜子前整理外观，真是个讲究的 🦞"
  ],
  
  // 🦞 旅行中
  traveling: [
    "🦞 已经出发旅行了，现在不在家哦~",
    "🦞 正在世界的某个角落探险！",
    "🦞 的旅行正在进行中，请耐心等待明信片~",
    "🦞 也许正在某个海滩晒太阳呢 🏖️"
  ],
  
  // 🦞 刚回来
  just_returned: [
    "🦞 刚旅行回来，正在休息呢！",
    "🦞 看起来很累，让它好好休息吧~",
    "🦞 带回了好多故事，等它休息好再聊吧"
  ]
};

// 出发消息
export const DEPARTURE_MESSAGES = {
  baby: [
    "🦞 背着小包包出门探索了！它会小心不去太远的地方~",
    "小小的 🦞 充满好奇地出发了，祝它一路平安！",
    "🦞 第一次独自出门，有点担心又有点期待..."
  ],
  teen: [
    "🦞 自信满满地出发了！它的钳子越来越有力了呢~",
    "少年 🦞 踏上旅程，去寻找新的冒险！",
    "🦞 已经是个熟练的旅行者了，让它去探索吧！"
  ],
  adult: [
    "🦞 背着满满的行囊，准备来一次大冒险！",
    "🦞 的眼神充满对世界的渴望，让它自由飞翔吧~",
    "成年的 🦞 要去探索更广阔的世界了！"
  ],
  mature: [
    "🦞 以王者的姿态踏上旅程，去征服远方！",
    "🦞 的巨大钳子已经准备好应对任何挑战！",
    "这只威武的 🦞 要去创造新的传说！"
  ],
  king: [
    "👑 虾王 🦞 开始了它的传奇之旅...",
    "传说中的 🦞 再次出现，它将去往何方？",
    "👑 虾王的足迹将遍布世界的每一个角落！"
  ]
};

// 寄明信片消息
export const POSTCARD_MESSAGES = {
  // 普通发现
  discovery: [
    "🦞 从 {location} 寄来一张明信片！\n\n\"{activity} 好有趣！这里的 {feature} 太棒了~\"\n\n——想你的 🦞",
    "叮！你有一张来自 {location} 的明信片 📬\n\n🦞 写道：\"{activity} 让我好兴奋！带回了好东西给你~\"",
    "🦞 在 {location} 给你寄了明信片！\n\n\"今天 {activity}，{thought}\"\n\n等 🦞 回家~"
  ],
  
  // 遇到朋友
  met_friend: [
    "🦞 在 {location} 遇到了一只 {friend}！\n\n它们一起 {activity}，看起来玩得很开心~",
    "明信片上 🦞 和一只 {friend} 的合影！\n\n\"认识了新朋友，一起 {activity}！\"",
    "🦞 写道：\"在 {location} 遇到了 {friend}，它教我 {activity}！\""
  ],
  
  // 特殊事件
  special_event: [
    "🦞 在 {location} 遇到了不可思议的事情！\n\n\"{event_description}\"\n\n这一定是特别的缘分~",
    "明信片上的 🦞 看起来特别兴奋！\n\n\"你绝对猜不到发生了什么！{event_description}\"",
    "🦞 在 {location} 的奇遇：\n\n{event_description}\n\n它一定有很多故事要分享！"
  ]
};

// 带回特产消息
export const SOUVENIR_MESSAGES = {
  common: [
    "🦞 给你带回了 {souvenir}！\n\"{thought}\"",
    "🦞 从旅行中带回 {souvenir}，看起来很满意这次收获~",
    "看！🦞 给你带了 {souvenir} 作为礼物 💝"
  ],
  rare: [
    "🦞 兴冲冲地给你看 {souvenir}！\n\"这可是很难得的东西！\"",
    "哇！🦞 带回了稀有的 {souvenir}！\n这次旅行收获满满！",
    "🦞 小心翼翼地把 {souvenir} 交给你，眼神里满是骄傲 ✨"
  ],
  legendary: [
    "🦞 神秘兮兮地拿出 {souvenir}...\n\"这...这是传说中的...！\"\n\n太不可思议了！",
    "👑 传说中的物品！🦞 竟然带回了 {souvenir}！\n这简直是奇迹！",
    "🦞 的眼神中闪烁着光芒，它带回了 {souvenir}！\n这将是一个传奇故事的开始..."
  ]
};

// 收割贝壳消息
export const COLLECT_MESSAGES = {
  none: [
    "家园里还没有长出新的贝壳，再等等吧~",
    "看起来 🦞 的家园还没有产出，耐心是一种美德 🦞",
    "现在没有贝壳可以收割，也许 🦞 回来后会变多~"
  ],
  few: [
    "收获了 {count} 个贝壳！🦞 的小窝虽然不大，但很温馨~",
    "找到了 {count} 个贝壳！积少成多，继续加油！",
    "🦞 的家园产出了 {count} 个贝壳，它是勤劳的小 🦞"
  ],
  normal: [
    "收获了 {count} 个贝壳！🦞 的家越来越富有了~",
    "哇，{count} 个贝壳！可以好好打扮 🦞 的小窝了！",
    "🦞 的辛勤换来了 {count} 个贝壳，真是个小富翁 🐚"
  ],
  many: [
    "大丰收！收获了 {count} 个贝壳！🦞 一定很开心！",
    "太棒了！{count} 个贝壳！可以给 🦞 买很多好东西了~",
    "哇塞！{count} 个贝壳！🦞 的家园真是个宝藏！"
  ]
};

// 互动学习关键词
export const PERSONALITY_KEYWORDS = {
  // 可爱系
  cute: {
    keywords: ['可爱', '萌', '乖', '宝贝', '宝宝', '小可爱', '心疼'],
    traits: ['cute', 'lovely', 'adorable'],
    prompt_modifier: 'cute and adorable expression, big shiny eyes, small body'
  },
  
  // 沉稳系
  calm: {
    keywords: ['沉稳', '成熟', '稳重', '优雅', '绅士', '淡定'],
    traits: ['calm', 'mature', 'elegant'],
    prompt_modifier: 'calm and elegant demeanor, wise expression, composed posture'
  },
  
  // 威武系
  strong: {
    keywords: ['威武', '霸气', '厉害', '强壮', '强大', '钳子大', '厉害'],
    traits: ['strong', 'powerful', 'mighty'],
    prompt_modifier: 'powerful and mighty stance, large impressive claws, confident posture'
  },
  
  // 好奇系
  curious: {
    keywords: ['好奇', '活泼', '调皮', '好动', '探险', '冒险'],
    traits: ['curious', 'playful', 'adventurous'],
    prompt_modifier: 'curious and playful expression, exploring pose, energetic vibe'
  },
  
  // 慵懒系
  lazy: {
    keywords: ['懒', '悠闲', '慵懒', '佛系', '慢', '躺平'],
    traits: ['lazy', 'relaxed', 'chill'],
    prompt_modifier: 'relaxed and lazy pose, chill vibe, leisurely attitude'
  }
};

// 随机选择消息
export function randomMessage(messageArray, vars = {}) {
  const msg = messageArray[Math.floor(Math.random() * messageArray.length)];
  return msg.replace(/\{(\w+)\}/g, (match, key) => vars[key] || match);
}

// 根据玩家消息检测性格偏好
export function detectPersonality(message) {
  const detected = [];
  
  for (const [type, data] of Object.entries(PERSONALITY_KEYWORDS)) {
    if (data.keywords.some(kw => message.includes(kw))) {
      detected.push(type);
    }
  }
  
  return detected;
}
