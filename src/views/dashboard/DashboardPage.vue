<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import AiSuggestionPanel from './components/AiSuggestionPanel.vue'
import AlertTablePanel from './components/AlertTablePanel.vue'
import ApprovalTablePanel from './components/ApprovalTablePanel.vue'
import AvgOrderGauge from './components/AvgOrderGauge.vue'
import ChannelChartPanel from './components/ChannelChartPanel.vue'
import DashboardDiagnosis from './components/DashboardDiagnosis.vue'
import DashboardFilterBar from './components/DashboardFilterBar.vue'
import KpiCardRow from './components/KpiCardRow.vue'
import StoreRankPanel from './components/StoreRankPanel.vue'
import TrendChartPanel from './components/TrendChartPanel.vue'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const { filters, data, loading, error } = storeToRefs(dashboardStore)

onMounted(() => {
  dashboardStore.loadDashboard()
})

watch(
  () => [authStore.org.brand, authStore.org.region, authStore.org.store],
  () => {
    dashboardStore.loadDashboard()
  },
)

async function handleSearch() {
  await dashboardStore.loadDashboard()
  if (!error.value) {
    ElMessage.success('工作台数据已刷新')
  }
}

async function handleReset() {
  dashboardStore.resetFilters()
  await dashboardStore.loadDashboard()
  ElMessage.success('筛选条件已重置')
}

function handleExport() {
  ElMessage.info('导出任务已创建，稍后可在导出中心查看（Mock）')
}

function handleFiltersUpdate(nextFilters) {
  dashboardStore.applyFilters(nextFilters)
}

async function handleTrendRangeChange(range) {
  dashboardStore.applyFilters({ trendRange: range })
  await dashboardStore.loadDashboard()
}
</script>

<template>
  <div v-loading="loading" class="dashboard-page">
    <el-alert
      v-if="error"
      type="error"
      :title="error"
      show-icon
      :closable="false"
      class="dashboard-page__error"
    />

    <template v-if="data">
      <DashboardDiagnosis :diagnosis="data.diagnosis" />

      <DashboardFilterBar
        :filters="filters"
        :loading="loading"
        @update:filters="handleFiltersUpdate"
        @search="handleSearch"
        @reset="handleReset"
        @export="handleExport"
      />

      <KpiCardRow :items="data.kpis" />

      <section class="chart-row">
        <TrendChartPanel
          :data="data.trend"
          :trend-range="filters.trendRange"
          :loading="loading"
          @update:trend-range="handleTrendRangeChange"
        />
        <ChannelChartPanel :data="data.channels" :loading="loading" />
        <AvgOrderGauge :data="data.avgOrderValue" />
      </section>

      <section class="ai-row">
        <AiSuggestionPanel :suggestions="data.aiSuggestions" />
        <StoreRankPanel :items="data.storeRank" />
      </section>

      <section class="table-row">
        <AlertTablePanel :items="data.alerts" />
        <ApprovalTablePanel :items="data.approvals" />
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 16px;
  min-height: 320px;
}

.dashboard-page__error {
  margin-bottom: 4px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 16px;
}

.ai-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 16px;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 1100px) {
  .chart-row,
  .ai-row,
  .table-row {
    grid-template-columns: 1fr;
  }
}
</style>
