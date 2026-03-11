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
  COLLECT_MESSAGES
} from '../content/dialogues.js';
import { getItem } from '../content/items.js';

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
      await this.saveGame();
    }
  }

  // 保存游戏数据
  async saveGame() {
    await this.storage.save(this.userId, {
      claw: this.claw.toJSON(),
      inventory: this.inventory.toJSON(),
      gameState: this.gameState
    });
  }

  // ========== 核心游戏循环 ==========

  // 获取当前状态
  getStatus() {
    this.claw.updateDays();
    
    // 检查是否需要更新旅行状态
    this.updateTravelState();
    
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

    return {
      claw: clawStatus,
      state,
      message,
      shells: this.inventory.getShells(),
      location: this.gameState.current_location,
      progress: this.calculateTravelProgress()
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
  collectShells() {
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
    this.saveGame();

    let messageKey = 'few';
    if (total >= 10) messageKey = 'many';
    else if (total >= 5) messageKey = 'normal';

    return {
      success: true,
      message: randomMessage(COLLECT_MESSAGES[messageKey], { count: total }),
      shells: total,
      total_shells: this.inventory.getShells()
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

  // 处理玩家消息（学习性格）
  async handleMessage(message) {
    this.claw.learnFromInteraction(message);
    await this.saveGame();
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
    const { getShopItems } = await import('../content/items.js');
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
