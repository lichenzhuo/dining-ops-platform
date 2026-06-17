<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { GEO_HUB, GEO_STORES } from '@/constants/geo'
import { resizeCanvas, useCanvasLoop } from '../composables/useCanvasLoop'

const props = defineProps({
  pointCount: {
    type: Number,
    default: 1200,
  },
  /** 开启视口裁剪 + 空间网格命中检测 */
  optimized: {
    type: Boolean,
    default: false,
  },
})

const containerRef = ref()
const canvasRef = ref()
const points = ref([])
const hoveredIndex = ref(-1)
const fps = ref(0)
const visibleCount = ref(0)
let frameCounter = 0
let fpsTimer = 0
let spatialGrid = null

const statsText = computed(() => {
  const base = `${props.pointCount.toLocaleString('zh-CN')} 点位 · ${fps.value} FPS`
  if (!props.optimized) {
    return base
  }
  return `${base} · 渲染 ${visibleCount.value.toLocaleString('zh-CN')}`
})

function generatePoints(count) {
  const list = []
  const seeds = GEO_STORES.length ? GEO_STORES : [{ lng: GEO_HUB.lng, lat: GEO_HUB.lat }]

  for (let index = 0; index < count; index += 1) {
    const seed = seeds[index % seeds.length]
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 42
    list.push({
      x: 0,
      y: 0,
      lng: seed.lng + Math.cos(angle) * radius * 0.01,
      lat: seed.lat + Math.sin(angle) * radius * 0.01,
      value: 20 + Math.random() * 80,
      pulse: Math.random() * Math.PI * 2,
    })
  }
  return list
}

function projectPoint(point, width, height) {
  const minLng = 116.8
  const maxLng = 122.2
  const minLat = 29.2
  const maxLat = 32.8
  point.x = ((point.lng - minLng) / (maxLng - minLng)) * (width - 40) + 20
  point.y = (1 - (point.lat - minLat) / (maxLat - minLat)) * (height - 40) + 20
}

function buildSpatialGrid(width, height, cellSize = 24) {
  const cols = Math.ceil(width / cellSize)
  const rows = Math.ceil(height / cellSize)
  const grid = Array.from({ length: cols * rows }, () => [])

  points.value.forEach((point, index) => {
    const col = Math.min(cols - 1, Math.max(0, Math.floor(point.x / cellSize)))
    const row = Math.min(rows - 1, Math.max(0, Math.floor(point.y / cellSize)))
    grid[row * cols + col].push(index)
  })

  return { grid, cols, rows, cellSize }
}

function isInViewport(point, width, height, margin = 8) {
  return (
    point.x >= -margin &&
    point.x <= width + margin &&
    point.y >= -margin &&
    point.y <= height + margin
  )
}

function drawBackground(ctx, width, height) {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#f7f9fb'
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = '#e5e6eb'
  ctx.strokeRect(10, 10, width - 20, height - 20)
}

function drawPoint(ctx, point, index) {
  const radius = 2 + (point.value / 100) * 2 + Math.sin(point.pulse) * 0.6
  ctx.beginPath()
  ctx.fillStyle = index === hoveredIndex.value ? '#1677ff' : '#13c2c2'
  ctx.globalAlpha = index === hoveredIndex.value ? 1 : 0.72
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function drawFrame(time) {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) {
    return
  }

  const { width, height } = resizeCanvas(canvas, container)
  if (points.value.length !== props.pointCount) {
    points.value = generatePoints(props.pointCount)
    spatialGrid = null
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  for (const point of points.value) {
    projectPoint(point, width, height)
    point.pulse += 0.03
  }

  drawBackground(ctx, width, height)

  if (props.optimized) {
    if (!spatialGrid || spatialGrid.width !== width || spatialGrid.height !== height) {
      spatialGrid = { ...buildSpatialGrid(width, height), width, height }
    }

    let rendered = 0
    for (const [index, point] of points.value.entries()) {
      if (!isInViewport(point, width, height)) {
        continue
      }
      drawPoint(ctx, point, index)
      rendered += 1
    }
    visibleCount.value = rendered
  } else {
    visibleCount.value = points.value.length
    for (const [index, point] of points.value.entries()) {
      drawPoint(ctx, point, index)
    }
  }

  ctx.globalAlpha = 1

  frameCounter += 1
  if (time - fpsTimer >= 1000) {
    fps.value = frameCounter
    frameCounter = 0
    fpsTimer = time
  }
}

useCanvasLoop(drawFrame)

function findPointIndexNaive(event) {
  const canvas = canvasRef.value
  if (!canvas) {
    return -1
  }
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  let hitIndex = -1
  let minDistance = 12

  points.value.forEach((point, index) => {
    const distance = Math.hypot(point.x - x, point.y - y)
    if (distance < minDistance) {
      minDistance = distance
      hitIndex = index
    }
  })
  return hitIndex
}

function findPointIndexGrid(event) {
  const canvas = canvasRef.value
  if (!canvas || !spatialGrid) {
    return -1
  }
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const col = Math.floor(x / spatialGrid.cellSize)
  const row = Math.floor(y / spatialGrid.cellSize)
  if (col < 0 || row < 0 || col >= spatialGrid.cols || row >= spatialGrid.rows) {
    return -1
  }

  const candidates = spatialGrid.grid[row * spatialGrid.cols + col]
  let hitIndex = -1
  let minDistance = 12
  for (const index of candidates) {
    const point = points.value[index]
    const distance = Math.hypot(point.x - x, point.y - y)
    if (distance < minDistance) {
      minDistance = distance
      hitIndex = index
    }
  }
  return hitIndex
}

function handlePointerMove(event) {
  hoveredIndex.value = props.optimized ? findPointIndexGrid(event) : findPointIndexNaive(event)
}

function handlePointerLeave() {
  hoveredIndex.value = -1
}

let resizeObserver = null

function resetPoints() {
  points.value = generatePoints(props.pointCount)
  spatialGrid = null
}

watch(
  () => props.pointCount,
  () => {
    resetPoints()
  },
)

watch(
  () => props.optimized,
  () => {
    spatialGrid = null
  },
)

onMounted(() => {
  resetPoints()
  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      spatialGrid = null
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="canvas-store-points">
    <canvas
      ref="canvasRef"
      @pointermove="handlePointerMove"
      @pointerleave="handlePointerLeave"
    />
    <div class="canvas-store-points__stats">{{ statsText }}</div>
    <p v-if="optimized" class="canvas-store-points__badge">视口裁剪</p>
    <p v-if="hoveredIndex >= 0" class="canvas-store-points__hint">
      命中点位 #{{ hoveredIndex + 1 }} · 值 {{ Math.round(points[hoveredIndex]?.value ?? 0) }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.canvas-store-points {
  position: relative;
  height: 420px;
  overflow: hidden;
  border: 1px solid $border-light;
  border-radius: $radius-lg;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: crosshair;
  }

  &__stats {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 8px;
    font-size: 12px;
    color: $text-secondary;
    background: rgba(255, 255, 255, 0.88);
    border-radius: $radius-sm;
  }

  &__badge {
    position: absolute;
    top: 10px;
    left: 10px;
    margin: 0;
    padding: 4px 8px;
    font-size: 12px;
    color: $color-primary;
    background: rgba(255, 255, 255, 0.92);
    border-radius: $radius-sm;
  }

  &__hint {
    position: absolute;
    bottom: 10px;
    left: 10px;
    margin: 0;
    padding: 4px 8px;
    font-size: 12px;
    color: $text-primary;
    background: rgba(255, 255, 255, 0.92);
    border-radius: $radius-sm;
  }
}
</style>
