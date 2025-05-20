<template>
  <div class="flv-demo">
    <h2>FLV 播放器示例 -- 空闲时间或者被动触发才会加载</h2>
    <div v-if="depsStatus.flv === 'loading'">加载中...</div>
    <div v-else-if="depsStatus.flv === 'unload'">未加载</div>
    <div v-else>
      <video ref="videoRef" controls style="width: 100%; max-width: 800px;"></video>
    </div>
    <button @click="loadDeps('flv')">加载</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLoadDeps } from 'use-load-deps'

const { depsStatus, loadDeps } = useLoadDeps()

</script>

<style scoped>
.flv-demo {
  padding: 20px;
}
</style> 