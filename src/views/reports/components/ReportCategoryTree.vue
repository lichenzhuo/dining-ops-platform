<script setup>
import { REPORT_GROUPS } from '@/constants/reports'

defineProps({
  activeId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <nav class="report-tree">
    <div v-for="group in REPORT_GROUPS" :key="group.key" class="report-tree__group">
      <p class="report-tree__title">{{ group.label }}</p>
      <button
        v-for="report in group.reports"
        :key="report.id"
        type="button"
        class="report-tree__item"
        :class="{ 'report-tree__item--active': activeId === report.id }"
        @click="emit('select', report.id)"
      >
        <el-icon><component :is="report.icon" /></el-icon>
        <span>{{ report.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.report-tree {
  display: grid;
  gap: 18px;
}

.report-tree__group {
  display: grid;
  gap: 4px;
}

.report-tree__title {
  margin: 0 0 4px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: $text-tertiary;
}

.report-tree__item {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  color: $text-secondary;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: $radius-base;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    color: $color-primary;
    background: $color-primary-light;
  }

  &--active {
    font-weight: 600;
    color: $color-primary;
    background: $color-primary-light;
  }
}
</style>
