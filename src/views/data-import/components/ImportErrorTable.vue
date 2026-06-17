<script setup>
defineProps({
  errorRows: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="panel-card error-panel">
    <div class="error-panel__head">
      <h3>错误行</h3>
      <el-tag type="danger" size="small">{{ errorRows.length }} 条需修正</el-tag>
    </div>

    <el-empty v-if="!errorRows.length" description="暂无错误行" :image-size="56" />

    <el-table v-else :data="errorRows" size="small" border max-height="280">
      <el-table-column prop="rowNumber" label="行号" width="70" />
      <el-table-column label="错误原因" min-width="280">
        <template #default="{ row }">
          <ul class="error-panel__list">
            <li v-for="(item, index) in row.errors" :key="index">{{ item }}</li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<style scoped lang="scss">
.error-panel {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
    }
  }

  &__list {
    margin: 0;
    padding-left: 16px;
    font-size: 12px;
    line-height: 1.6;
    color: $color-danger;
  }
}
</style>
