/**
 * 🎨 PackyAPI 客户端
 * 
 * 使用 PackyAPI (兼容 OpenAI 接口) 生成图片
 * 支持豆包 Seedream 系列模型
 */

export class PackyClient {
  constructor(apiKey, baseUrl = 'https://www.packyapi.com') {
    if (!apiKey) {
      throw new Error('PackyAPI Key is required');
    }
    
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, ''); // 移除末尾斜杠
    this.model = 'doubao-seedream-5.0-lite';
  }

  /**
   * 生成图片
   * @param {string} prompt - 图片描述
   * @param {Object} options - 生成选项
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateImage(prompt, options = {}) {
    const {
      size = null,  // 不再强制默认尺寸，让 API 自行决定
      n = 1,
      responseFormat = null, // 不强制指定，让 API 返回其默认格式
      seed = -1
    } = options;

    try {
      const requestBody = {
        model: this.model,
        prompt,
        n,
        seed
      };

      // 只有明确指定了 size 才加入请求
      if (size) {
        requestBody.size = size;
      }

      // 只有明确指定了 response_format 才加入请求
      if (responseFormat) {
        requestBody.response_format = responseFormat;
      }

      const response = await fetch(`${this.baseUrl}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error('No image data in response');
      }

      const imageData = data.data[0];

      // 处理 base64 格式
      if (imageData.b64_json) {
        return {
          imageData: imageData.b64_json,
          mimeType: this.detectMimeType(imageData.b64_json),
          url: imageData.url || null
        };
      }

      // 处理 URL 格式 - 支持返回 URL 而不强制下载
      if (imageData.url) {
        return {
          imageData: null,
          mimeType: null,
          url: imageData.url
        };
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  /**
   * 从 base64 数据头检测 mime type
   */
  detectMimeType(base64Data) {
    if (base64Data.startsWith('/9j/')) return 'image/jpeg';
    if (base64Data.startsWith('iVBOR')) return 'image/png';
    if (base64Data.startsWith('R0lGOD')) return 'image/gif';
    if (base64Data.startsWith('UklGR')) return 'image/webp';
    return 'image/png'; // 默认
  }

  /**
   * 生成旅行明信片
   * @param {Claw} claw - 🦞 角色
   * @param {string} locationId - 地点 ID
   * @param {string} activity - 活动
   * @param {Object} options - 生成选项
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generatePostcard(claw, locationId, activity, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildTravelPrompt(locationId, activity);
    
    console.log('🎨 生成明信片...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');
    
    return this.generateImage(prompt, options);
  }

  /**
   * 生成自拍
   * @param {Claw} claw - 🦞 角色
   * @param {Array} decorations - 家园装饰
   * @param {Object} options - 生成选项
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateSelfie(claw, decorations, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildSelfiePrompt(decorations);
    
    console.log('📸 生成自拍...');
    
    return this.generateImage(prompt, options);
  }

  /**
   * 生成成长纪念照
   * @param {Claw} claw - 🦞 角色
   * @param {Object} oldStage - 旧阶段
   * @param {Object} newStage - 新阶段
   * @param {Object} options - 生成选项
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateMilestonePhoto(claw, oldStage, newStage, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildMilestonePrompt(oldStage, newStage);
    
    console.log('🎉 生成成长纪念照...');
    
    return this.generateImage(prompt, options);
  }

  /**
   * 生成特殊事件图片
   * @param {Claw} claw - 🦞 角色
   * @param {string} eventType - 事件类型
   * @param {Object} details - 事件详情
   * @param {Object} options - 生成选项
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateSpecialEvent(claw, eventType, details, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildSpecialEventPrompt(eventType, details);
    
    console.log('✨ 生成特殊事件图片...');
    
    return this.generateImage(prompt, options);
  }
}

export default PackyClient;
