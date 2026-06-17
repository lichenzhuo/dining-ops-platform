/** MQTT topic 设计：按业务域划分，便于前端按需订阅 */
export const MQTT_TOPICS = {
  ORDERS: 'dop/orders/stream',
  INVENTORY: 'dop/inventory/alert',
  ALERTS: 'dop/ops/alert',
  EXPORT: 'dop/export/status',
  APPROVAL: 'dop/approval/pending',
}

export const WS_CHANNELS = {
  ORDERS: 'orders',
  HEARTBEAT: 'heartbeat',
}

export const MESSAGE_TYPE_LABELS = {
  order: '实时订单',
  inventory: '库存预警',
  alert: '运营告警',
  export: '导出任务',
  approval: '审批待办',
  heartbeat: '心跳',
}

export const TOPIC_OPTIONS = [
  { topic: MQTT_TOPICS.ORDERS, label: '订单流', type: 'order' },
  { topic: MQTT_TOPICS.INVENTORY, label: '库存预警', type: 'inventory' },
  { topic: MQTT_TOPICS.ALERTS, label: '运营告警', type: 'alert' },
  { topic: MQTT_TOPICS.EXPORT, label: '导出任务', type: 'export' },
  { topic: MQTT_TOPICS.APPROVAL, label: '审批待办', type: 'approval' },
]
