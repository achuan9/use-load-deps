import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { setDepsConfig } from 'use-load-deps'
import type { ExternalDependencies } from 'use-load-deps'
import { setupDepsGuard } from './router/guard'

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
// 设置全局依赖配置
setDepsConfig(depsConfig);
setupDepsGuard(router)

const app = createApp(App);
app.use(router);
app.mount("#app");
