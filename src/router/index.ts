import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

setupRouterGuards(router)

router.afterEach((to) => {
  const title = (to.meta.title as string) || '餐饮连锁运营平台'
  document.title = `${title} · Dining Ops Platform`
})

export default router
