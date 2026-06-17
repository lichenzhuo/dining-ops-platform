<script setup>
import { MESSAGE_TYPE_LABELS } from '@/realtime/constants/topics'

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: '等待实时消息…',
  },
})

function formatItem(item) {
  switch (item.type) {
    case 'order':
      return `${item.time} · ${item.store} · ${item.channel} · ¥${item.amount} · ${item.orderId}`
    case 'inventory':
      return `${item.time} · ${item.store} · ${item.material} 库存 ${item.level}风险`
    case 'alert':
      return `${item.time} · [${item.level}] ${item.text}`
    case 'export':
      return `${item.time} · 报表 ${item.reportId} · ${item.message}`
    case 'approval':
      return `${item.time} · ${item.title} · ${item.applicant}`
    case 'heartbeat':
      return `${item.time} · 延迟 ${item.latencyMs}ms`
    default:
      return `${item.time ?? ''} · ${JSON.stringify(item)}`
  }
}

function tagType(item) {
  if (item.type === 'alert') {
    return item.level === 'danger' ? 'danger' : 'warning'
  }
  if (item.type === 'inventory') {
    return 'warning'
  }
  if (item.type === 'export') {
    return 'success'
  }
  return 'info'
}
</script>

<template>
  <section class="panel-card stream-panel">
    <div class="stream-panel__head">
      <h3>{{ title }}</h3>
      <span>{{ items.length }} 条</span>
    </div>

    <ul v-if="items.length" class="stream-panel__list">
      <li v-for="item in items" :key="item.id">
        <el-tag size="small" :type="tagType(item)">
          {{ MESSAGE_TYPE_LABELS[item.type] ?? item.type }}
        </el-tag>
        <span>{{ formatItem(item) }}</span>
      </li>
    </ul>
    <el-empty v-else :description="emptyText" :image-size="56" />
  </section>
</template>

<style scoped lang="scss">
.stream-panel {
  display: flex;
  flex-direction: column;
  min-height: 280px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
    }

    span {
      font-size: 12px;
      color: $text-tertiary;
    }
  }

  &__list {
    flex: 1;
    max-height: 360px;
    margin: 0;
    padding: 0;
    overflow: auto;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px;
      align-items: start;
      padding: 8px 0;
      font-size: 12px;
      line-height: 1.6;
      color: $text-secondary;
      border-bottom: 1px dashed $border-light;
    }
  }
}
</style>
