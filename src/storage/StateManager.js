/**
 * 💾 状态管理器
 * 
 * 管理游戏数据的持久化存储
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

export class StateManager {
  constructor(dataPath) {
    // 默认存储路径
    this.basePath = dataPath || join(homedir(), '.openclaw', 'travelclaw');
  }

  /**
   * 确保目录存在
   */
  async ensureDirectory() {
    if (!existsSync(this.basePath)) {
      await mkdir(this.basePath, { recursive: true });
    }
  }

  /**
   * 获取用户数据文件路径
   */
  getUserFilePath(userId) {
    // 使用用户 ID 的哈希作为文件名（避免特殊字符）
    const safeId = Buffer.from(userId).toString('base64').replace(/[/+=]/g, '_');
    return join(this.basePath, `${safeId}.json`);
  }

  /**
   * 加载用户数据
   * @param {string} userId - 用户 ID
   * @returns {Promise<Object|null>} 用户数据
   */
  async load(userId) {
    try {
      await this.ensureDirectory();
      
      const filePath = this.getUserFilePath(userId);
      
      // 检查文件是否存在
      try {
        await access(filePath);
      } catch {
        return null; // 文件不存在
      }

      const data = await readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  /**
   * 保存用户数据
   * @param {string} userId - 用户 ID
   * @param {Object} data - 用户数据
   */
  async save(userId, data) {
    try {
      await this.ensureDirectory();
      
      const filePath = this.getUserFilePath(userId);
      
      // 写入文件（格式化 JSON）
      await writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );
      
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  /**
   * 删除用户数据
   * @param {string} userId - 用户 ID
   */
  async delete(userId) {
    try {
      const filePath = this.getUserFilePath(userId);
      const { unlink } = await import('fs/promises');
      await unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  }

  /**
   * 获取所有用户列表（用于统计）
   */
  async getAllUsers() {
    try {
      await this.ensureDirectory();
      
      const { readdir } = await import('fs/promises');
      const files = await readdir(this.basePath);
      
      return files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
    } catch (error) {
      console.error('Error listing users:', error);
      return [];
    }
  }

  /**
   * 导出数据（备份）
   * @param {string} userId - 用户 ID
   */
  async exportData(userId) {
    return this.load(userId);
  }

  /**
   * 导入数据（恢复）
   * @param {string} userId - 用户 ID
   * @param {Object} data - 备份数据
   */
  async importData(userId, data) {
    return this.save(userId, data);
  }
}

export default StateManager;
