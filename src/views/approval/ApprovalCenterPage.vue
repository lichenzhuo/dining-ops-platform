<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { APPROVAL_TABS } from '@/constants/approval'
import { useApprovalStore } from '@/stores/approval'
import ApprovalDetailDrawer from './components/ApprovalDetailDrawer.vue'
import ApprovalFilterBar from './components/ApprovalFilterBar.vue'
import ApprovalTable from './components/ApprovalTable.vue'
import PermissionOverviewPanel from './components/PermissionOverviewPanel.vue'

const approvalStore = useApprovalStore()

const {
  list,
  pendingCount,
  loading,
  activeTab,
  filters,
  selectedItem,
  drawerOpen,
  canReview,
} = storeToRefs(approvalStore)

onMounted(() => {
  approvalStore.loadApprovals()
})

watch(activeTab, () => {
  approvalStore.loadApprovals()
})

async function handleSearch() {
  await approvalStore.loadApprovals()
}

async function handleApprove(row) {
  await ElMessageBox.confirm(`确认通过「${row.title}」？`, '审批通过', { type: 'success' })
  await approvalStore.approve(row.id)
  ElMessage.success('审批已通过')
  await approvalStore.loadApprovals()
}

async function handleReject(row) {
  const { value } = await ElMessageBox.prompt('请输入驳回原因', '审批驳回', {
    confirmButtonText: '驳回',
    cancelButtonText: '取消',
    inputPlaceholder: '例如：预算超支、文案不合规',
    type: 'warning',
  })
  await approvalStore.reject(row.id, value)
  ElMessage.success('已驳回')
  await approvalStore.loadApprovals()
}

async function handleDispatch(row) {
  await approvalStore.dispatch(row.id)
  ElMessage.success('已下发门店')
  await approvalStore.loadApprovals()
}

async function handleComplete(row) {
  await approvalStore.complete(row.id)
  ElMessage.success('流程已完成')
  await approvalStore.loadApprovals()
}
</script>

<template>
  <div class="approval-page">
    <header class="approval-page__header">
      <div>
        <h2>审批中心</h2>
        <p>RBAC 权限 · 路由/菜单/按钮三级控制 · 营销活动 / AI 内容 / 卡券 / 预算审批流</p>
      </div>
      <el-tag v-if="pendingCount" type="warning">{{ pendingCount }} 条待审批</el-tag>
    </header>

    <section class="approval-page__layout">
      <PermissionOverviewPanel />

      <div class="approval-page__main">
        <el-tabs v-model="activeTab">
          <el-tab-pane
            v-for="tab in APPROVAL_TABS"
            :key="tab.key"
            :label="tab.label"
            :name="tab.key"
          />
        </el-tabs>

        <ApprovalFilterBar v-model="filters" @search="handleSearch" />

        <ApprovalTable
          :list="list"
          :loading="loading"
          :can-review="canReview"
          @detail="approvalStore.openDetail"
          @approve="handleApprove"
          @reject="handleReject"
          @dispatch="handleDispatch"
          @complete="handleComplete"
        />
      </div>
    </section>

    <ApprovalDetailDrawer
      :item="selectedItem"
      :open="drawerOpen"
      @close="approvalStore.closeDetail"
    />
  </div>
</template>

<style scoped lang="scss">
.approval-page {
  display: grid;
  gap: 16px;

  &__header {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;

    h2 {
      margin: 0;
      font-size: 22px;
    }

    p {
      margin: 6px 0 0;
      font-size: 13px;
      color: $text-tertiary;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  &__main {
    display: grid;
    gap: 14px;
  }
}

@media (max-width: 1200px) {
  .approval-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
