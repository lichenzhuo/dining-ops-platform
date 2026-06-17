<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { throttle } from '@/utils/performance'
import echarts from './echarts'
import { isEmptyChartOption } from './utils'

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: String,
    default: '240px',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  empty: {
    type: Boolean,
    default: undefined,
  },
  emptyText: {
    type: String,
    default: '暂无数据',
  },
})

const emit = defineEmits(['click', 'ready'])

const containerRef = ref()
const chartRef = ref()
const chartInstance = shallowRef()
let resizeObserver = null

const isEmpty = computed(() => {
  if (props.empty !== undefined) {
    return props.empty
  }
  return isEmptyChartOption(props.option)
})

function syncLoadingState() {
  if (!chartInstance.value) {
    return
  }
  if (props.loading) {
    chartInstance.value.showLoading({
      text: '加载中...',
      color: '#13c2c2',
      textColor: '#86909c',
      maskColor: 'rgba(255, 255, 255, 0.82)',
      zlevel: 0,
    })
    return
  }
  chartInstance.value.hideLoading()
}

async function ensureChart() {
  if (isEmpty.value) {
    disposeChart()
    return
  }

  await nextTick()

  if (!chartRef.value) {
    return
  }

  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartRef.value)
    chartInstance.value.on('click', (params) => emit('click', params))
    emit('ready', chartInstance.value)
  }

  chartInstance.value.setOption(props.option, {
    notMerge: false,
    lazyUpdate: true,
  })
  syncLoadingState()
  chartInstance.value.resize()
}

function handleResize() {
  chartInstance.value?.resize()
}

const throttledResize = throttle(handleResize, 120)
const throttledEnsureChart = throttle(() => {
  ensureChart()
}, 100)

function disposeChart() {
  chartInstance.value?.dispose()
  chartInstance.value = undefined
}

watch(
  () => props.option,
  () => {
    throttledEnsureChart()
  },
  { deep: true },
)

watch(isEmpty, () => {
  ensureChart()
})

watch(
  () => props.loading,
  () => {
    syncLoadingState()
  },
)

onMounted(() => {
  ensureChart()

  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => throttledResize())
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  disposeChart()
})
</script>

<template>
  <div ref="containerRef" class="base-chart-wrap" :style="{ height }">
    <div v-show="!isEmpty" ref="chartRef" class="base-chart" />
    <div v-if="isEmpty && !loading" class="base-chart__empty">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-chart-wrap {
  position: relative;
  width: 100%;
}

.base-chart {
  width: 100%;
  height: 100%;
}

.base-chart__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 13px;
  color: $text-tertiary;
  background: $bg-page;
  border: 1px dashed $border-light;
  border-radius: $radius-base;
}
</style>
