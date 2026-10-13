# Salary Manager Server

工资管理项目的后端服务，基于 NestJS 和 TypeScript 构建。

> 当前仓库处于基础服务骨架阶段：已配置环境变量、API 统一前缀和 CORS，并提供默认示例接口；尚未实现工资管理业务、数据库或用户认证。

## 技术栈

- Node.js、TypeScript
- [NestJS](https://nestjs.com/)
- Jest、Supertest（单元测试与端到端测试）
- Oxlint（代码检查）

## 环境要求

- Node.js（建议使用 Node.js 20 或更高版本）
- npm

## 安装与运行

```bash
npm install
cp .env.example .env
npm run start:dev
```

开发服务器默认监听 `http://localhost:3000`。修改 `src/` 下的代码后，开发模式会自动重新加载。

生产构建与启动：

```bash
npm run build
npm run start:prod
```

## 环境变量

服务从项目根目录的 `.env` 文件读取配置。可从 `.env.example` 复制并按需修改：

| 变量 | 示例值 | 说明 |
| --- | --- | --- |
| `NODE_ENV` | `development` | 运行环境标识 |
| `PORT` | `3000` | 服务监听端口 |
| `API_PREFIX` | `api` | API 统一前缀 |
| `API_VERSION` | `v1` | API 版本 |
| `CORS_ORIGIN` | `http://localhost:5173` | 允许跨域访问的来源；多个来源使用逗号分隔 |

未设置时，服务默认使用端口 `3000`、前缀 `api/v1` 和来源 `http://localhost:5173`。CORS 请求允许携带凭证；配置允许来源时不要使用 `*`。

## API

当前已实现的接口：

| 方法 | 路径 | 响应 |
| --- | --- | --- |
| `GET` | `/api/v1/` | `Hello World!`（纯文本） |

本地验证：

```bash
curl http://localhost:3000/api/v1/
```

## 开发命令

| 命令 | 说明 |
| --- | --- |
| `npm run start` | 启动服务 |
| `npm run start:dev` | 以监听模式启动服务 |
| `npm run start:debug` | 以调试和监听模式启动服务 |
| `npm run build` | 编译生产版本到 `dist/` |
| `npm run start:prod` | 启动已编译的生产版本 |
| `npm run lint` | 检查 `src/` 和 `test/` |
| `npm run format` | 格式化源代码与测试文件 |
| `npm run test` | 运行单元测试 |
| `npm run test:watch` | 以监听模式运行单元测试 |
| `npm run test:cov` | 运行单元测试并生成覆盖率报告 |
| `npm run test:e2e` | 运行端到端测试 |

## 项目结构

```text
src/
  app.controller.ts       # HTTP 路由
  app.service.ts          # 示例服务逻辑
  app.module.ts           # 应用模块与全局配置模块
  main.ts                 # 应用启动、全局 API 前缀与 CORS 配置
  app.controller.spec.ts  # 控制器单元测试
test/
  app.e2e-spec.ts         # 端到端测试
.env.example              # 环境变量示例
```
