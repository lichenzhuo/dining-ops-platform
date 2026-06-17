<script setup>
import { computed } from 'vue'

const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
})

const duplicatedOrders = computed(() => {
  if (!props.orders.length) {
    return []
  }
  return [...props.orders, ...props.orders]
})
</script>

<template>
  <div class="screen-order-ticker">
    <span class="screen-order-ticker__label">实时订单</span>
    <div class="screen-order-ticker__track">
      <div
        class="screen-order-ticker__content"
        :class="{ 'screen-order-ticker__content--paused': !orders.length }"
      >
        <span v-for="(item, index) in duplicatedOrders" :key="`${item.id}-${index}`">
          {{ item.time }} · {{ item.store }} · {{ item.channel }} · ¥{{ item.amount }}
        </span>
        <span v-if="!orders.length" class="screen-order-ticker__empty">等待 WebSocket / MQTT 推送…</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.screen-order-ticker {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  height: 40px;
  padding: 0 14px;
  overflow: hidden;
  background: rgba(7, 20, 38, 0.72);
  border: 1px solid rgba(19, 194, 194, 0.18);
  border-radius: 8px;

  &__label {
    flex-shrink: 0;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: $screen-accent;
    background: rgba(19, 194, 194, 0.12);
    border-radius: 999px;
  }

  &__track {
    overflow: hidden;
    white-space: nowrap;
  }

  &__content {
    display: inline-flex;
    gap: 48px;
    animation: ticker-scroll 28s linear infinite;

    &--paused {
      animation: none;
    }

    span {
      font-size: 12px;
      color: $screen-text-secondary;
    }
  }

  &__empty {
    color: $screen-text-secondary;
  }
}

@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>
