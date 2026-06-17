import { onMounted, onUnmounted, ref } from 'vue'

export const SCREEN_WIDTH = 1920
export const SCREEN_HEIGHT = 1080

export function useScreenScale() {
  const scale = ref(1)
  const offsetX = ref(0)
  const offsetY = ref(0)

  function updateScale() {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const nextScale = Math.min(viewportWidth / SCREEN_WIDTH, viewportHeight / SCREEN_HEIGHT)
    scale.value = nextScale
    offsetX.value = (viewportWidth - SCREEN_WIDTH * nextScale) / 2
    offsetY.value = (viewportHeight - SCREEN_HEIGHT * nextScale) / 2
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateScale)
  })

  const stageStyle = () => ({
    width: `${SCREEN_WIDTH}px`,
    height: `${SCREEN_HEIGHT}px`,
    transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
    transformOrigin: 'left top',
  })

  return {
    scale,
    stageStyle,
    updateScale,
  }
}
