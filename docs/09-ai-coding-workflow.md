# AI Coding 工作流沉淀

## 1. 定位

本阶段不是「保存 AI 聊天记录」，而是沉淀**可复用的 AI 辅助开发方法论**，用于：

- 需求拆分与模块边界设计
- 代码初稿生成与人工审查
- Bug 定位、重构优化、测试验收
- 文档与面试讲法输出

对应产品页：`/ai-coding`  
对应 Cursor 模板：`.cursor/prompts/`

## 2. 六步闭环

```text
人工定义目标和边界
→ AI 拆分任务
→ AI 生成初稿
→ 人工审查业务和架构
→ AI 辅助重构
→ 人工验证 + AI 生成文档
```

| 步骤 | 负责人 | 产出 |
|------|--------|------|
| 定义边界 | 人工 | 阶段范围、不做什么、引用 docs |
| 需求拆分 | AI | 路由 / Store / 组件 / Mock / 验收项 |
| 代码初稿 | AI | 限定目录内的可运行代码 |
| 审查补边界 | 人工 | 架构、权限、性能、业务闭环 |
| 重构优化 | AI | 最小 diff、抽取复用、dispose |
| 验证沉淀 | 双方 | build、README、面试讲法 |

## 3. 如何启动一个阶段

标准 Prompt（也可在 `/ai-coding` 页面一键复制）：

```text
按 Dining Ops Platform 项目规则，开始第 X 阶段：[阶段名称]。

要求：
1. 先阅读 README.md 和 docs 中相关文档。
2. 只实现当前阶段，不提前实现后续模块。
3. 使用 Vue3 + Element Plus + Pinia + Vue Router。
4. 保持项目既定设计方案和技术路线。
5. 完成后说明：做了什么、Vue3 知识点、技术栈、如何验证、面试怎么讲。
```

模型选择见 [08-model-routing-and-confirmation.md](./08-model-routing-and-confirmation.md)。

## 4. Prompt 分类

| 类型 | 用途 | 推荐模型 |
|------|------|----------|
| 阶段启动 | 按 roadmap 实现单一阶段 | Composer 2.5 / 见阶段表 |
| 模块设计 | 组件边界、Store、Mock，不写代码 | GPT-5.5 |
| 代码生成 | 在既定结构内实现模块 | Composer 2.5 |
| 代码审查 | 规范、范围、性能、可面试性 | GPT-5.5 / Auto |
| Bug 定位 | 最小 diff 修复 | Auto → GPT-5.5 |
| 重构优化 | 性能、抽象、dispose | GPT-5.5 / Codex 5.3 |
| 测试验收 | 主流程 / 边界 / 联动清单 | GPT-5.4 Mini |
| 文档面试 | 业务价值 + 技术选型讲法 | GPT-5.4 Mini |

完整模板见 `src/constants/aiCodingWorkflow.js` 与 `.cursor/prompts/`。

## 5. 人工如何约束 AI

审查清单（每次合并前过一遍）：

**范围**

- 是否只实现当前阶段？
- 是否提前做了未规划模块？
- 是否改动无关文件？

**架构**

- 目录与命名是否符合约定？
- Store 职责是否单一？
- 组件是否可复用？

**业务**

- 是否保持餐饮运营主线（数据 → 分析 → 营销 → 审批 → 执行 → 追踪）？
- Mock 与模块跳转是否闭环？

**质量**

- 图表 / Canvas / Cesium dispose 是否完整？
- 权限与 `v-permission` 是否遗漏？
- `npm run build` 是否通过？

**表达**

- 能否 1 分钟讲清模块价值？
- 能否说明技术选型原因？
- 是否有可演示路径？

## 6. 本项目过程案例（摘要）

### 案例 A：realtime ref 解包（Phase 12）

- **现象**：`list.unshift is not a function`
- **人工约束**：只修 `pushToStream`，不改协议
- **结论**：Pinia 内存 ref 需 `.value` 操作
- **面试**：Composable / Store 返回 ref 时注意解包层级

### 案例 B：性能专题最小增量（Phase 17）

- **目标**：ECharts 节流、虚拟滚动、Canvas 视口裁剪
- **人工约束**：不引入 vxe-table；要可交互对比 Demo
- **落点**：`/performance-lab`、`utils/performance`、`manualChunks`
- **面试**：按报表 / 图表 / 文件 / 地图四类讲优化

### 案例 C：AI Agent 业务嵌入（Phase 13）

- **约束**：非独立聊天框；必须审批 → 下发 → 追踪
- **落点**：`/ai-agent` + `approval` 联动
- **面试**：Agent 是营销工作流节点，不是通用 LLM UI

## 7. 与 Cursor 工程化协作

项目已配置：

```text
.cursor/skills/dining-ops-platform/SKILL.md   # 阶段顺序、栈、面试输出格式
.cursor/rules/dining-ops-platform.mdc          # 持久规则
.cursor/prompts/                               # 可复用 Prompt 片段
```

推荐用法：

1. 新阶段：复制 `phase-start.md` 并填入阶段号
2. 复杂模块：先跑 `module-design.md`，人工确认后再 `code-implement.md`
3. 合并前：跑 `code-review.md` 对照审查清单

## 8. 面试怎么说

```text
我不是简单让 AI 生成代码，而是把 AI 用在需求拆解、模块设计、初稿生成、
代码审查、重构优化和文档沉淀中。每个阶段都有明确输入、边界和验收标准，
并用 /ai-coding 页面和 docs 沉淀方法论，保证 AI 产物能真正落地、能讲清楚。
```

## 9. 下一步

Phase 19：Electron 桌面端（Web 完成后的承载层，不改变核心架构）。
