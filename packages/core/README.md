# use-load-deps

A Vue 3 composable for managing external dependencies (like JS and CSS files) loading.

## Features

- 🚀 On-demand loading of external dependencies
- 🔄 Parallel or sequential loading support
- ⏱️ Idle time loading support
- 🔒 Prevents duplicate loading
- 📊 Loading status management
- 🎯 Loading callback functions

## Installation

```bash
# Using pnpm
pnpm add @achuan9/use-load-deps

# Using npm
npm install @achuan9/use-load-deps

# Using yarn
yarn add @achuan9/use-load-deps
```

## Usage

### 1. Basic Usage

First, configure the dependencies you want to load in your application entry:

```typescript
import { setDepsConfig } from '@achuan9/use-load-deps'

setDepsConfig({
  // Configure dependencies
  flv: {
    js: ['https://cdn.jsdelivr.net/npm/flv.js/dist/flv.min.js'],
    css: ['https://cdn.jsdelivr.net/npm/flv.js/dist/flv.min.css'],
  },
  echarts: {
    js: ['https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js'],
    sequential: true, // Load sequentially
  }
})
```

Then use in your components:

```vue
<template>
  <div>
    <div v-if="depsStatus.flv === 'loading'">Loading...</div>
    <div v-else-if="depsStatus.flv === 'unload'">Not loaded</div>
    <div v-else>
      <!-- Content after dependency is loaded -->
    </div>
    <button @click="loadDeps('flv')">Load Dependency</button>
  </div>
</template>

<script setup lang="ts">
import { useLoadDeps } from '@achuan9/use-load-deps'

const { depsStatus, loadDeps, loadDepsOnIdle } = useLoadDeps({
  onLoading: (dep) => console.log(`Loading ${dep}...`),
  onLoaded: (dep) => console.log(`${dep} loaded!`),
  onError: (dep, error) => console.error(`Failed to load ${dep}:`, error)
})
</script>
```

### 2. Router Guard Usage

```typescript
// main.ts
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { setDepsConfig } from '@achuan9/use-load-deps'
import type { ExternalDependencies } from '@achuan9/use-load-deps'
import { setupDepsGuard } from './router/guard'

// 1. First configure dependencies
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

// 2. Set global dependency configuration (must be before setupDepsGuard)
setDepsConfig(depsConfig)

// 3. Create router
const router = createRouter({
  routes: [
    {
      path: '/echarts',
      component: () => import('./views/Echarts.vue'),
      meta: {
        deps: ['echarts'] // Specify dependencies required by the route
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

// 4. Setup router guard
setupDepsGuard(router)

// 5. Create app
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

  // Load dependencies before route enters
  router.beforeEach(async (to: RouteLocationNormalized) => {
    const targetDeps = to.meta.deps as string[] || []
    console.log('Dependencies required by target route, must be loaded before entering', targetDeps)

    if (targetDeps.length > 0) {
      try {
        await loadDeps(targetDeps)
      } catch (error) {
        console.error('Failed to load dependencies:', error)
      }
    }
    return true
  })

  // Load other dependencies during idle time after route enters
  router.afterEach(() => {
    const unloadDeps = getUnloadDeps()
    console.log('Unloaded dependencies, load during idle time', unloadDeps)
    if (unloadDeps.length > 0) {
      loadDepsOnIdle(unloadDeps)
    }
  })
}

// views/Echarts.vue
<template>
  <div class="echarts-demo">
    <h2>Echarts Example -- Enter page only after loading is complete</h2>
    <div v-if="depsStatus.echarts === 'loading'">Loading...</div>
    <div v-else-if="depsStatus.echarts === 'unload'">Not loaded</div>
    <div v-else>Loaded</div>
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
    // Create chart
  }
})
</script>
```

## API

### setDepsConfig

Configure the dependencies to be loaded.

```typescript
setDepsConfig(config: ExternalDependencies)
```

#### Parameters

- `config`: Dependency configuration object
  ```typescript
  interface ExternalDependencies {
    [key: string]: {
      js?: string[];      // Array of JS file URLs
      css?: string[];     // Array of CSS file URLs
      sequential?: boolean; // Whether to load JS files sequentially
    }
  }
  ```

### useLoadDeps

Returns dependency loading related states and methods.

```typescript
const { depsStatus, loadDeps, loadDepsOnIdle, getUnloadDeps } = useLoadDeps(callbacks?)
```

#### Parameters

- `callbacks`: Optional callback functions object
  ```typescript
  interface LazyDepsCallbacks {
    onLoading?: (dep: string) => void;    // Triggered when loading starts
    onLoaded?: (dep: string) => void;     // Triggered when loading completes
    onError?: (dep: string, error: Error) => void; // Triggered when loading fails
  }
  ```

#### Returns

- `depsStatus`: Reactive dependency status object
  ```typescript
  {
    [key: string]: 'unload' | 'loading' | 'loaded'
  }
  ```
- `loadDeps`: Method to load dependencies
  ```typescript
  (deps: string | string[]) => Promise<ExternalDependencyStatus>
  ```
- `loadDepsOnIdle`: Method to load dependencies during idle time
  ```typescript
  (deps: string | string[]) => Promise<ExternalDependencyStatus>
  ```
- `getUnloadDeps`: Get list of unloaded dependencies
  ```typescript
  () => string[]
  ```

## Dependency Status

Dependencies can have one of three states:

- `unload`: Not loaded
- `loading`: Currently loading
- `loaded`: Successfully loaded

## Features

1. **Prevent Duplicate Loading**:
   - Reuses existing loading Promise if dependency is already loading
   - Skips loading if dependency is already loaded

2. **Parallel/Sequential Loading**:
   - Loads all JS files in parallel by default
   - Set `sequential: true` to load JS files sequentially
   - CSS files are always loaded in parallel

3. **Idle Time Loading**:
   - Uses `requestIdleCallback` to load dependencies during browser idle time
   - Falls back to immediate loading if `requestIdleCallback` is not supported

4. **Status Management**:
   - Provides reactive dependency status
   - Supports loading status callbacks
   - Includes error handling

## License

MIT 