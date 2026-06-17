<script setup>
defineProps({
  brand: { type: String, required: true },
  region: { type: String, required: true },
  syncTime: { type: String, default: '-' },
  healthStatus: { type: String, default: 'healthy' },
  alertCount: { type: Number, default: 0 },
  isFullscreen: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-fullscreen', 'exit'])

const healthMap = {
  healthy: { label: '数据正常', type: 'success' },
  warn: { label: '部分延迟', type: 'warning' },
  error: { label: '同步异常', type: 'danger' },
}
</script>

<template>
  <header class="screen-header">
    <div class="screen-header__brand">
      <div class="screen-header__logo">DOP</div>
      <div>
        <h1>{{ brand }} · 经营指挥大屏</h1>
        <p>{{ region }} · 今日口径 · 自动刷新 30s</p>
      </div>
    </div>

    <div class="screen-header__meta">
      <el-tag :type="healthMap[healthStatus]?.type ?? 'info'" effect="dark" size="small">
        {{ healthMap[healthStatus]?.label ?? '未知' }}
      </el-tag>
      <span class="screen-header__sync">同步 {{ syncTime }}</span>
      <el-badge :value="alertCount" :max="99" type="danger">
        <span class="screen-header__alert">待处理告警</span>
      </el-badge>
    </div>

    <div class="screen-header__actions">
      <el-button size="small" plain @click="emit('exit')">返回后台</el-button>
      <el-button size="small" type="primary" @click="emit('toggle-fullscreen')">
        {{ isFullscreen ? '退出全屏' : '全屏展示' }}
      </el-button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.screen-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: center;
  height: 72px;
  padding: 0 4px;

  &__brand {
    display: flex;
    gap: 14px;
    align-items: center;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: $screen-text-primary;
    }

    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: $screen-text-secondary;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, $screen-accent, $color-brand-dark);
    border-radius: 12px;
    box-shadow: 0 0 24px rgba(19, 194, 194, 0.35);
  }

  &__meta {
    display: flex;
    gap: 16px;
    align-items: center;
    font-size: 12px;
    color: $screen-text-secondary;
  }

  &__alert {
    padding: 6px 10px;
    background: rgba(255, 77, 79, 0.12);
    border: 1px solid rgba(255, 77, 79, 0.25);
    border-radius: 999px;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}
</style>
