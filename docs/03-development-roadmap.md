# 开发步骤、学习重点与面试讲法

## 0. 开发原则

这个项目的目标不是让 AI 一次性生成完整代码，而是通过分阶段开发学习：

- Vue3 企业后台开发
- 真实 B 端产品设计
- 报表中心交互
- 图表和大屏
- 地图和 Cesium
- SVG / Canvas / WebGL 绘图
- D3 / X6 / Three.js 高级可视化
- WebSocket / MQTT
- AI Agent
- AI Coding 工作流
- Electron

每个阶段都要回答五个问题：

```text
这个阶段解决什么业务问题？
用到了哪些 Vue3 知识？
用到了哪些技术栈？
有什么工程化或性能问题？
面试时怎么讲？
```

## 1. 项目初始化

### 做什么

- 创建 Vue3 + Vite 项目。
- 接入 TypeScript。
- 接入 Element Plus。
- 接入 Vue Router。
- 接入 Pinia。
- 配置 ESLint、Prettier、路径别名、全局样式。
- 建立基础目录结构。

### 学习重点

- Vite 和 Vue CLI 的区别。
- Vue3 项目启动流程。
- `main.ts` 中如何挂载插件。
- Element Plus 如何按需引入。
- TypeScript 在 Vue3 项目中的基础使用。

### 技术栈

- Vue3
- Vite
- TypeScript
- Element Plus
- Pinia
- Vue Router

### 面试怎么说

```text
项目使用 Vue3 + Vite 搭建。
Vite 开发环境基于原生 ESM，冷启动和热更新速度比传统 Vue CLI 更快。
状态管理使用 Pinia，它更贴合 Vue3 Composition API，类型推导也比 Vuex 更自然。
```

### 常见问题

Q：为什么不用 Vue CLI？

A：

```text
Vue CLI 更适合传统 Vue2 / Webpack 项目。
新项目选择 Vite 是因为开发启动快、配置轻、生态成熟，
同时它的生产构建基于 Rollup，适合现代 Vue3 项目。
```

## 2. 基础 Layout 和路由

### 做什么

- 实现登录页布局。
- 实现后台 AdminLayout。
- 实现大屏 ScreenLayout。
- 配置基础路由。
- 配置路由懒加载。
- 根据 route meta 切换布局。

### 学习重点

- Vue Router 嵌套路由。
- 路由懒加载。
- route meta。
- 多布局设计。
- 后台布局和大屏布局为什么要分开。

### 技术栈

- Vue Router
- Element Plus Menu
- CSS Grid / Flex

### 面试怎么说

```text
系统采用多布局架构。
后台页面走 AdminLayout，包含左侧菜单和顶部栏；
经营大屏走 ScreenLayout，独立全屏展示。
这样可以避免大屏被后台布局、滚动容器和菜单影响。
```

## 3. 登录态、权限和刷新恢复

### 做什么

- 登录后保存 token。
- 保存用户信息、角色、组织、门店。
- 页面刷新后恢复登录状态。
- 实现路由守卫。
- 未登录跳转登录页。
- 生成动态菜单。

### 学习重点

- Pinia Store 设计。
- Pinia 持久化。
- localStorage 和 sessionStorage。
- 路由守卫。
- 刷新页面为什么会丢状态。
- 如何避免白屏。

### 技术栈

- Pinia
- pinia-plugin-persistedstate
- Vue Router
- Axios 拦截器

### 面试怎么说

```text
刷新不丢状态的关键是区分哪些数据需要持久化。
token、用户信息、角色、组织、菜单和筛选条件需要保存；
大报表明细和实时图表数据不长期保存，刷新后根据路由参数重新请求。
```

### 常见问题

Q：为什么不把所有数据都存 localStorage？

A：

```text
localStorage 适合保存登录态、角色、菜单、筛选条件这类轻量状态。
大报表数据和实时数据体积大、时效性强，持久化反而会造成脏数据和性能问题。
```

## 4. 经营工作台 Dashboard

### 做什么

- 实现浅色后台 Dashboard。
- 实现筛选条。
- 实现 KPI 卡片。
- 实现趋势图、渠道图、排行表、异常列表。
- 实现 AI 今日建议卡片。
- 接入 Mock 数据。

### 学习重点

- Composition API。
- `ref`、`reactive`、`computed`。
- 组件拆分。
- Element Plus 表单和表格。
- ECharts 基础使用。
- 响应式后台页面设计。

### 技术栈

- Element Plus
- ECharts
- Pinia
- CSS Grid / Flex

### 面试怎么说

```text
Dashboard 是运营人员日常使用的首页，所以采用浅色后台风格和响应式布局。
它强调筛选、表格、导出、审批和运营动作，不使用大屏 scale 方案。
```

## 5. 原生报表中心

### 做什么

- 实现报表分类树。
- 实现统一筛选器。
- 实现指标卡和图表。
- 实现核心明细表。
- 实现字段配置抽屉。
- 实现保存常用视图。
- 实现下钻交互。
- 实现导出任务提示。

### 学习重点

- 成熟报表中心的交互。
- 表格列配置。
- 服务端分页。
- 多级表头。
- URL query 恢复筛选条件。
- 为什么原生报表比 iframe 更适合新系统。

### 技术栈

- Element Plus Table
- Element Plus Drawer
- ECharts
- Vue Router query
- Pinia

### 面试怎么说

```text
我没有把报表做成 iframe 嵌套，而是做成原生报表中心。
这样筛选、权限、字段配置、下钻、导出、路由状态和系统视觉都能统一。
外部 BI 报表可以作为兼容入口，但核心报表应原生实现。
```

### 常见问题

Q：为什么不用 iframe 接报表？

A：

```text
iframe 接入成本低，适合兼容老系统或外部 BI。
但它的路由、权限、筛选、导出、样式和通信都割裂。
新系统核心报表用原生实现，可以获得更好的交互和可维护性。
```

Q：大数据量导出怎么做？

A：

```text
小数据量可以前端 xlsx 导出。
大数据量应该创建导出任务，由后端异步生成文件，
前端通过轮询或 WebSocket 接收完成通知，避免页面卡死。
```

## 6. ECharts 通用封装

### 做什么

- 封装 BaseChart。
- 支持 loading。
- 支持 empty。
- 支持点击事件。
- 支持 ResizeObserver。
- 组件卸载时 dispose。
- Dashboard、报表、大屏复用。

### 学习重点

- ECharts 实例生命周期。
- `setOption` 更新。
- 为什么不能重复 init。
- ResizeObserver。
- 组件封装思路。

### 技术栈

- ECharts
- ResizeObserver
- Vue3 组件通信

### 面试怎么说

```text
图表组件统一处理初始化、销毁、loading、空状态和 resize。
容器尺寸变化时用 ResizeObserver 触发 echarts.resize，
避免图表变形和点击坐标异常。
```

## 7. 经营指挥大屏

### 做什么

- 实现 `/large-screen` 独立全屏页面。
- 实现 1920 x 1080 设计稿。
- 实现主体 scale 适配。
- 实现 KPI、地图、趋势、预警、数据链路监控。
- 支持全屏展示。

### 学习重点

- 大屏和后台 Dashboard 的区别。
- scale 方案适用场景。
- 非标准比例屏幕如何处理。
- 全屏 API。
- 自动刷新。

### 技术栈

- ECharts
- CSS transform scale
- Fullscreen API
- 定时器 / WebSocket

### 面试怎么说

```text
经营大屏是投屏展示场景，交互较少，所以采用 1920x1080 设计稿加等比缩放。
背景层铺满屏幕，核心内容放在安全区。
后台 Dashboard 不使用 scale，而是响应式布局。
```

## 8. ECharts 地图

### 做什么

- 加载中国 / 省市 GeoJSON。
- 绘制区域热力。
- 绘制门店点位。
- 绘制订单飞线。
- 点击省市或门店进入报表中心。

### 学习重点

- GeoJSON。
- 经纬度。
- ECharts map。
- scatter / effectScatter。
- lines 飞线。
- 地图事件。

### 技术栈

- ECharts
- GeoJSON
- Vue Router

### 面试怎么说

```text
地图模块使用 ECharts + GeoJSON 实现区域热力、门店点位和飞线。
点击区域或门店后，携带区域和门店参数跳转到报表中心做下钻分析。
```

## 9. SVG / Canvas 可视化增强

### 做什么

- 在经营大屏中加入 SVG 数据链路图。
- 用 SVG 实现审批流、营销任务流或数据接入状态图。
- 用 Canvas 做大量门店点位渲染实验。
- 用 Canvas 做大屏背景粒子、轨迹或高性能点位 Demo。

### 学习重点

- SVG 和 Canvas 的区别。
- SVG 适合结构化、可交互、节点数量中等的图形。
- Canvas 适合大量点、粒子、轨迹和高频重绘。
- 浏览器绘图性能。
- requestAnimationFrame。
- 点击拾取和坐标换算。

### 技术栈

- SVG
- Canvas
- requestAnimationFrame
- Pointer Events

### 面试怎么说

```text
项目中 ECharts 负责常规图表，SVG 用于审批流、数据链路和状态图这类结构化可交互图形；
Canvas 用于大量点位和大屏动态效果，避免大量 DOM 节点造成性能问题。
```

## 10. D3 / X6 流程和关系可视化

### 做什么

- 用 D3 实现自定义会员分层图、渠道转化漏斗或关系型图表。
- 用 X6 实现审批流设计器或营销任务编排图。
- 展示“AI 生成内容 → 审批 → 下发门店 → 执行反馈 → 效果追踪”的流程图。
- 展示数据链路：POS / 外卖 / CRM / 库存 / 财务 → 指标中心 → 报表 / 大屏。

### 学习重点

- D3 的数据驱动思想。
- SVG 坐标系统。
- X6 节点、边、画布、拖拽、缩放。
- 流程图数据结构。
- 可视化组件和业务数据如何解耦。

### 技术栈

- D3.js
- X6
- SVG

### 面试怎么说

```text
D3 更适合高度定制的数据驱动图形，X6 更适合流程编排和关系图。
项目中用 X6 表达审批流和营销任务流，用 D3 补充 ECharts 不好覆盖的自定义图形。
```

## 11. Three.js / Cesium 3D 可视化

### 做什么

- 用 Three.js 做 3D 门店模型或 3D 数据卡片 Demo。
- 用 Cesium 做 3D 地球门店态势。
- 展示门店 3D 点位、区域柱状体、订单流向线。
- 点击门店显示经营浮层。
- 尝试点位聚合和按视野加载。

### 学习重点

- WebGL 是什么。
- Three.js 场景、相机、渲染器、几何体、材质。
- Cesium Viewer、Entity、Primitive、Camera。
- 经纬度和 3D 坐标。
- 大量点位性能优化。

### 技术栈

- Three.js
- WebGL
- Cesium

### 面试怎么说

```text
Three.js 用于学习通用 3D 场景和 WebGL 基础，Cesium 用于地理空间可视化。
项目中把 3D 能力放在独立地图态势模块，避免影响普通后台系统的可用性。
```

## 12. WebSocket / MQTT 实时数据

### 做什么

- 模拟实时订单。
- 模拟库存预警。
- 模拟告警消息。
- 模拟导出任务完成通知。
- 大屏数据实时滚动。

### 学习重点

- WebSocket 和 HTTP 轮询区别。
- MQTT 发布订阅模型。
- topic 设计。
- 心跳。
- 断线重连。

### 技术栈

- WebSocket
- MQTT.js
- Pinia

### 面试怎么说

```text
少量实时数据可以用 WebSocket。
如果消息类型多，比如订单、库存、告警、导出任务、审批待办，
可以用 MQTT 的 topic 做发布订阅，前端按主题订阅需要的数据。
```

## 13. AI 营销 Agent

### 做什么

- 实现 AI 营销 Agent 页面。
- 输入推广目标、关键词、平台、门店范围。
- 生成文案、图片提示词和推广方案。
- 保存素材。
- 提交审批。
- 下发门店。
- 追踪效果。

### 学习重点

- AI 不只是聊天框。
- Prompt 参数化。
- 结构化生成结果。
- AI 结果和业务流程结合。
- 素材、审批、下发、复盘闭环。

### 技术栈

- Vue3 表单
- Element Plus
- AI API 预留
- Pinia
- 审批流状态

### 面试怎么说

```text
AI Agent 嵌入餐饮营销流程，而不是独立聊天工具。
营销人员输入目标和关键词后，系统生成小红书笔记、美团评价话术、
店员转发文案和图片提示词，再进入素材库、审批和门店下发流程。
```

## 14. 数据导入导出

### 做什么

- 下载导入模板。
- 上传 Excel。
- 解析文件。
- 校验字段。
- 展示错误行。
- 确认导入。
- 报表导出。
- 导出任务队列。

### 学习重点

- 文件上传。
- xlsx 解析。
- 前端校验。
- 错误反馈。
- 大文件处理。
- Web Worker 可选优化。

### 技术栈

- xlsx
- Element Plus Upload
- Web Worker

### 面试怎么说

```text
导入不是简单上传文件，而是模板下载、字段校验、错误行提示、导入确认和结果回显。
大数据量导出采用任务队列，避免同步导出阻塞页面。
```

## 15. 权限和审批中心

### 做什么

- 实现角色权限。
- 实现菜单权限。
- 实现按钮权限。
- 实现审批待办。
- 实现营销活动审批。
- 实现 AI 内容审批。

### 学习重点

- RBAC。
- 动态路由。
- 按钮权限。
- 审批流状态机。
- 组织数据权限。

### 技术栈

- Vue Router
- Pinia
- 自定义指令
- Element Plus Table

### 面试怎么说

```text
权限分为路由级、菜单级、按钮级和数据范围权限。
审批流使用状态机管理，例如草稿、待审批、已通过、已驳回、已下发、已完成。
```

## 16. 可视化性能优化专题

### 做什么

- 针对 ECharts 图表更新做节流和实例复用。
- 针对大表格做服务端分页和虚拟滚动。
- 针对 Excel 导入做 Web Worker 解析。
- 针对 Canvas 大量点位做分层渲染和视口裁剪。
- 针对 Cesium 点位做聚合、分层加载和按视野加载。
- 针对路由和模块做懒加载。

### 学习重点

- 性能指标。
- 首屏加载。
- 长任务。
- 内存泄漏。
- 大数据渲染。
- 防抖节流。
- 虚拟滚动。
- Web Worker。

### 技术栈

- Vue Router 懒加载
- ECharts 实例复用
- Web Worker
- 虚拟表格
- Canvas 优化
- Cesium 聚合

### 面试怎么说

```text
项目中把性能优化分成报表、图表、文件和地图四类。
报表用服务端分页和虚拟滚动，图表复用实例并控制刷新频率，
Excel 大文件用 Web Worker，地图大量点位采用聚合和按视野加载。
```

## 17. AI Coding 工作流沉淀

### 做什么

- 用 AI 辅助需求拆分。
- 用 AI 生成模块设计和组件边界。
- 用 AI 生成代码初稿。
- 人工审查、补类型、补边界、重构。
- 用 AI 辅助生成测试用例。
- 用 AI 辅助生成文档和面试讲法。
- 沉淀每个阶段的 Prompt 模板。

### 学习重点

- 需求如何拆成可执行任务。
- 如何给 AI 提供上下文。
- 如何限制 AI 不乱改架构。
- 如何审查 AI 生成代码。
- 如何让 AI 输出可维护代码而不是一次性 Demo。

### 技术栈

- Cursor / AI Coding 工具
- Prompt Engineering
- Code Review
- 文档化工作流

### 面试怎么说

```text
我不是简单让 AI 生成代码，而是把 AI 用在需求拆解、模块设计、初稿生成、代码审查、重构优化和文档沉淀中。
每个阶段都有明确输入、边界和验收标准，保证 AI 产物能真正落地。
```

## 18. Electron 桌面端

### 做什么

- Web 系统完成后接入 Electron。
- 打包桌面应用。
- 支持全屏大屏。
- 支持本地文件导出。
- 支持桌面通知。
- 自动更新作为扩展学习。

### 学习重点

- 主进程。
- 渲染进程。
- preload。
- IPC。
- 本地文件。
- 打包发布。

### 技术栈

- Electron
- electron-builder
- IPC

### 面试怎么说

```text
Electron 在这个项目中是桌面端承载层，不改变核心 Web 架构。
它主要用于学习窗口管理、本地文件、桌面通知、自动更新和全屏展示能力。
```

## 19. 推荐开发顺序

严格建议按这个顺序：

```text
1. 项目初始化
2. 登录页
3. 后台 Layout
4. 路由和 Pinia 持久化
5. Dashboard
6. 报表中心
7. ECharts 封装
8. 经营大屏
9. ECharts 地图
10. SVG / Canvas 可视化增强
11. D3 / X6 流程和关系可视化
12. WebSocket / MQTT
13. AI 营销 Agent
14. 数据导入导出
15. 权限和审批
16. Three.js / Cesium
17. 可视化性能优化专题
18. AI Coding 工作流沉淀
19. Electron
```

不建议一开始就做 Three.js、Cesium、AI 和 Electron。

## 20. 项目最终面试主线

面试时不要把项目讲成“我做了很多功能”，而要讲成业务闭环：

```text
这个项目是一个餐饮连锁运营平台。
它从 POS、外卖、CRM、库存和财务等数据源接入经营数据，
通过 Dashboard 和报表中心做经营分析，
通过大屏和地图可视化展示整体态势，
再通过 AI 营销 Agent 生成推广方案，
经过审批后下发门店执行，
最后通过报表追踪营销效果和经营改善。
```

这条主线能把 Vue3、报表、大屏、地图、SVG、Canvas、D3、X6、Three.js、Cesium、实时数据、AI Agent、AI Coding 和 Electron 都串起来。

## 21. 每阶段向 AI 提需求的方式

后续让 AI 写代码时，不要说“帮我写整个系统”。

推荐这样提：

```text
现在实现第 X 阶段：xxx。
请基于当前项目结构实现：
1. xxx
2. xxx
3. xxx
要求：
- 使用 Vue3 + Element Plus（TypeScript 为渐进目标，见 docs/02 §3 与 docs/10）
- 保持已有布局和样式规范
- 不要实现未规划模块
- 完成后说明本阶段涉及的 Vue3 知识点
```

这样能保证开发过程不偏离学习目标。

## 22. 阶段完成度自检

Phase 1–18 完成后，用 **[docs/10-phase-completion-audit.md](./10-phase-completion-audit.md)** 核对：

- 各阶段路由、Store、验收项是否齐全
- 跨模块业务闭环是否可演示
- TypeScript / Axios / 未实现模块等已知差距是否与文档一致
- 三角色 Mock 账号权限是否符合预期

下一步开发：**Phase 19 Electron 桌面端**。
