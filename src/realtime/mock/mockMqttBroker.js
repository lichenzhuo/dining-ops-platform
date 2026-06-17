import {
  createAlertMessage,
  createApprovalMessage,
  createExportMessage,
  createInventoryMessage,
  createOrderMessage,
} from './messageFactory'
import { MQTT_TOPICS } from '../constants/topics'

class MockMqttBroker {
  constructor() {
    this.subscribers = new Map()
    this.timers = []
    this.running = false
  }

  subscribe(topic, handler) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set())
    }
    this.subscribers.get(topic).add(handler)
    return () => {
      this.subscribers.get(topic)?.delete(handler)
    }
  }

  publish(topic, payload) {
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload)
    this.subscribers.get(topic)?.forEach((handler) => handler(topic, message))
  }

  start() {
    if (this.running) {
      return
    }
    this.running = true

    this.timers.push(
      window.setInterval(() => {
        this.publish(MQTT_TOPICS.ORDERS, createOrderMessage())
      }, 4000),
    )

    this.timers.push(
      window.setInterval(() => {
        this.publish(MQTT_TOPICS.INVENTORY, createInventoryMessage())
      }, 9000),
    )

    this.timers.push(
      window.setInterval(() => {
        this.publish(MQTT_TOPICS.ALERTS, createAlertMessage())
      }, 7000),
    )

    this.timers.push(
      window.setInterval(() => {
        if (Math.random() > 0.55) {
          this.publish(MQTT_TOPICS.EXPORT, createExportMessage())
        }
      }, 12000),
    )

    this.timers.push(
      window.setInterval(() => {
        if (Math.random() > 0.5) {
          this.publish(MQTT_TOPICS.APPROVAL, createApprovalMessage())
        }
      }, 10000),
    )
  }

  stop() {
    this.running = false
    this.timers.forEach((timer) => window.clearInterval(timer))
    this.timers = []
    this.subscribers.clear()
  }
}

export const mockMqttBroker = new MockMqttBroker()
