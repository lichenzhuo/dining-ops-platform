<script setup>
import { useRouter } from 'vue-router'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const router = useRouter()

function goApprovalCenter() {
  router.push('/approval')
}
</script>

<template>
  <div class="panel-card table-card">
    <div class="card-head">
      <h3>审批待办</h3>
      <el-button link type="primary" @click="goApprovalCenter">进入审批中心</el-button>
    </div>
    <el-table :data="items" size="default" @row-click="goApprovalCenter">
      <el-table-column prop="title" label="审批事项" min-width="160" />
      <el-table-column prop="applicant" label="申请人" width="110" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag size="small" type="warning" effect="light">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
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

:deep(.el-table__row) {
  cursor: pointer;
}
</style>
