const STORES = ['上海南京路店', '杭州西湖店', '南京新街口店', '苏州观前街店']
const CHANNELS = ['堂食 POS', '美团外卖', '抖音团购', '饿了么']
const MATERIALS = ['牛肉', '蔬菜包', '米饭', '酱料']

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('zh-CN', { hour12: false })
}

export function createOrderMessage() {
  return {
    type: 'order',
    store: randomItem(STORES),
    channel: randomItem(CHANNELS),
    amount: Math.round(28 + Math.random() * 120),
    orderId: `ORD-${Date.now().toString().slice(-6)}`,
    time: formatTime(),
  }
}

export function createInventoryMessage() {
  return {
    type: 'inventory',
    store: randomItem(STORES),
    material: randomItem(MATERIALS),
    level: Math.random() > 0.6 ? '高' : '中',
    time: formatTime(),
  }
}

export function createAlertMessage() {
  return {
    type: 'alert',
    level: Math.random() > 0.7 ? 'danger' : 'warning',
    text: `${randomItem(STORES)} ${Math.random() > 0.5 ? '出餐超时率偏高' : '差评率上升'}`,
    time: formatTime(),
  }
}

export function createExportMessage() {
  return {
    type: 'export',
    reportId: randomItem(['daily', 'store', 'product']),
    status: 'done',
    message: '导出文件已生成，可下载（Mock）',
    time: formatTime(),
  }
}

export function createApprovalMessage() {
  return {
    type: 'approval',
    title: randomItem(['营销活动发布', '卡券发放', 'AI 内容下发']),
    applicant: randomItem(['张运营', '李区域', '王店长']),
    time: formatTime(),
  }
}

export function createHeartbeatMessage() {
  return {
    type: 'heartbeat',
    time: formatTime(),
    latencyMs: Math.round(20 + Math.random() * 40),
  }
}
