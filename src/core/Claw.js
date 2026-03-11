/**
 * 🦞 Claw 角色类
 * 
 * 管理 🦞 的状态、成长、个性化
 */

import { detectPersonality, PERSONALITY_KEYWORDS } from '../content/dialogues.js';

// 成长阶段配置
const STAGES = {
  baby: {
    name: '幼虾期',
    emoji: '🦐',
    min_days: 0,
    max_days: 30,
    reference_image: 'baby.png',
    description: '半透明小身体，小钳子',
    travel_range: 'nearby_beach',
    traits_prompt: 'tiny translucent body, small delicate claws, innocent look'
  },
  teen: {
    name: '少年期',
    emoji: '🦞',
    min_days: 30,
    max_days: 90,
    reference_image: 'teen.png',
    description: '颜色变深，钳子变大',
    travel_range: 'nearby_city',
    traits_prompt: 'growing vibrant shell, developing claws, curious expression'
  },
  adult: {
    name: '青年期',
    emoji: '🦞',
    min_days: 90,
    max_days: 180,
    reference_image: 'adult.png',
    description: '鲜艳的橙红色，强壮双钳',
    travel_range: 'domestic',
    traits_prompt: 'bright orange-red shell, strong symmetrical claws, confident posture'
  },
  mature: {
    name: '壮年期',
    emoji: '🦞',
    min_days: 180,
    max_days: 365,
    reference_image: 'mature.png',
    description: '巨大威武的钳子，霸气',
    travel_range: 'international',
    traits_prompt: 'large impressive asymmetrical claws, powerful build, majestic presence'
  },
  king: {
    name: '虾王期',
    emoji: '👑',
    min_days: 365,
    max_days: Infinity,
    reference_image: 'king.png',
    description: '金色纹路，传奇般存在',
    travel_range: 'global_adventure',
    traits_prompt: 'golden intricate patterns on shell, legendary aura, royal bearing, massive ornate claws'
  }
};

export class Claw {
  constructor(userId) {
    this.userId = userId;
    this.birth_date = new Date().toISOString();
    this.total_days = 0;
    this.interaction_count = 0;
    this.traits = []; // 从玩家互动学习的性格特征
    this.personality_scores = {
      cute: 0,
      calm: 0,
      strong: 0,
      curious: 0,
      lazy: 0
    };
  }

  // 获取当前阶段
  getCurrentStage() {
    for (const [stageId, stage] of Object.entries(STAGES)) {
      if (this.total_days >= stage.min_days && this.total_days < stage.max_days) {
        return { id: stageId, ...stage };
      }
    }
    return { id: 'king', ...STAGES.king };
  }

  // 获取阶段进度 (0-1)
  getStageProgress() {
    const stage = this.getCurrentStage();
    const stageDuration = stage.max_days - stage.min_days;
    const currentInStage = this.total_days - stage.min_days;
    return Math.min(currentInStage / stageDuration, 1);
  }

  // 记录玩家互动，学习性格
  learnFromInteraction(message) {
    this.interaction_count++;
    
    const detected = detectPersonality(message);
    
    for (const type of detected) {
      this.personality_scores[type] += 1;
      
      // 更新 traits 列表
      if (!this.traits.includes(type)) {
        this.traits.push(type);
      }
    }
  }

  // 获取主导性格（用于图片生成）
  getDominantTraits() {
    // 按分数排序
    const sorted = Object.entries(this.personality_scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, score]) => score > 0);
    
    if (sorted.length === 0) {
      return ['curious']; // 默认性格
    }
    
    return sorted.slice(0, 2).map(([type]) => type);
  }

  // 构建图片生成用的 personality modifier
  getPersonalityPrompt() {
    const traits = this.getDominantTraits();
    
    if (traits.length === 0) {
      return '';
    }
    
    const modifiers = traits.map(t => PERSONALITY_KEYWORDS[t]?.prompt_modifier || '');
    return modifiers.join(', ');
  }

  // 更新天数（每日调用）
  updateDays() {
    const birthDate = new Date(this.birth_date);
    const now = new Date();
    this.total_days = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
  }

  // 检查是否升级
  checkLevelUp() {
    const currentStage = this.getCurrentStage();
    const progress = this.getStageProgress();
    
    // 如果接近阶段末尾，提示即将升级
    if (progress > 0.9) {
      return {
        will_level_up: true,
        next_stage: this.getNextStage()
      };
    }
    
    return { will_level_up: false };
  }

  // 获取下一阶段
  getNextStage() {
    const current = this.getCurrentStage();
    const stageOrder = ['baby', 'teen', 'adult', 'mature', 'king'];
    const currentIndex = stageOrder.indexOf(current.id);
    
    if (currentIndex < stageOrder.length - 1) {
      const nextId = stageOrder[currentIndex + 1];
      return { id: nextId, ...STAGES[nextId] };
    }
    
    return null;
  }

  // 获取参考图片路径
  getReferenceImagePath() {
    const stage = this.getCurrentStage();
    return `./src/image/assets/${stage.reference_image}`;
  }

  // 获取状态摘要
  getStatus() {
    const stage = this.getCurrentStage();
    const progress = this.getStageProgress();
    const dominantTraits = this.getDominantTraits();
    
    return {
      stage: {
        id: stage.id,
        name: stage.name,
        emoji: stage.emoji,
        description: stage.description,
        progress: Math.floor(progress * 100)
      },
      age_days: this.total_days,
      traits: dominantTraits,
      personality: this.getPersonalityDescription(dominantTraits)
    };
  }

  // 获取性格描述
  getPersonalityDescription(traits) {
    if (traits.length === 0) {
      return '一只充满好奇心的 🦞';
    }
    
    const descriptions = {
      cute: '萌萌的',
      calm: '沉稳的',
      strong: '威武的',
      curious: '爱探险的',
      lazy: '悠闲的'
    };
    
    const desc = traits.map(t => descriptions[t]).join('、');
    return `一只${desc} 🦞`;
  }

  // 序列化
  toJSON() {
    return {
      userId: this.userId,
      birth_date: this.birth_date,
      total_days: this.total_days,
      interaction_count: this.interaction_count,
      traits: this.traits,
      personality_scores: this.personality_scores
    };
  }

  // 反序列化
  static fromJSON(data) {
    const claw = new Claw(data.userId);
    claw.birth_date = data.birth_date;
    claw.total_days = data.total_days;
    claw.interaction_count = data.interaction_count;
    claw.traits = data.traits || [];
    claw.personality_scores = data.personality_scores || {};
    return claw;
  }
}

export { STAGES };
