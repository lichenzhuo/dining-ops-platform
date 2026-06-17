import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchGeoVisualizationData } from '@/services/geo'
import { useAuthStore } from '@/stores/auth'

export const useGeoStore = defineStore('geo', () => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const query = computed(() => {
    const auth = useAuthStore()
    return {
      brand: auth.org.brand,
      region: auth.org.region,
      store: auth.org.store,
    }
  })

  async function loadGeoData() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchGeoVisualizationData(query.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '地图态势数据加载失败'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    query,
    loadGeoData,
  }
})
