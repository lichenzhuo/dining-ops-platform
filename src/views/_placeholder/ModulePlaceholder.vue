<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => (route.meta.title as string) || '模块')
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" class="page-card">
      <el-empty :description="`${title}模块将在后续阶段实现`">
        <el-tag type="info">占位页 · Phase 2 路由已就绪</el-tag>
      </el-empty>
    </el-card>
  </div>
</template>
