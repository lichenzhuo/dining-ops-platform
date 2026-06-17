<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const levelType = {
  danger: 'danger',
  warning: 'warning',
  info: 'info',
}

function resolveLevelType(level) {
  return levelType[level]
}
</script>

<template>
  <div class="panel-card table-card">
    <div class="card-head">
      <h3>异常预警处理台</h3>
    </div>
    <el-table :data="items" size="default">
      <el-table-column prop="store" label="门店" min-width="130" />
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="resolveLevelType(row.level)" effect="light">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="说明" min-width="150" />
      <el-table-column prop="time" label="时间" width="80" />
    </el-table>
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
</style>
