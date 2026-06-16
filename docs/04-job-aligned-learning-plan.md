# 招聘导向学习路线

## 1. 目标

本项目的学习路线要服务三个目标：

- 学会 Vue3 企业级 B 端开发。
- 补齐当前招聘中常见的数据可视化、性能优化、AI Coding、WebGL / 3D 能力。
- 形成能写进简历、能在面试中讲清楚的完整项目。

这个项目不应只被描述为“餐饮系统”，而应被描述为：

```text
Vue3 企业级中后台
+ 原生报表中心
+ 数据可视化大屏
+ 地图 / 3D 可视化
+ 实时数据
+ AI Agent 业务闭环
+ Electron 桌面端扩展
```

## 2. 对齐招聘要求

### 要求：熟悉 Vue / React 及工具链

项目对应能力：

- Vue3
- Vite
- TypeScript
- Pinia
- Vue Router
- Element Plus

项目模块：

- 登录页
- 后台 Layout
- 经营工作台
- 报表中心
- 权限路由
- 状态持久化

面试表达：

```text
我基于 Vue3 + TypeScript + Vite 搭建了一个餐饮连锁运营平台，
实现了多布局、权限路由、Pinia 状态持久化、Element Plus 后台页面和报表中心。
```

## 3. 对齐组件和插件抽象能力

招聘常见描述：

```text
熟练开发各类组件和插件，并能够在日常工作中总结抽象成平台或工具服务团队。
```

项目中要沉淀：

- SearchForm：查询表单组件。
- DataTable：业务表格组件。
- BaseChart：图表组件。
- MetricCard：指标卡组件。
- PermissionButton：权限按钮组件。
- ImportWizard：导入向导组件。
- ReportFieldDrawer：报表字段配置抽屉。
- AiPromptPanel：AI 提示词配置面板。
- StatusTag：统一状态标签。
- PageContainer：页面容器。

面试表达：

```text
我没有把页面写成一次性代码，而是沉淀了 SearchForm、DataTable、BaseChart、PermissionButton 等通用业务组件。
这些组件统一处理筛选、表格字段配置、图表 resize、按钮权限、loading、empty 和 error 状态。
```

## 4. 对齐数据可视化能力

招聘常见描述：

```text
熟悉 SVG、Canvas、WebGL 等前端绘图技术，
至少掌握 ECharts、D3、X6、Three.js、Highcharts 等一个或多个可视化库。
```

本项目的可视化技术栈：

```text
ECharts
SVG
Canvas
D3.js
X6
Three.js
WebGL
Cesium
```

### ECharts

落地模块：

- Dashboard 趋势图。
- 报表中心经营趋势。
- 渠道贡献环图。
- 门店排行。
- 经营大屏。
- ECharts 地图。

学习重点：

- option 配置。
- dataset。
- tooltip。
- legend。
- resize。
- setOption 更新。
- 点击事件。

面试表达：

```text
项目中 ECharts 覆盖了经营趋势、渠道占比、门店排行、区域热力、订单飞线和大屏图表。
我封装了 BaseChart 统一处理初始化、销毁、loading、空状态和 ResizeObserver resize。
```

### SVG

落地模块：

- 审批流状态图。
- 数据链路图。
- AI 营销任务流。
- 简单漏斗和关系图。

学习重点：

- SVG 坐标系统。
- path、line、rect、circle。
- marker 箭头。
- 事件绑定。
- 与 Vue 数据绑定。

面试表达：

```text
SVG 适合节点数量不大但需要清晰交互的结构化图形，
比如审批流、数据链路和营销任务流。
```

### Canvas

落地模块：

- 大量门店点位渲染实验。
- 大屏粒子背景。
- 大量订单轨迹动画。

学习重点：

- canvas 绘制 API。
- requestAnimationFrame。
- 坐标换算。
- 点击拾取。
- 大量图形性能优化。

面试表达：

```text
Canvas 更适合大量点、粒子和高频重绘场景。
项目中我会用 Canvas 做大量门店点位和大屏动态效果，避免大量 DOM 节点导致性能问题。
```

### D3.js

落地模块：

- 自定义会员分层图。
- 渠道转化漏斗。
- 门店关系或组织层级图。

学习重点：

- 数据驱动图形。
- scale。
- axis。
- selection。
- enter / update / exit。

面试表达：

```text
D3 不是简单图表库，而是数据驱动图形工具。
项目中用 D3 补充 ECharts 不方便高度定制的 SVG 可视化。
```

### X6

落地模块：

- 审批流设计器。
- AI 营销任务编排。
- 数据接入链路图。

学习重点：

- 节点。
- 边。
- 画布。
- 拖拽。
- 缩放。
- 自定义节点。
- 流程数据结构。

面试表达：

```text
X6 更适合流程图、关系图和编排类场景。
项目中可以用它表达 AI 生成内容、审批、下发门店和效果追踪的完整流程。
```

### Three.js / WebGL

落地模块：

- 3D 门店模型。
- 3D 指标卡。
- 3D 可视化实验。

学习重点：

- Scene。
- Camera。
- Renderer。
- Geometry。
- Material。
- Mesh。
- Light。
- WebGL 基础概念。

面试表达：

```text
Three.js 用于学习通用 3D 场景和 WebGL 基础，
为后续理解 Cesium 和复杂 3D 可视化打基础。
```

### Cesium

落地模块：

- 3D 地球门店态势。
- 城市门店点位。
- 区域柱状体。
- 订单流向线。

学习重点：

- Viewer。
- Entity。
- Primitive。
- Camera。
- 经纬度坐标。
- 3D Tiles。
- 点位聚合。

面试表达：

```text
Cesium 适合三维地理空间可视化。
项目中把它作为独立地图态势模块，用于全国门店分布、区域经营态势和订单流向展示。
```

## 5. 对齐性能优化能力

招聘常见描述：

```text
对前端性能优化、用户体验优化具有实际项目经验。
```

项目中要主动设计可讲的优化点：

- 路由懒加载。
- Element Plus 按需引入。
- ECharts 实例复用。
- ResizeObserver 防抖。
- 大表格服务端分页。
- 虚拟表格。
- 异步导出任务。
- Web Worker 解析 Excel。
- Canvas 大量点位渲染。
- Cesium 点位聚合和分层加载。
- 大屏实时刷新节流。
- 图片和素材懒加载。

面试表达：

```text
我把性能优化分成报表、图表、文件和地图四类。
报表采用服务端分页和虚拟滚动，导出采用异步任务；
图表复用 ECharts 实例并控制刷新频率；
Excel 大文件解析放到 Web Worker；
地图大量点位采用聚合和按视野加载。
```

## 6. 对齐实时数据能力

招聘常见关键词：

```text
WebSocket
MQTT
实时监控
大量数据可视化
```

项目中落地：

- 实时订单。
- 库存预警。
- 门店异常。
- 审批待办。
- 导出任务完成通知。
- 数据链路状态。

技术选择：

- WebSocket：少量实时推送。
- MQTT.js：多主题发布订阅。

面试表达：

```text
如果只是简单实时推送，用 WebSocket 即可。
如果消息类型多，比如订单、库存、告警、导出任务、审批待办，
我会用 MQTT 的 topic 做发布订阅，降低前端消息处理复杂度。
```

## 7. 对齐 AI Coding 能力

招聘加分项：

```text
深度使用 AI Coding 工具，
具备从需求拆分、模块设定到优化提示词让功能完全落地的能力。
```

项目中要沉淀：

- 需求拆分 Prompt。
- 页面开发 Prompt。
- 组件封装 Prompt。
- Bug 定位 Prompt。
- 重构优化 Prompt。
- 测试用例 Prompt。
- README / 面试讲法 Prompt。

开发流程：

```text
人工定义目标和边界
→ AI 拆分任务
→ AI 生成初稿
→ 人工审查业务和架构
→ AI 辅助重构
→ 人工验证
→ AI 生成文档
```

面试表达：

```text
我不是简单让 AI 生成代码，而是把 AI 用在需求拆解、模块边界设计、代码初稿、重构优化、测试和文档沉淀中。
每个阶段都有明确输入、边界和验收标准，保证 AI 产物能真正落地。
```

## 8. 对齐 AI Agent 业务能力

项目内 AI Agent：

- 推广目标输入。
- 平台选择：美团、小红书、抖音、朋友圈。
- 关键词输入。
- 门店范围选择。
- 生成文案。
- 生成图片提示词。
- 保存素材。
- 提交审批。
- 下发门店。
- 效果追踪。

面试表达：

```text
AI Agent 不是孤立聊天框，而是嵌入餐饮营销业务流程。
它把经营数据、推广目标、平台规则和门店画像结合起来，
生成可审批、可下发、可追踪的营销任务。
```

## 9. 对齐 Electron 桌面端

Electron 在本项目中是后期学习项。

落地能力：

- 桌面应用打包。
- 全屏大屏模式。
- 本地文件导出。
- 桌面通知。
- 自动更新。

面试表达：

```text
Electron 不改变核心 Web 架构，只是桌面端承载层。
项目先保证 Web 版完整，再用 Electron 学习窗口管理、本地文件、通知和自动更新。
```

## 10. 最终技能关键词

后续简历技能栏可以按掌握程度写：

熟练：

```text
Vue2 / Vue3
JavaScript
Element Plus
Element UI
Vant
ECharts
业务组件封装
```

掌握：

```text
TypeScript
Vite
Pinia
Vue Router
报表中心
大屏可视化
WebSocket
性能优化
```

实践：

```text
SVG
Canvas
D3.js
X6
Three.js
WebGL
Cesium
MQTT.js
AI Agent
Electron
AI Coding
```

## 11. 最终项目简历方向

项目描述：

```text
基于 Vue3 + TypeScript + Element Plus 开发餐饮连锁运营平台，
覆盖经营工作台、原生报表中心、经营大屏、地图可视化、AI 营销 Agent、
审批中心和数据导入导出等模块，用于帮助总部运营人员完成经营分析、
异常定位、营销决策和门店执行追踪。
```

项目亮点：

- Vue3 + Vite + TypeScript 企业后台架构。
- 原生报表中心替代 iframe 报表。
- ECharts 经营大屏和地图可视化。
- SVG / Canvas / D3 / X6 可视化增强。
- Three.js / Cesium 3D 地图态势。
- WebSocket / MQTT 实时数据。
- AI 营销 Agent 业务闭环。
- AI Coding 需求拆解和开发工作流。
- Electron 桌面端扩展。

## 12. 学习优先级

推荐顺序：

```text
1. Vue3 + TypeScript + Element Plus
2. 后台 Layout + 权限 + Pinia 持久化
3. Dashboard + 报表中心
4. ECharts 封装 + 大屏
5. ECharts 地图
6. SVG / Canvas
7. WebSocket / MQTT
8. D3 / X6
9. AI 营销 Agent
10. 数据导入导出 + 性能优化
11. Three.js
12. Cesium
13. Electron
14. AI Coding 工作流复盘
```

这样既不会脱离真实业务系统，又能覆盖当前招聘中高频出现的技术关键词。
