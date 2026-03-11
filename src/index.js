/**
 * 🦞 TravelClaw - OpenClaw Skill 主入口
 * 
 * 处理来自 OpenClaw 的消息和指令
 */

import { GameEngine, CLAW_STATE } from './core/GameEngine.js';
import { StateManager } from './storage/StateManager.js';
import { ImageClient } from './image/ImageClient.js';

// 环境变量
const IMAGE_API_KEY = process.env.IMAGE_API_KEY;
const IMAGE_API_BASE = process.env.IMAGE_API_BASE;
const IMAGE_API_MODEL = process.env.IMAGE_API_MODEL;
const DATA_PATH = process.env.TRAVELCLAW_DATA_PATH;

class TravelClawSkill {
  constructor() {
    this.storage = new StateManager(DATA_PATH);
    
    // 初始化图片客户端（支持多平台）
    this.imageClient = null;
    if (IMAGE_API_KEY) {
      this.imageClient = new ImageClient({
        apiKey: IMAGE_API_KEY,
        baseUrl: IMAGE_API_BASE,
        model: IMAGE_API_MODEL
      });
    }
    
    this.engines = new Map(); // 用户游戏引擎缓存
  }

  /**
   * 获取或创建用户的游戏引擎
   */
  async getEngine(userId) {
    if (!this.engines.has(userId)) {
      const engine = new GameEngine(userId, this.storage);
      await engine.loadGame();
      this.engines.set(userId, engine);
    }
    return this.engines.get(userId);
  }

  /**
   * 主处理函数 - 处理用户消息
   */
  async handleMessage(userId, message) {
    const engine = await this.getEngine(userId);
    
    // 学习玩家偏好
    await engine.handleMessage(message);

    // 解析指令
    const command = this.parseCommand(message);
    
    if (command) {
      return await this.executeCommand(engine, command);
    }

    // 自然语言交互
    return await this.handleNaturalLanguage(engine, message);
  }

  /**
   * 解析指令
   */
  parseCommand(message) {
    const lowerMsg = message.toLowerCase().trim();

    // 状态指令
    if (/^(状态|status|🦞 呢|🦞 在哪)/.test(lowerMsg)) {
      return { type: 'status' };
    }

    // 收割贝壳
    if (/^(收割|collect|收获|捡贝壳)/.test(lowerMsg)) {
      return { type: 'collect' };
    }

    // 商店
    if (/^(商店|shop|商店|购买|买东西)/.test(lowerMsg)) {
      if (/购买/.test(message)) {
        const itemMatch = message.match(/购买\s*(.+)/);
        if (itemMatch) {
          return { type: 'buy', itemName: itemMatch[1].trim() };
        }
      }
      return { type: 'shop' };
    }

    // 行囊
    if (/^(行囊|pack|背包|行李)/.test(lowerMsg)) {
      if (/放入|添加/.test(message)) {
        const itemMatch = message.match(/(放入|添加)\s*(.+)/);
        if (itemMatch) {
          return { type: 'pack_add', itemName: itemMatch[2].trim() };
        }
      }
      if (/取出|移除/.test(message)) {
        const indexMatch = message.match(/(取出|移除)\s*(\d+)/);
        if (indexMatch) {
          return { type: 'pack_remove', index: parseInt(indexMatch[2]) - 1 };
        }
      }
      return { type: 'pack_list' };
    }

    // 出发
    if (/^(出发|旅行|go|去旅行|开始旅行)/.test(lowerMsg)) {
      return { type: 'travel' };
    }

    // 图鉴
    if (/^(图鉴|album|收藏|收集)/.test(lowerMsg)) {
      return { type: 'album' };
    }

    // 家园
    if (/^(家园|home|家|小窝)/.test(lowerMsg)) {
      if (/装饰|放置|放/.test(message)) {
        const itemMatch = message.match(/(装饰|放置|放)\s*(.+)/);
        if (itemMatch) {
          return { type: 'decorate', itemName: itemMatch[2].trim() };
        }
      }
      return { type: 'home' };
    }

    // 拍照/自拍
    if (/^(拍照|pic|自拍|照片|picture)/.test(lowerMsg)) {
      return { type: 'selfie' };
    }

    // 帮助
    if (/^(帮助|help|指令|怎么用|指南)/.test(lowerMsg)) {
      return { type: 'help' };
    }

    return null;
  }

  /**
   * 执行指令
   */
  async executeCommand(engine, command) {
    switch (command.type) {
      case 'status':
        return this.formatStatus(await engine.getStatus());

      case 'collect':
        return this.formatCollectResult(await engine.collectShells());

      case 'shop':
        return this.formatShop(await engine.getShop());

      case 'buy':
        // TODO: 实现从名称到 ID 的映射
        return { text: '购买功能开发中...' };

      case 'pack_list':
        return this.formatBackpack(await engine.manageBackpack('list'));

      case 'pack_add':
      case 'pack_remove':
        // TODO: 实现行囊管理
        return { text: '行囊管理开发中...' };

      case 'travel':
        return this.formatTravelResult(await engine.startTravel());

      case 'album':
        return this.formatAlbum(await engine.getAlbum());

      case 'home':
        return this.formatHome(await engine.getHome());

      case 'decorate':
        // TODO: 实现装饰
        return { text: '装饰功能开发中...' };

      case 'selfie':
        return await this.generateSelfie(engine);

      case 'help':
        return this.formatHelp();

      default:
        return { text: '不太明白你的意思，发送"帮助"查看指令列表 🦞' };
    }
  }

  /**
   * 处理自然语言
   */
  async handleNaturalLanguage(engine, message) {
    // 简单的情感回应
    const lowerMsg = message.toLowerCase();

    if (/可爱|萌|喜欢/.test(lowerMsg)) {
      return { text: '🦞 听到你的夸奖，开心地挥舞钳子！' };
    }

    if (/回来|回家/.test(lowerMsg)) {
      const status = engine.getStatus();
      if (status.state === CLAW_STATE.TRAVELING) {
        return { 
          text: `🦞 还在旅行中呢，预计 ${this.formatTime(status.progress)}% 后回来~` 
        };
      }
      return { text: '🦞 已经在家啦！' };
    }

    if (/饿|吃|食物/.test(lowerMsg)) {
      return { text: '🦞 的背包里有食物的话，下次旅行会记得吃的！' };
    }

    return { text: '🦞 歪着头看着你，似乎在思考你说的话...' };
  }

  /**
   * 生成自拍
   */
  async generateSelfie(engine) {
    if (!this.imageClient) {
      return { 
        text: '抱歉，生图功能需要配置 IMAGE_API_KEY 才能使用 🦞\n支持: PackyAPI、Gemini、OpenAI、Stability AI 等' 
      };
    }

    const status = engine.getStatus();
    if (status.state === CLAW_STATE.TRAVELING) {
      return { text: '🦞 正在旅行中，无法自拍，等它回来吧！' };
    }

    try {
      const home = await engine.getHome();
      const imageResult = await this.imageClient.generateSelfie(
        engine.claw,
        home.decorations
      );

      return {
        text: '🦞 拍了一张自拍！',
        image: {
          data: imageResult.imageData,
          mimeType: imageResult.mimeType
        }
      };
    } catch (error) {
      console.error('Error generating selfie:', error);
      return { text: '生成图片时出错了，请稍后再试 🦞' };
    }
  }

  // ========== 格式化输出 ==========

  formatStatus(status) {
    const lines = [
      `${status.claw.stage.emoji} ${status.claw.stage.name} (${status.claw.stage.progress}%)`,
      status.message,
      ``,
      `🏠 状态: ${this.getStateText(status.state)}`,
      `🐚 贝壳: ${status.shells}`,
      `📊 天数: ${status.claw.age_days} 天`,
      `✨ 性格: ${status.claw.personality}`
    ];

    if (status.state === CLAW_STATE.TRAVELING && status.progress !== null) {
      lines.push(`🗺️ 旅行进度: ${status.progress}%`);
    }

    return { text: lines.join('\n') };
  }

  formatCollectResult(result) {
    if (!result.success) {
      return { text: result.message };
    }

    return {
      text: `${result.message}\n\n💰 当前共有 ${result.total_shells} 个贝壳`
    };
  }

  formatShop(shop) {
    const lines = [
      '🏪 欢迎使用 🦞 商店！',
      `💰 当前贝壳: ${shop.shells}`,
      '',
      '🍽️ 食物:'
    ];

    shop.items
      .filter(i => i.type === 'food')
      .forEach(item => {
        lines.push(`  ${item.emoji} ${item.name} - ${item.price}🐚`);
      });

    lines.push('', '🎒 装备:');
    shop.items
      .filter(i => i.type === 'gear')
      .forEach(item => {
        lines.push(`  ${item.emoji} ${item.name} - ${item.price}🐚`);
      });

    lines.push('', '🏠 装饰:');
    shop.items
      .filter(i => i.type === 'decoration')
      .forEach(item => {
        lines.push(`  ${item.emoji} ${item.name} - ${item.price}🐚`);
      });

    lines.push('', '💡 发送 "购买 [物品名]" 购买');

    return { text: lines.join('\n') };
  }

  formatBackpack(backpackData) {
    if (!backpackData.success) {
      return { text: backpackData.message };
    }

    const lines = [
      `🎒 行囊 (${backpackData.used}/${backpackData.capacity})`,
      ''
    ];

    if (backpackData.backpack.length === 0) {
      lines.push('行囊是空的，去商店买些东西吧！');
    } else {
      backpackData.backpack.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.emoji} ${item.name}`);
      });
    }

    return { text: lines.join('\n') };
  }

  formatTravelResult(result) {
    if (!result.success) {
      return { text: result.message };
    }

    return {
      text: `${result.message}\n\n🗺️ 目的地: ${result.destination}\n⏱️ 预计时长: ${this.formatDuration(result.duration)}\n📅 预计返回: ${new Date(result.expected_return).toLocaleString()}`
    };
  }

  formatAlbum(album) {
    const lines = [
      '📚 🦞 的收藏图鉴',
      '',
      `🎯 收集进度: ${album.progress.collected}/${album.progress.total} (${album.progress.percentage}%)`,
      ''
    ];

    if (album.souvenirs.length === 0) {
      lines.push('还没有收集到特产，让 🦞 去旅行吧！');
    } else {
      lines.push('🎁 已收集的特产:');
      album.souvenirs.forEach(s => {
        const rarityEmoji = { common: '⚪', uncommon: '🟢', rare: '🔵', legendary: '🟠' }[s.rarity];
        lines.push(`  ${rarityEmoji} ${s.emoji} ${s.name} x${s.count}`);
      });
    }

    return { text: lines.join('\n') };
  }

  formatHome(home) {
    const lines = [
      '🏠 🦞 的小窝',
      ''
    ];

    if (home.decorations.length === 0) {
      lines.push('小窝还是空荡荡的，买些装饰品吧！');
    } else {
      lines.push('当前装饰:');
      home.decorations.forEach(d => {
        lines.push(`  ${d.emoji} ${d.name} (${d.position})`);
      });
    }

    lines.push('', `🦞 状态: ${this.getStateText(home.claw_state)}`);

    return { text: lines.join('\n') };
  }

  formatHelp() {
    return {
      text: `🦞 TravelClaw 指令指南

📱 基础指令:
  状态 - 查看 🦞 当前状态
  收割 - 收取家园产出的贝壳
  商店 - 打开道具商店
  行囊 - 查看/管理行囊
  出发 - 让 🦞 开始旅行

📸 其他功能:
  图鉴 - 查看收集成就
  家园 - 查看/装饰小窝
  拍照 - 让 🦞 自拍
  帮助 - 显示本指南

💡 小贴士:
  • 给 🦞 准备好食物和装备再出发
  • 🦞 会根据自己的想法旅行，耐心等待明信片
  • 多和 🦞 互动，它会学习你的偏好！

愿你的 🦞 旅途愉快！`
    };
  }

  // ========== 辅助方法 ==========

  getStateText(state) {
    const stateMap = {
      [CLAW_STATE.AT_HOME]: '在家',
      [CLAW_STATE.PREPARING]: '准备中',
      [CLAW_STATE.TRAVELING]: '旅行中',
      [CLAW_STATE.RESTING]: '休息中'
    };
    return stateMap[state] || state;
  }

  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} 分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} 小时`;
    }
    return `${hours} 小时 ${mins} 分钟`;
  }

  formatTime(progress) {
    return progress || 0;
  }
}

// 导出 Skill 实例
const skill = new TravelClawSkill();

// OpenClaw Skill 接口
export async function handleMessage(userId, message) {
  return await skill.handleMessage(userId, message);
}

export default skill;
