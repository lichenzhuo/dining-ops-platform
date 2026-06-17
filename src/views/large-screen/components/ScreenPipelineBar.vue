<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const statusMap = {
  online: { label: '正常', className: 'screen-pipeline__dot--online' },
  warn: { label: '延迟', className: 'screen-pipeline__dot--warn' },
  offline: { label: '异常', className: 'screen-pipeline__dot--offline' },
}
</script>

<template>
  <section class="screen-pipeline">
    <span class="screen-pipeline__title">数据链路监控</span>
    <div class="screen-pipeline__list">
      <div v-for="item in items" :key="item.key" class="screen-pipeline__item">
        <i :class="['screen-pipeline__dot', statusMap[item.status]?.className]" />
        <span>{{ item.label }}</span>
        <em>{{ statusMap[item.status]?.label ?? '未知' }}</em>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.screen-pipeline {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 68px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid $screen-border;
  border-radius: 10px;

  &__title {
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 600;
    color: $screen-text-primary;
  }

  &__list {
    display: grid;
    flex: 1;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
  }

  &__item {
    display: grid;
    gap: 2px;
    justify-items: center;
    font-size: 11px;
    color: $screen-text-secondary;

    em {
      font-style: normal;
      color: $screen-text-secondary;
    }
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &--online {
      background: $color-success;
      box-shadow: 0 0 8px rgba(82, 196, 26, 0.65);
    }

    &--warn {
      background: $color-warning;
      box-shadow: 0 0 8px rgba(250, 173, 20, 0.65);
    }

    &--offline {
      background: $color-danger;
      box-shadow: 0 0 8px rgba(255, 77, 79, 0.65);
    }
  }
}
</style>
