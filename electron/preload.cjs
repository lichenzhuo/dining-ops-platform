const { contextBridge, ipcRenderer } = require('electron')
const channels = require('./ipcChannels.cjs')

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  getVersion: () => ipcRenderer.invoke(channels.APP_GET_VERSION),
  getPlatform: () => ipcRenderer.invoke(channels.APP_GET_PLATFORM),
  toggleFullscreen: () => ipcRenderer.invoke(channels.WINDOW_TOGGLE_FULLSCREEN),
  isFullscreen: () => ipcRenderer.invoke(channels.WINDOW_IS_FULLSCREEN),
  openLargeScreenWindow: () => ipcRenderer.invoke(channels.WINDOW_OPEN_LARGE_SCREEN),
  saveFile: (options) => ipcRenderer.invoke(channels.FILE_SAVE_BUFFER, options),
  showNotification: (options) => ipcRenderer.invoke(channels.NOTIFICATION_SHOW, options),
  onFullscreenChange: (callback) => {
    const listener = (_event, value) => callback(value)
    ipcRenderer.on('window:fullscreen-changed', listener)
    return () => ipcRenderer.removeListener('window:fullscreen-changed', listener)
  },
})
