/** 与开发计划同步的左侧导航，仅包含已实现模块 */
export const adminMenuGroups = [
  {
    title: '工作台',
    items: [{ path: '/dashboard', title: '经营工作台', icon: 'Odometer' }],
  },
  {
    title: '分析',
    items: [
      { path: '/reports', title: '报表中心', icon: 'DataAnalysis' },
      { path: '/geo-visualization', title: '地图态势', icon: 'Location' },
      { path: '/large-screen', title: '经营指挥大屏', icon: 'Monitor' },
    ],
  },
]

export const adminMenuItems = adminMenuGroups.flatMap((group) => group.items)
