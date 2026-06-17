<script setup>
import { computed } from 'vue'
import { BaseChart } from '@/charts'
import ScreenPanel from './ScreenPanel.vue'

const props = defineProps({
  trend: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const chartOption = computed(() => {
  if (!props.trend) {
    return {}
  }

  return {
    backgroundColor: 'transparent',
    color: ['#13c2c2', '#1677ff'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(7, 20, 38, 0.92)',
      borderColor: 'rgba(19, 194, 194, 0.35)',
      textStyle: { color: '#e6f4ff' },
    },
    legend: {
      data: ['订单', '营业额'],
      right: 0,
      top: 0,
      textStyle: { color: 'rgba(230,244,255,0.65)', fontSize: 11 },
    },
    grid: { left: 12, right: 12, top: 28, bottom: 24, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.trend.hours,
      axisLabel: { color: 'rgba(230,244,255,0.45)', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: { color: 'rgba(230,244,255,0.45)', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      {
        type: 'value',
        axisLabel: { color: 'rgba(230,244,255,0.45)', fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '订单',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: [3, 3, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#13c2c2' },
              { offset: 1, color: 'rgba(19, 194, 194, 0.2)' },
            ],
          },
        },
        data: props.trend.orders,
      },
      {
        name: '营业额',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2 },
        data: props.trend.revenue,
      },
    ],
  }
})
</script>

<template>
  <ScreenPanel title="分时订单与营收趋势" compact>
    <BaseChart :option="chartOption" :loading="loading" height="200px" />
  </ScreenPanel>
</template>
