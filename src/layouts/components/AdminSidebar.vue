<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { filterMenuGroups } from '@/utils/menu'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const activeMenu = computed(() => route.path)
const isCollapsed = computed(() => layoutStore.sidebarCollapsed)
const visibleMenuGroups = computed(() => filterMenuGroups(authStore.menuPaths))

function resolveIcon(name?: string) {
  if (!name) return ElementPlusIcons.Menu
  return (ElementPlusIcons as Record<string, typeof ElementPlusIcons.Menu>)[name] ?? ElementPlusIcons.Menu
}

function handleMenuSelect(path: string) {
  router.push(path)
}
</script>

<template>
  <aside class="admin-sidebar" :class="{ 'admin-sidebar--collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <span class="sidebar-logo__mark">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="url(#sidebarGrad)" />
            <path
              d="M10 12c0 4 2.6 6.5 6 6.5S22 16 22 12M16 18.5V23"
              stroke="#fff"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <circle cx="16" cy="11" r="1.4" fill="#fff" />
            <defs>
              <linearGradient id="sidebarGrad" x1="3" y1="3" x2="29" y2="29">
                <stop stop-color="#36cfc9" />
                <stop offset="1" stop-color="#13a8a8" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <div v-show="!isCollapsed" class="sidebar-logo__text">
          <strong>味链云</strong>
          <span>连锁餐饮运营平台</span>
        </div>
      </div>
      <button
        type="button"
        class="sidebar-collapse-btn"
        :aria-label="isCollapsed ? '展开菜单' : '收起菜单'"
        @click="layoutStore.toggleSidebar()"
      >
        <el-icon>
          <component :is="isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </button>
    </div>

    <el-scrollbar class="sidebar-scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <template v-for="group in visibleMenuGroups" :key="group.title">
          <el-menu-item-group v-if="!isCollapsed" :title="group.title">
            <el-menu-item v-for="item in group.items" :key="item.path" :index="item.path">
              <el-icon><component :is="resolveIcon(item.icon)" /></el-icon>
              <template #title>
                <span>{{ item.title }}</span>
                <el-icon v-if="item.external" class="menu-external-icon"><TopRight /></el-icon>
              </template>
            </el-menu-item>
          </el-menu-item-group>

          <template v-else>
            <el-menu-item v-for="item in group.items" :key="item.path" :index="item.path">
              <el-icon><component :is="resolveIcon(item.icon)" /></el-icon>
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<style scoped lang="scss">
.admin-sidebar {
  display: flex;
  flex-direction: column;
  width: $sidebar-width;
  height: 100%;
  background: $bg-sidebar;
  border-right: 1px solid $border-color;
  transition: width 0.2s ease;

  &--collapsed {
    width: $sidebar-collapsed-width;
  }
}

.sidebar-header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  padding: 0 12px 0 16px;
  border-bottom: 1px solid $border-light;
}

.sidebar-logo {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.sidebar-logo__mark {
  display: flex;
  flex-shrink: 0;
  width: 32px;
  height: 32px;

  svg {
    width: 100%;
    height: 100%;
  }
}

.sidebar-logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;

  strong {
    font-size: 15px;
    font-weight: 700;
    color: $color-brand-dark;
  }

  span {
    font-size: 12px;
    color: $text-tertiary;
  }
}

.sidebar-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: $text-tertiary;
  background: transparent;
  border: none;
  border-radius: $radius-sm;
  cursor: pointer;

  &:hover {
    color: $color-brand;
    background: $color-primary-light;
  }
}

.sidebar-scroll {
  flex: 1;
}

.sidebar-menu {
  --el-menu-bg-color: transparent;
  --el-menu-border-color: transparent;
  --el-menu-item-height: 44px;
  --el-menu-sub-item-height: 44px;

  border-right: none;

  :deep(.el-menu-item-group__title) {
    padding: 16px 16px 6px;
    font-size: 12px;
    font-weight: 500;
    color: $text-tertiary;
    letter-spacing: 0.5px;
  }

  :deep(.el-menu-item) {
    margin: 2px 8px;
    border-radius: $radius-base;

    &.is-active {
      font-weight: 600;
      color: $color-brand;
      background: $color-primary-light;

      &::before {
        position: absolute;
        top: 10px;
        bottom: 10px;
        left: 0;
        width: 3px;
        background: $color-brand;
        border-radius: 0 3px 3px 0;
        content: '';
      }
    }

    &:hover {
      background: rgba(19, 194, 194, 0.06);
    }
  }

  :deep(.el-menu-item .el-menu-tooltip__trigger) {
    justify-content: center;
  }
}

.menu-external-icon {
  margin-left: 4px;
  font-size: 12px;
  color: $text-tertiary;
}
</style>
