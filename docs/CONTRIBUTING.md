# 🤝 贡献指南

感谢你对 TravelClaw 的兴趣！我们欢迎各种形式的贡献。

## 如何贡献

### 报告 Bug

1. 使用 GitHub Issues
2. 描述 Bug 的复现步骤
3. 说明期望行为和实际行为
4. 提供环境信息（Node.js 版本、操作系统等）

### 提交功能建议

1. 使用 GitHub Issues，打上 `enhancement` 标签
2. 清晰描述功能和使用场景
3. 如果可能，提供实现思路

### 代码贡献

1. **Fork** 仓库
2. **创建分支**: `git checkout -b feature/amazing-feature`
3. **提交修改**: `git commit -m 'Add amazing feature'`
4. **推送分支**: `git push origin feature/amazing-feature`
5. **创建 Pull Request**

## 开发指南

### 环境设置

```bash
# 克隆仓库
git clone https://github.com/djyangmaowei/travelclaw.git
cd travelclaw

# 安装依赖
pnpm install

# 配置环境变量
export GEMINI_API_KEY="your-api-key"
```

### 代码风格

- 使用 ES Modules
- 函数使用 camelCase
- 类名使用 PascalCase
- 常量使用 UPPER_SNAKE_CASE
- 使用 2 空格缩进

### 项目结构

```
src/
  core/       # 核心游戏逻辑
  content/    # 游戏内容数据
  image/      # 图片生成
  storage/    # 数据存储
  utils/      # 工具函数
```

### 添加新地点

在 `src/content/locations.js` 中添加：

```javascript
my_new_location: {
  id: 'my_new_location',
  name: '地点名称',
  emoji: '🏛️',
  region: 'region_id',
  description: '地点描述',
  activities: ['活动1', '活动2'],
  souvenirs: ['souvenir_id1', 'souvenir_id2']
}
```

### 添加新道具

在 `src/content/items.js` 中添加到对应的分类：

```javascript
my_item: {
  id: 'my_item',
  name: '道具名称',
  emoji: '🎁',
  price: 50,
  type: 'food', // food, gear, decoration
  description: '道具描述',
  effect: { energy: 30, luck: 0.1 }
}
```

### 添加新对话

在 `src/content/dialogues.js` 中添加到对应的分类数组。

## 代码审查

所有 PR 都需要：
- 至少一个审查者批准
- 通过 CI 检查
- 符合代码风格

## 行为准则

- 友善和尊重
- 欢迎新手
- 接受建设性批评
- 关注对社区最有利的事情

## 许可

贡献即表示你同意将你的代码以 MIT 许可协议发布。

---

🦞 感谢你的贡献！
