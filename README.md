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
pnpm add use-load-deps

# Using npm
npm install use-load-deps

# Using yarn
yarn add use-load-deps
```

## Usage

### 1. Configure Dependencies

First, configure the dependencies you want to load in your application entry:

```typescript
import { setDepsConfig } from 'use-load-deps'

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

### 2. Use in Components

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
import { useLoadDeps } from 'use-load-deps'

const { depsStatus, loadDeps, loadDepsOnIdle } = useLoadDeps({
  onLoading: (dep) => console.log(`Loading ${dep}...`),
  onLoaded: (dep) => console.log(`${dep} loaded!`),
  onError: (dep, error) => console.error(`Failed to load ${dep}:`, error)
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