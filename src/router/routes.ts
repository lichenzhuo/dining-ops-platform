import type { RouteRecordRaw } from 'vue-router'
import type { AppLayout } from '@/types'
import type { UserRole } from '@/types/auth'
import { getRolesForPath } from '@/mocks/auth'
import { adminMenuItems } from './menu'

interface AdminRouteOptions {
  icon?: string
  roles?: UserRole[]
}

function adminRoute(
  path: string,
  name: string,
  title: string,
  component: NonNullable<RouteRecordRaw['component']>,
  options: AdminRouteOptions = {},
): RouteRecordRaw {
  return {
    path,
    name,
    component,
    meta: {
      title,
      layout: 'admin' satisfies AppLayout,
      icon: options.icon,
      requiresAuth: true,
      roles: options.roles ?? getRolesForPath(path),
    },
  }
}

function placeholderRoute(path: string, name: string, title: string, icon?: string): RouteRecordRaw {
  return adminRoute(
    path,
    name,
    title,
    () => import('@/views/_placeholder/ModulePlaceholder.vue'),
    { icon },
  )
}

const placeholderRoutes: RouteRecordRaw[] = adminMenuItems
  .filter((item) => !['/overview', '/dashboard', '/large-screen'].includes(item.path))
  .map((item) => {
    const name = item.path
      .replace(/^\//, '')
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
    return placeholderRoute(item.path, name || 'Module', item.title, item.icon)
  })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/overview',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
      layout: 'blank',
      requiresAuth: false,
    },
  },
  adminRoute(
    '/overview',
    'Overview',
    '系统总览',
    () => import('@/views/overview/OverviewPage.vue'),
    { icon: 'Grid' },
  ),
  adminRoute(
    '/dashboard',
    'Dashboard',
    '经营工作台',
    () => import('@/views/dashboard/DashboardPage.vue'),
    { icon: 'Odometer' },
  ),
  ...placeholderRoutes.filter(
    (route, index, self) => self.findIndex((item) => item.path === route.path) === index,
  ),
  {
    path: '/large-screen',
    name: 'LargeScreen',
    component: () => import('@/views/large-screen/LargeScreenPage.vue'),
    meta: {
      title: '经营指挥大屏',
      layout: 'screen',
      icon: 'Monitor',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/overview',
  },
]

export default routes
