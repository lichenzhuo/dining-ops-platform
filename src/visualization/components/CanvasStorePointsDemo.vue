<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { GEO_HUB, GEO_STORES } from '@/constants/geo'
import { resizeCanvas, useCanvasLoop } from '../composables/useCanvasLoop'

const props = defineProps({
  pointCount: {
    type: Number,
    default: 1200,
  },
})

const containerRef = ref()
const canvasRef = ref()
const points = ref([])
const hoveredIndex = ref(-1)
const fps = ref(0)
let frameCounter = 0
let fpsTimer = 0

const statsText = computed(() => `${props.pointCount.toLocaleString('zh-CN')} 点位 · ${fps.value} FPS`)

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

function drawFrame(time) {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) {
    return
  }

  const { width, height } = resizeCanvas(canvas, container)
  if (points.value.length !== props.pointCount) {
    points.value = generatePoints(props.pointCount)
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  for (const point of points.value) {
    projectPoint(point, width, height)
    point.pulse += 0.03
  }

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#f7f9fb'
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = '#e5e6eb'
  ctx.strokeRect(10, 10, width - 20, height - 20)

  for (const [index, point] of points.value.entries()) {
    const radius = 2 + (point.value / 100) * 2 + Math.sin(point.pulse) * 0.6
    ctx.beginPath()
    ctx.fillStyle = index === hoveredIndex.value ? '#1677ff' : '#13c2c2'
    ctx.globalAlpha = index === hoveredIndex.value ? 1 : 0.72
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
    ctx.fill()
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

function findPointIndex(event) {
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

function handlePointerMove(event) {
  hoveredIndex.value = findPointIndex(event)
}

function handlePointerLeave() {
  hoveredIndex.value = -1
}

let resizeObserver = null

onMounted(() => {
  points.value = generatePoints(props.pointCount)
  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      points.value = generatePoints(props.pointCount)
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
