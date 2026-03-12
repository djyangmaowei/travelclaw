# 🦞 TravelClaw

> *你的个人旅行龙虾伙伴 —— 在 OpenClaw 中开启一段奇妙的放置冒险*

TravelClaw 是一个为 [OpenClaw](https://github.com/openclaw/openclaw) 设计的 Skill，让你的 AI 助手变成一只爱旅行的龙虾 🦞。它会背起行囊探索世界，从各地给你寄回明信片和特产。

## ✨ 特性

- 🎮 **放置玩法** —— 无需时刻关注，🦞 有自己的生活节奏
- 🧳 **旅行系统** —— 准备行囊，🦞 会去世界各地冒险
- 📸 **AI 明信片** —— 通过 Gemini 生成 🦞 在景点的美照
- 🎨 **手绘风格** —— 温暖治愈的视觉体验
- 📈 **成长阶段** —— 从幼虾到虾王，陪伴 🦞 一路成长
- 🏠 **家园装饰** —— 打造温馨的龙虾小窝
- 📚 **收藏图鉴** —— 收集世界各地的特产和回忆

## 🚀 快速开始

### 前置要求

- [OpenClaw](https://github.com/openclaw/openclaw) 已安装并配置
- 任意图像生成 API Key（支持多个平台）

### 支持的图片生成平台

| 平台 | 环境变量配置 | 说明 |
|------|-------------|------|
| **PackyAPI** | `IMAGE_API_KEY=sk-...` | 推荐，豆包 Seedream 模型 |
| **Gemini** | `IMAGE_API_KEY=AIza...` | Google Gemini |
| **OpenAI** | `IMAGE_API_KEY=sk-...` + `IMAGE_API_MODEL=dall-e-3` | DALL-E 3 |
| **Stability AI** | `IMAGE_API_KEY=sk-...` + `IMAGE_API_BASE=https://api.stability.ai` | SDXL |
| **其他** | 配置 `IMAGE_API_BASE` 为中转站地址 | OneAPI、NewAPI 等 |

### 安装

```bash
# 克隆 Skill 到 OpenClaw 目录
git clone https://github.com/djyangmaowei/travelclaw.git ~/.openclaw/skills/travelclaw

# 配置环境变量（以 PackyAPI 为例）
export IMAGE_API_KEY="your-api-key"
# 可选：自定义 API 地址和模型
# export IMAGE_API_BASE="https://www.packyapi.com"
# export IMAGE_API_MODEL="doubao-seedream-5.0-lite"

# 在 OpenClaw 配置中启用 Skill
openclaw skills enable travelclaw
```

### 配置 openclaw.json

```json
{
  "skills": {
    "entries": {
      "travelclaw": {
        "enabled": true,
        "env": {
          "IMAGE_API_KEY": "${IMAGE_API_KEY}",
          "IMAGE_API_BASE": "${IMAGE_API_BASE}",
          "IMAGE_API_MODEL": "${IMAGE_API_MODEL}"
        }
      }
    }
  }
}
```

## 🎮 游戏指令

在任意 OpenClaw 连接的 IM 中发送：

| 指令 | 说明 |
|------|------|
| `状态` / `status` | 查看 🦞 当前状态、亲密度、任务 |
| `收割` / `collect` | 收取家园产出的贝壳，有概率掉落道具 |
| `商店` / `shop` | 打开道具商店 |
| `购买 [物品]` | 购买旅行道具 |
| `行囊` / `pack` | 管理 🦞 的旅行背包 |
| `图鉴` / `album` | 查看收集成就 |
| `家园` / `home` | 查看/装饰龙虾小窝 |
| `拍照` / `pic` | 让 🦞 拍一张自拍 |
| **新增** `任务` / `task` | 查看每日任务 |
| **新增** `背包` / `inventory` | 查看特殊道具 |
| **新增** `开箱` | 开启宝箱 |
| **新增** `亲密度` | 查看羁绊关系 |
| `帮助` / `help` | 显示帮助信息 |

## 🦞 成长阶段

| 阶段 | 特征 | 旅行范围 |
|------|------|----------|
| 🦐 幼虾期 | 半透明小身体 | 附近海滩 |
| 🦞 少年期 | 颜色变深，钳子变大 | 附近城市 |
| 🦞 青年期 | 鲜艳的橙红色 | 国内长途 |
| 🦞 壮年期 | 巨大威武的钳子 | 国际旅行 |
| 👑 虾王期 | 金色纹路，传奇存在 | 全球冒险 |

## 🎨 个性化

🦞 会根据你的互动方式学习你的偏好：

- 夸它可爱 → 🦞 会更活泼好动
- 说它沉稳 → 🦞 会更优雅成熟
- 关注钳子 → 🦞 的钳子特征会更突出

## 💕 亲密度系统

与 🦞 互动可以增加亲密度，亲密度越高：

- 🍀 **幸运加成** - 获得稀有道具的概率提升
- 📈 **成长加速** - 🦞 更容易获得成长值
- 💎 **特殊奖励** - 亲密度达到里程碑可获得专属道具

**亲密度等级**（共10级）：陌生人 → 朋友 → 挚友 → 灵魂伴侣 → 永恒之约

## 🎁 随机掉落系统

在各种活动中都有概率获得稀有道具：

| 活动 | 掉落概率 | 可能获得 |
|------|----------|----------|
| 收割贝壳 | 15% | 幸运贝壳、珍珠碎片 |
| 旅行归来 | 25% | 时间沙砾、友谊徽章、神秘宝箱 |
| 随机事件 | 20% | 各种稀有物品 |
| 每日任务 | 30% | 任务专属奖励 |
| 里程碑 | 50% | 龙珠、传送石等传说物品 |

**稀有度**（6个等级）：⚪普通 → 🟢优秀 → 🔵稀有 → 🟣史诗 → 🟠传说 → 🔴神话

### 特殊道具效果

- ⏳ **时间沙砾** - 缩短旅行时间 30 分钟
- 🧪 **成长药水** - 🦞 立即成长 1 天
- 💎 **传送石** - 让 🦞 立即完成旅行回家
- 🌟 **黄金贝壳** - 出售获得 100 贝壳 + 2小时幸运加成
- 🔮 **龙珠** - 传说级宝物，全属性提升 24 小时

## 📋 每日任务

每天会随机生成一个任务：

- 收集贝壳（目标 10-30 个）
- 送 🦞 去旅行
- 和 🦞 互动（聊天 5 次）
- 给 🦞 拍照
- 装饰家园

完成任务获得贝壳 + 神秘道具奖励！

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 运行测试
pnpm test

# 构建
pnpm build
```

## 📄 开源协议

MIT License — 人人都可以自由使用和修改！

## 🙏 致谢

- 灵感来源于《旅行的青蛙》
- 基于 [OpenClaw](https://github.com/openclaw/openclaw) 平台
- 参考 [Clawra](https://github.com/SumeLabs/clawra) 实现

---

<p align="center">🦞 愿你的 🦞 旅途愉快！</p>
