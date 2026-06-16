<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const brand = ref('味满鲜')
const region = ref('华东区')
const store = ref('全部门店')

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  if (matched.length === 0) {
    return [{ title: '首页', path: '/dashboard' }]
  }
  return [{ title: '首页', path: '/dashboard' }, ...matched.map((item) => ({
    title: item.meta.title as string,
    path: item.path,
  }))]
})

function goLargeScreen() {
  router.push('/large-screen')
}
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
          <span
            v-if="index === breadcrumbs.length - 1"
            class="breadcrumb-current"
          >
            {{ item.title }}
          </span>
          <router-link v-else :to="item.path" class="breadcrumb-link">
            {{ item.title }}
          </router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header-center">
      <el-select v-model="brand" size="small" class="header-select">
        <el-option label="味满鲜" value="味满鲜" />
        <el-option label="茶研社" value="茶研社" />
      </el-select>
      <el-select v-model="region" size="small" class="header-select">
        <el-option label="华东区" value="华东区" />
        <el-option label="华南区" value="华南区" />
        <el-option label="华北区" value="华北区" />
      </el-select>
      <el-select v-model="store" size="small" class="header-select header-select--wide">
        <el-option label="全部门店" value="全部门店" />
        <el-option label="上海南京路店" value="上海南京路店" />
        <el-option label="杭州西湖店" value="杭州西湖店" />
      </el-select>
    </div>

    <div class="header-right">
      <el-tooltip content="经营指挥大屏" placement="bottom">
        <button type="button" class="header-icon-btn" @click="goLargeScreen">
          <el-icon><Monitor /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="全局搜索" placement="bottom">
        <button type="button" class="header-icon-btn">
          <el-icon><Search /></el-icon>
        </button>
      </el-tooltip>
      <el-badge :value="5" :max="99" class="header-badge">
        <button type="button" class="header-icon-btn">
          <el-icon><Bell /></el-icon>
        </button>
      </el-badge>
      <el-tooltip content="帮助中心" placement="bottom">
        <button type="button" class="header-icon-btn">
          <el-icon><QuestionFilled /></el-icon>
        </button>
      </el-tooltip>

      <el-divider direction="vertical" />

      <el-dropdown trigger="click" placement="bottom-end">
        <div class="user-block">
          <el-avatar :size="32" class="user-avatar">运</el-avatar>
          <div class="user-meta">
            <span class="user-name">张运营</span>
            <span class="user-role">总部运营管理员</span>
          </div>
          <el-icon class="user-arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Setting /></el-icon>
              偏好设置
            </el-dropdown-item>
            <el-dropdown-item divided @click="router.push('/login')">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
.admin-header {
  display: flex;
  gap: 16px;
  align-items: center;
  height: $header-height;
  padding: 0 20px;
  background: $bg-container;
  border-bottom: 1px solid $border-color;
}

.header-left {
  flex-shrink: 0;
  min-width: 120px;
}

.breadcrumb-link {
  color: $text-tertiary;
  text-decoration: none;

  &:hover {
    color: $color-brand;
  }
}

.breadcrumb-current {
  font-weight: 500;
  color: $text-primary;
}

.header-center {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.header-select {
  width: 108px;

  &--wide {
    width: 140px;
  }

  :deep(.el-select__wrapper) {
    box-shadow: 0 0 0 1px $border-color inset;
  }
}

.header-right {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  align-items: center;
}

.header-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: $text-secondary;
  background: transparent;
  border: none;
  border-radius: $radius-base;
  cursor: pointer;

  &:hover {
    color: $color-brand;
    background: $color-primary-light;
  }
}

.header-badge {
  :deep(.el-badge__content) {
    border: none;
  }
}

.user-block {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 4px 8px 4px 4px;
  border-radius: $radius-base;
  cursor: pointer;

  &:hover {
    background: $border-light;
  }
}

.user-avatar {
  font-size: 14px;
  color: #fff;
  background: linear-gradient(135deg, #13c2c2, #0b3d5c);
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: $text-primary;
}

.user-role {
  font-size: 11px;
  color: $text-tertiary;
}

.user-arrow {
  font-size: 12px;
  color: $text-tertiary;
}

@media (max-width: 1280px) {
  .header-center {
    display: none;
  }
}
</style>
