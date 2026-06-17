<script setup>
import * as d3 from 'd3'
import { ref, toRef } from 'vue'
import { readSvgSize, useD3Mount } from './useD3Mount'

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { stage: '曝光', value: 100000 },
      { stage: '点击', value: 42000 },
      { stage: '下单', value: 18600 },
      { stage: '核销', value: 12800 },
      { stage: '复购', value: 5600 },
    ],
  },
})

const emit = defineEmits(['stage-click'])

const containerRef = ref()

function renderChart(svg) {
  const { width, height } = readSvgSize(svg)
  const maxValue = d3.max(props.data, (item) => item.value) ?? 1
  const stageHeight = (height - 40) / props.data.length
  const centerX = width / 2

  svg.attr('viewBox', `0 0 ${width} ${height}`)

  const colors = ['#b5f5ec', '#87e8de', '#5cdbd3', '#36cfc9', '#13c2c2']

  props.data.forEach((item, index) => {
    const topWidth = (item.value / maxValue) * (width * 0.72)
    const next = props.data[index + 1]
    const bottomWidth = next ? (next.value / maxValue) * (width * 0.72) : topWidth * 0.72
    const y = 20 + index * stageHeight
    const points = [
      [centerX - topWidth / 2, y],
      [centerX + topWidth / 2, y],
      [centerX + bottomWidth / 2, y + stageHeight - 6],
      [centerX - bottomWidth / 2, y + stageHeight - 6],
    ]

    svg
      .append('polygon')
      .attr('points', points.map((point) => point.join(',')).join(' '))
      .attr('fill', colors[index % colors.length])
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', () => emit('stage-click', item))

    svg
      .append('text')
      .attr('x', centerX)
      .attr('y', y + stageHeight / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1d2129')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .text(`${item.stage} · ${item.value.toLocaleString('zh-CN')}`)
  })
}

useD3Mount(containerRef, renderChart, [toRef(props, 'data')])
</script>

<template>
  <div ref="containerRef" class="d3-channel-funnel" role="img" aria-label="渠道转化漏斗" />
</template>

<style scoped lang="scss">
.d3-channel-funnel {
  width: 100%;
  height: 360px;
}
</style>
