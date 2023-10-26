# 📌 概述

**Chat AI:** 一个简单而优雅的 AI 聊天程序

## ⚙️ 设置

#### 环境变量

- `OPENAI_API_KEY`：不必多说，懂的都懂
- `GOOGLE_API_KEY`：用于 Google 搜索插件（可选）
- `GOOGLE_ENGINE_ID`：用于 Google 搜索插件（可选）
- `AMAP_KEY`：用于查询天气插件，_(使用高德开放平台)_（可选）

## 🚀 本地运行

1. 克隆仓库：

```sh
git clone https://github.com/sunls24/chat-ai
```

2. 安装依赖项：

```bash
pnpm install
```

3. 开发模式：

```bash
pnpm run dev
```

## ☁️ 使用 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsunls24%2Fchat-ai&env=OPENAI_API_KEY,GOOGLE_API_KEY,GOOGLE_ENGINE_ID,AMAP_KEY)
