/**
 * 🤖 Gemini 客户端
 * 
 * 使用 Gemini API 生成图片
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API Key is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image'
    });
  }

  /**
   * 生成图片
   * @param {string} prompt - 图片描述
   * @param {Object} options - 生成选项
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateImage(prompt, options = {}) {
    try {
      const generationConfig = {
        responseModalities: ['Text', 'Image'],
        ...options
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig
      });

      const response = await result.response;
      
      // 解析响应中的图片数据
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            imageData: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png'
          };
        }
      }

      throw new Error('No image data in response');
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
   * @param {Object} options - 生成选项（Gemini 会忽略不支持的选项）
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generatePostcard(claw, locationId, activity, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildTravelPrompt(locationId, activity);
    
    console.log('Generating postcard with prompt:', prompt);
    
    return this.generateImage(prompt, options);
  }

  /**
   * 生成自拍
   * @param {Claw} claw - 🦞 角色
   * @param {Array} decorations - 家园装饰
   * @param {Object} options - 生成选项（Gemini 会忽略不支持的选项）
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateSelfie(claw, decorations, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildSelfiePrompt(decorations);
    
    console.log('Generating selfie with prompt:', prompt);
    
    return this.generateImage(prompt, options);
  }

  /**
   * 生成成长纪念照
   * @param {Claw} claw - 🦞 角色
   * @param {Object} oldStage - 旧阶段
   * @param {Object} newStage - 新阶段
   * @param {Object} options - 生成选项（Gemini 会忽略不支持的选项）
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateMilestonePhoto(claw, oldStage, newStage, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildMilestonePrompt(oldStage, newStage);
    
    console.log('Generating milestone photo with prompt:', prompt);
    
    return this.generateImage(prompt, options);
  }

  /**
   * 生成特殊事件图片
   * @param {Claw} claw - 🦞 角色
   * @param {string} eventType - 事件类型
   * @param {Object} details - 事件详情
   * @param {Object} options - 生成选项（Gemini 会忽略不支持的选项）
   * @returns {Promise<{imageData: string, mimeType: string}>}
   */
  async generateSpecialEvent(claw, eventType, details, options = {}) {
    const { default: PromptBuilder } = await import('./PromptBuilder.js');
    const builder = new PromptBuilder(claw);
    
    const prompt = builder.buildSpecialEventPrompt(eventType, details);
    
    console.log('Generating special event with prompt:', prompt);
    
    return this.generateImage(prompt, options);
  }
}

export default GeminiClient;
