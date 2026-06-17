/** 与开发计划同步的左侧导航，仅包含已实现模块 */
export const adminMenuGroups = [
  {
    title: '工作台',
    items: [{ path: '/dashboard', title: '经营工作台', icon: 'Odometer' }],
  },
]

export const adminMenuItems = adminMenuGroups.flatMap((group) => group.items)
