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
      size = '1920x1920',
      n = 1,
      responseFormat = 'b64_json', // 'b64_json' 或 'url'
      seed = -1
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          size,
          n,
          response_format: responseFormat,
          seed
        })
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
      if (responseFormat === 'b64_json' && imageData.b64_json) {
        return {
          imageData: imageData.b64_json,
          mimeType: 'image/png',
          url: null
        };
      }

      // 处理 URL 格式
      if (responseFormat === 'url' && imageData.url) {
        // 下载图片
        const imageResponse = await fetch(imageData.url);
        const buffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        
        return {
          imageData: base64,
          mimeType: 'image/png',
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
   * 生成旅行明信片
   * @param {Claw} claw - 🦞 角色
   * @param {string} locationId - 地点 ID
   * @param {string} activity - 活动
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generatePostcard(claw, locationId, activity) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildTravelPrompt(locationId, activity);
    
    console.log('🎨 生成明信片...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');
    
    return this.generateImage(prompt, {
      size: '1024x1024',
      seed: -1
    });
  }

  /**
   * 生成自拍
   * @param {Claw} claw - 🦞 角色
   * @param {Array} decorations - 家园装饰
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateSelfie(claw, decorations) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildSelfiePrompt(decorations);
    
    console.log('📸 生成自拍...');
    
    return this.generateImage(prompt, {
      size: '1024x1024',
      seed: -1
    });
  }

  /**
   * 生成成长纪念照
   * @param {Claw} claw - 🦞 角色
   * @param {Object} oldStage - 旧阶段
   * @param {Object} newStage - 新阶段
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateMilestonePhoto(claw, oldStage, newStage) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildMilestonePrompt(oldStage, newStage);
    
    console.log('🎉 生成成长纪念照...');
    
    return this.generateImage(prompt, {
      size: '1024x1024',
      seed: -1
    });
  }

  /**
   * 生成特殊事件图片
   * @param {Claw} claw - 🦞 角色
   * @param {string} eventType - 事件类型
   * @param {Object} details - 事件详情
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateSpecialEvent(claw, eventType, details) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildSpecialEventPrompt(eventType, details);
    
    console.log('✨ 生成特殊事件图片...');
    
    return this.generateImage(prompt, {
      size: '1024x1024',
      seed: -1
    });
  }
}

export default PackyClient;
