import type { AppLayout } from '@/types'

export interface AppRouteMeta {
  title: string
  icon?: string
  layout: AppLayout
  requiresAuth?: boolean
  hidden?: boolean
  keepAlive?: boolean
}

export interface MenuItem {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

export const adminMenuItems: MenuItem[] = [
  {
    path: '/overview',
    title: '系统总览',
    icon: 'Grid',
  },
  {
    path: '/dashboard',
    title: '经营工作台',
    icon: 'Odometer',
  },
  {
    path: '/reports',
    title: '报表中心',
    icon: 'DataAnalysis',
  },
  {
    path: '/marketing',
    title: '营销活动',
    icon: 'Promotion',
  },
  {
    path: '/ai-agent',
    title: 'AI 营销 Agent',
    icon: 'MagicStick',
  },
  {
    path: '/approval',
    title: '审批中心',
    icon: 'DocumentChecked',
  },
  {
    path: '/data-import',
    title: '数据导入',
    icon: 'Upload',
  },
  {
    path: '/large-screen',
    title: '经营指挥大屏',
    icon: 'Monitor',
  },
  {
    path: '/settings',
    title: '系统设置',
    icon: 'Setting',
  },
]
