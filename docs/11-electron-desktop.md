# Electron 桌面端（Phase 19）

> 开发分支：`feature/electron` · Web 核心不变，Electron 仅作桌面承载层。

## 1. 定位

```text
Web 系统（Vue3 + Vite）= 核心业务
Electron = 窗口管理 + 本地文件保存 + 桌面通知 + 全屏大屏
```

不改变报表、权限、AI Agent 等业务逻辑；仅在桌面环境下增强体验。

## 2. 目录结构

```text
electron/
├── main.cjs          # 主进程：窗口、IPC、系统对话框
├── preload.cjs       # preload：contextBridge 暴露 electronAPI
└── ipcChannels.cjs   # IPC 通道常量

src/utils/electron.js # 渲染进程封装（Web 环境自动降级）
```

## 3. 架构要点

| 概念 | 本项目落点 |
|------|------------|
| 主进程 | `electron/main.cjs` — BrowserWindow、dialog、Notification |
| 渲染进程 | 现有 Vue 应用，与浏览器共用同一套代码 |
| preload | `contextIsolation: true`，通过 `window.electronAPI` 通信 |
| IPC | invoke/handle：全屏、保存文件、通知、独立大屏窗口 |
| 路由 | Electron 构建时 `VITE_ELECTRON=true`，使用 **Hash 路由** 以支持 `file://` 加载 |

## 4. 本地开发

```bash
# 安装依赖（含 electron / electron-builder）
npm install

# 启动 Vite + Electron（需先关闭占用 5173 端口的 dev 进程）
npm run electron:dev
```

流程：`concurrently` 同时启动 `ELECTRON=true vite` 与 `electron .`，Electron 加载 `http://localhost:5173`。

纯 Web 开发不受影响：

```bash
npm run dev
npm run build
```

## 5. 打包

```bash
# 仅构建 Electron 用静态资源
npm run build:electron

# 构建 + 打包安装包（输出到 release/）
npm run electron:build

# 仅解压测试（不生成安装包，推荐本地先验证）
npm run electron:pack
```

### Windows 打包报错：`Cannot create symbolic link`

**现象**：`electron:build` 在解压 `winCodeSign` 时失败，提示「客户端没有所需的特权」。

**原因**：electron-builder 默认会下载 `winCodeSign` 并编辑 exe 元数据；该压缩包内含 macOS 符号链接，在 Windows 无「开发者模式 / 管理员」时无法解压。

**本项目处理**（学习/本地打包，无需代码签名）：

- `package.json` → `build.win.signAndEditExecutable: false`
- 脚本已设置 `CSC_IDENTITY_AUTO_DISCOVERY=false` 跳过自动签名

若仍失败，可先 `npm run electron:pack`，直接运行 `release/win-unpacked/Dining Ops Platform.exe`。

正式发版需配置 Windows 代码签名证书后再开启签名。

### NSIS 下载失败（GitHub 连接超时）

**现象**：打包阶段提示无法下载 `nsis-3.0.4.1.7z`。

**处理**：

1. 脚本已配置 `ELECTRON_BUILDER_BINARIES_MIRROR`（npmmirror 镜像），请重试 `npm run electron:build`
2. 若仍失败，先用 **`npm run electron:pack`**，运行 `release/win-unpacked/Dining Ops Platform.exe` 即可验证桌面版
3. 或手动设置环境变量后打包：

```powershell
$env:ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
npm run electron:build
```

## 6. 桌面能力联动

| 能力 | 触发位置 | 说明 |
|------|----------|------|
| 系统保存对话框 | 数据导入模板 / 导出 Excel | `xlsxHelper` → `saveFileWithDialog` |
| 窗口全屏 | 经营大屏「全屏展示」 | `useFullscreen` → IPC `toggleFullscreen` |
| 独立大屏窗口 | AdminHeader「独立大屏窗口」 | 新建无边框全屏 BrowserWindow → `#/large-screen` |
| 桌面通知 | MQTT 运营告警 topic | `realtime` store → `showDesktopNotification` |

Web 浏览器中上述 API 自动降级（浏览器下载 / Fullscreen API / 无系统通知）。

## 7. IPC 通道

见 `electron/ipcChannels.cjs`：

- `app:get-version` / `app:get-platform`
- `window:toggle-fullscreen` / `window:is-fullscreen` / `window:open-large-screen`
- `file:save-buffer`
- `notification:show`

## 8. 自动更新（扩展学习）

当前 **未接入** `electron-updater`。生产环境可按以下方向扩展：

1. 配置 `electron-builder` 的 `publish` 源（GitHub Releases / 私有 OSS）
2. 主进程引入 `electron-updater`，在 `app.whenReady` 后检查更新
3. 通过 preload 向设置页暴露更新进度

面试表达：「桌面端先完成窗口与本地能力，自动更新作为 Electron 扩展项单独演进。」

## 9. 验证清单

- [ ] `npm run electron:dev` 打开桌面窗口，登录 Mock 账号正常
- [ ] 顶栏显示「桌面端 x.x.x」标签
- [ ] 「独立大屏窗口」打开全屏大屏
- [ ] 数据导入页下载模板 / 快速导出 → 弹出系统保存对话框
- [ ] 实时监测收到告警 → 系统通知（需 OS 允许通知）
- [ ] `npm run electron:build` 生成 `release/` 安装包

## 10. 面试怎么说

```text
Electron 在这个项目中是桌面端承载层，不改变核心 Web 架构。
Web 版负责完整业务；Electron 包装后提供窗口管理、系统保存对话框、
桌面通知和独立全屏大屏窗口。通信用 preload + contextBridge + IPC，
并针对 file:// 场景切换 Hash 路由。
```
