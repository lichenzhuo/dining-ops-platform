<script setup>
import * as d3 from 'd3'
import { ref, toRef } from 'vue'
import { readSvgSize, useD3Mount } from './useD3Mount'

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { segment: '新会员', value: 2800, color: '#91d5ff' },
      { segment: '活跃会员', value: 4200, color: '#13c2c2' },
      { segment: '沉睡会员', value: 1600, color: '#ffd666' },
      { segment: '高价值会员', value: 980, color: '#1677ff' },
      { segment: '流失预警', value: 420, color: '#ff7875' },
    ],
  },
})

const emit = defineEmits(['segment-click'])

const containerRef = ref()

function renderChart(svg) {
  const { width, height } = readSvgSize(svg)
  const margin = { top: 24, right: 24, bottom: 24, left: 96 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const g = svg
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (item) => item.value) ?? 0])
    .nice()
    .range([0, innerWidth])

  const y = d3
    .scaleBand()
    .domain(props.data.map((item) => item.segment))
    .range([0, innerHeight])
    .padding(0.28)

  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickSize(-innerHeight))
    .call((axis) => axis.selectAll('.domain').remove())
    .call((axis) => axis.selectAll('line').attr('stroke', '#f0f1f5'))
    .call((axis) => axis.selectAll('text').attr('fill', '#86909c').attr('font-size', 11))

  g.append('g')
    .call(d3.axisLeft(y).tickSize(0))
    .call((axis) => axis.select('.domain').remove())
    .call((axis) => axis.selectAll('text').attr('fill', '#4e5969').attr('font-size', 12))

  g.selectAll('.tier-bar')
    .data(props.data)
    .join('rect')
    .attr('class', 'tier-bar')
    .attr('x', 0)
    .attr('y', (item) => y(item.segment) ?? 0)
    .attr('height', y.bandwidth())
    .attr('width', (item) => x(item.value))
    .attr('fill', (item) => item.color)
    .attr('rx', 6)
    .style('cursor', 'pointer')
    .on('click', (_, item) => emit('segment-click', item))

  g.selectAll('.tier-value')
    .data(props.data)
    .join('text')
    .attr('class', 'tier-value')
    .attr('x', (item) => x(item.value) + 8)
    .attr('y', (item) => (y(item.segment) ?? 0) + y.bandwidth() / 2 + 4)
    .attr('fill', '#1d2129')
    .attr('font-size', 12)
    .text((item) => item.value.toLocaleString('zh-CN'))
}

useD3Mount(containerRef, renderChart, [toRef(props, 'data')])
</script>

<template>
  <div ref="containerRef" class="d3-member-tier" role="img" aria-label="会员分层图" />
</template>

<style scoped lang="scss">
.d3-member-tier {
  width: 100%;
  height: 320px;
}
</style>
