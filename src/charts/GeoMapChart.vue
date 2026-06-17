<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { buildGeoMapOption } from './buildGeoMapOption'
import BaseChart from './BaseChart.vue'
import { loadChinaMap } from './geo'

const props = defineProps({
  theme: {
    type: String,
    default: 'dark',
  },
  center: {
    type: Array,
    default: () => [119.5, 31.2],
  },
  zoom: {
    type: Number,
    default: 3.2,
  },
  roam: {
    type: Boolean,
    default: false,
  },
  regions: {
    type: Array,
    default: () => [],
  },
  stores: {
    type: Array,
    default: () => [],
  },
  hub: {
    type: Object,
    default: null,
  },
  height: {
    type: String,
    default: '100%',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showVisualMap: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['region-click', 'store-click', 'ready', 'error'])

const mapReady = ref(false)
const mapError = ref(null)
const mapKey = ref('china')

const chartOption = computed(() => {
  if (!mapReady.value) {
    return {}
  }

  return buildGeoMapOption({
    mapKey: mapKey.value,
    theme: props.theme,
    center: props.center,
    zoom: props.zoom,
    roam: props.roam,
    regions: props.regions,
    stores: props.stores,
    hub: props.hub,
    showVisualMap: props.showVisualMap,
  })
})

async function initMap() {
  mapError.value = null
  try {
    mapKey.value = await loadChinaMap()
    mapReady.value = true
    emit('ready', mapKey.value)
  } catch (error) {
    mapError.value = error instanceof Error ? error.message : '地图加载失败'
    emit('error', mapError.value)
  }
}

function handleChartClick(params) {
  if (!params?.name) {
    return
  }

  if (params.seriesType === 'map') {
    emit('region-click', {
      name: params.name,
      value: params.value ?? params.data?.value,
    })
    return
  }

  if (params.seriesType === 'effectScatter') {
    emit('store-click', {
      name: params.name,
      value: params.value?.[2],
      province: params.data?.province,
    })
  }
}

onMounted(() => {
  initMap()
})

watch(
  () => [props.regions, props.stores, props.hub, props.theme, props.center, props.zoom],
  () => {
    /* chartOption computed 会自动更新 */
  },
  { deep: true },
)
</script>

<template>
  <div class="geo-map-chart">
    <el-alert
      v-if="mapError"
      type="error"
      :title="mapError"
      show-icon
      :closable="false"
      class="geo-map-chart__error"
    />
    <BaseChart
      v-else
      :option="chartOption"
      :loading="loading || !mapReady"
      :height="height"
      @click="handleChartClick"
    />
  </div>
</template>

<style scoped lang="scss">
.geo-map-chart {
  width: 100%;
  height: 100%;
  min-height: 240px;

  &__error {
    margin: 12px;
  }
}
</style>
