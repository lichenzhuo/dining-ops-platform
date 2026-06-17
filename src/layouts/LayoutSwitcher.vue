<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import BlankLayout from './BlankLayout.vue'
import ScreenLayout from './ScreenLayout.vue'

const route = useRoute()

const layoutMap = {
  admin: AdminLayout,
  screen: ScreenLayout,
  blank: BlankLayout,
}

const currentLayout = computed(() => {
  const layout = route.meta.layout ?? 'blank'
  return layoutMap[layout] ?? BlankLayout
})</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
