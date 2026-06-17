<script setup>
import { computed } from 'vue'
import { WORKFLOW_STATUS_COLORS } from '../constants/pipeline'

const props = defineProps({
  workflow: {
    type: Object,
    required: true,
  },
  theme: {
    type: String,
    default: 'light',
  },
})

const emit = defineEmits(['node-click'])

const palette = computed(() =>
  props.theme === 'dark'
    ? {
        nodeFill: 'rgba(7, 20, 38, 0.92)',
        text: '#e6f4ff',
        line: 'rgba(255, 255, 255, 0.18)',
      }
    : {
        nodeFill: '#ffffff',
        text: '#1d2129',
        line: '#c9cdd4',
      },
)

const nodeMap = computed(() =>
  Object.fromEntries(props.workflow.nodes.map((node) => [node.id, node])),
)

const edges = computed(() =>
  props.workflow.edges
    .map(([fromId, toId]) => {
      const from = nodeMap.value[fromId]
      const to = nodeMap.value[toId]
      if (!from || !to) {
        return null
      }
      return { from, to, id: `${fromId}-${toId}` }
    })
    .filter(Boolean),
)

function nodeColor(status) {
  return WORKFLOW_STATUS_COLORS[status] ?? WORKFLOW_STATUS_COLORS.idle
}

function buildPath(from, to) {
  const midX = (from.x + to.x) / 2
  return `M ${from.x + 42} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 42} ${to.y}`
}

function handleNodeClick(node) {
  emit('node-click', node)
}
</script>

<template>
  <svg
    class="svg-workflow"
    :viewBox="workflow.viewBox"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    :aria-label="workflow.title"
  >
    <g v-for="edge in edges" :key="edge.id">
      <path
        :d="buildPath(edge.from, edge.to)"
        fill="none"
        :stroke="palette.line"
        stroke-width="2"
      />
      <polygon
        :points="`${edge.to.x - 46},${edge.to.y - 4} ${edge.to.x - 38},${edge.to.y} ${edge.to.x - 46},${edge.to.y + 4}`"
        :fill="nodeColor(edge.to.status)"
      />
    </g>

    <g
      v-for="node in workflow.nodes"
      :key="node.id"
      class="svg-workflow__node"
      @click="handleNodeClick(node)"
    >
      <rect
        x="-42"
        y="-22"
        width="84"
        height="44"
        rx="10"
        :fill="palette.nodeFill"
        :stroke="nodeColor(node.status)"
        stroke-width="2"
        :transform="`translate(${node.x}, ${node.y})`"
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
.svg-workflow {
  display: block;
  width: 100%;

  &__node {
    cursor: pointer;
  }
}
</style>
