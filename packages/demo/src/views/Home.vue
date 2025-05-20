<template>
  <div class="home">
    <h1>依赖加载示例</h1>
    <div class="demo-links">
      <router-link to="/echarts">Echarts 示例</router-link>
      <router-link to="/flv">FLV 播放器示例</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.demo-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 300px;
  margin: 40px auto;
}

.demo-links a {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.demo-links a:hover {
  background-color: #45a049;
}
</style> 