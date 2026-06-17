/** AI 营销 Agent 工作流状态 */
export const AGENT_WORKFLOW_STATUS = {
  DRAFT: 'draft',
  GENERATING: 'generating',
  GENERATED: 'generated',
  SAVED: 'saved',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  DISPATCHED: 'dispatched',
  TRACKING: 'tracking',
}

export const AGENT_WORKFLOW_STEPS = [
  { key: AGENT_WORKFLOW_STATUS.DRAFT, label: '任务配置' },
  { key: AGENT_WORKFLOW_STATUS.GENERATED, label: 'AI 生成' },
  { key: AGENT_WORKFLOW_STATUS.SAVED, label: '保存素材' },
  { key: AGENT_WORKFLOW_STATUS.PENDING_APPROVAL, label: '提交审批' },
  { key: AGENT_WORKFLOW_STATUS.DISPATCHED, label: '下发门店' },
  { key: AGENT_WORKFLOW_STATUS.TRACKING, label: '效果追踪' },
]

export const PLATFORM_OPTIONS = [
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'meituan', label: '美团' },
  { value: 'douyin', label: '抖音团购' },
  { value: 'wechat', label: '微信私域' },
]

export const GOAL_OPTIONS = [
  '提升午市套餐转化',
  '拉新会员注册',
  '促进复购与储值',
  '清理滞销库存',
  '提升外卖评分',
  '节日主题活动引流',
]

export const COPY_STYLE_OPTIONS = [
  { value: 'lively', label: '活泼种草' },
  { value: 'professional', label: '专业信任' },
  { value: 'promotion', label: '优惠促销' },
]

export const STORE_SCOPE_OPTIONS = [
  '全部门店',
  '华东区',
  '华南区',
  '上海南京路店',
  '杭州西湖店',
  '南京新街口店',
  '苏州观前街店',
]

export const CONTENT_SECTIONS = [
  { key: 'xiaohongshuTitle', label: '小红书笔记标题', editable: true },
  { key: 'xiaohongshuContent', label: '小红书正文', editable: true, multiline: true },
  { key: 'meituanReview', label: '美团评价话术', editable: true, multiline: true },
  { key: 'staffForward', label: '店员转发文案', editable: true, multiline: true },
  { key: 'imagePrompt', label: '图片生成提示词', editable: true, multiline: true },
  { key: 'promotionSuggestion', label: '优惠活动建议', editable: true, multiline: true },
]

export function getWorkflowStepIndex(status) {
  const order = [
    AGENT_WORKFLOW_STATUS.DRAFT,
    AGENT_WORKFLOW_STATUS.GENERATING,
    AGENT_WORKFLOW_STATUS.GENERATED,
    AGENT_WORKFLOW_STATUS.SAVED,
    AGENT_WORKFLOW_STATUS.PENDING_APPROVAL,
    AGENT_WORKFLOW_STATUS.APPROVED,
    AGENT_WORKFLOW_STATUS.DISPATCHED,
    AGENT_WORKFLOW_STATUS.TRACKING,
  ]
  const idx = order.indexOf(status)
  if (idx <= 1) return 0
  if (idx === 2) return 1
  if (idx === 3) return 2
  if (idx === 4) return 3
  if (idx === 5) return 3
  if (idx === 6) return 4
  return 5
}

export function defaultTaskForm(org = {}) {
  return {
    goal: GOAL_OPTIONS[0],
    platforms: ['xiaohongshu', 'meituan'],
    keywords: ['双人套餐', '午市优惠'],
    storeScope: org.store && org.store !== '全部门店' ? org.store : org.region ?? '全部门店',
    budget: 3000,
    activityRange: [],
    copyStyle: 'lively',
    approvalRequired: true,
    prompt: '',
  }
}
