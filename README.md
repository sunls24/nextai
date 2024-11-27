# 💬 概述

一个简单而优雅的 AI 聊天程序

支持 ChatGPT **函数调用：**

- Google 搜索 (使用[`Programmable Search Engine`](https://programmablesearchengine.google.com/about/))

## ⚙️ 设置

#### 环境变量

- `OPENAI_API_KEY`：懂得都懂
- `OPENAI_BASE_URL`: OpenAI 代理或者 OneAPI 地址（可选）
- `GOOGLE_API_KEY`：用于 Google 搜索插件（可选）
- `GOOGLE_ENGINE_ID`：用于 Google 搜索插件（可选）

## 🚀 本地运行

1. 克隆仓库：

```sh
git clone https://github.com/sunls24/nextai
```

2. 安装依赖项：

```bash
pnpm install
```

3. 本地运行：

```bash
# 设置环境变量 OPENAI_API_KEY=sk-xxx
touch .env.local
# 本地运行
pnpm dev
```

## ☁️ 使用 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsunls24%2Fnextai&env=OPENAI_API_KEY,OPENAI_BASE_URL,GOOGLE_API_KEY,GOOGLE_ENGINE_ID)
