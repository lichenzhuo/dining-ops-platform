import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchDashboardData } from '@/services/dashboard'
import { useAuthStore } from '@/stores/auth'

function defaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 6)
  const format = (date) => date.toISOString().slice(0, 10)
  return [format(start), format(end)]
}

const defaultFilters = () => ({
  dateRange: defaultDateRange(),
  channel: 'all',
  activityType: 'all',
  trendRange: '7d',
})

export const useDashboardStore = defineStore(
  'dashboard',
  () => {
    const filters = ref(defaultFilters())
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const query = computed(() => {
      const auth = useAuthStore()
      return {
        ...filters.value,
        brand: auth.org.brand,
        region: auth.org.region,
        store: auth.org.store,
      }
    })

    async function loadDashboard() {
      loading.value = true
      error.value = null
      try {
        data.value = await fetchDashboardData(query.value)
      } catch (err) {
        error.value = err instanceof Error ? err.message : '工作台数据加载失败'
        data.value = null
      } finally {
        loading.value = false
      }
    }

    function applyFilters(partial) {
      filters.value = { ...filters.value, ...partial }
    }

    function resetFilters() {
      filters.value = defaultFilters()
    }

    return {
      filters,
      data,
      loading,
      error,
      query,
      loadDashboard,
      applyFilters,
      resetFilters,
    }
  },
  {
    persist: {
      key: 'dop-dashboard-filters',
      pick: ['filters'],
    },
  },
)
