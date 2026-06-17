<script setup>
import { computed } from 'vue'
import { BaseChart } from '@/charts'

const props = defineProps({
  chart: {
    type: Object,
    default: null,
  },
  reportId: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const chartOption = computed(() => {
  if (!props.chart) {
    return {}
  }

  const isPie = props.reportId === 'channel'
  if (isPie) {
    return {
      color: ['#13c2c2', '#1677ff', '#722ed1', '#faad14'],
      tooltip: { trigger: 'item', formatter: '{b}<br/>{c}%' },
      legend: { bottom: 0, textStyle: { color: '#8c8c8c', fontSize: 12 } },
      series: [
        {
          type: 'pie',
          radius: ['42%', '68%'],
          center: ['50%', '46%'],
          data: props.chart.categories.map((name, index) => ({
            name,
            value: props.chart.series[0]?.data[index] ?? 0,
          })),
        },
      ],
    }
  }

  return {
    color: ['#13c2c2', '#1677ff'],
    tooltip: { trigger: 'axis' },
    legend: {
      data: props.chart.series.map((item) => item.name),
      bottom: 0,
      textStyle: { color: '#8c8c8c', fontSize: 12 },
    },
    grid: { left: 12, right: 12, top: 24, bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.chart.categories,
      axisLabel: { color: '#8c8c8c', fontSize: 11 },
      axisLine: { lineStyle: { color: '#e8ecec' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8c8c8c' },
      splitLine: { lineStyle: { color: '#f0f3f3' } },
    },
    series: props.chart.series.map((item, index) => ({
      name: item.name,
      type: index === 0 ? 'bar' : 'line',
      smooth: index > 0,
      barWidth: 14,
      data: item.data,
    })),
  }
})
</script>

<template>
  <div class="panel-card">
    <div class="card-head">
      <h3>图表分析</h3>
    </div>
    <BaseChart :option="chartOption" :loading="loading" height="260px" />
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

.card-head {
  margin-bottom: 8px;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}
</style>
