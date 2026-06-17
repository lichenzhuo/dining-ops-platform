export const APPROVAL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
  DISPATCHED: 'dispatched',
  COMPLETED: 'completed',
}

export const APPROVAL_STATUS_LABELS = {
  draft: '草稿',
  pending: '待审批',
  approved: '已通过',
  rejected: '已驳回',
  withdrawn: '已撤回',
  dispatched: '已下发',
  completed: '已完成',
}

export const APPROVAL_STATUS_TYPES = {
  draft: 'info',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  withdrawn: 'info',
  dispatched: 'primary',
  completed: 'success',
}

export const APPROVAL_TYPES = {
  MARKETING: 'marketing',
  AI_CONTENT: 'ai_content',
  COUPON: 'coupon',
  BUDGET: 'budget',
  INVENTORY: 'inventory',
}

export const APPROVAL_TYPE_LABELS = {
  marketing: '营销活动',
  ai_content: 'AI 内容',
  coupon: '卡券发放',
  budget: '预算调整',
  inventory: '库存补货',
}

export const APPROVAL_TABS = [
  { key: 'pending', label: '待我审批' },
  { key: 'mine', label: '我发起的' },
  { key: 'all', label: '全部记录' },
]

/** 审批流状态机：允许的状态流转 */
export const APPROVAL_TRANSITIONS = {
  pending: ['approved', 'rejected'],
  approved: ['dispatched'],
  dispatched: ['completed'],
}

export function canTransition(from, to) {
  return APPROVAL_TRANSITIONS[from]?.includes(to) ?? false
}

export function getStatusLabel(status) {
  return APPROVAL_STATUS_LABELS[status] ?? status
}

export function getTypeLabel(type) {
  return APPROVAL_TYPE_LABELS[type] ?? type
}
