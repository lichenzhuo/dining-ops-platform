/** 数据接入链路 SVG 布局（viewBox 920×80） */
export const DATA_PIPELINE_NODES = [
  { key: 'pos', label: 'POS', x: 60, y: 40 },
  { key: 'waimai', label: '外卖', x: 160, y: 40 },
  { key: 'meituan', label: '美团', x: 260, y: 40 },
  { key: 'douyin', label: '抖音', x: 360, y: 40 },
  { key: 'crm', label: 'CRM', x: 460, y: 40 },
  { key: 'inventory', label: '库存', x: 560, y: 40 },
  { key: 'finance', label: '财务', x: 660, y: 40 },
  { key: 'materials', label: '素材库', x: 760, y: 40 },
]

export const DATA_PIPELINE_HUB = { key: 'hub', label: '指标中心', x: 860, y: 40 }

export const DATA_PIPELINE_VIEWBOX = '0 0 920 80'

export const WORKFLOW_STATUS_COLORS = {
  online: '#52c41a',
  warn: '#faad14',
  offline: '#ff4d4f',
  idle: '#86909c',
  done: '#13c2c2',
}

/** 营销活动审批流 */
export const APPROVAL_WORKFLOW = {
  title: '营销活动审批流',
  viewBox: '0 0 720 120',
  nodes: [
    { id: 'draft', label: '草稿', x: 60, y: 60, status: 'done' },
    { id: 'pending', label: '待审批', x: 180, y: 60, status: 'warn' },
    { id: 'approved', label: '已通过', x: 300, y: 60, status: 'idle' },
    { id: 'dispatched', label: '已下发', x: 420, y: 60, status: 'idle' },
    { id: 'done', label: '已完成', x: 540, y: 60, status: 'idle' },
  ],
  edges: [
    ['draft', 'pending'],
    ['pending', 'approved'],
    ['approved', 'dispatched'],
    ['dispatched', 'done'],
  ],
}

/** AI 营销任务流 */
export const MARKETING_WORKFLOW = {
  title: 'AI 营销任务流',
  viewBox: '0 0 820 120',
  nodes: [
    { id: 'ai', label: 'AI 生成', x: 70, y: 60, status: 'done' },
    { id: 'review', label: '内容审批', x: 210, y: 60, status: 'warn' },
    { id: 'dispatch', label: '下发门店', x: 350, y: 60, status: 'idle' },
    { id: 'execute', label: '执行反馈', x: 490, y: 60, status: 'idle' },
    { id: 'track', label: '效果追踪', x: 630, y: 60, status: 'idle' },
  ],
  edges: [
    ['ai', 'review'],
    ['review', 'dispatch'],
    ['dispatch', 'execute'],
    ['execute', 'track'],
  ],
}
