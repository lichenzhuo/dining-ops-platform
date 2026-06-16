<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => (route.meta.title as string) || '页面')

function goLargeScreen() {
  router.push('/large-screen')
}
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <el-tag size="small" type="info">Phase 2</el-tag>
    </div>
    <div class="header-right">
      <el-button text @click="goLargeScreen">
        <el-icon><Monitor /></el-icon>
        经营大屏
      </el-button>
      <el-divider direction="vertical" />
      <el-dropdown trigger="click">
        <span class="user-entry">
          <el-avatar :size="28">运</el-avatar>
          <span class="user-name">运营管理员</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item divided @click="router.push('/login')">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  padding: 0 16px;
  background: $bg-container;
  border-bottom: 1px solid $border-color;
}

.header-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.header-right {
  display: flex;
  gap: 4px;
  align-items: center;
}

.user-entry {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  color: $text-secondary;
}

.user-name {
  font-size: 13px;
}
</style>
