/** 按钮级权限码 */
export const PERMISSIONS = {
  REPORT_EXPORT: 'report:export',
  REPORT_FIELD_CONFIG: 'report:field-config',
  DATA_IMPORT: 'data:import',
  DATA_EXPORT: 'data:export',
  AI_GENERATE: 'ai:generate',
  AI_DISPATCH: 'ai:dispatch',
  APPROVAL_APPROVE: 'approval:approve',
  APPROVAL_REJECT: 'approval:reject',
}

export const PERMISSION_LABELS = {
  [PERMISSIONS.REPORT_EXPORT]: '报表导出',
  [PERMISSIONS.REPORT_FIELD_CONFIG]: '字段配置',
  [PERMISSIONS.DATA_IMPORT]: '数据导入',
  [PERMISSIONS.DATA_EXPORT]: '数据导出',
  [PERMISSIONS.AI_GENERATE]: 'AI 生成',
  [PERMISSIONS.AI_DISPATCH]: 'AI 下发门店',
  [PERMISSIONS.APPROVAL_APPROVE]: '审批通过',
  [PERMISSIONS.APPROVAL_REJECT]: '审批驳回',
}

export const ALL_MENU_PATHS = [
  '/dashboard',
  '/ai-agent',
  '/data-import',
  '/approval',
  '/reports',
  '/geo-visualization',
  '/geo-3d',
  '/visualization-lab',
  '/performance-lab',
  '/ai-coding',
  '/workflow-designer',
  '/realtime-monitor',
  '/large-screen',
]

/** 角色 → 菜单路径 */
export const ROLE_MENU_PATHS = {
  hq_admin: ALL_MENU_PATHS,
  region_manager: [
    '/dashboard',
    '/data-import',
    '/approval',
    '/reports',
    '/geo-visualization',
    '/geo-3d',
    '/performance-lab',
    '/realtime-monitor',
    '/large-screen',
  ],
  store_manager: ['/dashboard', '/reports', '/approval'],
}

/** 角色 → 按钮权限 */
export const ROLE_PERMISSIONS = {
  hq_admin: Object.values(PERMISSIONS),
  region_manager: [
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.REPORT_FIELD_CONFIG,
    PERMISSIONS.DATA_IMPORT,
    PERMISSIONS.DATA_EXPORT,
    PERMISSIONS.APPROVAL_APPROVE,
    PERMISSIONS.APPROVAL_REJECT,
  ],
  store_manager: [PERMISSIONS.REPORT_EXPORT],
}

export const ROLE_LABELS = {
  hq_admin: '总部运营管理员',
  region_manager: '区域运营经理',
  store_manager: '门店店长',
}

export function resolvePermissionsForRoles(roles = []) {
  const set = new Set()
  roles.forEach((role) => {
    ROLE_PERMISSIONS[role]?.forEach((code) => set.add(code))
  })
  return [...set]
}

export function resolveMenuPathsForRoles(roles = []) {
  const set = new Set()
  roles.forEach((role) => {
    ROLE_MENU_PATHS[role]?.forEach((path) => set.add(path))
  })
  return [...set]
}

export function canApproveByRole(roles = []) {
  return roles.some((role) => ['hq_admin', 'region_manager'].includes(role))
}
