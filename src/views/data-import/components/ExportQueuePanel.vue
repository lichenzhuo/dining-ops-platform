<script setup>
import { EXPORT_TASK_STATUS } from '@/constants/dataImport'

defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  pendingCount: {
    type: Number,
    default: 0,
  },
  getStatusLabel: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['download', 'remove', 'clear-done', 'quick-export'])

const statusTypeMap = {
  [EXPORT_TASK_STATUS.PENDING]: 'info',
  [EXPORT_TASK_STATUS.PROCESSING]: 'warning',
  [EXPORT_TASK_STATUS.DONE]: 'success',
  [EXPORT_TASK_STATUS.FAILED]: 'danger',
}

function formatTime(value) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('zh-CN')
}
</script>

<template>
  <section class="panel-card export-panel">
    <div class="export-panel__head">
      <div>
        <h3>导出任务队列</h3>
        <p>大数据量报表走异步任务，避免页面阻塞；小数据可直接前端导出</p>
      </div>
      <div class="export-panel__actions">
        <el-tag v-if="pendingCount" type="warning">{{ pendingCount }} 个进行中</el-tag>
        <el-button @click="emit('quick-export')">小数据快速导出</el-button>
        <el-button plain @click="emit('clear-done')">清除已完成</el-button>
      </div>
    </div>

    <el-empty v-if="!tasks.length" description="暂无导出任务，可在报表中心创建" />

    <el-table v-else :data="tasks" size="small" border>
      <el-table-column prop="reportName" label="报表/任务" min-width="160" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="statusTypeMap[row.status] ?? 'info'">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="说明" min-width="220" show-overflow-tooltip />
      <el-table-column label="创建时间" width="170">
        <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === EXPORT_TASK_STATUS.DONE"
            link
            type="primary"
            @click="emit('download', row)"
          >
            下载
          </el-button>
          <el-button link type="danger" @click="emit('remove', row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<style scoped lang="scss">
.export-panel {
  &__head {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 14px;

    h3 {
      margin: 0;
      font-size: 15px;
    }

    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: $text-tertiary;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
}
</style>
