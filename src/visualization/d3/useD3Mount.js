import { onMounted, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'

export function useD3Mount(containerRef, renderFn, deps) {
  let svg = null

  function mount() {
    if (!containerRef.value) {
      return
    }
    d3.select(containerRef.value).selectAll('*').remove()
    svg = d3.select(containerRef.value).append('svg').attr('width', '100%').attr('height', '100%')
    renderFn(svg)
  }

  onMounted(() => {
    mount()
  })

  onUnmounted(() => {
    if (containerRef.value) {
      d3.select(containerRef.value).selectAll('*').remove()
    }
    svg = null
  })

  watch(deps, () => {
    mount()
  })
}

export function readSvgSize(svg) {
  const node = svg.node()
  const width = node?.clientWidth || 560
  const height = node?.clientHeight || 320
  return { width, height }
}
