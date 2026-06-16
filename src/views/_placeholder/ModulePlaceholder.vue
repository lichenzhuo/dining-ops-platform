<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => (route.meta.title as string) || '模块')
</script>

<template>
  <div class="placeholder-page">
    <div class="placeholder-card page-card">
      <div class="placeholder-icon">
        <el-icon :size="28"><Box /></el-icon>
      </div>
      <h2>{{ title }}</h2>
      <p>该模块将在后续阶段按设计稿逐步实现，当前路由与导航已就绪。</p>
      <el-tag type="info" effect="plain">占位页</el-tag>
    </div>
  </div>
</template>

<style scoped lang="scss">
.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - #{$header-height} - 80px);
}

.placeholder-card {
  width: min(480px, 100%);
  padding: 40px 32px;
  text-align: center;
}

.placeholder-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: $color-brand;
  background: $color-primary-light;
  border-radius: 16px;
}

h2 {
  margin: 0 0 10px;
  font-size: 20px;
  color: $text-primary;
}

p {
  margin: 0 0 16px;
  color: $text-secondary;
  line-height: 1.7;
}
</style>
