import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchLargeScreenData } from '@/services/largeScreen'
import { useAuthStore } from '@/stores/auth'

const REFRESH_INTERVAL = 30000

export const useLargeScreenStore = defineStore('largeScreen', () => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  let refreshTimer = null

  const query = computed(() => {
    const auth = useAuthStore()
    return {
      brand: auth.org.brand,
      region: auth.org.region,
      store: auth.org.store,
    }
  })

  async function loadScreen() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchLargeScreenData(query.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '大屏数据加载失败'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  function startAutoRefresh() {
    stopAutoRefresh()
    refreshTimer = window.setInterval(() => {
      loadScreen()
    }, REFRESH_INTERVAL)
  }

  function stopAutoRefresh() {
    if (refreshTimer) {
      window.clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  return {
    data,
    loading,
    error,
    query,
    loadScreen,
    startAutoRefresh,
    stopAutoRefresh,
  }
})
