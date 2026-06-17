/** Electron 渲染进程 API 封装（Web 环境安全降级） */

export function isElectron() {
  return Boolean(typeof window !== 'undefined' && window.electronAPI?.isElectron)
}

function getAPI() {
  return window.electronAPI ?? null
}

export async function getElectronVersion() {
  const api = getAPI()
  if (!api) {
    return null
  }
  return api.getVersion()
}

export async function getElectronPlatform() {
  const api = getAPI()
  if (!api) {
    return null
  }
  return api.getPlatform()
}

export async function toggleElectronFullscreen() {
  const api = getAPI()
  if (!api) {
    return false
  }
  return api.toggleFullscreen()
}

export async function isElectronFullscreen() {
  const api = getAPI()
  if (!api) {
    return false
  }
  return api.isFullscreen()
}

export async function openLargeScreenWindow() {
  const api = getAPI()
  if (!api) {
    return false
  }
  return api.openLargeScreenWindow()
}

/**
 * 通过系统保存对话框写入二进制文件（Electron）或触发浏览器下载（Web）
 * @param {ArrayBuffer|Uint8Array|number[]} buffer
 */
export async function saveFileWithDialog(buffer, options = {}) {
  const {
    defaultPath = 'export.xlsx',
    filters = [{ name: 'Excel', extensions: ['xlsx'] }],
  } = options

  const bytes =
    buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)

  const api = getAPI()
  if (api?.saveFile) {
    return api.saveFile({
      defaultPath,
      filters,
      buffer: Array.from(bytes),
    })
  }

  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = defaultPath
  anchor.click()
  URL.revokeObjectURL(url)
  return { saved: true, path: defaultPath, fallback: 'browser-download' }
}

export async function showDesktopNotification(options = {}) {
  const api = getAPI()
  if (api?.showNotification) {
    return api.showNotification(options)
  }

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(options.title ?? 'Dining Ops Platform', {
      body: options.body ?? '',
    })
    return { shown: true, fallback: 'web-notification' }
  }

  return { shown: false }
}

export function onElectronFullscreenChange(callback) {
  const api = getAPI()
  if (!api?.onFullscreenChange) {
    return () => {}
  }
  return api.onFullscreenChange(callback)
}
