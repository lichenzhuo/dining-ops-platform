import { mockMqttBroker } from './mock/mockMqttBroker'

/**
 * 开发阶段使用内存 Mock Broker，生产环境可替换为 mqtt.connect('wss://broker.example.com')
 */
export function createMqttClient() {
  let status = 'disconnected'
  const listeners = new Map()
  const unsubscribeList = []

  function emit(event, payload) {
    listeners.get(event)?.forEach((handler) => handler(payload))
  }

  function on(event, handler) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }
    listeners.get(event).add(handler)
    return () => listeners.get(event)?.delete(handler)
  }

  function connect() {
    if (status === 'connected') {
      return Promise.resolve()
    }
    status = 'connecting'
    emit('status', status)

    return new Promise((resolve) => {
      window.setTimeout(() => {
        mockMqttBroker.start()
        status = 'connected'
        emit('connect')
        emit('status', status)
        resolve()
      }, 320)
    })
  }

  function subscribe(topic, handler) {
    const unsubscribe = mockMqttBroker.subscribe(topic, (receivedTopic, message) => {
      handler(receivedTopic, message)
      emit('message', { topic: receivedTopic, message })
    })
    unsubscribeList.push(unsubscribe)
  }

  function publish(topic, payload) {
    mockMqttBroker.publish(topic, payload)
  }

  function disconnect() {
    unsubscribeList.forEach((unsubscribe) => unsubscribe())
    unsubscribeList.length = 0
    mockMqttBroker.stop()
    status = 'disconnected'
    emit('close')
    emit('status', status)
  }

  function getStatus() {
    return status
  }

  return {
    on,
    connect,
    subscribe,
    publish,
    disconnect,
    getStatus,
  }
}
