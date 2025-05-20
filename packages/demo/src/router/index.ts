import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Echarts from '../views/Echarts.vue'
import Flv from '../views/Flv.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        deps: [] // 首页不需要依赖
      }
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: Echarts,
      meta: {
        deps: ['echarts']
      }
    },
    {
      path: '/flv',
      name: 'flv',
      component: Flv
    }
  ]
})


export default router 