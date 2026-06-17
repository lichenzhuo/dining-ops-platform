/** 与开发计划同步的左侧导航，仅包含已实现模块 */
export const adminMenuGroups = [
  {
    title: '工作台',
    items: [
      { path: '/dashboard', title: '经营工作台', icon: 'Odometer' },
      { path: '/approval', title: '审批中心', icon: 'Checked' },
    ],
  },
  {
    title: '营销',
    items: [{ path: '/ai-agent', title: 'AI 营销 Agent', icon: 'MagicStick' }],
  },
  {
    title: '数据',
    items: [{ path: '/data-import', title: '数据导入导出', icon: 'Upload' }],
  },
  {
    title: '分析',
    items: [
      { path: '/reports', title: '报表中心', icon: 'DataAnalysis' },
      { path: '/geo-visualization', title: '地图态势', icon: 'Location' },
      { path: '/visualization-lab', title: '可视化实验室', icon: 'DataBoard' },
      { path: '/workflow-designer', title: '流程设计器', icon: 'Share' },
      { path: '/realtime-monitor', title: '实时监测', icon: 'Connection' },
      { path: '/large-screen', title: '经营指挥大屏', icon: 'Monitor' },
    ],
  },
]

export const adminMenuItems = adminMenuGroups.flatMap((group) => group.items)
