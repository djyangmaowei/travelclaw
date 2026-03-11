/**
 * 🎒 库存系统
 * 
 * 管理玩家的贝壳、道具、收藏
 */

import { getItem, getShopItems, SOUVENIRS } from '../content/items.js';

export class Inventory {
  constructor(userId) {
    this.userId = userId;
    this.shells = 0; // 贝壳货币
    this.items = {}; // 拥有的道具 { itemId: count }
    this.backpack = []; // 行囊内容（最多5个物品）
    this.home_decorations = []; // 家园装饰
    this.souvenirs = {}; // 收集的特产 { souvenirId: count }
    this.unlocked_locations = ['sunny_beach']; // 已解锁地点
  }

  // ========== 贝壳相关 ==========
  
  // 增加贝壳
  addShells(amount) {
    this.shells += amount;
    return this.shells;
  }

  // 消费贝壳
  spendShells(amount) {
    if (this.shells < amount) {
      return { success: false, message: '贝壳不足 😢' };
    }
    this.shells -= amount;
    return { success: true, remaining: this.shells };
  }

  // 获取贝壳数量
  getShells() {
    return this.shells;
  }

  // ========== 道具购买 ==========
  
  // 购买物品
  buyItem(itemId) {
    const item = getShopItems()[itemId];
    
    if (!item) {
      return { success: false, message: '没有这个物品 🤔' };
    }

    const spendResult = this.spendShells(item.price);
    if (!spendResult.success) {
      return spendResult;
    }

    // 添加到库存
    this.items[itemId] = (this.items[itemId] || 0) + 1;
    
    return { 
      success: true, 
      message: `购买了 ${item.emoji} ${item.name}！`,
      remaining_shells: spendResult.remaining
    };
  }

  // 获取库存物品列表
  getItems() {
    return Object.entries(this.items).map(([id, count]) => ({
      ...getItem(id),
      count
    }));
  }

  // 检查是否有某物品
  hasItem(itemId) {
    return (this.items[itemId] || 0) > 0;
  }

  // 使用/消耗物品
  consumeItem(itemId) {
    if (!this.hasItem(itemId)) {
      return { success: false, message: '没有这个物品' };
    }
    
    this.items[itemId]--;
    if (this.items[itemId] === 0) {
      delete this.items[itemId];
    }
    
    return { success: true };
  }

  // ========== 行囊管理 ==========
  
  // 放入行囊
  addToBackpack(itemId) {
    if (this.backpack.length >= 5) {
      return { success: false, message: '行囊已满（最多5个物品）🎒' };
    }

    if (!this.hasItem(itemId)) {
      return { success: false, message: '库存中没有这个物品' };
    }

    // 从库存移除，放入行囊
    this.consumeItem(itemId);
    this.backpack.push(itemId);
    
    const item = getItem(itemId);
    return { 
      success: true, 
      message: `将 ${item.emoji} ${item.name} 放入行囊` 
    };
  }

  // 从行囊取出
  removeFromBackpack(index) {
    if (index < 0 || index >= this.backpack.length) {
      return { success: false, message: '无效的位置' };
    }

    const itemId = this.backpack.splice(index, 1)[0];
    this.items[itemId] = (this.items[itemId] || 0) + 1;
    
    const item = getItem(itemId);
    return { 
      success: true, 
      message: `从行囊取出 ${item.emoji} ${item.name}` 
    };
  }

  // 获取行囊内容
  getBackpack() {
    return this.backpack.map(id => getItem(id));
  }

  // 清空行囊（旅行后）
  clearBackpack() {
    this.backpack = [];
  }

  // ========== 家园装饰 ==========
  
  // 放置装饰
  decorate(itemId) {
    const item = getItem(itemId);
    
    if (!item || item.type !== 'decoration') {
      return { success: false, message: '这不是装饰品' };
    }

    if (!this.hasItem(itemId)) {
      return { success: false, message: '没有这件装饰品' };
    }

    // 检查位置是否已有装饰
    const existing = this.home_decorations.find(d => d.position === item.position);
    if (existing) {
      // 替换，旧装饰回到库存
      this.items[existing.itemId] = (this.items[existing.itemId] || 0) + 1;
      this.home_decorations = this.home_decorations.filter(d => d.position !== item.position);
    }

    // 放置新装饰
    this.consumeItem(itemId);
    this.home_decorations.push({
      itemId,
      position: item.position,
      placed_at: new Date().toISOString()
    });

    return { 
      success: true, 
      message: `放置了 ${item.emoji} ${item.name}` 
    };
  }

  // 移除装饰
  removeDecoration(position) {
    const decoration = this.home_decorations.find(d => d.position === position);
    if (!decoration) {
      return { success: false, message: '该位置没有装饰品' };
    }

    this.items[decoration.itemId] = (this.items[decoration.itemId] || 0) + 1;
    this.home_decorations = this.home_decorations.filter(d => d.position !== position);

    return { success: true, message: '装饰品已移除' };
  }

  // 获取家园装饰
  getHomeDecorations() {
    return this.home_decorations.map(d => ({
      ...getItem(d.itemId),
      position: d.position,
      placed_at: d.placed_at
    }));
  }

  // ========== 特产收藏 ==========
  
  // 添加特产
  addSouvenir(souvenirId) {
    this.souvenirs[souvenirId] = (this.souvenirs[souvenirId] || 0) + 1;
    
    const souvenir = getItem(souvenirId);
    return {
      is_new: this.souvenirs[souvenirId] === 1,
      souvenir: souvenir
    };
  }

  // 获取所有收集的特产
  getSouvenirs() {
    return Object.entries(this.souvenirs).map(([id, count]) => ({
      ...getItem(id),
      count
    }));
  }

  // 获取收集进度
  getCollectionProgress() {
    const totalSouvenirs = Object.keys(SOUVENIRS).length;
    const collected = Object.keys(this.souvenirs).length;
    
    return {
      collected,
      total: totalSouvenirs,
      percentage: Math.floor((collected / totalSouvenirs) * 100)
    };
  }

  // ========== 地点解锁 ==========
  
  // 解锁地点
  unlockLocation(locationId) {
    if (!this.unlocked_locations.includes(locationId)) {
      this.unlocked_locations.push(locationId);
      return true;
    }
    return false;
  }

  // 检查地点是否解锁
  isLocationUnlocked(locationId) {
    return this.unlocked_locations.includes(locationId);
  }

  // 获取已解锁地点
  getUnlockedLocations() {
    return this.unlocked_locations;
  }

  // ========== 序列化 ==========
  
  toJSON() {
    return {
      userId: this.userId,
      shells: this.shells,
      items: this.items,
      backpack: this.backpack,
      home_decorations: this.home_decorations,
      souvenirs: this.souvenirs,
      unlocked_locations: this.unlocked_locations
    };
  }

  static fromJSON(data) {
    const inv = new Inventory(data.userId);
    inv.shells = data.shells || 0;
    inv.items = data.items || {};
    inv.backpack = data.backpack || [];
    inv.home_decorations = data.home_decorations || [];
    inv.souvenirs = data.souvenirs || {};
    inv.unlocked_locations = data.unlocked_locations || ['sunny_beach'];
    return inv;
  }
}
