# 餐饮连锁运营平台技术方案

## 1. 技术目标

本项目的技术目标不是单纯完成页面，而是系统性学习并实践：

- Vue3 技术栈
- 企业 B 端系统架构
- Element Plus 后台组件体系
- 原生报表中心设计
- ECharts 图表和大屏
- SVG / Canvas / WebGL 绘图能力
- D3 / X6 / Three.js 可视化能力
- 地图 / 3D / Cesium 可视化
- WebSocket / MQTT 实时数据
- AI Agent 业务化接入
- AI Coding 工程化协作
- Electron 桌面端包装

## 2. 主技术栈

推荐主栈：

```text
Vue3
Vite
TypeScript
Vue Router
Pinia
Element Plus
ECharts
Axios
```

后续扩展：

```text
vxe-table 或 Element Plus Table V2
xlsx
Web Worker
WebSocket
MQTT.js
SVG
Canvas
D3.js
X6
Three.js
WebGL
Cesium
Electron
```

## 2.1 招聘导向技术栈分层

为了贴合当前高级前端招聘要求，技术栈按能力层分为：

### 业务系统层

```text
Vue3
TypeScript
Vite
Vue Router
Pinia
Element Plus
Axios
```

目标：

- 能独立搭建企业级 B 端系统。
- 能处理登录、权限、菜单、状态恢复、表单、表格和复杂页面。

### 报表和数据处理层

```text
Element Plus Table
Element Plus Table V2
vxe-table
xlsx
Web Worker
```

目标：

- 能实现成熟报表中心。
- 能处理大表格、字段配置、服务端分页、导入导出和异步任务。

### 图表和大屏层

```text
ECharts
ResizeObserver
Canvas
SVG
```

目标：

- 能实现经营大屏、趋势图、排行图、区域热力、订单飞线。
- 能解释图表 resize、实例复用、性能优化和点击坐标问题。

### 高级可视化层

```text
D3.js
X6
Three.js
WebGL
Cesium
```

目标：

- D3.js：用于自定义 SVG 图表、复杂关系图和数据驱动图形。
- X6：用于审批流、营销任务流、数据链路图和流程编排。
- Three.js：用于基础 3D 场景、3D 门店模型、可视化特效。
- Cesium：用于地理空间可视化、3D 地球、城市门店态势。
- WebGL：理解 Three.js 和 Cesium 的底层图形能力。

### 实时数据层

```text
WebSocket
MQTT.js
```

目标：

- WebSocket 用于简单实时推送。
- MQTT 用于多主题发布订阅，例如订单、库存、告警、导出任务、审批待办。

### AI 和工程效率层

```text
AI Agent
Prompt 参数化
结构化生成结果
AI Coding
```

目标：

- 产品内实现 AI 营销 Agent。
- 开发过程中沉淀 AI 辅助需求拆解、模块设计、代码生成、重构优化、测试和文档的方法论。

### 桌面端扩展层

```text
Electron
electron-builder
IPC
```

目标：

- Web 系统完成后包装为桌面应用。
- 学习窗口管理、本地文件、系统通知、自动更新和全屏展示。

## 3. TypeScript 方案

建议使用 TypeScript，但采用渐进式策略。

原因：

- 本项目是中大型 B 端系统，数据结构复杂。
- 报表字段、菜单权限、路由 meta、接口 DTO、AI 生成结果都需要清晰类型。
- TS 能减少字段拼写错误和状态结构混乱。
- 对后续面试更有帮助。

不建议一开始追求复杂类型体操。

推荐策略：

```text
必须写类型：
- 接口返回数据
- Pinia Store
- 路由 meta
- 菜单权限
- 报表字段配置
- 表单模型
- AI Agent 生成结果

可以放松：
- 页面内部临时变量
- 简单组件 props
- Mock 阶段的部分临时数据
```

面试说法：

```text
这个项目采用渐进式 TypeScript。
核心数据结构、接口、路由、状态和配置项都做类型约束，
页面内部不做过度类型设计，避免为了类型而牺牲开发效率。
```

**当前实现（Phase 18）**：源码为 JavaScript（`.js` / `.vue`），尚未接入 `tsconfig` 与类型文件。面试与简历中应区分「目标架构」与「当前实践版」；迁移路径见 [10-phase-completion-audit.md](./10-phase-completion-audit.md) §5。

## 4. 项目目录建议

推荐目录：

```text
src/
├── assets/              静态资源
├── components/          通用组件
├── layouts/             布局组件
│   ├── AdminLayout.vue
│   └── ScreenLayout.vue
├── router/              路由
├── stores/              Pinia 状态
├── services/            API 请求
├── views/               页面
│   ├── login/
│   ├── overview/
│   ├── dashboard/
│   ├── reports/
│   ├── large-screen/
│   ├── geo-visualization/
│   ├── marketing/
│   ├── ai-agent/
│   └── settings/
├── charts/              ECharts 配置和封装
├── types/               全局类型
├── utils/               工具函数
├── mocks/               Mock 数据
└── styles/              全局样式和主题
```

## 5. 布局架构

系统使用多布局架构。

后台布局：

```text
AdminLayout
├── 左侧菜单
├── 顶部导航
└── 内容区
```

适用页面：

- 经营工作台
- 报表中心
- AI 营销 Agent
- 营销活动
- 审批中心
- 数据导入
- 系统设置

大屏布局：

```text
ScreenLayout
└── 全屏内容
```

适用页面：

- 经营指挥大屏
- 展示型地图大屏

这样设计的原因：

- 后台页面用于长期操作，需要菜单、筛选、表格和按钮。
- 大屏页面用于投屏展示，需要全屏沉浸，不应该被后台布局影响。

## 6. 路由方案

核心点：

- 使用 Vue Router。
- 路由懒加载。
- 使用 route meta 控制标题、图标、权限、是否缓存、布局类型。
- 根据权限动态生成菜单。
- 未登录访问业务页面跳转登录。

路由 meta 建议：

```text
title        页面标题
icon         菜单图标
layout       admin / screen / blank
requiresAuth 是否需要登录
roles        允许访问的角色
keepAlive    是否缓存页面
```

面试说法：

```text
路由层面通过 meta 描述页面布局、权限和菜单信息。
后台页面和大屏页面通过 layout 字段进入不同布局，
避免大屏被后台外壳污染。
```

## 7. 状态管理与刷新恢复

使用：

```text
Pinia + pinia-plugin-persistedstate
```

需要持久化：

- token
- 用户信息
- 当前角色
- 当前组织 / 区域 / 门店
- 菜单权限
- 当前打开的标签页
- 常用筛选条件
- 报表个人视图配置

不建议持久化：

- 大报表明细数据
- 大图表数据
- 临时弹窗状态
- 大屏实时数据

刷新恢复流程：

```text
恢复 token
→ 拉取用户信息
→ 恢复角色和组织
→ 拉取菜单权限
→ 初始化路由
→ 根据 URL query 和本地筛选条件恢复页面状态
→ 请求当前页面数据
```

避免白屏策略：

- 路由守卫中处理登录和权限。
- 全局错误页。
- API 请求失败显示错误状态，不让页面空白。
- 页面 loading、empty、error 三种状态完整。
- 重要筛选条件放 URL query，刷新可恢复。

## 8. UI 组件库方案

使用：

```text
Element Plus
```

原因：

- 适合 Vue3 B 端后台。
- 表单、表格、弹窗、抽屉、菜单、日期选择器完善。
- 学习价值高。
- 国内企业项目常见。

二次封装建议：

- SearchForm：统一查询表单。
- DataTable：统一表格。
- PageContainer：统一页面容器。
- MetricCard：指标卡。
- StatusTag：状态标签。
- PermissionButton：权限按钮。
- BaseDialog：统一弹窗。
- BaseDrawer：统一抽屉。

不建议一开始做完整组件库。

## 9. 报表中心技术方案

核心原则：

```text
原生报表为主，iframe 只做外部 BI 兼容。
```

报表中心能力：

- 报表分类树。
- 统一筛选器。
- 指标卡。
- 图表分析。
- 明细表。
- 字段配置抽屉。
- 保存个人视图。
- URL query 恢复查询条件。
- 下钻分析。
- 异步导出任务。
- 报表权限。
- 水印。

表格方案：

第一阶段：

```text
Element Plus Table
```

第二阶段：

```text
Element Plus Table V2 或 vxe-table
```

适用场景：

- 大量列。
- 固定列。
- 多级表头。
- 虚拟滚动。
- 编辑表格。

导出方案：

小数据量：

```text
前端 xlsx 导出
```

大数据量：

```text
创建导出任务
→ 后端异步生成文件
→ 前端轮询或 WebSocket 通知
→ 下载文件
```

面试说法：

```text
核心报表采用原生 Vue 实现，保证筛选、权限、字段配置、下钻和导出体验统一。
只有历史 BI 或外部系统报表保留 iframe 兼容入口。
大数据量导出采用异步任务，避免前端同步生成导致页面卡死。
```

## 10. ECharts 图表方案

需要封装通用图表组件。

BaseChart 能力：

- 初始化 ECharts 实例。
- 接收 option。
- loading 状态。
- 空状态。
- 点击事件。
- ResizeObserver 监听容器变化。
- window resize 兜底。
- 组件卸载时 dispose。

注意事项：

- 不要每次数据变化都重新 init。
- 数据更新用 setOption。
- 页面切换时销毁实例。
- 大屏缩放后要触发 resize。

面试说法：

```text
我封装了通用图表组件，把初始化、销毁、loading、空状态、resize 和点击事件统一处理。
容器变化通过 ResizeObserver 调用 echarts.resize，避免图表变形和点击坐标异常。
```

## 11. 大屏技术方案

大屏用于展示，不作为后台工作台。

适配方案：

```text
1920 x 1080 设计稿
主体内容 scale 等比缩放
背景层 100vw x 100vh 铺满
核心内容安全区
```

非标准比例处理：

- 主体完整显示。
- 允许左右或上下留白。
- 留白由背景纹理和光效填充。
- 不拉伸核心图表。

点击偏移控制：

- 大屏交互保持克制。
- ECharts 容器 resize。
- 地图和 Canvas 不做复杂嵌套 transform。
- 弹窗、浮层尽量放在未缩放根层。

如果交互复杂：

```text
改用响应式 Grid + ECharts resize
```

## 12. 地图与 Cesium 技术方案

ECharts 地图：

- GeoJSON。
- map。
- scatter。
- effectScatter。
- lines。
- tooltip。
- click 下钻。

适合：

- 经营大屏。
- 报表地图分析。
- 门店点位和区域热力。

Cesium：

- Viewer。
- Entity。
- Primitive。
- Camera。
- 3D Tiles。
- 坐标转换。
- 数据分层。

适合：

- 全国门店 3D 态势。
- 城市级点位。
- 空间可视化学习。
- 大量地理数据展示。

性能关注：

- 点位聚合。
- 分层加载。
- 按视野加载。
- 减少 Entity 数量。
- 大量数据用 Primitive 或 3D Tiles。

面试说法：

```text
ECharts 地图适合业务看板，开发效率高。
Cesium 适合三维空间和大量地理数据可视化。
项目中会把 Cesium 作为独立高级可视化模块，而不是替代普通报表和后台页面。
```

## 13. WebSocket / MQTT 技术方案

实时数据场景：

- 实时订单。
- 大屏告警。
- 库存预警。
- 导出任务完成通知。
- 审批待办变化。
- 数据链路状态。

WebSocket：

- 适合简单实时推送。
- 前后端建立长连接。
- 服务端主动推送消息。

MQTT：

- 适合多主题发布订阅。
- topic 可以按业务划分。
- 支持断线重连和心跳。

主题设计示例：

```text
/ops/orders/realtime
/ops/alerts/store
/ops/inventory/risk
/ops/export/status
/ops/approval/todo
/ops/datalink/health
```

面试说法：

```text
如果只是少量实时数据，用 WebSocket 就够。
如果消息类型多、订阅关系复杂，就用 MQTT 的 topic 做发布订阅，
例如订单、库存、告警、导出任务和审批待办各自独立主题。
```

## 14. AI Agent 技术方案

AI Agent 不做成普通聊天框，而是业务工作流。

模块能力：

- 输入推广目标。
- 输入关键词。
- 选择平台。
- 选择门店范围。
- 结合经营数据生成方案。
- 生成结构化内容。
- 保存素材。
- 提交审批。
- 下发门店。
- 追踪效果。

生成内容结构：

```text
小红书笔记标题
小红书正文
美团评价话术
店员转发文案
图片生成提示词
优惠活动建议
预估效果
合规检查结果
```

技术关注：

- Prompt 参数化。
- 生成结果结构化。
- 结果可编辑。
- 结果可保存。
- 结果进入审批流程。
- 生成记录可追溯。

面试说法：

```text
AI Agent 不是独立聊天工具，而是嵌入餐饮营销流程。
它根据门店经营数据、推广目标和平台规则生成可执行营销内容，
再进入素材库、审批和门店下发流程，形成业务闭环。
```

## 15. 数据导入导出方案

导入流程：

```text
下载模板
→ 上传 Excel
→ 前端解析
→ 字段校验
→ 错误行展示
→ 确认导入
→ 刷新数据
```

技术：

- xlsx。
- 文件大小限制。
- 字段校验。
- 错误行定位。
- Web Worker 可用于大文件解析。

导出流程：

小数据：

```text
前端生成 Excel
```

大数据：

```text
创建导出任务
→ 后端生成
→ 通知完成
→ 下载
```

## 16. 权限与审批方案

权限模型：

```text
RBAC
用户
角色
组织
菜单
按钮
数据范围
```

权限层级：

- 路由级权限。
- 菜单级权限。
- 按钮级权限。
- 数据范围权限。

审批流状态：

```text
草稿
待审批
已通过
已驳回
已撤回
已下发
已完成
```

适用业务：

- 营销活动发布。
- 卡券发放。
- 员工奖励。
- AI 生成内容下发。
- 大额优惠审批。

## 17. Electron 技术方案

Electron 优先级较低，Web 系统完成后再做。

定位：

- 学习桌面端开发。
- 包装 Web 系统。
- 支持全屏大屏。
- 支持文件导出、打印、桌面通知。

技术关注：

- 主进程。
- 渲染进程。
- preload。
- IPC 通信。
- 窗口管理。
- 本地文件。
- 打包发布。
- 自动更新。

面试说法：

```text
Electron 不是核心业务架构，而是桌面端承载层。
核心业务仍然保持 Web 化，Electron 主要提供窗口、本地文件、通知和全屏展示能力。
```

## 18. 项目阶段策略

不建议一开始同时做所有技术。

推荐顺序：

```text
Vue3 主系统
→ Dashboard
→ 报表中心
→ ECharts 封装
→ 大屏
→ ECharts 地图
→ SVG / Canvas 可视化增强
→ D3 / X6 流程和关系可视化
→ 实时数据
→ AI Agent
→ 导入导出
→ 权限审批
→ Three.js / Cesium
→ 可视化性能优化
→ AI Coding 工作流沉淀
→ Electron
```

这样能保证每一步都有学习价值，也不会偏离面试目标。
