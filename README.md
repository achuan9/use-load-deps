# use-load-deps

一个用于管理外部依赖（如JS、CSS文件）加载的 Vue 3 组合式 API 工具。

## 文档

- [English Documentation](packages/core/README.md)
- [中文文档](packages/core/README.zh-CN.md)

## 特性

- 🚀 支持按需加载外部依赖
- 🔄 支持并行或串行加载
- ⏱️ 支持空闲时间加载
- 🔒 防止重复加载
- 📊 提供加载状态管理
- 🎯 支持加载回调函数

## 安装

```bash
# 使用 pnpm
pnpm add @achuan9/use-load-deps

# 使用 npm
npm install @achuan9/use-load-deps

# 使用 yarn
yarn add @achuan9/use-load-deps
```

## 快速开始

### 基础用法

```typescript
import { setDepsConfig } from '@achuan9/use-load-deps'

// 配置依赖
setDepsConfig({
  echarts: {
    js: ['https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js'],
    sequential: true,
  }
})

// 在组件中使用
import { useLoadDeps } from '@achuan9/use-load-deps'

const { depsStatus, loadDeps } = useLoadDeps()
```

### 路由守卫用法

```typescript
// main.ts
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { setDepsConfig } from '@achuan9/use-load-deps'
import type { ExternalDependencies } from '@achuan9/use-load-deps'
import { setupDepsGuard } from './router/guard'

// 1. 首先配置依赖
export const depsConfig: ExternalDependencies = {
  echarts: {
    js: ['https://cdn.bootcdn.net/ajax/libs/echarts/5.6.0/echarts.min.js'],
    css: [],
    sequential: true
  },
  flv: {
    js: ['https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.2/flv.min.js'],
    css: []
  }
}

// 2. 设置全局依赖配置（必须在 setupDepsGuard 之前）
setDepsConfig(depsConfig)

// 3. 创建路由
const router = createRouter({
  routes: [
    {
      path: '/echarts',
      component: () => import('./views/Echarts.vue'),
      meta: {
        deps: ['echarts'] // 指定路由需要的依赖
      }
    },
    {
      path: '/flv',
      component: () => import('./views/Flv.vue'),
      meta: {
        deps: ['flv']
      }
    }
  ]
})

// 4. 设置路由守卫
setupDepsGuard(router)

// 5. 创建应用
const app = createApp(App)
app.use(router)
app.mount('#app')

// router/guard.ts
import { useLoadDeps } from '@achuan9/use-load-deps'
import type { Router, RouteLocationNormalized } from 'vue-router'

export function setupDepsGuard(router: Router) {
  const { getUnloadDeps, loadDeps, loadDepsOnIdle } = useLoadDeps({
    onLoading: (dep) => console.log(`Loading ${dep}...`),
    onLoaded: (dep) => console.log(`${dep} loaded!`),
    onError: (dep, error) => console.error(`Failed to load ${dep}:`, error)
  })

  // 路由进入前加载依赖
  router.beforeEach(async (to: RouteLocationNormalized) => {
    const targetDeps = to.meta.deps as string[] || []
    console.log('目标路由需要的依赖，必须加载完才能进入', targetDeps)

    if (targetDeps.length > 0) {
      try {
        await loadDeps(targetDeps)
      } catch (error) {
        console.error('Failed to load dependencies:', error)
      }
    }
    return true
  })

  // 路由进入后，利用空闲时间加载其他依赖
  router.afterEach(() => {
    const unloadDeps = getUnloadDeps()
    console.log('未加载的依赖，利用空闲时间加载', unloadDeps)
    if (unloadDeps.length > 0) {
      loadDepsOnIdle(unloadDeps)
    }
  })
}

// views/Echarts.vue
<template>
  <div class="echarts-demo">
    <h2>Echarts 示例 -- 确定加载完成才进入页面</h2>
    <div v-if="depsStatus.echarts === 'loading'">加载中...</div>
    <div v-else-if="depsStatus.echarts === 'unload'">未加载</div>
    <div v-else>加载完成</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLoadDeps } from '@achuan9/use-load-deps'

const chartRef = ref<HTMLElement>()
const { depsStatus } = useLoadDeps({
  onLoading: (dep) => console.log(`echarts: Loading ${dep}...`),
  onLoaded: (dep) => console.log(`echarts: ${dep} loaded!`),
  onError: (dep, error) => console.error(`echarts: Failed to load ${dep}:`, error)
})

onMounted(() => {
  if (chartRef.value) {
    echarts.init(chartRef.value)
    // 创建地图
  }
})
</script>
```

## 示例

查看 [demo 项目](packages/demo) 了解更多使用示例。

## 许可证

MIT 