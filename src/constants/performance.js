/** 可视化性能优化专题：四类场景与项目内落地点 */
export const PERF_TECHNIQUE_GROUPS = [
  {
    key: 'report',
    title: '报表 / 表格',
    summary: '服务端分页 + 虚拟滚动，避免一次性挂载大量 DOM。',
    items: [
      { name: '服务端分页', location: '报表中心 /reports', status: 'done' },
      { name: '虚拟滚动表格', location: '性能专题 /performance-lab', status: 'done' },
    ],
  },
  {
    key: 'chart',
    title: '图表 / ECharts',
    summary: '实例复用、Resize 节流、setOption lazyUpdate。',
    items: [
      { name: 'ECharts 实例复用', location: 'BaseChart.vue', status: 'done' },
      { name: 'ResizeObserver 节流', location: 'BaseChart.vue', status: 'done' },
      { name: 'setOption lazyUpdate', location: 'BaseChart.vue', status: 'done' },
    ],
  },
  {
    key: 'file',
    title: '文件 / Excel',
    summary: '大文件解析放 Web Worker，主线程只负责 UI。',
    items: [
      { name: 'Web Worker 解析 xlsx', location: 'data-import + xlsxParse.worker.js', status: 'done' },
      { name: '导出任务队列', location: 'stores/exportQueue.js', status: 'done' },
    ],
  },
  {
    key: 'map',
    title: '地图 / Canvas / 3D',
    summary: '视口裁剪、分层渲染、点位聚合、路由懒加载与分包。',
    items: [
      { name: 'Canvas 视口裁剪', location: 'CanvasStorePointsDemo optimized', status: 'done' },
      { name: 'Cesium 点位聚合', location: 'createCesiumGeoViewer.js', status: 'done' },
      { name: 'Cesium 按视野统计', location: 'CesiumGeoScene + perf-lab', status: 'done' },
      { name: '路由懒加载', location: 'router/routes.js', status: 'done' },
      { name: 'Vite manualChunks', location: 'vite.config.js', status: 'done' },
    ],
  },
]

export const ROUTE_LAZY_MODULES = [
  { path: '/dashboard', chunk: 'views/dashboard' },
  { path: '/reports', chunk: 'views/reports' },
  { path: '/large-screen', chunk: 'views/large-screen' },
  { path: '/geo-visualization', chunk: 'views/geo-visualization' },
  { path: '/geo-3d', chunk: 'views/geo-3d + vendor-cesium' },
  { path: '/visualization-lab', chunk: 'views/visualization-lab + vendor-three' },
  { path: '/performance-lab', chunk: 'views/performance-lab' },
  { path: '/workflow-designer', chunk: 'views/workflow-designer + vendor-x6' },
  { path: '/realtime-monitor', chunk: 'views/realtime-monitor' },
  { path: '/ai-agent', chunk: 'views/ai-agent' },
  { path: '/data-import', chunk: 'views/data-import + vendor-xlsx' },
  { path: '/approval', chunk: 'views/approval' },
]
