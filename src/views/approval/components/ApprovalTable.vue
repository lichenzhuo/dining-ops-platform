<script setup>
import {
  APPROVAL_STATUS,
  APPROVAL_STATUS_TYPES,
  getStatusLabel,
  getTypeLabel,
} from '@/constants/approval'
import { PERMISSIONS } from '@/constants/permissions'

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  canReview: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['detail', 'approve', 'reject', 'dispatch', 'complete'])

function formatTime(value) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('zh-CN')
}
</script>

<template>
  <section class="panel-card approval-table">
    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="title" label="审批事项" min-width="200" show-overflow-tooltip />
      <el-table-column label="类型" width="110">
        <template #default="{ row }">{{ getTypeLabel(row.type) }}</template>
      </el-table-column>
      <el-table-column prop="applicant" label="申请人" width="120" />
      <el-table-column prop="region" label="区域" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="APPROVAL_STATUS_TYPES[row.status] ?? 'info'">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="170">
        <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('detail', row)">详情</el-button>
          <template v-if="row.status === APPROVAL_STATUS.PENDING && canReview">
            <el-button
              v-permission="PERMISSIONS.APPROVAL_APPROVE"
              link
              type="success"
              @click="emit('approve', row)"
            >
              通过
            </el-button>
            <el-button
              v-permission="PERMISSIONS.APPROVAL_REJECT"
              link
              type="danger"
              @click="emit('reject', row)"
            >
              驳回
            </el-button>
          </template>
          <el-button
            v-if="row.status === APPROVAL_STATUS.APPROVED && canReview"
            link
            type="primary"
            @click="emit('dispatch', row)"
          >
            下发
          </el-button>
          <el-button
            v-if="row.status === APPROVAL_STATUS.DISPATCHED && canReview"
            link
            type="success"
            @click="emit('complete', row)"
          >
            完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<style scoped lang="scss">
.approval-table {
  padding: 0;
  overflow: hidden;
}
</style>
