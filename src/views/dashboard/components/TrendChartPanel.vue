<script setup>
import { computed } from 'vue'
import { BaseChart } from '@/charts'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  trendRange: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:trendRange'])

const chartOption = computed(() => ({
  color: ['#13c2c2', '#1677ff'],
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  legend: {
    data: ['营业额', '订单数'],
    bottom: 0,
    textStyle: { color: '#8c8c8c', fontSize: 12 },
  },
  grid: {
    left: 12,
    right: 12,
    top: 24,
    bottom: 40,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.label),
    axisLine: { lineStyle: { color: '#e8ecec' } },
    axisLabel: { color: '#8c8c8c', fontSize: 11 },
  },
  yAxis: [
    {
      type: 'value',
      name: '营业额',
      axisLabel: {
        color: '#8c8c8c',
        formatter: (value) => `${Math.round(value / 10000)}万`,
      },
      splitLine: { lineStyle: { color: '#f0f3f3' } },
    },
    {
      type: 'value',
      name: '订单数',
      axisLabel: { color: '#8c8c8c' },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: '营业额',
      type: 'bar',
      barWidth: 14,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#13c2c2' },
            { offset: 1, color: 'rgba(19, 194, 194, 0.35)' },
          ],
        },
      },
      data: props.data.map((item) => item.revenue),
    },
    {
      name: '订单数',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 },
      data: props.data.map((item) => item.orders),
    },
  ],
}))
</script>

<template>
  <div class="panel-card chart-card">
    <div class="card-head">
      <h3>营收趋势与订单结构</h3>
      <el-radio-group
        size="small"
        :model-value="trendRange"
        @update:model-value="emit('update:trendRange', $event)"
      >
        <el-radio-button value="7d">近 7 日</el-radio-button>
        <el-radio-button value="30d">近 30 日</el-radio-button>
      </el-radio-group>
    </div>
    <BaseChart :option="chartOption" height="240px" />
  </div>
</template>

<style scoped lang="scss">
.panel-card {
  padding: 18px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.chart-card {
  min-height: 320px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}
</style>
