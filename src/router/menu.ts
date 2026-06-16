export interface MenuItem {
  path: string
  title: string
  icon?: string
  external?: boolean
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

/** 与设计稿 / 产品文档一致的左侧导航分组 */
export const adminMenuGroups: MenuGroup[] = [
  {
    title: '工作台',
    items: [
      { path: '/overview', title: '系统总览', icon: 'Grid' },
      { path: '/dashboard', title: '经营工作台', icon: 'Odometer' },
    ],
  },
  {
    title: '经营分析',
    items: [
      { path: '/reports', title: '报表中心', icon: 'DataAnalysis' },
      { path: '/store-ops', title: '门店经营', icon: 'Shop' },
      { path: '/order-reports', title: '订单报表', icon: 'Document' },
    ],
  },
  {
    title: '可视化',
    items: [
      { path: '/large-screen', title: '经营指挥大屏', icon: 'Monitor', external: true },
      { path: '/geo-visualization', title: '地图态势', icon: 'Location' },
      { path: '/visualization-lab', title: '可视化实验室', icon: 'PictureFilled' },
      { path: '/workflow-designer', title: '流程设计器', icon: 'Share' },
    ],
  },
  {
    title: '营销运营',
    items: [
      { path: '/marketing', title: '营销活动', icon: 'Promotion' },
      { path: '/coupons', title: '卡券中心', icon: 'Ticket' },
      { path: '/members', title: '会员运营', icon: 'UserFilled' },
      { path: '/staff-promotion', title: '员工推广', icon: 'Avatar' },
      { path: '/brand-seeding', title: '品牌种草', icon: 'ChatDotRound' },
      { path: '/ai-agent', title: 'AI 营销助手', icon: 'MagicStick' },
      { path: '/materials', title: '素材库', icon: 'FolderOpened' },
    ],
  },
  {
    title: '流程协同',
    items: [
      { path: '/approval', title: '审批中心', icon: 'DocumentChecked' },
      { path: '/data-import', title: '数据导入', icon: 'Upload' },
    ],
  },
  {
    title: '工程实践',
    items: [
      { path: '/performance-lab', title: '性能优化实验室', icon: 'Cpu' },
      { path: '/ai-coding', title: 'AI Coding 沉淀', icon: 'EditPen' },
    ],
  },
  {
    title: '系统',
    items: [{ path: '/settings', title: '系统设置', icon: 'Setting' }],
  },
]

export const adminMenuItems = adminMenuGroups.flatMap((group) => group.items)
