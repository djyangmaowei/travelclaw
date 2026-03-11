# 🎨 图像生成平台配置指南

TravelClaw 支持多种图像生成 API，你可以根据自己的需求选择。

---

## 🌟 推荐平台

### PackyAPI (豆包 Seedream) - 推荐

国内速度快，支持豆包 Seedream 模型，效果适合 🦞 的风格。

```bash
export IMAGE_API_KEY="sk-your-packy-key"
export IMAGE_API_BASE="https://www.packyapi.com"
export IMAGE_API_MODEL="doubao-seedream-5.0-lite"
```

**特点：**
- ✅ 国内访问快
- ✅ 手绘插画风格出色
- ✅ 价格便宜
- ⚠️ 需要 1920x1920 以上尺寸

---

## 🌍 国际平台

### OpenAI (DALL-E 3)

```bash
export IMAGE_API_KEY="sk-your-openai-key"
export IMAGE_API_MODEL="dall-e-3"
```

**特点：**
- ✅ 质量最高
- ✅ 理解能力强
- ⚠️ 价格较贵
- ⚠️ 需要翻墙

### Gemini (Google)

```bash
export IMAGE_API_KEY="AIza-your-gemini-key"
```

**特点：**
- ✅ 免费额度 generous
- ✅ 速度快
- ⚠️ 部分地区受限

---

## 🔧 中转站/聚合平台

### OneAPI / NewAPI

如果你有自己的 OneAPI/NewAPI 中转站：

```bash
export IMAGE_API_KEY="sk-your-key"
export IMAGE_API_BASE="https://your-api-domain.com"
export IMAGE_API_MODEL="your-model-name"
```

### 自定义 OpenAI 兼容接口

任何兼容 OpenAI `/v1/images/generations` 接口的服务：

```bash
export IMAGE_API_KEY="your-key"
export IMAGE_API_BASE="https://api.custom-service.com"
export IMAGE_API_MODEL="sdxl"  # 或其他模型
```

---

## 📝 环境变量说明

| 变量 | 必需 | 说明 |
|------|------|------|
| `IMAGE_API_KEY` | ✅ | API 密钥 |
| `IMAGE_API_BASE` | ❌ | 自定义 API 地址 |
| `IMAGE_API_MODEL` | ❌ | 指定模型名称 |

---

## 🔍 自动检测

如果不指定 `IMAGE_API_BASE`，系统会自动检测：

| Key 特征 | 自动识别为 |
|----------|-----------|
| `sk-qSyl...` 或 URL 含 `packyapi` | PackyAPI |
| `AIza...` | Gemini |
| 其他 | OpenAI 兼容接口 |

---

## 💡 选择建议

| 场景 | 推荐平台 |
|------|---------|
| 国内用户，追求性价比 | PackyAPI |
| 追求最高质量 | OpenAI DALL-E 3 |
| 免费使用 | Gemini |
| 已有中转站 | 自定义接口 |

---

## 🐛 常见问题

### Q: 为什么生成失败？

检查：
1. API Key 是否正确
2. 余额是否充足
3. 模型名称是否正确
4. 尺寸参数是否被支持

### Q: 如何切换平台？

修改环境变量后重启 OpenClaw：
```bash
export IMAGE_API_KEY="new-key"
export IMAGE_API_BASE="new-url"
openclaw gateway restart
```

### Q: 支持图生图吗？

目前只支持文生图。图生图（保持角色一致性）需要额外开发，计划中！

---

愿你的 🦞 旅行明信片美美哒！🦞✨
