<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useReportsStore } from '@/stores/reports'
import { useRealtimeStore } from '@/stores/realtime'
import { useExportQueueStore } from '@/stores/exportQueue'
import KpiCardRow from '@/views/dashboard/components/KpiCardRow.vue'
import ExternalBiPanel from './components/ExternalBiPanel.vue'
import ReportCategoryTree from './components/ReportCategoryTree.vue'
import ReportChartPanel from './components/ReportChartPanel.vue'
import ReportDetailTable from './components/ReportDetailTable.vue'
import ReportExportTip from './components/ReportExportTip.vue'
import ReportFieldDrawer from './components/ReportFieldDrawer.vue'
import ReportFilterBar from './components/ReportFilterBar.vue'
import ReportToolbar from './components/ReportToolbar.vue'

const route = useRoute()
const router = useRouter()
const reportsStore = useReportsStore()
const realtimeStore = useRealtimeStore()
const exportQueueStore = useExportQueueStore()

const {
  reportId,
  filters,
  pagination,
  savedViews,
  data,
  loading,
  error,
  fieldDrawerOpen,
  exportTask,
  activeVisibleColumns,
} = storeToRefs(reportsStore)

const { exportMessages } = storeToRefs(realtimeStore)

let syncingRoute = false

watch(
  () => exportMessages.value[0],
  (latest) => {
    if (!latest || latest.status !== 'done' || !exportTask.value) {
      return
    }
    if (exportTask.value.status !== 'done') {
      exportTask.value = {
        ...exportTask.value,
        status: 'done',
        message: latest.message,
      }
      exportQueueStore.markDoneByReport(latest.reportId, {
        message: latest.message,
        fileName: `${latest.reportId}.xlsx`,
      })
      ElMessage.success('导出任务已完成（MQTT 通知）')
    }
  },
)

async function syncRouteAndLoad(replace = true) {
  syncingRoute = true
  const nextQuery = reportsStore.buildRouteQuery()
  await router.replace({ path: '/reports', query: nextQuery })
  await reportsStore.loadReport()
  syncingRoute = false
}

onMounted(async () => {
  reportsStore.applyRouteQuery(route.query)
  await reportsStore.loadReport()
})

watch(
  () => route.query,
  async (query) => {
    if (syncingRoute) {
      return
    }
    reportsStore.applyRouteQuery(query)
    await reportsStore.loadReport()
  },
)

async function handleSelectReport(id) {
  reportsStore.selectReport(id)
  await syncRouteAndLoad()
}

async function handleSearch() {
  await syncRouteAndLoad()
  if (!error.value) {
    ElMessage.success('报表数据已刷新')
  }
}

async function handleReset() {
  reportsStore.resetFilters()
  await syncRouteAndLoad()
  ElMessage.success('筛选条件已重置')
}

async function handleExport() {
  await reportsStore.createExportTask()
  ElMessage.success('导出任务已创建')
}

function handleFiltersUpdate(nextFilters) {
  reportsStore.applyFilters(nextFilters)
}

async function handlePageChange(page) {
  reportsStore.setPage(page)
  await syncRouteAndLoad()
}

async function handlePageSizeChange(pageSize) {
  reportsStore.setPageSize(pageSize)
  await syncRouteAndLoad()
}

async function handleDrill(payload) {
  reportsStore.drillDown(payload)
  await syncRouteAndLoad()
  ElMessage.success(`已下钻至「${payload.label}」相关分析`)
}

async function handleApplyView(viewId) {
  const ok = reportsStore.applySavedView(viewId)
  if (!ok) {
    ElMessage.warning('视图不存在或已删除')
    return
  }
  await syncRouteAndLoad()
  ElMessage.success('常用视图已应用')
}

async function handleSaveView(name) {
  reportsStore.saveCurrentView(name)
}

function handleRemoveView(viewId) {
  reportsStore.removeSavedView(viewId)
}

function handleSaveColumns(columns) {
  reportsStore.setVisibleColumns(columns)
  ElMessage.success('字段配置已应用')
}
</script>

<template>
  <div class="reports-page">
    <aside class="reports-page__aside">
      <ReportCategoryTree :active-id="reportId" @select="handleSelectReport" />
    </aside>

    <main v-loading="loading" class="reports-page__main">
      <el-alert
        v-if="error"
        type="error"
        :title="error"
        show-icon
        :closable="false"
        class="reports-page__error"
      />

      <ReportToolbar
        :report-id="reportId"
        :saved-views="savedViews"
        @open-fields="fieldDrawerOpen = true"
        @apply-view="handleApplyView"
        @save-view="handleSaveView"
        @remove-view="handleRemoveView"
      />

      <ExternalBiPanel v-if="data?.external" />

      <template v-else>
        <ReportFilterBar
          :filters="filters"
          :loading="loading"
          :drill-store="filters.drillStore"
          @update:filters="handleFiltersUpdate"
          @search="handleSearch"
          @reset="handleReset"
          @export="handleExport"
        />

        <KpiCardRow v-if="data?.metrics?.length" :items="data.metrics" />

        <ReportChartPanel
          v-if="data?.chart"
          :chart="data.chart"
          :report-id="reportId"
          :loading="loading"
        />

        <ReportDetailTable
          :report-id="reportId"
          :rows="data?.rows ?? []"
          :visible-column-keys="activeVisibleColumns"
          :loading="loading"
          @drill="handleDrill"
        />

        <footer class="reports-page__footer">
          <el-pagination
            :current-page="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            background
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
          <ReportExportTip :export-task="exportTask" @clear="reportsStore.clearExportTask()" />
        </footer>
      </template>
    </main>

    <ReportFieldDrawer
      v-model="fieldDrawerOpen"
      :report-id="reportId"
      :visible-column-keys="activeVisibleColumns"
      @save="handleSaveColumns"
    />
  </div>
</template>

<style scoped lang="scss">
.reports-page {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.reports-page__aside {
  position: sticky;
  top: 0;
  padding: 16px 12px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.reports-page__main {
  display: grid;
  gap: 16px;
  min-height: 480px;
}

.reports-page__error {
  margin-bottom: 0;
}

.reports-page__footer {
  display: grid;
  gap: 12px;
}

@media (max-width: 1100px) {
  .reports-page {
    grid-template-columns: 1fr;
  }

  .reports-page__aside {
    position: static;
  }
}
</style>
