import { onMounted, onUnmounted, ref } from 'vue'

export function useFullscreen(targetRef) {
  const isFullscreen = ref(false)

  function syncState() {
    isFullscreen.value = Boolean(document.fullscreenElement)
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    const target = targetRef?.value ?? document.documentElement
    await target.requestFullscreen()
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', syncState)
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', syncState)
  })

  return {
    isFullscreen,
    toggleFullscreen,
  }
}
