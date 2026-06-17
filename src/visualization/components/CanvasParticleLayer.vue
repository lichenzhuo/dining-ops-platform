<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { resizeCanvas, useCanvasLoop } from '../composables/useCanvasLoop'

const props = defineProps({
  density: {
    type: Number,
    default: 48,
  },
})

const containerRef = ref()
const canvasRef = ref()
const particles = ref([])

function initParticles(width, height) {
  particles.value = Array.from({ length: props.density }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 1 + Math.random() * 2,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    alpha: 0.15 + Math.random() * 0.45,
  }))
}

function drawFrame() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) {
    return
  }

  const { width, height } = resizeCanvas(canvas, container)
  if (particles.value.length === 0) {
    initParticles(width, height)
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, width, height)

  for (const particle of particles.value) {
    particle.x += particle.vx
    particle.y += particle.vy

    if (particle.x < 0 || particle.x > width) {
      particle.vx *= -1
    }
    if (particle.y < 0 || particle.y > height) {
      particle.vy *= -1
    }

    ctx.beginPath()
    ctx.fillStyle = `rgba(19, 194, 194, ${particle.alpha})`
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < particles.value.length; i += 1) {
    for (let j = i + 1; j < particles.value.length; j += 1) {
      const a = particles.value[i]
      const b = particles.value[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const distance = Math.hypot(dx, dy)
      if (distance > 120) {
        continue
      }
      ctx.beginPath()
      ctx.strokeStyle = `rgba(19, 194, 194, ${0.12 * (1 - distance / 120)})`
      ctx.lineWidth = 1
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }
}

useCanvasLoop(drawFrame)

let resizeObserver = null

onMounted(() => {
  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      particles.value = []
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="canvas-particle-layer">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped lang="scss">
.canvas-particle-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
