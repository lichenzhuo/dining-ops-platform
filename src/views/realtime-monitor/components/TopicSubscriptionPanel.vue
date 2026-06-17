<script setup>
import { TOPIC_OPTIONS } from '@/realtime/constants/topics'

defineProps({
  mqttStatus: {
    type: String,
    default: 'disconnected',
  },
})
</script>

<template>
  <section class="panel-card topic-panel">
    <h3>MQTT Topic 订阅</h3>
    <p class="topic-panel__desc">
      按业务域划分 topic，前端按需订阅订单、库存、告警、导出与审批消息。
    </p>

    <ul class="topic-panel__list">
      <li v-for="item in TOPIC_OPTIONS" :key="item.topic">
        <code>{{ item.topic }}</code>
        <span>{{ item.label }}</span>
        <el-tag size="small" :type="mqttStatus === 'connected' ? 'success' : 'info'">
          {{ mqttStatus === 'connected' ? '已订阅' : '待连接' }}
        </el-tag>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.topic-panel {
  h3 {
    margin: 0 0 8px;
    font-size: 15px;
  }

  &__desc {
    margin: 0 0 12px;
    font-size: 12px;
    line-height: 1.6;
    color: $text-tertiary;
  }

  &__list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 10px;
      align-items: center;
      padding: 10px 12px;
      background: $bg-page;
      border: 1px solid $border-light;
      border-radius: $radius-base;

      code {
        font-size: 12px;
        color: $color-brand-dark;
      }

      span {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
}
</style>
