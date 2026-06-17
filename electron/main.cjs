const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification,
  shell,
} = require('electron')
const path = require('path')
const fs = require('fs')
const channels = require('./ipcChannels.cjs')

const isDev = !app.isPackaged
let mainWindow = null
let largeScreenWindow = null

function getPreloadPath() {
  return path.join(__dirname, 'preload.cjs')
}

function getDistIndexPath() {
  return path.join(__dirname, '../dist/index.html')
}

function buildAppUrl(hashPath = '') {
  if (isDev) {
    const normalized = hashPath.replace(/^#?\/?/, '')
    return normalized ? `http://localhost:5173/#/${normalized}` : 'http://localhost:5173/'
  }
  const indexPath = getDistIndexPath()
  const normalized = hashPath.replace(/^#?\/?/, '')
  return normalized ? `file://${indexPath}#/${normalized}` : `file://${indexPath}`
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 720,
    title: 'Dining Ops Platform',
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('window:fullscreen-changed', true)
  })

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('window:fullscreen-changed', false)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.loadURL(buildAppUrl('/dashboard'))
}

function createLargeScreenWindow() {
  if (largeScreenWindow) {
    largeScreenWindow.focus()
    return
  }

  largeScreenWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: '#071426',
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  })

  largeScreenWindow.once('ready-to-show', () => {
    largeScreenWindow.show()
  })

  largeScreenWindow.on('closed', () => {
    largeScreenWindow = null
  })

  largeScreenWindow.loadURL(buildAppUrl('/large-screen'))
}

function registerIpcHandlers() {
  ipcMain.handle(channels.APP_GET_VERSION, () => app.getVersion())

  ipcMain.handle(channels.APP_GET_PLATFORM, () => process.platform)

  ipcMain.handle(channels.WINDOW_TOGGLE_FULLSCREEN, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return false
    }
    win.setFullScreen(!win.isFullScreen())
    return win.isFullScreen()
  })

  ipcMain.handle(channels.WINDOW_IS_FULLSCREEN, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return win?.isFullScreen() ?? false
  })

  ipcMain.handle(channels.WINDOW_OPEN_LARGE_SCREEN, () => {
    createLargeScreenWindow()
    return true
  })

  ipcMain.handle(channels.FILE_SAVE_BUFFER, async (_event, options = {}) => {
    const { defaultPath = 'export.xlsx', filters = [], buffer } = options
    const win = BrowserWindow.getFocusedWindow() ?? mainWindow
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath,
      filters: filters.length
        ? filters
        : [{ name: 'All Files', extensions: ['*'] }],
    })

    if (canceled || !filePath) {
      return { saved: false, canceled: true }
    }

    const data = Buffer.from(buffer)
    fs.writeFileSync(filePath, data)
    return { saved: true, path: filePath }
  })

  ipcMain.handle(channels.NOTIFICATION_SHOW, (_event, options = {}) => {
    const { title = 'Dining Ops Platform', body = '' } = options
    if (!Notification.isSupported()) {
      return { shown: false, reason: 'unsupported' }
    }
    const notification = new Notification({ title, body })
    notification.show()
    return { shown: true }
  })
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
})
