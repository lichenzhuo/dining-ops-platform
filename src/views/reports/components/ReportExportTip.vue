<script setup>
defineProps({
  exportTask: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['clear'])
</script>

<template>
  <transition name="fade">
    <div v-if="exportTask" class="export-tip">
      <div class="export-tip__content">
        <el-icon><Download /></el-icon>
        <span>{{ exportTask.message }}</span>
        <el-tag size="small" :type="exportTask.status === 'done' ? 'success' : 'warning'">
          {{ exportTask.status === 'done' ? '已完成' : '处理中' }}
        </el-tag>
      </div>
      <el-button v-if="exportTask.status === 'done'" link type="primary" @click="emit('clear')">
        知道了
      </el-button>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.export-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: $color-primary-light;
  border: 1px solid rgba(19, 194, 194, 0.25);
  border-radius: $radius-base;

  &__content {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    font-size: 13px;
    color: $text-secondary;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
