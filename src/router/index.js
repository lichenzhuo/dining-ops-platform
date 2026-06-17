import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import routes from './routes'

const isElectronApp = import.meta.env.VITE_ELECTRON === 'true'

const router = createRouter({
  history: isElectronApp
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

setupRouterGuards(router)

router.afterEach((to) => {
  const title = to.meta.title || '餐饮连锁运营平台'
  document.title = `${title} · Dining Ops Platform`
})

export default router
