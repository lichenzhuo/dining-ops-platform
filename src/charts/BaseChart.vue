<script setup>
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  height: {
    type: String,
    default: '240px',
  },
})

const chartRef = ref()
const chartInstance = shallowRef()

function renderChart() {
  if (!chartRef.value) {
    return
  }
  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartRef.value)
  }
  chartInstance.value.setOption(props.option, true)
}

function handleResize() {
  chartInstance.value?.resize()
}

watch(
  () => props.option,
  () => renderChart(),
  { deep: true },
)

onMounted(() => {
  renderChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance.value?.dispose()
  chartInstance.value = undefined
})
</script>

<template>
  <div ref="chartRef" class="base-chart" :style="{ height }" />
</template>

<style scoped lang="scss">
.base-chart {
  width: 100%;
}
</style>
