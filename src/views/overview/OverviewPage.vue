<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<template>
  <div class="overview-page">
    <el-card class="welcome-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ appStore.appName }}</span>
          <el-tag type="success" size="small">Phase 1 初始化完成</el-tag>
        </div>
      </template>
      <p class="desc">Vue3 + Vite + TypeScript + Element Plus + Pinia + Vue Router 工程已就绪。</p>
      <el-space wrap>
        <el-button type="primary">经营工作台</el-button>
        <el-button>报表中心</el-button>
        <el-button>经营大屏</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.overview-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: $bg-page;
}

.welcome-card {
  width: min(640px, 100%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
}

.desc {
  margin: 0 0 20px;
  color: $text-secondary;
  line-height: 1.6;
}
</style>
