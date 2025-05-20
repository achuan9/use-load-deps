# 开发者文档

## 项目结构

```
use-load-deps/
├── packages/
│   ├── core/           # 核心包
│   │   ├── src/        # 源代码
│   │   ├── dist/       # 构建输出
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── demo/           # 示例应用
│       ├── src/
│       └── package.json
├── package.json        # 根目录 package.json
└── pnpm-workspace.yaml # pnpm 工作空间配置
```

## 开发环境设置

1. 安装依赖：

```bash
pnpm install
```

2. 启动开发服务器：

```bash
# 启动核心包开发
pnpm dev:core

# 启动示例应用开发
pnpm dev:demo

# 同时启动核心包和示例应用
pnpm dev
```

## 开发流程

### 核心包开发

1. 在 `packages/core/src` 目录下进行开发
2. 使用 `pnpm dev:core` 启动开发服务器，支持热重载
3. 在 `packages/demo` 中测试核心包的功能

### 类型检查

```bash
pnpm typecheck
```

### 构建

```bash
# 构建所有包
pnpm build

# 只构建核心包
cd packages/core && pnpm build
```

## 发布流程

### 1. 准备工作

1. 确保您已登录到 npm：

```bash
npm login
```

2. 确保您在 `packages/core` 目录下：

```bash
cd packages/core
```

### 2. 发布前检查

1. 更新版本号（如果需要）：

```bash
npm version patch  # 小版本更新
npm version minor  # 中版本更新
npm version major  # 大版本更新
```

2. 检查构建输出：

```bash
pnpm build
```

3. 检查打包内容：

```bash
npm pack
```

这将创建一个 `.tgz` 文件，您可以检查其中包含的文件是否符合预期。

### 3. 发布

1. 执行发布：

```bash
npm publish
```

### 4. 发布后检查

1. 在 npm 网站上检查包是否成功发布
2. 测试安装和使用：

```bash
npm install use-load-deps
```

## 注意事项

1. 确保 `package.json` 中的 `files` 字段只包含必要文件
2. 确保 `vite.config.ts` 中的构建配置正确
3. 确保 `README.md` 和 `README.zh-CN.md` 是最新的
4. 确保所有类型定义都正确导出

## 常见问题

### 1. 发布时包含不需要的文件

确保 `package.json` 中的 `files` 字段正确配置，并且没有 `.npmignore` 文件影响发布。

### 2. 类型定义不完整

确保 `vite-plugin-dts` 配置正确，并且所有类型都正确导出。

### 3. 构建失败

检查 `vite.config.ts` 配置，确保所有依赖都正确配置。

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 