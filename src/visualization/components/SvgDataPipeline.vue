<script setup>
import { computed } from 'vue'
import {
  DATA_PIPELINE_HUB,
  DATA_PIPELINE_NODES,
  DATA_PIPELINE_VIEWBOX,
  WORKFLOW_STATUS_COLORS,
} from '../constants/pipeline'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  theme: {
    type: String,
    default: 'dark',
  },
  showHub: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['node-click'])

const statusMap = computed(() =>
  Object.fromEntries((props.items ?? []).map((item) => [item.key, item.status])),
)

const nodes = computed(() => {
  const sourceNodes = props.showHub
    ? [...DATA_PIPELINE_NODES, DATA_PIPELINE_HUB]
    : DATA_PIPELINE_NODES

  return sourceNodes.map((node) => ({
    ...node,
    status: statusMap.value[node.key] ?? 'online',
  }))
})

const edges = computed(() => {
  const list = [...DATA_PIPELINE_NODES]
  const pairs = []

  for (let index = 0; index < list.length - 1; index += 1) {
    pairs.push([list[index], list[index + 1]])
  }
  if (props.showHub) {
    pairs.push([list[list.length - 1], DATA_PIPELINE_HUB])
  }
  return pairs
})

const palette = computed(() =>
  props.theme === 'dark'
    ? {
        nodeFill: 'rgba(7, 20, 38, 0.92)',
        nodeStroke: 'rgba(19, 194, 194, 0.55)',
        text: '#e6f4ff',
        line: 'rgba(22, 119, 255, 0.55)',
      }
    : {
        nodeFill: '#ffffff',
        nodeStroke: '#13c2c2',
        text: '#1d2129',
        line: '#91d5ff',
      },
)

function nodeColor(status) {
  return WORKFLOW_STATUS_COLORS[status] ?? WORKFLOW_STATUS_COLORS.online
}

function buildPath(from, to) {
  return `M ${from.x + 36} ${from.y} L ${to.x - 36} ${to.y}`
}

function handleNodeClick(node) {
  emit('node-click', node)
}
</script>

<template>
  <svg
    class="svg-data-pipeline"
    :viewBox="DATA_PIPELINE_VIEWBOX"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="数据接入链路图"
  >
    <defs>
      <marker
        id="pipeline-arrow"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="4"
        orient="auto"
      >
        <path d="M0,0 L8,4 L0,8 Z" fill="rgba(22, 119, 255, 0.8)" />
      </marker>
    </defs>

    <g v-for="([from, to], index) in edges" :key="`${from.key}-${to.key}`">
      <path
        :d="buildPath(from, to)"
        fill="none"
        :stroke="palette.line"
        stroke-width="2"
        marker-end="url(#pipeline-arrow)"
      />
      <path
        :d="buildPath(from, to)"
        class="svg-data-pipeline__flow"
        fill="none"
        stroke="#13c2c2"
        stroke-width="2"
        stroke-dasharray="8 10"
        :style="{ animationDelay: `${index * 0.35}s` }"
      />
    </g>

    <g
      v-for="node in nodes"
      :key="node.key"
      class="svg-data-pipeline__node"
      @click="handleNodeClick(node)"
    >
      <rect
        x="-36"
        y="-18"
        width="72"
        height="36"
        rx="8"
        :fill="palette.nodeFill"
        :stroke="nodeColor(node.status)"
        stroke-width="2"
        :transform="`translate(${node.x}, ${node.y})`"
      />
      <circle
        :cx="node.x - 24"
        :cy="node.y"
        r="4"
        :fill="nodeColor(node.status)"
      />
      <text
        :x="node.x"
        :y="node.y + 4"
        text-anchor="middle"
        :fill="palette.text"
        font-size="12"
      >
        {{ node.label }}
      </text>
    </g>
  </svg>
</template>

<style scoped lang="scss">
.svg-data-pipeline {
  display: block;
  width: 100%;
  height: 100%;

  &__node {
    cursor: pointer;
  }

  &__flow {
    animation: pipeline-flow 2.4s linear infinite;
  }
}

@keyframes pipeline-flow {
  from {
    stroke-dashoffset: 36;
  }

  to {
    stroke-dashoffset: 0;
  }
}
</style>
