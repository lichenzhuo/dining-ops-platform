/** IPC 通道常量（主进程与 preload 共用命名） */
module.exports = {
  APP_GET_VERSION: 'app:get-version',
  APP_GET_PLATFORM: 'app:get-platform',
  WINDOW_TOGGLE_FULLSCREEN: 'window:toggle-fullscreen',
  WINDOW_IS_FULLSCREEN: 'window:is-fullscreen',
  WINDOW_OPEN_LARGE_SCREEN: 'window:open-large-screen',
  FILE_SAVE_BUFFER: 'file:save-buffer',
  NOTIFICATION_SHOW: 'notification:show',
}
