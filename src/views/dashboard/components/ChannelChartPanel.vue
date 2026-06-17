<script setup>
import { computed } from 'vue'
import { BaseChart } from '@/charts'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const chartOption = computed(() => ({
  color: props.data.map((item) => item.color),
  tooltip: {
    trigger: 'item',
    formatter: (params) => `${params.name}<br/>占比 ${params.percent}%`,
  },
  legend: {
    orient: 'vertical',
    right: 0,
    top: 'center',
    textStyle: { color: '#595959', fontSize: 12 },
  },
  series: [
    {
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      data: props.data.map((item) => ({
        name: item.name,
        value: item.percent,
      })),
    },
  ],
}))
</script>

<template>
  <div class="panel-card chart-card">
    <div class="card-head">
      <h3>渠道贡献</h3>
    </div>
    <BaseChart :option="chartOption" height="240px" />
    <ul class="channel-summary">
      <li v-for="item in data" :key="item.name">
        <span><i :style="{ background: item.color }" />{{ item.name }}</span>
        <strong>{{ item.percent }}%</strong>
      </li>
    </ul>
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

.channel-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: $text-secondary;
  }

  span {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  strong {
    color: $text-primary;
  }
}
</style>
