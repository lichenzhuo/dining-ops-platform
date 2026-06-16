import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/overview',
  },
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('@/views/overview/OverviewPage.vue'),
    meta: {
      title: '系统总览',
      layout: 'blank',
    },
  },
]

export default routes
