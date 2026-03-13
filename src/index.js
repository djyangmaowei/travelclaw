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
    this.reminderTimers = new Map(); // 用户提醒定时器
    this.isTestMode = process.env.TRAVELCLAW_TEST_MODE === 'true'; // 测试模式（缩短间隔）
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
  async handleMessage(userId, message, context = {}) {
    const engine = await this.getEngine(userId);
    
    // 检查是否是健康提醒触发的消息
    if (context.isHealthReminder) {
      return this.formatHealthReminder(engine.getHealthReminder(context.isFirstReminder));
    }
    
    // 学习玩家偏好
    await engine.handleMessage(message);

    // 解析指令
    const command = this.parseCommand(message);
    
    if (command) {
      return await this.executeCommand(engine, command, userId);
    }

    // 自然语言交互
    return await this.handleNaturalLanguage(engine, message);
  }
  
  /**
   * ⏰ 启动 Claw 主动问候定时器
   * 
   * 新版机制：9:00-22:00，每小时随机时间点推送一次
   * 以 Claw 主动发消息的形式，包含早安/日常/晚安三种模式
   */
  startHealthReminder(userId) {
    // 如果已有定时器，先清除
    this.stopHealthReminder(userId);
    
    // 每分钟检查一次是否需要发送问候
    const checkInterval = this.isTestMode ? 10 * 1000 : 60 * 1000; // 测试模式10秒，正常1分钟
    
    const timer = setInterval(async () => {
      try {
        const engine = await this.getEngine(userId);
        const settings = engine.getHealthSettings();
        
        // 检查是否应该问候
        if (!settings.disabled) {
          const greeting = engine.checkGreeting();
          if (greeting && this.onHealthReminder) {
            this.onHealthReminder(userId, {
              text: greeting.message,
              isGreeting: true,
              type: greeting.type
            });
          }
        }
      } catch (error) {
        console.error('Greeting check error:', error);
      }
    }, checkInterval);
    
    this.reminderTimers.set(userId, timer);
    
    // 立即检查一次（如果到了该问候的时间）
    return this.getEngine(userId).then(engine => {
      const settings = engine.getHealthSettings();
      if (!settings.disabled) {
        const greeting = engine.checkGreeting();
        if (greeting) {
          return {
            text: greeting.message,
            isGreeting: true,
            type: greeting.type
          };
        }
      }
      return null;
    });
  }
  
  /**
   * ⏰ 停止健康提醒定时器
   */
  stopHealthReminder(userId) {
    const timer = this.reminderTimers.get(userId);
    if (timer) {
      clearInterval(timer);
      this.reminderTimers.delete(userId);
    }
  }
  
  /**
   * 设置健康提醒回调
   */
  setHealthReminderCallback(callback) {
    this.onHealthReminder = callback;
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
    if (/^(商店|shop|商店)/.test(lowerMsg)) {
      return { type: 'shop' };
    }
    
    // 购买
    if (/^(购买|buy)/.test(lowerMsg) || /购买\s*.+/.test(message)) {
      const itemMatch = message.match(/购买\s*(.+)/);
      if (itemMatch) {
        return { type: 'buy', itemName: itemMatch[1].trim() };
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
    
    // 📋 任务指令
    if (/^(任务|task|每日任务|日常)/.test(lowerMsg)) {
      return { type: 'task' };
    }
    
    // 🎁 特殊物品/背包
    if (/^(背包|物品|inventory|道具)/.test(lowerMsg)) {
      return { type: 'inventory' };
    }
    
    // 📦 开启宝箱
    if (/^(开启|打开|开)\s*(宝箱|箱子)/.test(lowerMsg) || /^(开宝箱|开箱)/.test(lowerMsg)) {
      const boxMatch = message.match(/(开启|打开|开)\s*(小宝箱|中宝箱|大宝箱|传说宝箱|宝箱)/);
      const boxType = boxMatch ? 
        (boxMatch[2] === '小宝箱' ? 'small' : 
         boxMatch[2] === '中宝箱' ? 'medium' : 
         boxMatch[2] === '大宝箱' ? 'large' : 
         boxMatch[2] === '传说宝箱' ? 'legendary' : 'small') : 'small';
      return { type: 'open_box', boxType };
    }
    
    // 💎 使用物品
    if (/^(使用|use)\s*(.+)/.test(lowerMsg)) {
      const useMatch = message.match(/使用\s*(.+)/);
      if (useMatch) {
        return { type: 'use_item', itemName: useMatch[1].trim() };
      }
    }
    
    // 💕 亲密度
    if (/^(亲密度|bond|好感|关系)/.test(lowerMsg)) {
      return { type: 'bond' };
    }
    
    // ⏰ 健康提醒
    if (/^(健康|提醒|健康提醒|微习惯|身体燃料)/.test(lowerMsg)) {
      if (/开启|打开|启用|开始/.test(message)) {
        return { type: 'health_enable' };
      }
      if (/关闭|关掉|停止|禁用/.test(message)) {
        return { type: 'health_disable' };
      }
      if (/静默|静音|专注|会议/.test(message)) {
        const minutesMatch = message.match(/(\d+)\s*分钟/);
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 60;
        return { type: 'health_silent', minutes };
      }
      if (/恢复|取消静默/.test(message)) {
        return { type: 'health_unsilent' };
      }
      if (/报告|统计|数据/.test(message)) {
        return { type: 'health_report' };
      }
      return { type: 'health_status' };
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
  async executeCommand(engine, command, userId) {
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
        
      case 'task':
        return this.formatTask(engine.getDailyTask());
        
      case 'inventory':
        return this.formatInventory(engine);
        
      case 'open_box':
        return this.formatOpenBox(await engine.openBox(command.boxType));
        
      case 'use_item':
        // TODO: 实现物品名称到ID的映射
        return { text: '使用物品功能开发中...发送"背包"查看物品ID' };
        
      case 'bond':
        return this.formatBond(engine.claw);
        
      case 'health_status':
        return this.formatHealthStatus(engine);
      
      case 'health_enable':
        this.startHealthReminder(userId);
        await engine.toggleHealthReminder(true);
        return { 
          text: '✅ 健康提醒已开启！\n\n🦞 每 45 分钟会温柔提醒你：\n  💧 喝水（150-200ml）\n  🦵 站立活动（1分钟）\n  🍑 提肛锻炼（隐形健身）\n\n发送"健康 静默 60分钟"可进入专注模式。' 
        };
      
      case 'health_disable':
        this.stopHealthReminder(userId);
        await engine.toggleHealthReminder(false);
        return { text: '❌ 健康提醒已关闭。\n\n发送"健康 开启"随时重新启用。' };
      
      case 'health_silent':
        await engine.enableSilentMode(command.minutes);
        return { 
          text: `🔕 已进入静默模式 ${command.minutes} 分钟。\n\n🦞 会安静陪伴，不打扰你专注。\n时间到了自动恢复提醒。` 
        };
      
      case 'health_unsilent':
        await engine.disableSilentMode();
        return { text: '🔔 已恢复健康提醒！\n\n🦞 回来了，继续陪你保持健康～' };
      
      case 'health_report':
        return this.formatHealthReport(engine);

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
      `✨ 性格: ${status.claw.personality}`,
      `💕 亲密度: ${status.bond.title.emoji} ${status.bond.title.name} (${status.bond.level})`
    ];

    if (status.state === CLAW_STATE.TRAVELING && status.progress !== null) {
      lines.push(`🗺️ 旅行进度: ${status.progress}%`);
    }
    
    // 显示连续登录
    if (status.bond.consecutive > 1) {
      lines.push(`🔥 连续登录: ${status.bond.consecutive} 天`);
    }
    
    // 显示今日任务
    if (status.dailyTask) {
      const taskStatus = status.dailyTask.completed ? '✅' : '📋';
      lines.push(`${taskStatus} 今日任务: ${status.dailyTask.name} (${status.dailyTask.progress}/${status.dailyTask.target})`);
    }
    
    // 显示里程碑奖励
    if (status.newMilestones && status.newMilestones.length > 0) {
      lines.push('', '🏆 里程碑达成！');
      for (const m of status.newMilestones) {
        lines.push(`   ${m}% 阶段进度奖励已发放！`);
      }
    }

    return { text: lines.join('\n') };
  }

  formatCollectResult(result) {
    if (!result.success) {
      return { text: result.message };
    }

    let text = `${result.message}\n\n💰 当前共有 ${result.total_shells} 个贝壳`;
    
    // 显示掉落
    if (result.drop) {
      text += `\n\n🎁 ${result.drop.message}`;
    }

    return { text };
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

🎁 新增功能:
  任务 - 查看每日任务
  背包 - 查看特殊道具
  开箱 - 开启宝箱（获得后）
  亲密度 - 查看羁绊关系

⏰ 健康提醒:
  健康 - 查看健康提醒状态
  健康 开启 - 启动微习惯闹钟
  健康 关闭 - 停止健康提醒
  健康 静默 60分钟 - 进入专注模式
  健康 恢复 - 取消静默模式
  健康 报告 - 查看今日健康数据

📸 其他功能:
  图鉴 - 查看收集成就
  家园 - 查看/装饰小窝
  拍照 - 让 🦞 自拍
  帮助 - 显示本指南

💡 小贴士:
  • 给 🦞 准备好食物和装备再出发
  • 多和 🦞 互动增加亲密度，亲密度越高幸运值越高
  • 完成每日任务获得额外奖励
  • 收割贝壳和旅行都有概率获得稀有道具
  • 开启"健康提醒"，让 🦞 成为你的微习惯闹钟
  • 🦞 会根据自己的想法旅行，耐心等待明信片

愿你的 🦞 旅途愉快！`
    };
  }
  
  // 📋 格式化任务
  formatTask(task) {
    const lines = [
      '📋 今日任务',
      '',
      `任务: ${task.name}`,
      `进度: ${task.progress}/${task.target}`,
    ];
    
    if (task.completed) {
      lines.push('状态: ✅ 已完成');
      lines.push('', '🎁 奖励已领取！');
    } else {
      lines.push(`状态: 进行中（还差 ${task.target - task.progress} 次）`);
      lines.push('', '💡 奖励:');
      if (task.reward.shells) {
        lines.push(`  ${task.reward.shells} 个贝壳`);
      }
      if (task.reward.item) {
        lines.push('  神秘道具');
      }
    }
    
    return { text: lines.join('\n') };
  }
  
  // 🎒 格式化背包
  formatInventory(engine) {
    const specialItems = engine.getSpecialItems();
    
    const lines = [
      '🎒 特殊道具背包',
      ''
    ];
    
    if (specialItems.length === 0) {
      lines.push('背包是空的...');
      lines.push('');
      lines.push('💡 通过以下方式获得道具:');
      lines.push('  • 收割贝壳时有概率掉落');
      lines.push('  • 🦞 旅行归来时可能带回');
      lines.push('  • 完成每日任务');
      lines.push('  • 达到成长里程碑');
    } else {
      specialItems.forEach(item => {
        const rarityEmoji = { common: '⚪', uncommon: '🟢', rare: '🔵', epic: '🟣', legendary: '🟠', mythic: '🔴' }[item.rarity];
        lines.push(`${rarityEmoji} ${item.emoji} ${item.name} x${item.count}`);
        lines.push(`   ${item.description}`);
        lines.push('');
      });
    }
    
    lines.push(`\n💕 当前亲密度: ${engine.claw.bond_level}`);
    lines.push(`🍀 幸运加成: ${(engine.getLuckModifier() * 100).toFixed(1)}%`);
    
    return { text: lines.join('\n') };
  }
  
  // 📦 格式化开箱结果
  formatOpenBox(result) {
    if (!result.success) {
      return { text: result.message };
    }
    
    const lines = [
      `🎉 开启了 ${result.box_name}！`,
      '',
      `💰 获得 ${result.shells} 个贝壳！`
    ];
    
    if (result.items.length > 0) {
      lines.push('', '🎁 获得物品:');
      result.items.forEach(item => {
        lines.push(`  ${item.emoji} ${item.name}`);
      });
    }
    
    return { text: lines.join('\n') };
  }
  
  // 💕 格式化亲密度
  formatBond(claw) {
    const title = claw.getBondTitle();
    const progress = claw.bond_level % 100;
    const nextLevel = Math.floor(claw.bond_level / 100) * 100 + 100;
    
    const lines = [
      `💕 与 🦞 的羁绊`,
      '',
      `${title.emoji} ${title.name}`,
      `亲密度: ${claw.bond_level} / 1000`,
    ];
    
    if (claw.bond_level < 1000) {
      lines.push(`升级进度: ${progress}% (${claw.bond_level}/${nextLevel})`);
    } else {
      lines.push('✨ 已达到最高等级！');
    }
    
    lines.push('', `🔥 连续登录: ${claw.consecutive_days} 天`);
    lines.push(`💬 今日已互动: ${claw.bond_today} 点亲密度`);
    
    lines.push('', '💡 提升亲密度的方法:');
    lines.push('  • 和 🦞 聊天 (+1)');
    lines.push('  • 送 🦞 去旅行 (+3)');
    lines.push('  • 完成每日任务 (+5)');
    lines.push('  • 触发随机事件 (+3~8)');
    
    return { text: lines.join('\n') };
  }
  
  // ⏰ 格式化健康提醒（兼容旧版和新版问候）
  formatHealthReminder(reminder) {
    if (!reminder) return null;
    
    // 新版问候直接返回消息
    if (reminder.isGreeting) {
      return { text: reminder.message };
    }
    
    // 兼容旧版格式
    const lines = [
      `⏰ 微习惯闹钟`,
      '',
      reminder.message,
      '',
      `💡 ${reminder.tip}`
    ];
    
    if (reminder.intervalMsg) {
      lines.push('', reminder.intervalMsg);
    }
    
    return { text: lines.join('\n') };
  }
  
  // ⏰ 格式化健康状态
  formatHealthStatus(engine) {
    const settings = engine.getHealthSettings();
    const nextTime = engine.getNextGreetingTime();
    
    const lines = [
      `🦞 Claw 问候设置`,
      '',
      `状态: ${settings.disabled ? '❌ 已关闭' : '✅ 运行中'}`,
    ];
    
    if (settings.silentMode) {
      const until = new Date(settings.silentUntil);
      const minutesLeft = Math.ceil((until - Date.now()) / 60000);
      lines.push(`模式: 🔕 静默（还剩 ${minutesLeft} 分钟）`);
    }
    
    lines.push('', '📊 今日统计:');
    lines.push(`  已问候: ${settings.completed || 0}/${settings.total || 13} 次`);
    lines.push(`  今日互动: ${engine.claw.dailyStats?.interactions || 0} 次`);
    
    if (nextTime) {
      lines.push('', `⏰ 下次问候: ${nextTime}`);
    } else {
      lines.push('', '✅ 今天的问候都完成啦');
    }
    
    lines.push('', '🕐 问候时段: 09:00 - 22:00');
    lines.push('📱 每小时随机时间点，Claw 会主动找你聊天');
    
    lines.push('', '💡 可用指令:');
    lines.push('  健康 开启 / 关闭');
    lines.push('  健康 静默 60分钟');
    lines.push('  健康 恢复');
    lines.push('  健康 报告');
    
    return { text: lines.join('\n') };
  }
  
  // ⏰ 格式化健康报告（今日统计）
  formatHealthReport(engine) {
    const stats = engine.claw.dailyStats || {
      interactions: 0,
      shells: 0,
      greetingCount: 0,
      travel: null,
      taskCompleted: false,
      bond: 0
    };
    
    const lines = [
      `📊 今日与 🦞 的互动报告`,
      '',
      '🦞 的问候:',
      `  今天来找你 ${stats.greetingCount || 0} 次`,
      '',
      '📈 互动数据:',
      `  聊天次数: ${stats.interactions} 次`,
      `  收割贝壳: ${stats.shells} 个`,
    ];
    
    if (stats.travel) {
      lines.push(`  旅行探险: ${stats.travel.location}`);
    }
    
    if (stats.taskCompleted) {
      lines.push(`  每日任务: ✅ 已完成`);
    }
    
    lines.push(`  亲密度增加: +${stats.bond} 点`);
    
    lines.push('', '💕 当前羁绊:');
    const bond = engine.claw.getBondTitle();
    lines.push(`  ${bond.emoji} ${bond.name} (${engine.claw.bond_level} 点)`);
    
    lines.push('', '🦞 "有你的每一天都很开心！"');
    
    return { text: lines.join('\n') };
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
