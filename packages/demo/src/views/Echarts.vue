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
import { useLoadDeps } from 'use-load-deps'

const chartRef = ref<HTMLElement>()
const { depsStatus, loadDeps } = useLoadDeps({
  onLoading: (dep) => console.log(`echarts: Loading ${dep}...`),
  onLoaded: (dep) => console.log(`echarts: ${dep} loaded!`),
  onError: (dep, error) => console.error(`echarts: Failed to load ${dep}:`, error)
})

onMounted(async () => {
  await loadDeps('echarts')
  if (chartRef.value) {
    echarts.init(chartRef.value)
    // 创建地图
  }
})
</script>

<style scoped>
.echarts-demo {
  padding: 20px;
}
</style> 