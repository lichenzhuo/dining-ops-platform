<script setup>
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useRealtimeStore } from '@/stores/realtime'
import ConnectionStatusCard from './components/ConnectionStatusCard.vue'
import MessageStreamPanel from './components/MessageStreamPanel.vue'
import TopicSubscriptionPanel from './components/TopicSubscriptionPanel.vue'

const realtimeStore = useRealtimeStore()

const {
  connectionSummary,
  isConnected,
  mqttStatus,
  orders,
  inventoryAlerts,
  alerts,
  exportMessages,
  approvals,
  wsMessages,
  liveRevenue,
} = storeToRefs(realtimeStore)

async function handleReconnect() {
  await realtimeStore.simulateReconnect()
  ElMessage.info('已触发断线重连（Mock）')
}

function handleDisconnect() {
  realtimeStore.disconnect()
  ElMessage.warning('实时连接已断开')
}

async function handleConnect() {
  await realtimeStore.connect()
  ElMessage.success('实时连接已建立')
}

function handleClear() {
  realtimeStore.clearStreams()
  ElMessage.success('消息流已清空')
}
</script>

<template>
  <div class="realtime-monitor-page">
    <header class="realtime-monitor-page__header">
      <div>
        <h2>实时监测中心</h2>
        <p>WebSocket 心跳 + MQTT 发布订阅 · 订单流 / 库存预警 / 运营告警 / 导出任务 / 审批待办</p>
      </div>
      <div class="realtime-monitor-page__actions">
        <el-statistic title="累计实时流水（Mock）" :value="liveRevenue" prefix="¥" />
        <el-button v-if="!isConnected" type="primary" @click="handleConnect">建立连接</el-button>
        <el-button @click="handleClear">清空消息流</el-button>
      </div>
    </header>

    <section class="realtime-monitor-page__top">
      <ConnectionStatusCard
        :summary="connectionSummary"
        :is-connected="isConnected"
        @reconnect="handleReconnect"
        @disconnect="handleDisconnect"
      />
      <TopicSubscriptionPanel :mqtt-status="mqttStatus" />
    </section>

    <section class="realtime-monitor-page__streams">
      <MessageStreamPanel title="实时订单" :items="orders" />
      <MessageStreamPanel title="库存预警" :items="inventoryAlerts" />
      <MessageStreamPanel title="运营告警" :items="alerts" />
      <MessageStreamPanel title="导出任务" :items="exportMessages" />
      <MessageStreamPanel title="审批待办" :items="approvals" />
      <MessageStreamPanel title="WebSocket 通道" :items="wsMessages" empty-text="等待 WebSocket 消息…" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.realtime-monitor-page {
  display: grid;
  gap: 16px;

  &__header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    h2 {
      margin: 0;
      font-size: 22px;
      color: $text-primary;
    }

    p {
      margin: 6px 0 0;
      font-size: 13px;
      color: $text-tertiary;
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 16px;
  }

  &__streams {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 1400px) {
  .realtime-monitor-page {
    &__top,
    &__streams {
      grid-template-columns: 1fr;
    }
  }
}
</style>
