<script setup>
defineProps({
  suggestions: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="panel-card ai-card">
    <div class="card-head">
      <h3>AI 今日建议</h3>
      <el-tag size="small" effect="dark" type="success">AI</el-tag>
    </div>
    <ul class="ai-list">
      <li v-for="(item, index) in suggestions" :key="index">
        <el-icon class="ai-list__icon"><MagicStick /></el-icon>
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.panel-card {
  padding: 18px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.ai-card {
  background: linear-gradient(160deg, #f7f4ff 0%, #fff 45%);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

.ai-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: $text-secondary;
  line-height: 1.6;

  li {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    font-size: 13px;
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: #722ed1;
  }
}
</style>
