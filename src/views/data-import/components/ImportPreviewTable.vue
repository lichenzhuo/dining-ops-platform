<script setup>
import { computed } from 'vue'
import { getImportSchema } from '@/constants/dataImport'

const props = defineProps({
  importType: {
    type: String,
    required: true,
  },
  validRows: {
    type: Array,
    default: () => [],
  },
})

const columns = computed(() => getImportSchema(props.importType))
</script>

<template>
  <section class="panel-card preview-panel">
    <div class="preview-panel__head">
      <h3>有效数据预览</h3>
      <span>{{ validRows.length }} 条</span>
    </div>

    <el-table :data="validRows.slice(0, 8)" size="small" border max-height="320">
      <el-table-column prop="rowNumber" label="行号" width="70" />
      <el-table-column
        v-for="field in columns"
        :key="field.key"
        :prop="`data.${field.key}`"
        :label="field.label"
        min-width="120"
      />
    </el-table>
  </section>
</template>

<style scoped lang="scss">
.preview-panel {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
    }

    span {
      font-size: 12px;
      color: $text-tertiary;
    }
  }
}
</style>
