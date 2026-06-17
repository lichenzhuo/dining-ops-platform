---
name: dining-ops-platform
description: Guides development, documentation, learning, and interview preparation for the Dining Ops Platform project. Use when working in dining-ops-platform, implementing project phases, updating docs, planning features, preparing resume content, or discussing Vue3, reports, dashboards, visualization, AI Agent, Electron, and job-aligned learning for this project.
---

# Dining Ops Platform Skill

## Purpose

Use this skill for all work related to `dining-ops-platform`.

The project is not a simple餐饮后台. It is a job-aligned learning project:

```text
Vue3 企业级中后台
+ 原生报表中心
+ ECharts 大屏
+ SVG / Canvas / D3 / X6
+ Three.js / Cesium
+ WebSocket / MQTT
+ AI Agent
+ AI Coding
+ Electron
```

## Read First

Before planning or coding, read the relevant docs:

- `README.md`
- `docs/01-product-design.md`
- `docs/02-technical-architecture.md`
- `docs/03-development-roadmap.md`
- `docs/04-job-aligned-learning-plan.md`
- `docs/05-resume-and-interview-guide.md`
- `docs/10-phase-completion-audit.md`（Phase 1–18 自检与已知差距）

For design-related work, also inspect images under `docs/assets/`.

## Core Rules

- Use Vue3 + Vite + TypeScript + Element Plus + Pinia + Vue Router as the main stack.
- Do not reduce the planned technical stack unless the user explicitly asks.
- Keep business context tied to餐饮连锁运营: POS、外卖、CRM、库存、财务、营销、卡券、会员、门店、审批、报表。
- Build in phases from `docs/03-development-roadmap.md`; do not generate the whole system at once.
- Each coding phase must include: what was built, Vue3 knowledge points, technical stack used, verification, and interview talking points.
- Prefer original Vue report pages over iframe reports. Iframe is only for external BI compatibility.
- Treat AI Agent as a business workflow, not a standalone chat box.
- Treat Cesium/Three.js as visualization modules, not replacements for normal B-end pages.
- Keep Electron as a later wrapper around the Web system.
- Before entering any coding phase, recommend a model and ask for confirmation if the user wants to use the recommended model or choose another one.
- Default model guidance:
  - Planning / docs / learning explanations: GPT-5.4 Mini
  - Day-to-day coding / layout / components / standard phases: Composer 2.5
  - Unclear bug severity or uncertain task complexity: Auto
  - Cross-file refactor, complex report logic, performance work, AI Agent implementation: GPT-5.5 or Codex 5.3
  - 3D / Cesium / WebGL / hard visualization tasks: GPT-5.5, Codex 5.3, or Opus 4.8 for the hardest cases
- When recommending a model, keep the explanation short and practical: why this model, what it is good at, and what trade-off the user is making.

## Development Phase Template

When the user asks to implement a phase, follow this flow:

1. Confirm the phase from `docs/03-development-roadmap.md`.
2. Read related product and technical docs.
3. Recommend the model for this phase and ask for a quick confirmation if the user wants the recommended model or another one.
4. Explain the phase goal in 1-2 sentences.
5. Implement only the requested phase after confirmation.
6. After implementation, summarize:
   - 完成了什么
   - 涉及的 Vue3 知识点
   - 涉及的技术栈
   - 如何验证
   - 面试怎么讲
7. If useful, update docs with new decisions.

## Preferred Phase Order

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

## User Prompt Shortcut

The user can say:

```text
按 Dining Ops Platform 项目规则，开始第 X 阶段。
```

Then apply this skill, read the docs, recommend a model, ask for confirmation, and proceed with the matching phase after the user chooses.
