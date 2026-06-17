<script setup>
import { computed } from 'vue'
import { REPORT_COLUMN_DEFS } from '@/constants/reports'

const props = defineProps({
  reportId: {
    type: String,
    required: true,
  },
  rows: {
    type: Array,
    default: () => [],
  },
  visibleColumnKeys: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['drill'])

const columnDefs = computed(() => REPORT_COLUMN_DEFS[props.reportId] ?? [])

const activeColumns = computed(() =>
  columnDefs.value.filter((col) => props.visibleColumnKeys.includes(col.key)),
)

const groupedColumns = computed(() => {
  const groups = new Map()
  for (const col of activeColumns.value) {
    const group = col.group ?? ''
    if (!groups.has(group)) {
      groups.set(group, [])
    }
    groups.get(group).push(col)
  }
  return [...groups.entries()]
})

const hasGroupedHeader = computed(() =>
  groupedColumns.value.some(([group, cols]) => group && cols.length > 0),
)

function handleDrill(column, row) {
  if (!column.drill) {
    return
  }
  const value =
    column.drill.field === 'channel'
      ? row.channelKey ?? row.channelName
      : row[column.key]
  emit('drill', {
    reportId: column.drill.reportId,
    field: column.drill.field,
    value,
    label: row[column.key],
  })
}
</script>

<template>
  <div v-loading="loading" class="panel-card report-table">
    <div class="card-head">
      <h3>明细数据</h3>
      <span class="card-head__hint">点击带下划线的字段可下钻分析</span>
    </div>

    <el-table :data="rows" stripe border show-summary style="width: 100%">
      <template v-if="hasGroupedHeader">
        <template v-for="[group, cols] in groupedColumns" :key="group || 'root'">
          <el-table-column v-if="group" :label="group" align="center">
            <el-table-column
              v-for="col in cols"
              :key="col.key"
              :prop="col.key"
              :label="col.label"
              :width="col.width"
              :align="col.align ?? 'left'"
            />
          </el-table-column>
          <template v-else>
            <el-table-column
              v-for="col in cols"
              :key="col.key"
              :prop="col.key"
              :label="col.label"
              :width="col.width"
              :align="col.align ?? 'left'"
              :fixed="col.fixed"
            />
          </template>
        </template>
      </template>

      <template v-else>
        <el-table-column
          v-for="col in activeColumns"
          :key="col.key"
          :prop="col.key"
          :label="col.label"
          :width="col.width"
          :min-width="col.fixed ? undefined : 120"
          :align="col.align ?? 'left'"
          :fixed="col.fixed"
        >
          <template #default="{ row }">
            <button
              v-if="col.drill"
              type="button"
              class="report-table__drill"
              @click="handleDrill(col, row)"
            >
              {{ row[col.key] }}
            </button>
            <span v-else>{{ row[col.key] }}</span>
          </template>
        </el-table-column>
      </template>
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
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }

  &__hint {
    font-size: 12px;
    color: $text-tertiary;
  }
}

.report-table__drill {
  padding: 0;
  font: inherit;
  color: $color-primary;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
