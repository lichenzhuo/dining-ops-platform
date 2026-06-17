<script setup>
import { computed, onUnmounted, ref } from 'vue'
import BaseChart from '@/charts/BaseChart.vue'
import { throttle } from '@/utils/performance'

const props = defineProps({
  throttled: {
    type: Boolean,
    default: true,
  },
})

const updateCount = ref(0)
const tickCount = ref(0)
const option = ref(buildOption(0))
let timer = null

function buildOption(seed) {
  const categories = ['华东', '华南', '华北', '西南', '华中']
  return {
    grid: { left: 48, right: 16, top: 24, bottom: 32 },
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      {
        type: 'bar',
        data: categories.map((_, index) => 40 + ((seed + index * 7) % 50)),
        itemStyle: { color: '#13c2c2', borderRadius: [4, 4, 0, 0] },
      },
    ],
  }
}

function applyUpdate(seed) {
  updateCount.value += 1
  option.value = buildOption(seed)
}

const throttledApply = throttle((seed) => applyUpdate(seed), 120)

function startStream() {
  stopStream()
  timer = window.setInterval(() => {
    tickCount.value += 1
    const seed = tickCount.value
    if (props.throttled) {
      throttledApply(seed)
    } else {
      applyUpdate(seed)
    }
  }, 16)
}

function stopStream() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function resetCounters() {
  tickCount.value = 0
  updateCount.value = 0
  option.value = buildOption(0)
}

const statsText = computed(() => {
  const mode = props.throttled ? '节流 120ms' : '无节流'
  return `${mode} · 触发 ${tickCount.value} 次 · 实际 setOption ${updateCount.value} 次`
})

onUnmounted(stopStream)

defineExpose({ startStream, stopStream, resetCounters })
</script>

<template>
  <div class="chart-throttle-demo">
    <BaseChart :option="option" height="280px" />
    <p class="chart-throttle-demo__stats">{{ statsText }}</p>
  </div>
</template>

<style scoped lang="scss">
.chart-throttle-demo {
  &__stats {
    margin: 8px 0 0;
    font-size: 12px;
    color: $text-tertiary;
  }
}
</style>
