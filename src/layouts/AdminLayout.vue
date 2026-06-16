<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import AdminHeader from './components/AdminHeader.vue'
import AdminSidebar from './components/AdminSidebar.vue'

const layoutStore = useLayoutStore()
const sidebarWidth = computed(() =>
  layoutStore.sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
)
</script>

<template>
  <div class="admin-layout" :style="{ '--sidebar-current-width': sidebarWidth }">
    <AdminSidebar />
    <div class="admin-main">
      <AdminHeader />
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  --sidebar-width: #{$sidebar-width};
  --sidebar-collapsed-width: #{$sidebar-collapsed-width};

  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $bg-page;
}

.admin-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.admin-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style>
