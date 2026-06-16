import type { RouteRecordRaw } from 'vue-router'
import type { AppLayout } from '@/types'

function adminRoute(
  path: string,
  name: string,
  title: string,
  component: NonNullable<RouteRecordRaw['component']>,
  icon?: string,
): RouteRecordRaw {
  return {
    path,
    name,
    component,
    meta: { title, layout: 'admin' satisfies AppLayout, icon },
  }
}

function placeholderRoute(path: string, name: string, title: string, icon?: string): RouteRecordRaw {
  return adminRoute(
    path,
    name,
    title,
    () => import('@/views/_placeholder/ModulePlaceholder.vue'),
    icon,
  )
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
      layout: 'blank',
    },
  },
  adminRoute(
    '/overview',
    'Overview',
    '系统总览',
    () => import('@/views/overview/OverviewPage.vue'),
    'Grid',
  ),
  adminRoute(
    '/dashboard',
    'Dashboard',
    '经营工作台',
    () => import('@/views/dashboard/DashboardPage.vue'),
    'Odometer',
  ),
  placeholderRoute('/reports', 'Reports', '报表中心', 'DataAnalysis'),
  placeholderRoute('/marketing', 'Marketing', '营销活动', 'Promotion'),
  placeholderRoute('/ai-agent', 'AiAgent', 'AI 营销 Agent', 'MagicStick'),
  placeholderRoute('/approval', 'Approval', '审批中心', 'DocumentChecked'),
  placeholderRoute('/data-import', 'DataImport', '数据导入', 'Upload'),
  placeholderRoute('/settings', 'Settings', '系统设置', 'Setting'),
  {
    path: '/large-screen',
    name: 'LargeScreen',
    component: () => import('@/views/large-screen/LargeScreenPage.vue'),
    meta: {
      title: '经营指挥大屏',
      layout: 'screen',
      icon: 'Monitor',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

export default routes
