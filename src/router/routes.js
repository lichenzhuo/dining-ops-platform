const routes = [
  {
    path: '/',
    redirect: '/dashboard',
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
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardPage.vue'),
    meta: {
      title: '经营工作台',
      layout: 'admin',
      icon: 'Odometer',
      requiresAuth: true,
    },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/reports/ReportsPage.vue'),
    meta: {
      title: '报表中心',
      layout: 'admin',
      icon: 'DataAnalysis',
      requiresAuth: true,
    },
  },
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
    path: '/geo-visualization',
    name: 'GeoVisualization',
    component: () => import('@/views/geo-visualization/GeoVisualizationPage.vue'),
    meta: {
      title: '地图态势',
      layout: 'admin',
      icon: 'Location',
      requiresAuth: true,
    },
  },
  {
    path: '/visualization-lab',
    name: 'VisualizationLab',
    component: () => import('@/views/visualization-lab/VisualizationLabPage.vue'),
    meta: {
      title: '可视化实验室',
      layout: 'admin',
      icon: 'DataBoard',
      requiresAuth: true,
    },
  },
  {
    path: '/workflow-designer',
    name: 'WorkflowDesigner',
    component: () => import('@/views/workflow-designer/WorkflowDesignerPage.vue'),
    meta: {
      title: '流程设计器',
      layout: 'admin',
      icon: 'Share',
      requiresAuth: true,
    },
  },
  {
    path: '/realtime-monitor',
    name: 'RealtimeMonitor',
    component: () => import('@/views/realtime-monitor/RealtimeMonitorPage.vue'),
    meta: {
      title: '实时监测',
      layout: 'admin',
      icon: 'Connection',
      requiresAuth: true,
    },
  },
  {
    path: '/ai-agent',
    name: 'AiAgent',
    component: () => import('@/views/ai-agent/AiAgentPage.vue'),
    meta: {
      title: 'AI 营销 Agent',
      layout: 'admin',
      icon: 'MagicStick',
      requiresAuth: true,
    },
  },
  {
    path: '/data-import',
    name: 'DataImport',
    component: () => import('@/views/data-import/DataImportPage.vue'),
    meta: {
      title: '数据导入导出',
      layout: 'admin',
      icon: 'Upload',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

export default routes
