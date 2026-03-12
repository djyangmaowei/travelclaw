/**
 * 🎨 统一图片生成客户端
 * 
 * 支持多种图片生成 API：
 * - PackyAPI (豆包 Seedream)
 * - Gemini
 * - OpenAI (DALL-E)
 * - Stability AI
 * - 任何兼容 OpenAI 接口的服务
 */

import { PackyClient } from './PackyClient.js';

export class ImageClient {
  constructor(config = {}) {
    this.config = config;
    this.provider = config.provider || this.detectProvider(config);
    this.client = null; // 延迟初始化
  }

  /**
   * 自动检测提供商
   */
  detectProvider(config) {
    if (config.apiKey?.startsWith('sk-qSyl') || config.baseUrl?.includes('packyapi')) {
      return 'packy';
    }
    if (config.apiKey?.startsWith('AIza')) {
      return 'gemini';
    }
    if (config.model?.includes('dall-e')) {
      return 'openai';
    }
    // 默认使用 OpenAI 兼容接口
    return 'openai-compatible';
  }

  /**
   * 异步初始化客户端
   */
  async initClient() {
    if (this.client) return this.client;
    
    switch (this.provider) {
      case 'packy':
        this.client = new PackyClient(this.config.apiKey, this.config.baseUrl);
        break;
      
      case 'gemini': {
        const { GeminiClient } = await import('./GeminiClient.js');
        this.client = new GeminiClient(this.config.apiKey);
        break;
      }
      
      case 'openai':
      case 'openai-compatible':
      default:
        this.client = new OpenAICompatibleClient(this.config);
    }
    
    return this.client;
  }

  /**
   * 生成图片
   */
  async generateImage(prompt, options = {}) {
    const client = await this.initClient();
    return client.generateImage(prompt, options);
  }

  /**
   * 生成旅行明信片
   */
  async generatePostcard(claw, locationId, activity) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    const prompt = builder.buildTravelPrompt(locationId, activity);
    
    console.log('🎨 生成明信片...');
    console.log('Prompt:', prompt.substring(0, 80) + '...');
    
    return this.generateImage(prompt, { size: '1024x1024' });
  }

  /**
   * 生成自拍
   */
  async generateSelfie(claw, decorations) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    const prompt = builder.buildSelfiePrompt(decorations);
    
    console.log('📸 生成自拍...');
    
    return this.generateImage(prompt, { size: '1024x1024' });
  }

  /**
   * 生成成长纪念照
   */
  async generateMilestonePhoto(claw, oldStage, newStage) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    const prompt = builder.buildMilestonePrompt(oldStage, newStage);
    
    console.log('🎉 生成成长纪念照...');
    
    return this.generateImage(prompt, { size: '1024x1024' });
  }
}

/**
 * OpenAI 兼容接口客户端
 * 适用于：OpenAI、OneAPI、NewAPI、自定义中转站等
 */
class OpenAICompatibleClient {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'https://api.openai.com').replace(/\/$/, '');
    this.model = config.model || 'dall-e-3';
  }

  async generateImage(prompt, options = {}) {
    const { size = '1024x1024', n = 1, quality = 'standard' } = options;

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
        quality,
        response_format: 'b64_json'
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

    return {
      imageData: data.data[0].b64_json,
      mimeType: 'image/png',
      url: data.data[0].url || null
    };
  }
}

export default ImageClient;
