# Dining Ops Platform

## 项目名称

- 中文名：餐饮连锁运营平台
- 英文名：Dining Ops Platform
- Git 项目名：dining-ops-platform

## 项目定位

Dining Ops Platform 是一个面向连锁餐饮企业的 B 端运营平台，覆盖经营工作台、报表中心、经营大屏、地图可视化、营销活动、会员卡券、员工推广、AI 营销 Agent、审批中心和数据导入导出等模块。

项目以真实餐饮连锁企业的总部运营、区域管理、门店执行、会员营销和经营分析场景为背景，按照生产级 B 端系统的标准进行产品设计和技术实现。系统同时沉淀现代前端能力，覆盖：

- Vue3 企业后台开发
- TypeScript
- Element Plus
- Pinia
- Vue Router
- ECharts
- SVG / Canvas / WebGL
- D3 / X6 / Three.js
- 报表中心
- 大屏适配
- 地图 / Cesium
- WebSocket / MQTT
- AI Agent
- AI Coding 工作流
- Electron

## 核心业务闭环

```text
数据接入
→ 经营分析
→ 报表下钻
→ 大屏展示
→ 地图态势定位
→ AI 生成营销动作
→ 审批
→ 下发门店
→ 执行反馈
→ 数据回流复盘
```

## 推荐技术栈

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

扩展技术：

```text
vxe-table / Element Plus Table V2
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

## 规划模块

```text
/login                 登录页
/overview              系统总览
/dashboard             经营工作台
/reports               报表中心
/large-screen          经营指挥大屏
/geo-visualization     地图态势 / 3D 可视化
/visualization-lab     可视化实验室
/workflow-designer     审批流 / 业务流程设计器
/marketing             营销活动
/coupons               卡券中心
/members               会员运营
/staff-promotion       员工推广
/ai-agent              AI 营销 Agent
/materials             素材库
/approval              审批中心
/data-import           数据导入
/performance-lab       性能优化实验室
/ai-coding             AI Coding 过程沉淀
/settings              系统设置
```

## 文档索引

- [产品与设计方案](docs/01-product-design.md)
- [技术架构方案](docs/02-technical-architecture.md)
- [开发步骤、学习重点与面试讲法](docs/03-development-roadmap.md)
- [招聘导向学习路线](docs/04-job-aligned-learning-plan.md)
- [简历调整与面试准备指南](docs/05-resume-and-interview-guide.md)
- [项目总览、学习路线评估与 AI 使用方式](docs/06-project-overview-and-ai-usage.md)
- [真实业务级包装与简历口径](docs/07-production-positioning-and-resume-packaging.md)
- [模型路由与二次确认协议](docs/08-model-routing-and-confirmation.md)
- [AI Coding 工作流沉淀](docs/09-ai-coding-workflow.md)

## 推荐开发顺序

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
17. 性能优化专题
18. AI Coding 工作流沉淀
19. Electron
```

## 设计原则

- 后台管理系统采用浅色企业后台风格，适合长期操作。
- 经营大屏采用深色全屏风格，适合投屏展示。
- 核心报表采用原生 Vue 页面实现，不以 iframe 作为主方案。
- AI Agent 要嵌入营销业务流程，不做孤立聊天框。
- Cesium 作为高级地图可视化模块，不强行替代普通报表和后台页面。
- SVG、Canvas、D3、X6、Three.js 作为可视化能力增强模块，服务于报表、流程、地图和大屏，不做无业务意义的技术堆砌。
- AI Coding 要贯穿需求拆解、模块设计、代码生成、重构优化、测试和文档沉淀，形成可面试表达的开发方法论。
- Electron 作为后期桌面端承载层，不改变核心 Web 架构。

## 面试表达主线

这个项目可以这样介绍：

```text
这是一个餐饮连锁运营平台。
它从 POS、外卖、CRM、库存和财务等数据源接入经营数据，
通过 Dashboard 和报表中心做经营分析，
通过大屏和地图可视化展示整体态势，
再通过 AI 营销 Agent 生成推广方案，
经过审批后下发门店执行，
最后通过报表追踪营销效果和经营改善。
```

## 当前状态

已完成：

- Vue3 + Vite + TypeScript + Element Plus + Pinia + Vue Router 项目初始化
- 登录页 `/login`（blank 布局、Mock 登录、记住账号）
- 后台 `AdminLayout`（侧边菜单 + 顶部栏）、大屏 `ScreenLayout`、空白 `BlankLayout`
- 根据 `route.meta.layout` 自动切换布局，路由懒加载
- 路由守卫、Pinia 持久化（token / 用户信息 / 组织 / 菜单权限）、刷新后恢复登录态
- 经营工作台 `/dashboard`（筛选条、KPI 卡片、趋势图、渠道图、客单价、门店排行、异常列表、审批待办、AI 建议、Mock 数据）
- ECharts 通用封装 `BaseChart`（loading、empty、点击事件、ResizeObserver、实例生命周期管理），Dashboard 图表已接入
- 原生报表中心 `/reports`（分类树、统一筛选、指标卡、图表分析、明细表、字段配置抽屉、常用视图、下钻交互、URL query 同步、导出任务提示、外部 BI 兼容占位）
- 经营指挥大屏 `/large-screen`（1920×1080 scale 适配、KPI 通栏、区域态势图、分时趋势、风险预警、数据链路监控、全屏展示、30s 自动刷新、点击跳转报表中心）
- ECharts 地图 `/geo-visualization`（中国 GeoJSON、省份热力、门店 scatter、订单飞线、点击省市/门店下钻报表；大屏地图已同步接入）
- SVG / Canvas 可视化增强：`/visualization-lab`（SVG 数据链路、审批流、营销任务流；Canvas 大量点位实验；D3 会员分层与渠道漏斗）；经营大屏已接入 SVG 数据链路与 Canvas 粒子背景
- D3 / X6 流程可视化：`/workflow-designer`（X6 拖拽连线、节点配置、流程 JSON 导出；审批流 / AI 营销任务流 / 数据接入链路模板）
- WebSocket / MQTT 实时数据：`/realtime-monitor`（Mock WebSocket 心跳、MQTT topic 订阅、订单流 / 库存预警 / 运营告警 / 导出任务 / 审批待办；AdminHeader 告警角标；报表导出 MQTT 完成通知；经营大屏实时订单滚动）
- AI 营销 Agent `/ai-agent`（任务配置、参数化 Prompt、结构化生成小红书 / 美团 / 店员文案与图片提示词；素材保存；审批 → 下发门店 → 效果追踪；Dashboard AI 建议一键跳转）
- 数据导入导出 `/data-import`（xlsx 模板下载、Excel 上传解析、Web Worker 解析、字段校验、错误行展示、确认导入；导出任务队列；小数据前端 Excel 导出；报表中心 / MQTT 导出通知联动）
- 权限与审批中心 `/approval`（RBAC 角色/菜单/按钮权限、`v-permission` 指令；审批待办；营销活动 / AI 内容 / 卡券 / 预算 / 库存审批流状态机；AI Agent 提交审批联动）
- Three.js / Cesium 3D 可视化 `/geo-3d`（Cesium 3D 地球、区域柱状体、门店点位聚合、订单飞线、点击经营浮层；Three.js 3D 指标卡 Demo；可视化实验室 / ECharts 地图入口联动）
- 可视化性能优化专题 `/performance-lab`（ECharts 实例复用与更新节流、虚拟滚动表格、Canvas 视口裁剪、Web Worker Excel 解析联动、Cesium 聚合与路由/Vite 分包策略）
- AI Coding 工作流沉淀 `/ai-coding`（六步闭环、通用/阶段 Prompt 模板、过程案例、审查清单、`.cursor/prompts` 与 `docs/09-ai-coding-workflow.md`）

本地启动：

```bash
npm install
npm run dev
```

构建验证：

```bash
npm run build
```

下一步：Electron 桌面端。


## 对外说明口径

该项目可以作为“独立项目 / 作品项目 / 技术实践项目”展示，表达为：

```text
基于餐饮连锁企业真实业务场景设计的 B 端运营平台，覆盖经营分析、报表中心、经营大屏、地图可视化、AI 营销和门店执行闭环。
```

不要虚构：

- 不写成某公司真实线上项目。
- 不写未经验证的真实用户数、门店数、营收提升等指标。
- 不使用原公司真实数据、客户名、门店名或内部截图。
