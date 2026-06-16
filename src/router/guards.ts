import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { getDefaultHomePath } from '@/utils/menu'

const WHITE_LIST = ['/login']

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const auth = useAuthStore()

    if (!auth.sessionReady) {
      await auth.restoreSession()
    }

    const requiresAuth = to.meta.requiresAuth !== false
    const isWhiteListed = WHITE_LIST.includes(to.path)

    if (auth.isLoggedIn && to.path === '/login') {
      next(getDefaultHomePath(auth.menuPaths))
      return
    }

    if (!requiresAuth || isWhiteListed) {
      next()
      return
    }

    if (!auth.isLoggedIn) {
      next({
        path: '/login',
        query: to.fullPath === '/' ? undefined : { redirect: to.fullPath },
      })
      return
    }

    if (!auth.canAccessPath(to.path)) {
      ElMessage.warning('暂无访问该页面的权限')
      next(getDefaultHomePath(auth.menuPaths))
      return
    }

    const routeRoles = to.meta.roles
    if (routeRoles?.length && !auth.hasAnyRole(routeRoles)) {
      ElMessage.warning('当前角色无权访问该页面')
      next(getDefaultHomePath(auth.menuPaths))
      return
    }

    next()
  })
}
