<script setup>
import { SvgDataPipeline } from '@/visualization'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['node-click'])
</script>

<template>
  <section class="screen-svg-pipeline">
    <span class="screen-svg-pipeline__title">数据链路监控</span>
    <div class="screen-svg-pipeline__chart">
      <SvgDataPipeline theme="dark" :items="items" @node-click="emit('node-click', $event)" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.screen-svg-pipeline {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  height: 88px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid $screen-border;
  border-radius: 10px;

  &__title {
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 600;
    color: $screen-text-primary;
  }

  &__chart {
    height: 72px;
  }
}
</style>
