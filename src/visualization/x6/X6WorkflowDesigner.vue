<script setup>
import { Graph } from '@antv/x6'
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { WORKFLOW_TEMPLATES } from '../constants/x6Workflows'

const props = defineProps({
  templateKey: {
    type: String,
    default: 'approval',
  },
})

const emit = defineEmits(['node-select', 'graph-change'])

const containerRef = ref()
const graphRef = shallowRef()
const selectedNodeId = ref('')

function createGraph() {
  const graph = new Graph({
    container: containerRef.value,
    autoResize: true,
    background: { color: '#f7f9fb' },
    grid: {
      visible: true,
      type: 'dot',
      args: { color: '#e5e6eb', thickness: 1 },
    },
    panning: true,
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
    connecting: {
      router: 'manhattan',
      connector: { name: 'rounded' },
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      createEdge() {
        return graph.createEdge({
          attrs: {
            line: {
              stroke: '#91d5ff',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 8,
                height: 8,
              },
            },
          },
        })
      },
    },
  })

  graph.on('node:click', ({ node }) => {
    selectedNodeId.value = node.id
    emit('node-select', {
      id: node.id,
      label: node.attr('label/text') || node.getLabel?.() || '',
      data: node.getData() ?? {},
    })
  })

  graph.on('blank:click', () => {
    selectedNodeId.value = ''
    emit('node-select', null)
  })

  graph.on('node:added node:removed edge:added edge:removed node:change:*', () => {
    emit('graph-change', graph.toJSON())
  })

  return graph
}

function loadTemplate(templateKey) {
  const template = WORKFLOW_TEMPLATES[templateKey]
  if (!graphRef.value || !template) {
    return
  }
  graphRef.value.clearCells()
  graphRef.value.fromJSON(template.graph)
  graphRef.value.centerContent()
  emit('graph-change', graphRef.value.toJSON())
}

function exportGraphJson() {
  return graphRef.value?.toJSON() ?? null
}

function updateSelectedNodeLabel(label) {
  const node = graphRef.value?.getCellById(selectedNodeId.value)
  if (!node?.isNode?.()) {
    return
  }
  node.attr('label/text', label)
  node.setData({ ...(node.getData() ?? {}), label })
  emit('graph-change', graphRef.value.toJSON())
}

onMounted(() => {
  graphRef.value = createGraph()
  loadTemplate(props.templateKey)
})

onUnmounted(() => {
  graphRef.value?.dispose()
  graphRef.value = undefined
})

watch(
  () => props.templateKey,
  (templateKey) => {
    loadTemplate(templateKey)
  },
)

defineExpose({
  exportGraphJson,
  updateSelectedNodeLabel,
})
</script>

<template>
  <div ref="containerRef" class="x6-workflow-designer" />
</template>

<style scoped lang="scss">
.x6-workflow-designer {
  width: 100%;
  height: 100%;
  min-height: 520px;
  overflow: hidden;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
}
</style>
