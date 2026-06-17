import { onMounted, onUnmounted } from 'vue'

export function useCanvasLoop(callback) {
  let frameId = 0
  let active = true

  const loop = (time) => {
    if (!active) {
      return
    }
    callback(time)
    frameId = window.requestAnimationFrame(loop)
  }

  onMounted(() => {
    active = true
    frameId = window.requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    active = false
    window.cancelAnimationFrame(frameId)
  })

  return {
    pause() {
      active = false
      window.cancelAnimationFrame(frameId)
    },
    resume() {
      if (active) {
        return
      }
      active = true
      frameId = window.requestAnimationFrame(loop)
    },
  }
}

export function resizeCanvas(canvas, container) {
  if (!canvas || !container) {
    return { width: 0, height: 0, dpr: 1 }
  }
  const dpr = window.devicePixelRatio || 1
  const width = container.clientWidth
  const height = container.clientHeight
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { width, height, dpr }
}
