<script setup>
import { AGENT_WORKFLOW_STEPS } from '@/constants/aiAgent'

defineProps({
  activeStep: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'draft',
  },
})
</script>

<template>
  <section class="agent-workflow">
    <el-steps :active="activeStep" align-center finish-status="success">
      <el-step v-for="item in AGENT_WORKFLOW_STEPS" :key="item.key" :title="item.label" />
    </el-steps>
    <p class="agent-workflow__hint">
      当前状态：<strong>{{ status }}</strong> · AI 结果进入素材库 → 审批 → 门店下发 → 效果追踪
    </p>
  </section>
</template>

<style scoped lang="scss">
.agent-workflow {
  padding: 16px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;

  &__hint {
    margin: 12px 0 0;
    font-size: 12px;
    color: $text-tertiary;
    text-align: center;

    strong {
      color: $color-brand;
    }
  }
}
</style>
