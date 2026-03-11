# 📚 TravelClaw API 文档

## Skill 接口

### 处理用户消息

```javascript
import { handleMessage } from 'travelclaw';

const response = await handleMessage(userId, message);
```

**参数**:
- `userId` (string): 用户唯一标识
- `message` (string): 用户发送的消息

**返回**:
```typescript
{
  text: string;        // 回复文本
  image?: {            // 可选的图片
    data: string;      // base64 编码的图片
    mimeType: string;  // 图片类型
  }
}
```

## GameEngine API

### 构造函数

```javascript
import { GameEngine } from './core/GameEngine.js';

const engine = new GameEngine(userId, storage);
await engine.loadGame();
```

### 方法

#### getStatus()
获取 🦞 当前状态

```javascript
const status = engine.getStatus();
```

**返回**:
```typescript
{
  claw: {
    stage: {
      id: string;
      name: string;
      emoji: string;
      description: string;
      progress: number;
    };
    age_days: number;
    traits: string[];
    personality: string;
  };
  state: 'at_home' | 'preparing' | 'traveling' | 'resting';
  message: string;
  shells: number;
  location?: string;
  progress?: number;
}
```

#### collectShells()
收割贝壳

```javascript
const result = await engine.collectShells();
```

**返回**:
```typescript
{
  success: boolean;
  message: string;
  shells?: number;
  total_shells?: number;
}
```

#### startTravel()
让 🦞 出发旅行

```javascript
const result = await engine.startTravel();
```

**返回**:
```typescript
{
  success: boolean;
  message: string;
  destination?: string;
  duration?: number;  // 分钟
  expected_return?: string;  // ISO 时间
}
```

#### getAlbum()
获取收藏图鉴

```javascript
const album = engine.getAlbum();
```

**返回**:
```typescript
{
  souvenirs: Array<{
    id: string;
    name: string;
    emoji: string;
    rarity: string;
    count: number;
  }>;
  progress: {
    collected: number;
    total: number;
    percentage: number;
  };
  unlocked_locations: string[];
}
```

#### getHome()
获取家园信息

```javascript
const home = engine.getHome();
```

**返回**:
```typescript
{
  decorations: Array<{
    id: string;
    name: string;
    emoji: string;
    position: string;
  }>;
  claw_state: string;
}
```

## Storage API

### StateManager

```javascript
import { StateManager } from './storage/StateManager.js';

const storage = new StateManager(dataPath);
```

#### load(userId)
加载用户数据

```javascript
const data = await storage.load(userId);
```

#### save(userId, data)
保存用户数据

```javascript
await storage.save(userId, {
  claw: claw.toJSON(),
  inventory: inventory.toJSON(),
  gameState: { ... }
});
```

## Image Generation API

### PackyClient

```javascript
import { GeminiClient } from './image/GeminiClient.js';

const client = new GeminiClient(apiKey);
```

#### generatePostcard()
生成旅行明信片

```javascript
const result = await client.generatePostcard(claw, locationId, activity);
```

**返回**:
```typescript
{
  imageData: string;  // base64
  mimeType: string;
}
```

#### generateSelfie()
生成自拍

```javascript
const result = await client.generateSelfie(claw, decorations);
```

#### generateMilestonePhoto()
生成成长纪念照

```javascript
const result = await client.generateMilestonePhoto(claw, oldStage, newStage);
```

## PromptBuilder API

```javascript
import { PromptBuilder } from './image/PromptBuilder.js';

const builder = new PromptBuilder(claw);

// 构建旅行明信片 prompt
const travelPrompt = builder.buildTravelPrompt(locationId, activity);

// 构建自拍 prompt  
const selfiePrompt = builder.buildSelfiePrompt(decorations);

// 构建成长纪念照 prompt
const milestonePrompt = builder.buildMilestonePrompt(oldStage, newStage);
```

## 数据结构

### Claw 角色

```typescript
interface Claw {
  userId: string;
  birth_date: string;  // ISO date
  total_days: number;
  interaction_count: number;
  traits: string[];
  personality_scores: {
    cute: number;
    calm: number;
    strong: number;
    curious: number;
    lazy: number;
  };
}
```

### Inventory 库存

```typescript
interface Inventory {
  userId: string;
  shells: number;
  items: Record<string, number>;  // itemId -> count
  backpack: string[];  // itemId array
  home_decorations: Array<{
    itemId: string;
    position: string;
    placed_at: string;
  }>;
  souvenirs: Record<string, number>;
  unlocked_locations: string[];
}
```

## 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `GEMINI_API_KEY` | 是 | Gemini API 密钥 |
| `TRAVELCLAW_DATA_PATH` | 否 | 数据存储路径 |
