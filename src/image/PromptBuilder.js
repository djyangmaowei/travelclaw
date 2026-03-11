/**
 * 🎨 Prompt 构建器
 * 
 * 构建用于 Gemini 生图的 Prompt
 */

import { STAGES } from '../core/Claw.js';
import { PERSONALITY_KEYWORDS } from '../content/dialogues.js';
import { LOCATIONS } from '../content/locations.js';

export class PromptBuilder {
  constructor(claw) {
    this.claw = claw;
  }

  /**
   * 构建旅行明信片 Prompt
   * @param {string} locationId - 地点 ID
   * @param {string} activity - 活动描述
   * @returns {string} 完整的 prompt
   */
  buildTravelPrompt(locationId, activity) {
    const stage = this.claw.getCurrentStage();
    const location = LOCATIONS[locationId];
    const personality = this.claw.getPersonalityPrompt();
    
    // 基础角色描述
    const baseCharacter = this.buildCharacterDescription(stage, personality);
    
    // 场景描述
    const sceneDescription = this.buildSceneDescription(location, activity);
    
    // 风格修饰
    const styleModifiers = this.getStyleModifiers();
    
    return `${baseCharacter}, ${sceneDescription}, ${styleModifiers}`;
  }

  /**
   * 构建家园自拍 Prompt
   * @param {Array} decorations - 家园装饰列表
   * @returns {string} 完整的 prompt
   */
  buildSelfiePrompt(decorations) {
    const stage = this.claw.getCurrentStage();
    const personality = this.claw.getPersonalityPrompt();
    
    const baseCharacter = this.buildCharacterDescription(stage, personality);
    const homeScene = this.buildHomeScene(decorations);
    const styleModifiers = this.getStyleModifiers();
    
    return `${baseCharacter}, ${homeScene}, selfie pose, looking at camera, ${styleModifiers}`;
  }

  /**
   * 构建角色描述
   */
  buildCharacterDescription(stage, personality) {
    const parts = [
      'A cute red lobster character',
      stage.traits_prompt,
      personality
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  /**
   * 构建场景描述
   */
  buildSceneDescription(location, activity) {
    const locationPrompts = {
      // 附近海滩
      sunny_beach: 'on a sunny beach with golden sand, palm trees in background, ocean waves',
      rocky_shore: 'on a rocky coastline, tide pools visible, ocean spray',
      tide_pool: 'in a colorful tide pool, small sea creatures around, clear water',
      
      // 附近城市
      harbor: 'at a bustling harbor with fishing boats, seagulls flying, wooden piers',
      fish_market: 'at a lively fish market, various seafood displays, colorful umbrellas',
      coastal_park: 'in a beautiful coastal park, flowers blooming, benches, lighthouse in distance',
      
      // 国内名胜
      great_wall: 'on the Great Wall of China, mountains in background, ancient bricks',
      west_lake: 'at West Lake Hangzhou, willow trees, lotus flowers, traditional bridge',
      li_river: 'on Li River Guilin, karst mountains, bamboo raft, misty scenery',
      yellow_mountain: 'at Huangshan Yellow Mountain, sea of clouds, pine trees, sunrise',
      
      // 国际旅行
      eiffel_tower: 'in front of Eiffel Tower Paris, romantic atmosphere, evening lights',
      santorini: 'in Santorini Greece, white buildings with blue domes, Mediterranean sea',
      mount_fuji: 'with Mount Fuji Japan in background, cherry blossoms, serene lake',
      sydney_opera: 'at Sydney Opera House, harbor bridge, sunny Australian weather',
      
      // 全球冒险
      antarctica: 'in Antarctica, icebergs, penguins nearby, aurora borealis in sky',
      deep_sea_trench: 'in deep ocean, bioluminescent creatures, mysterious dark blue',
      atlantis_ruins: 'in ancient underwater Atlantis ruins, glowing crystals, mythical'
    };

    const locationPrompt = locationPrompts[location.id] || `at ${location.name}`;
    
    // 活动动作
    const activityActions = {
      '晒太阳': 'relaxing and sunbathing',
      '堆沙堡': 'building a sandcastle',
      '捡贝壳': 'collecting seashells',
      '看大船': 'watching ships in harbor',
      '爬楼梯': 'climbing stone stairs',
      '赏荷花': 'admiring lotus flowers',
      '竹筏漂流': 'on a bamboo raft',
      '仰望铁塔': 'looking up at tower',
      '看企鹅': 'watching penguins',
      '深潜': 'deep sea diving'
    };
    
    const action = activityActions[activity] || activity || 'exploring';
    
    return `${locationPrompt}, ${action}, happy expression`;
  }

  /**
   * 构建家园场景
   */
  buildHomeScene(decorations) {
    const baseScene = 'inside a cozy underwater cave home, warm lighting';
    
    if (!decorations || decorations.length === 0) {
      return `${baseScene}, simple and clean`;
    }

    const decorDescriptions = decorations.map(d => {
      const descMap = {
        coral_branch: 'coral decoration at entrance',
        sea_anemone: 'colorful sea anemone in corner',
        ship_wheel: 'ship wheel on wall',
        anchor: 'anchor near entrance',
        message_bottle: 'message bottle on table',
        fishing_net: 'fishing net as curtain',
        shell_wind_chime: 'shell wind chime hanging'
      };
      return descMap[d.id] || d.name;
    });

    return `${baseScene}, decorated with ${decorDescriptions.join(', ')}`;
  }

  /**
   * 获取风格修饰词
   */
  getStyleModifiers() {
    return [
      'hand-drawn illustration style',
      'warm and cozy atmosphere',
      'soft pastel colors',
      'children book illustration',
      'detailed and charming',
      'high quality'
    ].join(', ');
  }

  /**
   * 构建成长阶段纪念照 Prompt
   */
  buildMilestonePrompt(oldStage, newStage) {
    const personality = this.claw.getPersonalityPrompt();
    
    return [
      'A cute red lobster character',
      newStage.traits_prompt,
      personality,
      'celebrating growth milestone',
      'sparkles and confetti around',
      'proud and happy expression',
      this.getStyleModifiers()
    ].filter(Boolean).join(', ');
  }

  /**
   * 构建特殊事件 Prompt
   */
  buildSpecialEventPrompt(eventType, details) {
    const stage = this.claw.getCurrentStage();
    const personality = this.claw.getPersonalityPrompt();
    
    const baseCharacter = this.buildCharacterDescription(stage, personality);
    
    const eventPrompts = {
      met_friend: `${baseCharacter}, meeting a friendly ${details.friend} at ${details.location}, happy interaction, ${this.getStyleModifiers()}`,
      found_treasure: `${baseCharacter}, discovering a glowing treasure chest, surprised expression, magical sparkles, ${this.getStyleModifiers()}`,
      festival: `${baseCharacter}, celebrating ${details.festival}, festive decorations, joyful atmosphere, ${this.getStyleModifiers()}`
    };
    
    return eventPrompts[eventType] || `${baseCharacter}, special moment, ${this.getStyleModifiers()}`;
  }
}

export default PromptBuilder;
