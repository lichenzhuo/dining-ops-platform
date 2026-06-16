<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import BlankLayout from './BlankLayout.vue'
import ScreenLayout from './ScreenLayout.vue'
import type { AppLayout } from '@/types'
import type { Component } from 'vue'

const route = useRoute()

const layoutMap: Record<AppLayout, Component> = {
  admin: AdminLayout,
  screen: ScreenLayout,
  blank: BlankLayout,
}

const currentLayout = computed(() => {
  const layout = (route.meta.layout as AppLayout | undefined) ?? 'blank'
  return layoutMap[layout] ?? BlankLayout
})
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
