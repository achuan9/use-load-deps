import type { Router, RouteLocationNormalized } from 'vue-router'
import { useLoadDeps } from '@achuan9/use-load-deps'



export function setupDepsGuard(router: Router) {
  
  const { getUnloadDeps, loadDeps, loadDepsOnIdle } = useLoadDeps({
    onLoading: (dep: string) => console.log(`Loading by router guard: ${dep}...`),
    onLoaded: (dep: string) => {
      console.log(`Loading by router guard: ${dep} loaded!`)
      
    },
    onError: (dep: string, error: Error) => console.error(`Loading by router guard: Failed to load ${dep}:`, error)
  })
  

  router.beforeEach(async (to: RouteLocationNormalized) => {

    // 获取目标路由需要的依赖
    const targetDeps = to.meta.deps as string[] || []
    console.log('目标路由需要的依赖，必须加载完才能进入', targetDeps)

    if (targetDeps.length > 0) {
      // 加载目标路由的依赖
      try {
        await loadDeps(targetDeps)
      } catch (error) {
        console.error('Failed to load dependencies:', error)
      }
    }
    return true;
  })

  router.afterEach(() => {
    // 获取所有未加载的依赖
    const unloadDeps = getUnloadDeps()
    console.log('未加载的依赖，利用空闲时间加载', unloadDeps)
    // 在空闲时间加载其他依赖
    if (unloadDeps.length > 0) {
      loadDepsOnIdle(unloadDeps)
    }
  })
} 