import { onMounted, onUnmounted, ref } from 'vue'
import {
  isElectron,
  isElectronFullscreen,
  onElectronFullscreenChange,
  toggleElectronFullscreen,
} from '@/utils/electron'

export function useFullscreen(targetRef) {
  const isFullscreen = ref(false)

  function syncState() {
    isFullscreen.value = Boolean(document.fullscreenElement)
  }

  async function syncElectronState() {
    if (!isElectron()) {
      return
    }
    isFullscreen.value = await isElectronFullscreen()
  }

  async function toggleFullscreen() {
    if (isElectron()) {
      isFullscreen.value = await toggleElectronFullscreen()
      return
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    const target = targetRef?.value ?? document.documentElement
    await target.requestFullscreen()
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', syncState)
    syncElectronState()
    onElectronFullscreenChange((value) => {
      isFullscreen.value = value
    })
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', syncState)
  })

  return {
    isFullscreen,
    toggleFullscreen,
  }
}
