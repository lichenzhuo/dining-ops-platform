<script setup>
import { computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRealtimeStore } from '@/stores/realtime'
import AdminLayout from './AdminLayout.vue'
import BlankLayout from './BlankLayout.vue'
import ScreenLayout from './ScreenLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const realtimeStore = useRealtimeStore()

const layoutMap = {
  admin: AdminLayout,
  screen: ScreenLayout,
  blank: BlankLayout,
}

const currentLayout = computed(() => {
  const layout = route.meta.layout ?? 'blank'
  return layoutMap[layout] ?? BlankLayout
})

watch(
  () => authStore.isLoggedIn,
  async (loggedIn) => {
    if (loggedIn) {
      await realtimeStore.connect()
      return
    }
    realtimeStore.disconnect()
  },
  { immediate: true },
)
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
