<script setup>
defineProps({
  summary: {
    type: Object,
    required: true,
  },
  isConnected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['reconnect', 'disconnect'])

const statusTypeMap = {
  connected: 'success',
  connecting: 'warning',
  reconnecting: 'warning',
  disconnected: 'info',
}

const statusLabelMap = {
  connected: '已连接',
  connecting: '连接中',
  reconnecting: '重连中',
  disconnected: '未连接',
}
</script>

<template>
  <section class="panel-card connection-card">
    <div class="connection-card__head">
      <h3>连接状态</h3>
      <el-tag :type="isConnected ? 'success' : 'warning'" size="small">
        {{ isConnected ? '双通道在线' : '部分离线' }}
      </el-tag>
    </div>

    <div class="connection-card__grid">
      <article>
        <span>WebSocket</span>
        <el-tag :type="statusTypeMap[summary.ws] ?? 'info'" size="small">
          {{ statusLabelMap[summary.ws] ?? summary.ws }}
        </el-tag>
      </article>
      <article>
        <span>MQTT</span>
        <el-tag :type="statusTypeMap[summary.mqtt] ?? 'info'" size="small">
          {{ statusLabelMap[summary.mqtt] ?? summary.mqtt }}
        </el-tag>
      </article>
      <article>
        <span>心跳延迟</span>
        <strong>{{ summary.heartbeat?.latencyMs ?? '-' }} ms</strong>
      </article>
      <article>
        <span>重连次数</span>
        <strong>{{ summary.reconnectCount }}</strong>
      </article>
    </div>

    <div class="connection-card__actions">
      <el-button size="small" @click="emit('reconnect')">模拟断线重连</el-button>
      <el-button size="small" plain @click="emit('disconnect')">断开连接</el-button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.connection-card {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    h3 {
      margin: 0;
      font-size: 15px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;

    article {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 10px 12px;
      background: $bg-page;
      border: 1px solid $border-light;
      border-radius: $radius-base;

      span {
        font-size: 12px;
        color: $text-tertiary;
      }

      strong {
        font-size: 16px;
        color: $text-primary;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }
}
</style>
