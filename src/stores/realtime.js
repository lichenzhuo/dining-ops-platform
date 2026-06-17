import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { MQTT_TOPICS, WS_CHANNELS } from '@/realtime/constants/topics'
import { createMqttClient } from '@/realtime/mqttClient'
import { createWebSocketClient } from '@/realtime/websocketClient'
import { useExportQueueStore } from '@/stores/exportQueue'

const MAX_STREAM_SIZE = 50

function parsePayload(message) {
  try {
    return JSON.parse(message)
  } catch {
    return null
  }
}

function pushToStream(listRef, item, max = MAX_STREAM_SIZE) {
  if (!Array.isArray(listRef.value)) {
    listRef.value = []
  }
  listRef.value.unshift({
    ...item,
    id: `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  })
  if (listRef.value.length > max) {
    listRef.value.length = max
  }
}

export const useRealtimeStore = defineStore('realtime', () => {
  const wsStatus = ref('disconnected')
  const mqttStatus = ref('disconnected')
  const lastHeartbeat = ref(null)
  const reconnectCount = ref(0)
  const started = ref(false)

  const orders = ref([])
  const inventoryAlerts = ref([])
  const alerts = ref([])
  const exportMessages = ref([])
  const approvals = ref([])
  const wsMessages = ref([])

  const unreadAlertCount = ref(0)
  const liveRevenue = ref(0)

  let wsClient = null
  let mqttClient = null
  const cleanupFns = []

  const isConnected = computed(
    () => wsStatus.value === 'connected' && mqttStatus.value === 'connected',
  )

  const connectionSummary = computed(() => ({
    ws: wsStatus.value,
    mqtt: mqttStatus.value,
    heartbeat: lastHeartbeat.value,
    reconnectCount: reconnectCount.value,
  }))

  function handleWsMessage({ channel, payload }) {
    pushToStream(wsMessages, { channel, ...payload }, 30)

    if (channel === WS_CHANNELS.HEARTBEAT) {
      lastHeartbeat.value = payload
    }

    if (channel === WS_CHANNELS.ORDERS) {
      pushToStream(orders, payload)
      liveRevenue.value += payload.amount ?? 0
    }
  }

  function handleMqttMessage(topic, rawMessage) {
    const payload = parsePayload(rawMessage)
    if (!payload) {
      return
    }

    switch (topic) {
      case MQTT_TOPICS.ORDERS:
        pushToStream(orders, payload)
        liveRevenue.value += payload.amount ?? 0
        break
      case MQTT_TOPICS.INVENTORY:
        pushToStream(inventoryAlerts, payload)
        break
      case MQTT_TOPICS.ALERTS:
        pushToStream(alerts, payload)
        unreadAlertCount.value += 1
        break
      case MQTT_TOPICS.EXPORT:
        pushToStream(exportMessages, payload)
        useExportQueueStore().markDoneByReport(payload.reportId, {
          message: payload.message,
          fileName: `${payload.reportId}.xlsx`,
        })
        break
      case MQTT_TOPICS.APPROVAL:
        pushToStream(approvals, payload)
        break
      default:
        break
    }
  }

  function bindClients() {
    wsClient = createWebSocketClient()
    mqttClient = createMqttClient()

    cleanupFns.push(
      wsClient.on('status', (status) => {
        wsStatus.value = status
      }),
      wsClient.on('message', handleWsMessage),
      mqttClient.on('status', (status) => {
        mqttStatus.value = status
      }),
    )

    Object.values(MQTT_TOPICS).forEach((topic) => {
      mqttClient.subscribe(topic, handleMqttMessage)
    })
  }

  async function connect() {
    if (started.value) {
      return
    }
    bindClients()
    started.value = true
    await Promise.all([wsClient.connect(), mqttClient.connect()])
  }

  function disconnect() {
    cleanupFns.forEach((fn) => fn())
    cleanupFns.length = 0
    wsClient?.disconnect()
    mqttClient?.disconnect()
    wsClient = null
    mqttClient = null
    wsStatus.value = 'disconnected'
    mqttStatus.value = 'disconnected'
    started.value = false
  }

  async function simulateReconnect() {
    reconnectCount.value += 1
    wsClient?.simulateReconnect()
    mqttClient?.disconnect()
    mqttStatus.value = 'reconnecting'
    await new Promise((resolve) => window.setTimeout(resolve, 1400))
    await mqttClient?.connect()
  }

  function markAlertsRead() {
    unreadAlertCount.value = 0
  }

  function clearStreams() {
    orders.value = []
    inventoryAlerts.value = []
    alerts.value = []
    exportMessages.value = []
    approvals.value = []
    wsMessages.value = []
    liveRevenue.value = 0
  }

  return {
    wsStatus,
    mqttStatus,
    lastHeartbeat,
    reconnectCount,
    started,
    orders,
    inventoryAlerts,
    alerts,
    exportMessages,
    approvals,
    wsMessages,
    unreadAlertCount,
    liveRevenue,
    isConnected,
    connectionSummary,
    connect,
    disconnect,
    simulateReconnect,
    markAlertsRead,
    clearStreams,
  }
})
