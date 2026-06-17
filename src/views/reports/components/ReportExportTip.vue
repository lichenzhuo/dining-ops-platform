<script setup>
import { useRouter } from 'vue-router'

defineProps({
  exportTask: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['clear'])
const router = useRouter()

function goExportCenter() {
  router.push({ path: '/data-import', query: { tab: 'export' } })
}
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
      <div class="export-tip__actions">
        <el-button link type="primary" @click="goExportCenter">导出中心</el-button>
        <el-button v-if="exportTask.status === 'done'" link type="primary" @click="emit('clear')">
          知道了
        </el-button>
      </div>
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

  &__actions {
    display: flex;
    gap: 4px;
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
