<script setup lang="ts">
import LayoutSwitcher from '@/layouts/LayoutSwitcher.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <LayoutSwitcher />
  </el-config-provider>
</template>
