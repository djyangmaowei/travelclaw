/**
 * 🎮 TravelClaw 游戏引擎
 * 
 * 核心游戏逻辑控制器
 */

import { Claw } from './Claw.js';
import { Inventory } from './Inventory.js';
import { getLocation, getLocationsForStage } from '../content/locations.js';
import { 
  randomMessage, 
  STATUS_MESSAGES, 
  DEPARTURE_MESSAGES,
  POSTCARD_MESSAGES,
  SOUVENIR_MESSAGES,
  COLLECT_MESSAGES,
  DROP_MESSAGES,
  TASK_MESSAGES,
  EVENT_MESSAGES,
  MILESTONE_MESSAGES
} from '../content/dialogues.js';
import { getItem, getShopItems } from '../content/items.js';
import { 
  rollDrop, 
  openBox, 
  getMilestoneReward, 
  generateDailyTask, 
  triggerRandomEvent,
  calculateLuckModifier,
  SPECIAL_DROPS 
} from './Rewards.js';
import {
  checkGreeting,
  generateGreeting,
  getNextGreetingTime,
  getTodayGreetingStats,
  updateDailyStats,
  shouldRemind,
  getCurrentTimeSlot,
  REMINDER_TYPES
} from './HealthReminder.js';

// 🦞 状态枚举
export const CLAW_STATE = {
  AT_HOME: 'at_home',
  PREPARING: 'preparing',
  TRAVELING: 'traveling',
  RESTING: 'resting'
};

export class GameEngine {
  constructor(userId, storage) {
    this.userId = userId;
    this.storage = storage;
    
    // 加载或创建数据
    this.claw = null;
    this.inventory = null;
    this.gameState = null;
    
    this.loadGame();
  }

  // 加载游戏数据
  async loadGame() {
    const data = await this.storage.load(this.userId);
    
    if (data) {
      this.claw = Claw.fromJSON(data.claw);
      this.inventory = Inventory.fromJSON(data.inventory);
      this.gameState = data.gameState;
      this.dailyTask = data.dailyTask || null;
      this.taskProgress = data.taskProgress || {};
      this.specialItems = data.specialItems || {}; // 特殊道具存储
      this.healthStats = data.healthStats || { reminders: 0, water: 0, lastDate: null };
      this.healthSettings = data.healthSettings || { disabled: false, silentMode: false, silentUntil: null };
    } else {
      // 新游戏
      this.claw = new Claw(this.userId);
      this.inventory = new Inventory(this.userId);
      this.gameState = {
        state: CLAW_STATE.AT_HOME,
        travel_start: null,
        travel_end: null,
        current_location: null,
        last_shell_collection: new Date().toISOString(),
        pending_shells: 0
      };
      this.dailyTask = null;
      this.taskProgress = {};
      this.specialItems = {};
      this.healthStats = { reminders: 0, water: 0, lastDate: null };
      this.healthSettings = { disabled: false, silentMode: false, silentUntil: null };
      await this.saveGame();
    }
    
    // 检查并生成每日任务
    this.checkDailyTask();
    
    // 检查健康提醒日期，跨天重置统计
    this.checkHealthStatsDate();
  }

  // 保存游戏数据
  async saveGame() {
    await this.storage.save(this.userId, {
      claw: this.claw.toJSON(),
      inventory: this.inventory.toJSON(),
      gameState: this.gameState,
      dailyTask: this.dailyTask,
      taskProgress: this.taskProgress,
      specialItems: this.specialItems,
      healthStats: this.healthStats,
      healthSettings: this.healthSettings
    });
  }
  
  // ========== ⏰ Claw 主动问候系统 ==========
  
  // 检查是否需要发送问候（主入口）
  checkGreeting() {
    // 检查设置
    if (!shouldRemind(this.healthSettings)) {
      return null;
    }
    
    // 检查问候调度
    const greetingInfo = checkGreeting(this.claw);
    if (!greetingInfo) {
      return null;
    }
    
    // 准备上下文
    const context = {};
    
    // 早安：准备昨晚回顾
    if (greetingInfo.type === REMINDER_TYPES.MORNING) {
      if (this.claw.lastTravelSummary) {
        const travelTime = new Date(this.claw.lastTravelSummary.timestamp);
        const hour = travelTime.getHours();
        const timeDesc = hour >= 22 ? '深夜' : hour >= 18 ? '傍晚' : '下午';
        context.travelSummary = {
          time: timeDesc,
          location: this.claw.lastTravelSummary.location,
          souvenir: this.claw.lastTravelSummary.souvenir
        };
      } else if (this.claw.lastNightActivity) {
        context.nightActivity = this.claw.lastNightActivity;
      }
    }
    
    // 生成问候消息
    const message = generateGreeting(this.claw, greetingInfo.type, context);
    
    // 保存游戏（更新了 greetingSchedule）
    this.saveGame();
    
    return {
      type: greetingInfo.type,
      hour: greetingInfo.hour,
      minute: greetingInfo.minute,
      message,
      isGreeting: true
    };
  }
  
  // 获取下次问候时间
  getNextGreetingTime() {
    return getNextGreetingTime(this.claw);
  }
  
  // 获取今日问候统计
  getTodayGreetingStats() {
    return getTodayGreetingStats(this.claw);
  }
  
  // 获取健康设置（兼容旧版）
  getHealthSettings() {
    const stats = getTodayGreetingStats(this.claw);
    return {
      ...this.healthSettings,
      nextTime: stats.nextTime,
      todayCount: stats.todayCount,
      completed: stats.completed,
      total: stats.total
    };
  }
  
  // 更新健康设置
  async updateHealthSettings(settings) {
    this.healthSettings = { ...this.healthSettings, ...settings };
    await this.saveGame();
    return this.healthSettings;
  }
  
  // 开启静默模式
  async enableSilentMode(minutes = 60) {
    const silentUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    return await this.updateHealthSettings({
      silentMode: true,
      silentUntil
    });
  }
  
  // 关闭静默模式
  async disableSilentMode() {
    return await this.updateHealthSettings({
      silentMode: false,
      silentUntil: null
    });
  }
  
  // 切换提醒开关
  async toggleHealthReminder(enabled) {
    return await this.updateHealthSettings({ disabled: !enabled });
  }
  
  // ========== 🎁 掉落与奖励系统 ==========
  
  // 获取当前幸运加成
  getLuckModifier() {
    return calculateLuckModifier(0, this.claw.bond_level);
  }
  
  // 💝 处理掉落
  async processDrop(activity, context = {}) {
    const luckModifier = this.getLuckModifier();
    const drop = rollDrop(activity, luckModifier);
    
    if (drop) {
      // 添加到特殊物品库存
      this.specialItems[drop.id] = (this.specialItems[drop.id] || 0) + 1;
      await this.saveGame();
      
      return {
        dropped: true,
        item: drop,
        message: randomMessage(DROP_MESSAGES[drop.rarity] || DROP_MESSAGES.common, {
          item: `${drop.emoji} ${drop.name}`
        })
      };
    }
    
    return { dropped: false };
  }
  
  // 📦 开启宝箱
  async openBox(boxType) {
    const boxItemId = boxType === 'small' ? 'mystery_box' : 
                      boxType === 'golden' ? 'golden_shell' : 'mystery_box';
    
    if (!this.specialItems[boxItemId] || this.specialItems[boxItemId] <= 0) {
      return { success: false, message: '你没有这个宝箱 📦' };
    }
    
    // 消耗宝箱
    this.specialItems[boxItemId]--;
    if (this.specialItems[boxItemId] === 0) {
      delete this.specialItems[boxItemId];
    }
    
    // 开箱
    const luckModifier = this.getLuckModifier();
    const result = openBox(boxType, luckModifier);
    
    // 发放奖励
    this.inventory.addShells(result.shells);
    
    for (const item of result.items) {
      if (item.type === 'special') {
        this.specialItems[item.id] = (this.specialItems[item.id] || 0) + 1;
      } else {
        this.inventory.items[item.id] = (this.inventory.items[item.id] || 0) + 1;
      }
    }
    
    await this.saveGame();
    
    return {
      success: true,
      box_name: result.box_name,
      shells: result.shells,
      items: result.items
    };
  }
  
  // 🏆 检查里程碑奖励
  checkMilestones() {
    const newMilestones = this.claw.checkMilestones();
    const rewards = [];
    
    for (const milestone of newMilestones) {
      const reward = getMilestoneReward(milestone, this.claw.getCurrentStage().id);
      this.inventory.addShells(reward.shells);
      
      if (reward.item) {
        this.specialItems[reward.item.id] = (this.specialItems[reward.item.id] || 0) + 1;
      }
      
      rewards.push({
        milestone,
        shells: reward.shells,
        item: reward.item
      });
    }
    
    if (rewards.length > 0) {
      this.saveGame();
    }
    
    return rewards;
  }
  
  // 📋 每日任务系统
  checkDailyTask() {
    const today = new Date().toDateString();
    
    // 如果没有任务或不是今天的任务，生成新任务
    if (!this.dailyTask || this.dailyTask.date !== today) {
      this.dailyTask = {
        ...generateDailyTask(),
        date: today,
        completed: false,
        progress: 0
      };
      this.taskProgress = {};
    }
  }
  
  getDailyTask() {
    this.checkDailyTask();
    return {
      ...this.dailyTask,
      remaining: Math.max(0, this.dailyTask.target - this.dailyTask.progress)
    };
  }
  
  // 更新任务进度
  async updateTaskProgress(taskId, amount = 1) {
    if (!this.dailyTask || this.dailyTask.completed || this.dailyTask.id !== taskId) {
      return null;
    }
    
    this.dailyTask.progress += amount;
    
    // 检查是否完成
    if (this.dailyTask.progress >= this.dailyTask.target && !this.dailyTask.completed) {
      this.dailyTask.completed = true;
      
      // 发放奖励
      if (this.dailyTask.reward.shells) {
        this.inventory.addShells(this.dailyTask.reward.shells);
      }
      
      if (this.dailyTask.reward.item) {
        const item = SPECIAL_DROPS[this.dailyTask.reward.item];
        if (item) {
          this.specialItems[item.id] = (this.specialItems[item.id] || 0) + 1;
        }
      }
      
      // 增加亲密度
      this.claw.addBond(5);
      
      // 📝 更新每日统计
      updateDailyStats(this.claw, 'task');
      updateDailyStats(this.claw, 'bond', 5);
      
      await this.saveGame();
      
      return {
        completed: true,
        reward: this.dailyTask.reward
      };
    }
    
    await this.saveGame();
    return { completed: false, progress: this.dailyTask.progress };
  }
  
  // 🎲 触发随机事件
  triggerEvent() {
    const event = triggerRandomEvent(this.gameState.state);
    
    if (event) {
      // 应用事件奖励
      if (event.reward.shells) {
        this.inventory.addShells(event.reward.shells);
      }
      if (event.reward.bond) {
        this.claw.addBond(event.reward.bond);
      }
      if (event.reward.item) {
        const item = SPECIAL_DROPS[event.reward.item];
        if (item) {
          this.specialItems[item.id] = (this.specialItems[item.id] || 0) + 1;
        }
      }
      
      this.saveGame();
      
      return {
        triggered: true,
        event,
        message: randomMessage(EVENT_MESSAGES[event.id] || [event.message])
      };
    }
    
    return { triggered: false };
  }
  
  // 获取特殊物品列表
  getSpecialItems() {
    return Object.entries(this.specialItems).map(([id, count]) => ({
      ...SPECIAL_DROPS[id],
      count
    })).filter(item => item.id);
  }
  
  // 💎 使用特殊物品
  async useSpecialItem(itemId) {
    const item = SPECIAL_DROPS[itemId];
    
    if (!item || !this.specialItems[itemId] || this.specialItems[itemId] <= 0) {
      return { success: false, message: '你没有这个物品' };
    }
    
    // 消耗物品
    this.specialItems[itemId]--;
    if (this.specialItems[itemId] === 0) {
      delete this.specialItems[itemId];
    }
    
    const effect = item.effect || {};
    const results = [];
    
    // 时间沙砾 - 缩短旅行时间
    if (effect.time_reduce && this.gameState.state === CLAW_STATE.TRAVELING) {
      const currentEnd = new Date(this.gameState.travel_end);
      const newEnd = new Date(currentEnd.getTime() - effect.time_reduce * 60 * 1000);
      this.gameState.travel_end = newEnd.toISOString();
      results.push(`旅行时间缩短了 ${effect.time_reduce} 分钟！`);
    }
    
    // 成长药水
    if (effect.growth_bonus) {
      this.claw.total_days += effect.growth_bonus;
      results.push(`🦞 成长了 ${effect.growth_bonus} 天！`);
    }
    
    // 传送石
    if (effect.instant_return && this.gameState.state === CLAW_STATE.TRAVELING) {
      this.gameState.travel_end = new Date().toISOString();
      results.push('🦞 即将立即返回！');
    }
    
    // 出售物品
    if (effect.sell_price) {
      this.inventory.addShells(effect.sell_price);
      results.push(`出售获得 ${effect.sell_price} 个贝壳！`);
    }
    
    await this.saveGame();
    
    return {
      success: true,
      message: `使用了 ${item.emoji} ${item.name}`,
      effects: results
    };
  }

  // ========== 核心游戏循环 ==========

  // 获取当前状态
  getStatus() {
    this.claw.updateDays();
    
    // 检查是否需要更新旅行状态
    this.updateTravelState();
    
    // 🏆 检查里程碑（在获取状态时顺便检查）
    const newMilestones = this.checkMilestones();
    
    const clawStatus = this.claw.getStatus();
    const state = this.gameState.state;
    
    let message = '';
    switch (state) {
      case CLAW_STATE.AT_HOME:
        message = randomMessage(STATUS_MESSAGES.at_home);
        break;
      case CLAW_STATE.PREPARING:
        message = randomMessage(STATUS_MESSAGES.preparing);
        break;
      case CLAW_STATE.TRAVELING:
        message = randomMessage(STATUS_MESSAGES.traveling);
        break;
      case CLAW_STATE.RESTING:
        message = randomMessage(STATUS_MESSAGES.just_returned);
        break;
    }
    
    // 📋 确保每日任务已生成
    this.checkDailyTask();

    return {
      claw: clawStatus,
      state,
      message,
      shells: this.inventory.getShells(),
      location: this.gameState.current_location,
      progress: this.calculateTravelProgress(),
      bond: {
        level: this.claw.bond_level,
        title: this.claw.getBondTitle(),
        today: this.claw.bond_today,
        consecutive: this.claw.consecutive_days
      },
      dailyTask: this.dailyTask,
      newMilestones,
      luckModifier: this.getLuckModifier()
    };
  }

  // 更新旅行状态（检查是否该回来了）
  updateTravelState() {
    if (this.gameState.state === CLAW_STATE.TRAVELING) {
      const now = new Date();
      const endTime = new Date(this.gameState.travel_end);
      
      if (now >= endTime) {
        // 🦞 回来了！
        this.returnFromTravel();
      }
    }
  }

  // 计算旅行进度
  calculateTravelProgress() {
    if (this.gameState.state !== CLAW_STATE.TRAVELING) {
      return null;
    }
    
    const start = new Date(this.gameState.travel_start);
    const end = new Date(this.gameState.travel_end);
    const now = new Date();
    
    const total = end - start;
    const elapsed = now - start;
    
    return Math.min(Math.floor((elapsed / total) * 100), 100);
  }

  // 收割贝壳
  async collectShells() {
    const now = new Date();
    const lastCollect = new Date(this.gameState.last_shell_collection);
    const hoursPassed = (now - lastCollect) / (1000 * 60 * 60);
    
    // 每小时产出 0-3 个贝壳
    const baseProduction = Math.floor(hoursPassed * 1.5);
    const randomBonus = Math.floor(Math.random() * 3);
    const total = baseProduction + randomBonus;
    
    if (total <= 0) {
      return {
        success: false,
        message: randomMessage(COLLECT_MESSAGES.none),
        shells: 0
      };
    }

    this.inventory.addShells(total);
    this.gameState.last_shell_collection = now.toISOString();
    
    // 🎁 随机掉落
    const drop = await this.processDrop('collect');
    
    // 📋 更新任务进度
    await this.updateTaskProgress('collect_shells', total);
    
    // 📝 更新每日统计
    updateDailyStats(this.claw, 'shells', total);
    
    await this.saveGame();

    let messageKey = 'few';
    if (total >= 10) messageKey = 'many';
    else if (total >= 5) messageKey = 'normal';

    return {
      success: true,
      message: randomMessage(COLLECT_MESSAGES[messageKey], { count: total }),
      shells: total,
      total_shells: this.inventory.getShells(),
      drop: drop.dropped ? drop : null
    };
  }

  // 购买物品
  buyItem(itemId) {
    const result = this.inventory.buyItem(itemId);
    if (result.success) {
      this.saveGame();
    }
    return result;
  }

  // 管理行囊
  manageBackpack(action, itemIdOrIndex) {
    let result;
    
    if (action === 'add') {
      result = this.inventory.addToBackpack(itemIdOrIndex);
    } else if (action === 'remove') {
      result = this.inventory.removeFromBackpack(itemIdOrIndex);
    } else if (action === 'list') {
      return {
        success: true,
        backpack: this.inventory.getBackpack(),
        capacity: 5,
        used: this.inventory.backpack.length
      };
    }

    if (result.success) {
      this.saveGame();
    }
    return result;
  }

  // 🦞 出发旅行！
  async startTravel() {
    if (this.gameState.state !== CLAW_STATE.AT_HOME) {
      return {
        success: false,
        message: '🦞 现在不能出发（可能已经在旅行或休息中）'
      };
    }

    const backpack = this.inventory.getBackpack();
    if (backpack.length === 0) {
      return {
        success: false,
        message: '行囊是空的！给 🦞 准备些食物和装备吧 🎒'
      };
    }

    // 计算旅行参数
    const travelPlan = this.calculateTravelPlan(backpack);
    
    // 设置旅行状态
    const now = new Date();
    const duration = travelPlan.duration * 60 * 1000; // 转为毫秒
    
    this.gameState.state = CLAW_STATE.TRAVELING;
    this.gameState.travel_start = now.toISOString();
    this.gameState.travel_end = new Date(now.getTime() + duration).toISOString();
    this.gameState.current_location = travelPlan.location;
    this.gameState.travel_plan = travelPlan;
    
    // 清空行囊（🦞 带走了）
    this.inventory.clearBackpack();
    
    // 📋 更新任务进度
    await this.updateTaskProgress('send_travel');
    
    await this.saveGame();

    // 返回出发消息
    const stage = this.claw.getCurrentStage();
    return {
      success: true,
      message: randomMessage(DEPARTURE_MESSAGES[stage.id]),
      destination: travelPlan.location_name,
      duration: travelPlan.duration,
      expected_return: this.gameState.travel_end
    };
  }

  // 计算旅行计划
  calculateTravelPlan(backpack) {
    const stage = this.claw.getCurrentStage();
    
    // 根据阶段和行囊决定目的地
    const availableLocations = getLocationsForStage(stage.id);
    const location = availableLocations[Math.floor(Math.random() * availableLocations.length)];
    
    // 计算旅行时间（分钟）
    let duration = 60; // 基础 1 小时
    
    // 食物影响时间
    const foods = backpack.filter(item => item.type === 'food');
    foods.forEach(food => {
      duration *= (food.effect?.duration_mod || 1);
    });
    
    // 装备影响
    const gear = backpack.filter(item => item.type === 'gear');
    gear.forEach(g => {
      duration *= (g.effect?.duration_mod || 1);
    });
    
    // 随机波动
    duration = Math.floor(duration * (0.8 + Math.random() * 0.4));
    
    // 限制最小和最大时间
    duration = Math.max(30, Math.min(duration, 1440)); // 30分钟 - 24小时

    return {
      location: location.id,
      location_name: location.name,
      location_emoji: location.emoji,
      duration,
      backpack,
      luck: this.calculateLuck(backpack)
    };
  }

  // 计算幸运值
  calculateLuck(backpack) {
    let luck = 0;
    
    backpack.forEach(item => {
      if (item.effect?.luck) {
        luck += item.effect.luck;
      }
    });
    
    // 基础幸运 + 随机
    return 0.1 + luck + (Math.random() * 0.1);
  }

  // 🦞 旅行归来
  async returnFromTravel() {
    const plan = this.gameState.travel_plan;
    const location = getLocation(plan.location);
    
    // 生成结果
    const results = {
      postcard: this.generatePostcard(location),
      souvenirs: this.generateSouvenirs(location, plan.luck),
      unlocks: this.checkUnlocks(location)
    };
    
    // 🎁 旅行额外掉落
    const drop = await this.processDrop('travel');
    if (drop.dropped) {
      results.bonus_drop = drop;
    }
    
    // 🏆 检查里程碑
    results.milestones = this.checkMilestones();
    
    // 💕 增加亲密度
    this.claw.addBond(3);

    // 更新状态
    this.gameState.state = CLAW_STATE.RESTING;
    this.gameState.travel_start = null;
    this.gameState.travel_end = null;
    
    // 设置休息时间（30分钟后可以再次出发）
    setTimeout(() => {
      if (this.gameState.state === CLAW_STATE.RESTING) {
        this.gameState.state = CLAW_STATE.AT_HOME;
        this.saveGame();
      }
    }, 30 * 60 * 1000);

    await this.saveGame();

    return results;
  }

  // 生成明信片文案
  generatePostcard(location) {
    const activity = location.activities[Math.floor(Math.random() * location.activities.length)];
    
    return randomMessage(POSTCARD_MESSAGES.discovery, {
      location: `${location.emoji} ${location.name}`,
      activity,
      feature: location.description.substring(0, 20),
      thought: '这里太美了！'
    });
  }

  // 生成带回的特产
  generateSouvenirs(location, luck) {
    const souvenirs = [];
    
    // 基础特产
    if (location.souvenirs && location.souvenirs.length > 0) {
      const baseSouvenir = location.souvenirs[0];
      const result = this.inventory.addSouvenir(baseSouvenir);
      souvenirs.push({
        ...result.souvenir,
        is_new: result.is_new
      });
    }
    
    // 幸运额外获得
    if (Math.random() < luck && location.souvenirs && location.souvenirs.length > 1) {
      const bonusSouvenir = location.souvenirs[1];
      const result = this.inventory.addSouvenir(bonusSouvenir);
      souvenirs.push({
        ...result.souvenir,
        is_new: result.is_new
      });
    }

    return souvenirs;
  }

  // 检查解锁内容
  checkUnlocks(location) {
    const unlocks = [];
    
    // 解锁新地点（随机）
    if (Math.random() < 0.3) {
      // TODO: 实现地点解锁逻辑
    }

    return unlocks;
  }

  // 处理玩家消息（学习性格 + 触发事件）
  async handleMessage(message) {
    this.claw.learnFromInteraction(message);
    
    // 🎲 概率触发随机事件
    const event = this.triggerEvent();
    
    // 📋 更新任务进度
    await this.updateTaskProgress('interact');
    await this.updateTaskProgress('check_status');
    
    // 📝 更新每日统计
    updateDailyStats(this.claw, 'interaction');
    updateDailyStats(this.claw, 'bond', 1); // 互动增加亲密度
    
    await this.saveGame();
    
    return event;
  }

  // 获取图鉴
  getAlbum() {
    return {
      souvenirs: this.inventory.getSouvenirs(),
      progress: this.inventory.getCollectionProgress(),
      unlocked_locations: this.inventory.getUnlockedLocations()
    };
  }

  // 获取商店
  getShop() {
    return {
      items: Object.values(getShopItems()),
      shells: this.inventory.getShells()
    };
  }

  // 装饰家园
  decorateHome(itemId) {
    const result = this.inventory.decorate(itemId);
    if (result.success) {
      this.saveGame();
    }
    return result;
  }

  // 获取家园
  getHome() {
    return {
      decorations: this.inventory.getHomeDecorations(),
      claw_state: this.gameState.state
    };
  }
}
