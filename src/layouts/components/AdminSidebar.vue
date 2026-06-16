<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { adminMenuItems } from '@/router/menu'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()

const activeMenu = computed(() => route.path)

function resolveIcon(name?: string) {
  if (!name) return ElementPlusIcons.Menu
  return (ElementPlusIcons as Record<string, typeof ElementPlusIcons.Menu>)[name] ?? ElementPlusIcons.Menu
}
</script>

<template>
  <aside class="admin-sidebar">
    <div class="sidebar-brand">
      <el-icon :size="22" color="#13c2c2">
        <Shop />
      </el-icon>
      <span class="brand-title">{{ appStore.appName }}</span>
    </div>
    <el-scrollbar class="sidebar-menu-wrap">
      <el-menu :default-active="activeMenu" router class="sidebar-menu">
        <el-menu-item v-for="item in adminMenuItems" :key="item.path" :index="item.path">
          <el-icon>
            <component :is="resolveIcon(item.icon)" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
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
  background: $bg-container;
  border-right: 1px solid $border-color;
}

.sidebar-brand {
  display: flex;
  gap: 10px;
  align-items: center;
  height: $header-height;
  padding: 0 16px;
  border-bottom: 1px solid $border-color;
}

.brand-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.3;
}

.sidebar-menu-wrap {
  flex: 1;
}

.sidebar-menu {
  border-right: none;
}
</style>
