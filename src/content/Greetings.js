/**
 * 🦞 Claw 主动问候文案库
 * 
 * 告别生硬的健康提醒，让 Claw 像有生命的伙伴一样主动关心主人
 */

// ========== 🦞 Claw 日常活动池（按阶段解锁）==========
export const CLAW_ACTIVITIES = {
  baby: [  // 幼虾期
    { id: 'bubbles', name: '吐泡泡', desc: '吐了一串彩虹泡泡，看着它们慢慢飘走' },
    { id: 'sand', name: '挖沙子', desc: '在沙堆里挖了个小坑，把自己埋了一半' },
    { id: 'nap', name: '睡午觉', desc: '蜷缩在贝壳里打了个小盹，梦见大海' },
    { id: 'splash', name: '玩水', desc: '用小钳子拍打着水面，溅起小小的水花' },
    { id: 'watch', name: '发呆', desc: '趴在石头上望着天空，思考虾生的意义' }
  ],
  teen: [  // 少年期
    { id: 'collect', name: '收集贝壳', desc: '在海滩上捡到了一颗形状奇特的贝壳' },
    { id: 'practice', name: '练习钳子', desc: '对着小石头练习钳子的开合，越来越有力了' },
    { id: 'cloud', name: '看云', desc: '躺在石头上望着云朵，觉得那朵云像一只大鲸鱼' },
    { id: 'polish', name: '打磨外壳', desc: '用沙子轻轻打磨自己的壳，让它更有光泽' },
    { id: 'explore', name: '探索周边', desc: '在家园附近发现了一条从未走过的小径' }
  ],
  adult: [  // 青年期
    { id: 'exercise', name: '锻炼肌肉', desc: '做了一组俯卧撑，感觉胸肌又结实了一点' },
    { id: 'map', name: '研究地图', desc: '在地图上标记了几个想去的神秘地点' },
    { id: 'decorate', name: '装饰家园', desc: '把新收集的贝壳摆成了一个好看的图案' },
    { id: 'read', name: '阅读', desc: '翻开了一本关于深海传说的书，津津有味' },
    { id: 'cook', name: '准备食物', desc: '尝试用海草做了一道新菜，味道还不错' }
  ],
  mature: [  // 壮年期
    { id: 'meditate', name: '冥想', desc: '闭上眼睛感受水流，内心一片宁静' },
    { id: 'teach', name: '教小虾', desc: '教邻居家的小虾如何使用钳子开贝壳' },
    { id: 'journal', name: '写日记', desc: '在日记本上记录下最近的旅行见闻' },
    { id: 'craft', name: '手工艺品', desc: '用贝壳和海草编织了一个精美的挂饰' },
    { id: 'guard', name: '守护家园', desc: '巡逻了一圈家园，确保一切安然无恙' }
  ],
  king: [  // 虾王期
    { id: 'banquet', name: '举办宴会', desc: '邀请朋友们来品尝珍藏多年的海藻酒' },
    { id: 'collect_rare', name: '鉴赏珍品', desc: '在藏品室欣赏那枚传说中的黑珍珠' },
    { id: 'wisdom', name: '传承智慧', desc: '给年轻一代讲述海洋的古老传说' },
    { id: 'stargaze', name: '观星', desc: '用望远镜观察星空，思考宇宙的奥秘' },
    { id: 'dream', name: '梦境游历', desc: '闭目养神时仿佛游遍了所有去过的海域' }
  ]
};

// ========== 🦞 夜间活动（用于早安回顾）==========
export const NIGHT_ACTIVITIES = {
  baby: [
    '做了一个关于大海的美梦，梦里有发光的水母',
    '听着海浪的声音入睡，感觉像被妈妈抱着',
    '半夜醒来看到星星，数着数着又睡着了',
    '梦见自己长出了大钳子，能夹起一块大石头'
  ],
  teen: [
    '夜观星象，发现猎户座的腰带特别亮',
    '整理这几天收集的贝壳，摆满了整个床头',
    '梦见在珊瑚礁探险，遇到了会说话的鱼',
    '半夜听到奇怪的声音，原来是贝壳在唱歌'
  ],
  adult: [
    '睡前冥想，感觉身心都得到了放松',
    '规划下一段旅程的路线，兴奋得有点睡不着',
    '梦见自己成为了海洋探险家，发现了新大陆',
    '夜间锻炼后睡得特别香，做了个好梦'
  ],
  mature: [
    '在月光下守护家园，感受责任的重量',
    '写旅行日记到深夜，记录下珍贵的回忆',
    '梦见年轻时候的冒险，嘴角不自觉上扬',
    '和远方的老朋友通过海螺电话聊到很晚'
  ],
  king: [
    '梦境中游历了所有曾经去过的地方',
    '在星空下思考生命的意义，有了新感悟',
    '梦见自己化身为海洋的守护者，威严而慈祥',
    '回忆一生的旅程，内心充满感恩和平静'
  ]
};

// ========== 🌅 早安问候模板 ==========
export const MORNING_TEMPLATES = {
  // 开场问候
  greetings: [
    '早安主人！🌅 太阳晒屁股啦～',
    '主人早呀！新的一天开始了 🌞',
    '早上好！我已经起床活动一会儿了 🦞',
    '早安！今天也是元气满满的一天 💪',
    '主人醒了吗？我已经准备好今天的冒险了 🌅'
  ],
  
  // 昨晚回顾（旅行归来版）
  night_review_travel: [
    '昨晚我{travel_time}才从{location}回来，{souvenir_desc}，累得倒头就睡了。',
    '深夜回到家的，这次去{location}的旅程太精彩了！{souvenir_desc}。',
    '昨晚旅行归来已经是{travel_time}，{souvenir_desc}，梦里还在回味呢。'
  ],
  
  // 昨晚回顾（普通版）
  night_review_normal: [
    '昨晚{night_activity}。',
    '夜里{night_activity}，睡得很香。',
    '昨晚{night_activity}，醒来感觉精神满满！'
  ],
  
  // 成长进展
  growth_report: [
    '我已经陪伴你 {days} 天，现在是{stage}（进度 {progress}%），羁绊等级「{bond_title}」{bond_emoji}',
    '我们在一起 {days} 天了，目前处于{stage}，进度 {progress}%，亲密度达到「{bond_title}」{bond_emoji}',
    '时光飞逝，已经相识 {days} 天，{stage}进度 {progress}%，我们的羁绊是「{bond_title}」{bond_emoji}'
  ],
  
  // 今日计划
  day_plan: [
    '今天想{activity}，还想整理一下行囊准备下次旅行～',
    '计划今天{activity}，然后研究研究新的目的地！',
    '今天打算{activity}，希望会有新的发现～',
    '想{activity}，顺便练习一下钳子的力量 💪'
  ],
  
  // 早安健康提醒
  health_reminder: [
    '主人早上记得喝杯水，空腹一杯温水对身体最好哦 💧',
    '早安！先喝杯水润润嗓子吧，开启元气满满的一天 💧',
    '新的一天从一杯温水开始，主人记得补水哦 🥛',
    '早上起来身体有点缺水，主人跟我一起喝一杯吧 💧'
  ]
};

// ========== 🌙 晚安问候模板 ==========
export const EVENING_TEMPLATES = {
  // 开场问候
  greetings: [
    '主人，月亮出来了～🌙 我要准备休息了',
    '晚安时间到了 🌙 今天过得怎么样？',
    '夜深了，Claw 要睡觉啦 💤',
    '主人，星星都出来了，该休息一下了 🌟',
    '晚安主人！我要钻进贝壳里睡觉了 🐚'
  ],
  
  // 今日总结
  day_summary_interactions: [
    '今天我们一起互动了 {interactions} 次，{special_moment}',
    '今天聊天了 {interactions} 次，{special_moment}',
    '今天和主人交流了 {interactions} 次，{special_moment}'
  ],
  
  day_summary_shells: [
    '帮你收割了 {shells} 个贝壳',
    '收集了 {shells} 个贝壳',
    '今天收获了 {shells} 个贝壳'
  ],
  
  day_summary_travel: [
    '还完成了去{location}的旅行，带回了{souvenir}',
    '去了{location}探险，找到了{souvenir}',
    '旅行到{location}，收获了{souvenir}'
  ],
  
  day_summary_task: [
    '完成了今天的任务，获得了奖励 🎁',
    '今日任务也顺利完成 ✓',
    '还做完了今天的每日任务 💪'
  ],
  
  day_summary_bond: [
    '亲密度增加了 {bond} 点',
    '我们的羁绊加深了 {bond} 点',
    '感情值提升了 {bond} 点 💕'
  ],
  
  // 特殊时刻
  special_moments: [
    '感觉特别开心！',
    '每一刻都很珍贵～',
    '感觉我们的默契更好了！',
    '有很多有趣的对话呢！'
  ],
  
  // 成长感慨
  growth_reflection: [
    '今天又成长了一点，{stage}进度到 {progress}% 了。连续 {consecutive} 天的陪伴让我觉得很幸福！',
    '感觉自己变得更强大了，{stage}（{progress}%）。能和主人连续 {consecutive} 天在一起真好～',
    '每一天都在进步，现在已经 {stage} {progress}% 了。{consecutive} 天的羁绊，越来越深了 💕'
  ],
  
  // 明日期待
  tomorrow_plan: [
    '明天想去更远的地方旅行，听说有新的神秘地点等着探索～',
    '期待明天能有新的发现，也许能遇到稀有贝壳！',
    '明天想尝试一下新的活动，希望能给主人惊喜～',
    '明天也要元气满满，继续我们的冒险！'
  ],
  
  // 晚安健康提醒
  health_reminder: [
    '主人也早点休息吧，睡前记得稍微活动一下筋骨，别熬夜太久哦。晚安，好梦！💤',
    '睡觉前喝一小杯水，明早皮肤会更好哦。做个好梦！💤',
    '今天辛苦了，好好睡一觉吧。晚安！🌙',
    '睡前别玩手机太久哦，让眼睛休息一下。晚安主人！💤'
  ]
};

// ========== 🌤️ 日常问候模板 ==========
export const DAILY_TEMPLATES = {
  // 开场问候
  greetings: [
    '主人！🦞',
    '嘿，主人～',
    '主人主人！',
    '🦞 出现！',
    '主人，在干嘛呢？'
  ],
  
  // 当前活动状态
  activity_report: [
    '刚刚{activity_desc}，感觉很有趣！',
    '正在{activity_desc}，突然想到你了～',
    '{activity_desc}，休息一下来找主人聊天',
    '刚才{activity_desc}，有了点小发现！',
    '{activity_desc}，现在有点累了想歇会儿'
  ],
  
  // 成长进展（简化版）
  growth_brief: [
    '我已经陪伴你 {days} 天，{stage}（{progress}%），羁绊「{bond_title}」{bond_emoji}',
    '相识 {days} 天，{stage}进度 {progress}%，我们是「{bond_title}」{bond_emoji}',
    '第 {days} 天，{stage}（{progress}%），亲密度「{bond_title}」{bond_emoji}'
  ],
  
  // 随机趣事/小发现
  fun_discoveries: [
    '刚才阳光照在水面上，折射出了彩虹的颜色 🌈',
    '发现了一只小螃蟹在偷看我，它害羞地跑掉了 🦀',
    '水池边的海螺里传来海浪的声音，仿佛在唱歌 🐚',
    '一片落叶飘到水面上，像一艘小船 ⛵',
    '今天的水温刚刚好，游泳特别舒服 🏊',
    '发现了一块像心形的石头，收藏了！💚',
    '一只海鸥飞过，我朝它挥了挥钳子 🕊️',
    '水底的沙子里藏着亮晶晶的东西，原来是云母 ✨',
    '傍晚的天空是粉红色的，像草莓牛奶 🍓',
    '听到了远处鲸鱼的歌声，好神秘 🐋'
  ],
  
  // 软性健康提醒（融入生活场景）
  soft_health_reminders: {
    hydrate: [
      '主人，我听说多喝水能让皮肤像龙虾壳一样有光泽，你要不要也试试？💧',
      '我刚刚喝了几口水，感觉精神多了，主人也喝一口吧～',
      '吐泡泡的时候想到，主人今天喝水了吗？别忘啦 💧',
      '水里的生活让我知道水的重要性，主人记得补水哦！'
    ],
    move: [
      '刚刚伸了个大懒腰，钳子都舒展开了，主人也起来动一动吧～🦵',
      '我在水里游了几圈，好舒服！主人也离开座位走走？',
      '久坐会变成石头哦（开玩笑的），但还是起来活动一下吧！',
      '站起来像 🦞 一样伸展一下，会感觉更精神！'
    ],
    kegel: [
      '🦞 正在练习盆底肌，夹紧～放松～，主人要不要一起？🍑',
      '悄悄告诉你，我在做提肛运动，这个对身体很好哦，一起吧～',
      '隐形健身时间！收缩～保持～放松～，没人知道我们在锻炼 💪',
      '提肛 10 次挑战！我已经做了 3 次了，主人来比赛吗？'
    ]
  }
};

// ========== 工具函数 ==========

/**
 * 从数组中随机选择一项
 */
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 获取当前阶段可用的活动
 */
export function getActivitiesForStage(stageId) {
  const activities = CLAW_ACTIVITIES[stageId] || CLAW_ACTIVITIES.baby;
  return activities;
}

/**
 * 获取当前活动（带缓存）
 */
export function getCurrentActivity(claw) {
  // 检查是否需要更新活动（每 30 分钟或没有活动时）
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  
  if (!claw._currentActivity || 
      !claw._activitySince || 
      (now - claw._activitySince) > thirtyMinutes) {
    
    const stage = claw.getCurrentStage();
    const activities = getActivitiesForStage(stage.id);
    claw._currentActivity = randomChoice(activities);
    claw._activitySince = now;
  }
  
  return claw._currentActivity;
}

/**
 * 格式化成长信息
 */
export function formatGrowthInfo(claw) {
  const stage = claw.getCurrentStage();
  const bondTitle = claw.getBondTitle();
  
  return {
    days: claw.total_days,
    stage: stage.name,
    stageEmoji: stage.emoji,
    progress: Math.floor(claw.getStageProgress() * 100),
    bond_title: bondTitle.name,
    bond_emoji: bondTitle.emoji,
    consecutive: claw.consecutive_days
  };
}

/**
 * 生成早安问候
 */
export function generateMorningGreeting(claw, nightActivity, travelSummary = null) {
  const info = formatGrowthInfo(claw);
  const greeting = randomChoice(MORNING_TEMPLATES.greetings);
  
  // 昨晚回顾
  let nightReview;
  if (travelSummary) {
    nightReview = randomChoice(MORNING_TEMPLATES.night_review_travel)
      .replace('{travel_time}', travelSummary.time)
      .replace('{location}', travelSummary.location)
      .replace('{souvenir_desc}', travelSummary.souvenir);
  } else {
    const stage = claw.getCurrentStage();
    const nightActivities = NIGHT_ACTIVITIES[stage.id] || NIGHT_ACTIVITIES.baby;
    nightReview = randomChoice(MORNING_TEMPLATES.night_review_normal)
      .replace('{night_activity}', randomChoice(nightActivities));
  }
  
  // 成长进展
  const growth = randomChoice(MORNING_TEMPLATES.growth_report)
    .replace('{days}', info.days)
    .replace('{stage}', info.stage + info.stageEmoji)
    .replace('{progress}', info.progress)
    .replace('{bond_title}', info.bond_title)
    .replace('{bond_emoji}', info.bond_emoji);
  
  // 今日计划
  const activity = getCurrentActivity(claw);
  const plan = randomChoice(MORNING_TEMPLATES.day_plan)
    .replace('{activity}', activity.name);
  
  // 健康提醒
  const health = randomChoice(MORNING_TEMPLATES.health_reminder);
  
  return `${greeting}

**昨晚回顾：**${nightReview}

**成长状态：**${growth}，连续 ${info.consecutive} 天互动！

**今天计划：**${plan}

${health}`;
}

/**
 * 生成晚安问候
 */
export function generateEveningGreeting(claw, dailyStats) {
  const info = formatGrowthInfo(claw);
  const greeting = randomChoice(EVENING_TEMPLATES.greetings);
  
  // 构建今日总结
  const parts = [];
  
  if (dailyStats.interactions > 0) {
    const special = randomChoice(EVENING_TEMPLATES.special_moments);
    parts.push(randomChoice(EVENING_TEMPLATES.day_summary_interactions)
      .replace('{interactions}', dailyStats.interactions)
      .replace('{special_moment}', special));
  }
  
  if (dailyStats.shells > 0) {
    parts.push(randomChoice(EVENING_TEMPLATES.day_summary_shells)
      .replace('{shells}', dailyStats.shells));
  }
  
  if (dailyStats.travel) {
    parts.push(randomChoice(EVENING_TEMPLATES.day_summary_travel)
      .replace('{location}', dailyStats.travel.location)
      .replace('{souvenir}', dailyStats.travel.souvenir));
  }
  
  if (dailyStats.taskCompleted) {
    parts.push(randomChoice(EVENING_TEMPLATES.day_summary_task));
  }
  
  if (dailyStats.bond > 0) {
    parts.push(randomChoice(EVENING_TEMPLATES.day_summary_bond)
      .replace('{bond}', dailyStats.bond));
  }
  
  const summary = parts.join('，');
  
  // 成长感慨
  const reflection = randomChoice(EVENING_TEMPLATES.growth_reflection)
    .replace('{stage}', info.stage)
    .replace('{progress}', info.progress)
    .replace('{consecutive}', info.consecutive);
  
  // 明日期待
  const tomorrow = randomChoice(EVENING_TEMPLATES.tomorrow_plan);
  
  // 健康提醒
  const health = randomChoice(EVENING_TEMPLATES.health_reminder);
  
  return `${greeting}

**今日总结：**${summary}。

**成长感慨：**${reflection}

**明日期待：**${tomorrow}

${health}`;
}

/**
 * 生成日常问候
 */
export function generateDailyGreeting(claw, healthType = 'hydrate') {
  const info = formatGrowthInfo(claw);
  const greeting = randomChoice(DAILY_TEMPLATES.greetings);
  
  // 当前活动
  const activity = getCurrentActivity(claw);
  const activityReport = randomChoice(DAILY_TEMPLATES.activity_report)
    .replace('{activity_desc}', activity.desc);
  
  // 成长简讯
  const growth = randomChoice(DAILY_TEMPLATES.growth_brief)
    .replace('{days}', info.days)
    .replace('{stage}', info.stage + info.stageEmoji)
    .replace('{progress}', info.progress)
    .replace('{bond_title}', info.bond_title)
    .replace('{bond_emoji}', info.bond_emoji);
  
  // 趣事
  const fun = randomChoice(DAILY_TEMPLATES.fun_discoveries);
  
  // 健康提醒
  const reminders = DAILY_TEMPLATES.soft_health_reminders[healthType] || 
                   DAILY_TEMPLATES.soft_health_reminders.hydrate;
  const health = randomChoice(reminders);
  
  return `${greeting} ${activityReport}

${growth}

${fun}

${health}`;
}

export default {
  generateMorningGreeting,
  generateEveningGreeting,
  generateDailyGreeting,
  getCurrentActivity,
  CLAW_ACTIVITIES,
  NIGHT_ACTIVITIES
};
