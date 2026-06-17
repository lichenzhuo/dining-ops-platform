import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getDefaultVisibleColumns } from '@/constants/reports'
import { createReportExportTask, fetchReportData } from '@/services/reports'
import { useAuthStore } from '@/stores/auth'

function defaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 13)
  const format = (date) => date.toISOString().slice(0, 10)
  return [format(start), format(end)]
}

const defaultFilters = () => ({
  dateRange: defaultDateRange(),
  channel: 'all',
  keyword: '',
  drillStore: '',
})

export const useReportsStore = defineStore(
  'reports',
  () => {
    const reportId = ref('daily')
    const filters = ref(defaultFilters())
    const pagination = ref({ page: 1, pageSize: 20, total: 0 })
    const visibleColumns = ref({})
    const savedViews = ref([])
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const fieldDrawerOpen = ref(false)
    const exportTask = ref(null)

    const query = computed(() => {
      const auth = useAuthStore()
      return {
        reportId: reportId.value,
        ...filters.value,
        brand: auth.org.brand,
        region: auth.org.region,
        store: auth.org.store,
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
      }
    })

    const activeVisibleColumns = computed(() => {
      if (visibleColumns.value[reportId.value]?.length) {
        return visibleColumns.value[reportId.value]
      }
      return getDefaultVisibleColumns(reportId.value)
    })

    function ensureColumnConfig(id = reportId.value) {
      if (!visibleColumns.value[id]?.length) {
        visibleColumns.value = {
          ...visibleColumns.value,
          [id]: getDefaultVisibleColumns(id),
        }
      }
    }

    function applyRouteQuery(routeQuery = {}) {
      if (routeQuery.report && routeQuery.report !== reportId.value) {
        reportId.value = routeQuery.report
        ensureColumnConfig(routeQuery.report)
      }

      const nextFilters = { ...filters.value }
      if (routeQuery.from && routeQuery.to) {
        nextFilters.dateRange = [routeQuery.from, routeQuery.to]
      }
      if (routeQuery.channel) {
        nextFilters.channel = routeQuery.channel
      }
      if (routeQuery.keyword !== undefined) {
        nextFilters.keyword = routeQuery.keyword
      }
      if (routeQuery.drillStore !== undefined) {
        nextFilters.drillStore = routeQuery.drillStore
      }
      filters.value = nextFilters

      pagination.value = {
        ...pagination.value,
        page: Number(routeQuery.page) > 0 ? Number(routeQuery.page) : 1,
        pageSize: Number(routeQuery.pageSize) > 0 ? Number(routeQuery.pageSize) : pagination.value.pageSize,
      }

      if (routeQuery.view) {
        applySavedView(routeQuery.view, { silent: true })
      }
    }

    function buildRouteQuery() {
      const [from, to] = filters.value.dateRange ?? []
      return {
        report: reportId.value,
        from,
        to,
        channel: filters.value.channel !== 'all' ? filters.value.channel : undefined,
        keyword: filters.value.keyword || undefined,
        drillStore: filters.value.drillStore || undefined,
        page: pagination.value.page > 1 ? String(pagination.value.page) : undefined,
        pageSize:
          pagination.value.pageSize !== 20 ? String(pagination.value.pageSize) : undefined,
      }
    }

    async function loadReport() {
      ensureColumnConfig()
      loading.value = true
      error.value = null
      try {
        const result = await fetchReportData(query.value)
        data.value = result
        pagination.value.total = result.total ?? 0
      } catch (err) {
        error.value = err instanceof Error ? err.message : '报表数据加载失败'
        data.value = null
      } finally {
        loading.value = false
      }
    }

    function selectReport(id) {
      reportId.value = id
      pagination.value.page = 1
      ensureColumnConfig(id)
    }

    function applyFilters(partial) {
      filters.value = { ...filters.value, ...partial }
      pagination.value.page = 1
    }

    function resetFilters() {
      filters.value = defaultFilters()
      pagination.value.page = 1
    }

    function setVisibleColumns(columns) {
      visibleColumns.value = {
        ...visibleColumns.value,
        [reportId.value]: columns,
      }
    }

    function setPage(page) {
      pagination.value.page = page
    }

    function setPageSize(pageSize) {
      pagination.value.pageSize = pageSize
      pagination.value.page = 1
    }

    function drillDown({ reportId: nextReportId, field, value }) {
      reportId.value = nextReportId
      ensureColumnConfig(nextReportId)
      filters.value = {
        ...defaultFilters(),
        dateRange: [...filters.value.dateRange],
        channel: field === 'channel' ? value : filters.value.channel,
        drillStore: field === 'drillStore' ? value : '',
      }
      pagination.value.page = 1
    }

    function saveCurrentView(name) {
      const view = {
        id: `view-${Date.now()}`,
        name,
        reportId: reportId.value,
        filters: { ...filters.value },
        columns: [...activeVisibleColumns.value],
        createdAt: new Date().toISOString(),
      }
      savedViews.value = [view, ...savedViews.value].slice(0, 8)
      return view
    }

    function applySavedView(viewId, options = {}) {
      const view = savedViews.value.find((item) => item.id === viewId)
      if (!view) {
        return false
      }
      reportId.value = view.reportId
      filters.value = { ...view.filters }
      visibleColumns.value = {
        ...visibleColumns.value,
        [view.reportId]: [...view.columns],
      }
      pagination.value.page = 1
      if (!options.silent) {
        return true
      }
      return true
    }

    function removeSavedView(viewId) {
      savedViews.value = savedViews.value.filter((item) => item.id !== viewId)
    }

    async function createExportTask() {
      exportTask.value = await createReportExportTask(query.value)
      window.setTimeout(() => {
        if (exportTask.value?.id) {
          exportTask.value = {
            ...exportTask.value,
            status: 'done',
            message: '导出文件已生成，可在导出中心下载（Mock）',
          }
        }
      }, 2800)
    }

    function clearExportTask() {
      exportTask.value = null
    }

    return {
      reportId,
      filters,
      pagination,
      visibleColumns,
      savedViews,
      data,
      loading,
      error,
      fieldDrawerOpen,
      exportTask,
      query,
      activeVisibleColumns,
      applyRouteQuery,
      buildRouteQuery,
      loadReport,
      selectReport,
      applyFilters,
      resetFilters,
      setVisibleColumns,
      setPage,
      setPageSize,
      drillDown,
      saveCurrentView,
      applySavedView,
      removeSavedView,
      createExportTask,
      clearExportTask,
    }
  },
  {
    persist: {
      key: 'dop-reports',
      pick: ['visibleColumns', 'savedViews'],
    },
  },
)
