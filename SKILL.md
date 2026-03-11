# TravelClaw Skill

## 基本信息

- **名称**: travelclaw
- **版本**: 1.0.0
- **描述**: 一只爱旅行的龙虾伙伴，会背起行囊探索世界，给你寄明信片和特产
- **作者**: TravelClaw Team

## 能力声明

本 Skill 为 OpenClaw 添加以下能力：

1. **放置养成游戏** —— 管理一只虚拟龙虾的生活和旅行
2. **图像生成** —— 使用 Gemini API 生成 🦞 的旅行照片
3. **状态管理** —— 持久化游戏进度和用户数据
4. **定时任务** —— 触发旅行事件和家园产出

## 指令响应

当用户发送以下消息时，Skill 会响应：

- 包含 "状态/status" → 返回 🦞 当前状态
- 包含 "收割/collect" → 收取贝壳
- 包含 "商店/shop" → 显示商店
- 包含 "购买/buy" → 购买物品
- 包含 "行囊/pack" → 管理背包
- 包含 "图鉴/album" → 显示收集成就
- 包含 "家园/home" → 显示家园
- 包含 "拍照/pic/自拍" → 生成自拍
- 包含 "帮助/help" → 显示帮助

## 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `PACKY_API_KEY` | 是 | PackyAPI 密钥，用于生成图片 |
| `TRAVELCLAW_DATA_PATH` | 否 | 游戏数据存储路径，默认 `~/.openclaw/travelclaw/` |

## 依赖

- Node.js >= 18
- OpenClaw >= 1.0
- PackyAPI 访问权限

## 资源文件

Skill 包含以下资源：

- `src/image/assets/baby.png` —— 幼虾期参考图
- `src/image/assets/teen.png` —— 少年期参考图  
- `src/image/assets/adult.png` —— 青年期参考图
- `src/image/assets/mature.png` —— 壮年期参考图
- `src/image/assets/king.png` —— 虾王期参考图

## 工作流程

1. Skill 加载时初始化游戏引擎
2. 监听用户消息，解析游戏指令
3. 根据指令执行对应游戏逻辑
4. 需要时调用 Gemini API 生成图片
5. 将结果返回给用户

## 注意事项

- 图片生成需要有效的 Gemini API Key
- 每个用户的游戏数据独立存储
- 🦞 的旅行时间从几分钟到几天不等，取决于目的地和行囊
