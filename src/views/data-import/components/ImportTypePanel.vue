<script setup>
import { IMPORT_TYPES } from '@/constants/dataImport'

defineProps({
  importType: {
    type: String,
    required: true,
  },
})

const useWorker = defineModel('useWorker', { type: Boolean, default: true })

const emit = defineEmits(['download', 'select-type'])
</script>

<template>
  <section class="panel-card import-type-panel">
    <h3>选择导入类型</h3>
    <div class="import-type-panel__list">
      <button
        v-for="item in IMPORT_TYPES"
        :key="item.key"
        type="button"
        class="type-item"
        :class="{ 'type-item--active': importType === item.key }"
        @click="emit('select-type', item.key)"
      >
        <strong>{{ item.label }}</strong>
        <span>{{ item.description }}</span>
      </button>
    </div>

    <div class="import-type-panel__actions">
      <el-button type="primary" @click="emit('download')">
        <el-icon><Download /></el-icon>
        下载导入模板
      </el-button>
      <el-switch v-model="useWorker" active-text="Web Worker 解析" inactive-text="主线程解析" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.import-type-panel {
  h3 {
    margin: 0 0 12px;
    font-size: 15px;
  }

  &__list {
    display: grid;
    gap: 8px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
  }
}

.type-item {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  background: $bg-page;
  border: 1px solid $border-light;
  border-radius: $radius-base;

  strong {
    font-size: 13px;
    color: $text-primary;
  }

  span {
    font-size: 12px;
    color: $text-tertiary;
  }

  &--active {
    background: $color-primary-light;
    border-color: rgba(19, 194, 194, 0.35);
  }
}
</style>
