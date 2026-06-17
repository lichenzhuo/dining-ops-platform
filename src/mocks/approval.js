import {
  APPROVAL_STATUS,
  APPROVAL_TYPES,
} from '@/constants/approval'

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const INITIAL_APPROVALS = [
  {
    id: 'apv-001',
    title: '双人午市套餐活动',
    type: APPROVAL_TYPES.MARKETING,
    applicant: '王晓敏',
    applicantId: 'u-101',
    region: '华东区',
    status: APPROVAL_STATUS.PENDING,
    amount: 8000,
    summary: '午市双人套餐 8 折，覆盖华东区 36 家门店，预算 8000 元。',
    createdAt: '2026-06-16T09:20:00.000Z',
  },
  {
    id: 'apv-002',
    title: '小红书种草内容 ×5',
    type: APPROVAL_TYPES.AI_CONTENT,
    applicant: 'AI 营销助手',
    applicantId: 'system-ai',
    region: '华东区',
    status: APPROVAL_STATUS.PENDING,
    amount: 0,
    summary: 'AI 生成 5 篇小红书笔记与店员转发文案，待区域审核后下发门店。',
    createdAt: '2026-06-16T10:05:00.000Z',
  },
  {
    id: 'apv-003',
    title: '会员日满减预算调整',
    type: APPROVAL_TYPES.BUDGET,
    applicant: '陈雪',
    applicantId: 'u-102',
    region: '华南区',
    status: APPROVAL_STATUS.PENDING,
    amount: 12000,
    summary: '会员日满 100 减 20，华南区预算上调至 12000 元。',
    createdAt: '2026-06-16T11:30:00.000Z',
  },
  {
    id: 'apv-004',
    title: '门店补货申请 · 上海南京路店',
    type: APPROVAL_TYPES.INVENTORY,
    applicant: '李建国',
    applicantId: 'u-103',
    region: '华东区',
    status: APPROVAL_STATUS.APPROVED,
    amount: 3200,
    summary: '牛肉、蔬菜包库存低于安全值，申请紧急补货。',
    createdAt: '2026-06-15T14:00:00.000Z',
    approvedAt: '2026-06-15T16:20:00.000Z',
    approver: '李区域',
  },
  {
    id: 'apv-005',
    title: '抖音团购券发放',
    type: APPROVAL_TYPES.COUPON,
    applicant: '张运营',
    applicantId: 'u-001',
    region: '全部门店',
    status: APPROVAL_STATUS.DISPATCHED,
    amount: 5000,
    summary: '19.9 元团购券，全国门店同步上线。',
    createdAt: '2026-06-14T08:00:00.000Z',
    approvedAt: '2026-06-14T10:00:00.000Z',
    dispatchedAt: '2026-06-14T12:00:00.000Z',
    approver: '张运营',
  },
  {
    id: 'apv-006',
    title: 'AI 店员话术模板 B',
    type: APPROVAL_TYPES.AI_CONTENT,
    applicant: 'AI 营销助手',
    applicantId: 'system-ai',
    region: '华东区',
    status: APPROVAL_STATUS.REJECTED,
    amount: 0,
    summary: '话术含绝对化用语，需修改后重新提交。',
    createdAt: '2026-06-13T15:00:00.000Z',
    rejectedAt: '2026-06-13T17:00:00.000Z',
    approver: '李区域',
    rejectReason: '文案含「第一」「绝对」等违规词',
  },
]

let approvalCache = [...INITIAL_APPROVALS]

export async function mockFetchApprovals(query = {}) {
  await delay(400)
  let list = [...approvalCache]

  if (query.tab === 'pending') {
    list = list.filter((item) => item.status === APPROVAL_STATUS.PENDING)
  } else if (query.tab === 'mine') {
    list = list.filter((item) => item.applicantId === query.userId)
  }

  if (query.type && query.type !== 'all') {
    list = list.filter((item) => item.type === query.type)
  }

  if (query.keyword?.trim()) {
    const text = query.keyword.trim().toLowerCase()
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(text) ||
        item.applicant.toLowerCase().includes(text),
    )
  }

  return {
    list: list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    pendingCount: approvalCache.filter((item) => item.status === APPROVAL_STATUS.PENDING).length,
  }
}

export async function mockUpdateApprovalStatus(id, payload) {
  await delay(600)
  const index = approvalCache.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('审批单不存在')
  }

  const current = approvalCache[index]
  const now = new Date().toISOString()
  const next = { ...current, ...payload }

  if (payload.status === APPROVAL_STATUS.APPROVED) {
    next.approvedAt = now
    next.approver = payload.approver
  }
  if (payload.status === APPROVAL_STATUS.REJECTED) {
    next.rejectedAt = now
    next.approver = payload.approver
    next.rejectReason = payload.rejectReason
  }
  if (payload.status === APPROVAL_STATUS.DISPATCHED) {
    next.dispatchedAt = now
  }
  if (payload.status === APPROVAL_STATUS.COMPLETED) {
    next.completedAt = now
  }

  approvalCache[index] = next
  return next
}

export async function mockCreateApproval(payload) {
  await delay(400)
  const item = {
    id: `apv-${Date.now()}`,
    status: APPROVAL_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    ...payload,
  }
  approvalCache = [item, ...approvalCache]
  return item
}

export function resetApprovalMock() {
  approvalCache = [...INITIAL_APPROVALS]
}
