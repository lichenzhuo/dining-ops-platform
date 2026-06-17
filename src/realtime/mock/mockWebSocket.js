import { createHeartbeatMessage, createOrderMessage } from './messageFactory'
import { WS_CHANNELS } from '../constants/topics'

export function createMockWebSocketClient() {
  let status = 'disconnected'
  let heartbeatTimer = null
  let messageTimer = null
  let reconnectTimer = null
  const listeners = new Map()

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

  function startTimers() {
    heartbeatTimer = window.setInterval(() => {
      emit('message', {
        channel: WS_CHANNELS.HEARTBEAT,
        payload: createHeartbeatMessage(),
      })
    }, 15000)

    messageTimer = window.setInterval(() => {
      emit('message', {
        channel: WS_CHANNELS.ORDERS,
        payload: createOrderMessage(),
      })
    }, 5000)
  }

  function clearTimers() {
    if (heartbeatTimer) {
      window.clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
    if (messageTimer) {
      window.clearInterval(messageTimer)
      messageTimer = null
    }
    if (reconnectTimer) {
      window.clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function connect() {
    if (status === 'connected' || status === 'connecting') {
      return Promise.resolve()
    }

    status = 'connecting'
    emit('status', status)

    return new Promise((resolve) => {
      window.setTimeout(() => {
        status = 'connected'
        emit('open')
        emit('status', status)
        startTimers()
        resolve()
      }, 280)
    })
  }

  function disconnect() {
    clearTimers()
    status = 'disconnected'
    emit('close')
    emit('status', status)
  }

  function simulateReconnect() {
    disconnect()
    status = 'reconnecting'
    emit('status', status)
    reconnectTimer = window.setTimeout(() => {
      connect()
    }, 1200)
  }

  function getStatus() {
    return status
  }

  return {
    on,
    connect,
    disconnect,
    simulateReconnect,
    getStatus,
  }
}
