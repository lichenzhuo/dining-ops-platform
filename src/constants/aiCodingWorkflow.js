/** AI Coding 工作流：六步闭环 */
export const AI_CODING_WORKFLOW_STEPS = [
  {
    key: 'define',
    title: '人工定义目标与边界',
    desc: '明确阶段范围、技术栈约束、不做什么；引用 README 与 docs。',
    owner: 'human',
  },
  {
    key: 'split',
    title: 'AI 辅助需求拆分',
    desc: '把阶段拆成路由、Store、组件、Mock、验收项等可执行任务。',
    owner: 'ai',
  },
  {
    key: 'draft',
    title: 'AI 生成代码初稿',
    desc: '在既定目录结构内生成页面与模块，不提前实现后续阶段。',
    owner: 'ai',
  },
  {
    key: 'review',
    title: '人工审查与补边界',
    desc: '检查架构偏离、权限遗漏、性能隐患、Mock 与业务闭环。',
    owner: 'human',
  },
  {
    key: 'refine',
    title: 'AI 辅助重构优化',
    desc: '抽取复用组件、补 dispose、节流、类型与错误处理。',
    owner: 'ai',
  },
  {
    key: 'verify',
    title: '验证与文档沉淀',
    desc: 'build 验证、更新 README；整理 Vue3 知识点与面试讲法。',
    owner: 'both',
  },
]

/** Prompt 分类 */
export const AI_CODING_PROMPT_CATEGORIES = [
  { key: 'phase', label: '阶段启动', icon: 'Flag' },
  { key: 'design', label: '模块设计', icon: 'SetUp' },
  { key: 'code', label: '代码生成', icon: 'EditPen' },
  { key: 'review', label: '代码审查', icon: 'View' },
  { key: 'bug', label: 'Bug 定位', icon: 'Warning' },
  { key: 'refactor', label: '重构优化', icon: 'Refresh' },
  { key: 'test', label: '测试用例', icon: 'CircleCheck' },
  { key: 'doc', label: '文档 / 面试', icon: 'Document' },
]

/** 通用 Prompt 模板 */
export const AI_CODING_GENERIC_PROMPTS = [
  {
    key: 'phase-start',
    category: 'phase',
    title: '阶段启动（标准）',
    model: '见 docs/08 阶段推荐表',
    prompt: `按 Dining Ops Platform 项目规则，开始第 X 阶段：[阶段名称]。

要求：
1. 先阅读 README.md 和 docs 中相关文档。
2. 只实现当前阶段，不提前实现后续模块。
3. 使用 Vue3 + Element Plus + Pinia + Vue Router。
4. 保持项目既定设计方案和技术路线。
5. 完成后说明：做了什么、Vue3 知识点、技术栈、如何验证、面试怎么讲。`,
  },
  {
    key: 'module-design',
    category: 'design',
    title: '模块设计与组件边界',
    model: 'GPT-5.5 / Codex 5.3（复杂模块）',
    prompt: `按 Dining Ops Platform 项目规则，为 [模块名] 做模块设计，不要写代码。

请输出：
1. 页面路由与布局（admin / screen / blank）
2. 组件拆分（页面 / 业务组件 / 通用组件）
3. Pinia Store 职责与状态字段
4. Mock 数据结构
5. 与已有模块的联动点
6. 明确不实现的边界

约束：不更换技术栈，不删除已有 docs 约束。`,
  },
  {
    key: 'code-gen',
    category: 'code',
    title: '模块代码实现',
    model: 'Composer 2.5（常规模块）',
    prompt: `按 Dining Ops Platform 项目规则，实现 [模块名]。

边界：
- 不实现未规划模块
- 不随意更换技术栈
- 组件要可复用，匹配现有命名与目录
- 完成后补充学习点和面试话术

请先阅读 src 下同类页面的实现风格再动手。`,
  },
  {
    key: 'code-review',
    category: 'review',
    title: '代码审查',
    model: 'GPT-5.5 / Auto',
    prompt: `按 Dining Ops Platform 项目规则，审查当前 [模块/阶段] 实现。

重点检查：
1. 是否符合 Vue3 + Element Plus 项目规范
2. 是否偏离当前阶段目标或提前实现未来模块
3. 是否有可复用组件抽象
4. 是否有性能隐患（图表、表格、Canvas、路由分包）
5. 权限、Mock、dispose 是否遗漏
6. 是否能在面试中讲清楚业务闭环`,
  },
  {
    key: 'bug-fix',
    category: 'bug',
    title: 'Bug 定位与修复',
    model: 'Auto → GPT-5.5（复杂根因）',
    prompt: `按 Dining Ops Platform 项目规则，修复以下问题：[现象描述]。

请：
1. 先定位根因（相关文件与调用链）
2. 用最小 diff 修复，不重构无关代码
3. 说明复现步骤与验证方式
4. 如涉及 ref/响应式/生命周期，补充 Vue3 知识点`,
  },
  {
    key: 'refactor',
    category: 'refactor',
    title: '重构与性能优化',
    model: 'GPT-5.5 / Codex 5.3',
    prompt: `按 Dining Ops Platform 项目规则，优化 [模块/场景] 的性能或结构。

目标：[如 ECharts 节流 / 虚拟滚动 / Worker 解析]
约束：最小范围改动，保持现有 API 与页面行为
输出：改动说明、优化前后对比、面试讲法`,
  },
  {
    key: 'test-case',
    category: 'test',
    title: '测试用例与验收清单',
    model: 'GPT-5.4 Mini / Composer 2.5',
    prompt: `按 Dining Ops Platform 项目规则，为 [模块名] 生成验收清单。

包含：
1. 主流程用例（正常路径）
2. 边界用例（空数据、无权限、加载失败）
3. 联动用例（与其他模块跳转 / Store）
4. 手动验证步骤（无需引入测试框架除非项目已有）`,
  },
  {
    key: 'interview',
    category: 'doc',
    title: '面试讲法生成',
    model: 'GPT-5.4 Mini',
    prompt: `按 Dining Ops Platform 项目规则，讲解 [阶段/模块] 的面试表达。

请结合餐饮连锁业务场景说明：
1. 解决什么业务问题
2. 为什么选这个技术
3. 和替代方案的区别
4. 项目里怎么用（具体路径/组件）
5. 面试官可能怎么问，我应该怎么答`,
  },
]

/** 各阶段 Prompt 与验收（与 roadmap 对齐） */
export const PHASE_PROMPT_TEMPLATES = [
  {
    phase: 1,
    name: '项目初始化',
    model: 'Composer 2.5',
    route: null,
    prompt: '按 Dining Ops Platform 项目规则，开始第 1 阶段：项目初始化。搭建 Vue3 + Vite + Element Plus + Pinia + Vue Router 基础工程。',
    inputs: ['docs/02-technical-architecture.md', 'README.md'],
    outputs: ['vite.config.js', 'src/main.js', '目录结构'],
    acceptance: ['npm run dev 可启动', 'SCSS 变量注入', '路径别名 @'],
  },
  {
    phase: 5,
    name: 'Dashboard',
    model: 'Composer 2.5',
    route: '/dashboard',
    prompt: '按 Dining Ops Platform 项目规则，开始第 5 阶段：经营工作台 Dashboard。KPI 卡片、趋势图、渠道图、审批待办、AI 建议入口。',
    inputs: ['docs/01-product-design.md Dashboard 章节', '已有 Layout'],
    outputs: ['DashboardPage', 'KpiCardRow', '各 Chart Panel'],
    acceptance: ['筛选联动 Mock', '图表可点击', '路由可访问'],
  },
  {
    phase: 6,
    name: '报表中心',
    model: 'GPT-5.5 / Codex 5.3',
    route: '/reports',
    prompt: '按 Dining Ops Platform 项目规则，开始第 6 阶段：原生报表中心。分类树、筛选、字段配置、保存视图、下钻、导出。',
    inputs: ['docs/01-product-design.md 报表章节'],
    outputs: ['ReportsPage', 'reports store', 'Mock 报表数据'],
    acceptance: ['服务端分页', '下钻跳转', '字段配置持久化'],
  },
  {
    phase: 13,
    name: 'AI 营销 Agent',
    model: 'GPT-5.5 / Codex 5.3',
    route: '/ai-agent',
    prompt: '按 Dining Ops Platform 项目规则，开始第 13 阶段：AI 营销 Agent。任务配置、结构化生成、素材保存、审批下发、效果追踪。',
    inputs: ['营销业务闭环 docs', 'approval store'],
    outputs: ['AiAgentPage', 'aiAgent store'],
    acceptance: ['非纯聊天框', '可提交审批', 'Dashboard 可跳转'],
  },
  {
    phase: 15,
    name: '权限与审批',
    model: 'GPT-5.5',
    route: '/approval',
    prompt: '按 Dining Ops Platform 项目规则，开始第 15 阶段：RBAC 菜单/按钮权限、v-permission、审批中心状态机。',
    inputs: ['constants/permissions.js', 'mocks/auth.js'],
    outputs: ['ApprovalCenterPage', 'v-permission 指令'],
    acceptance: ['三角色菜单差异', '按钮级权限', 'AI Agent 联动'],
  },
  {
    phase: 17,
    name: '可视化性能优化',
    model: 'GPT-5.5 / Codex 5.3',
    route: '/performance-lab',
    prompt: '按 Dining Ops Platform 项目规则，开始第 17 阶段：可视化性能优化专题。ECharts 节流、虚拟滚动、Canvas 视口裁剪、Vite 分包。',
    inputs: ['BaseChart.vue', 'CanvasStorePointsDemo'],
    outputs: ['/performance-lab', 'utils/performance', 'manualChunks'],
    acceptance: ['build 通过', 'Demo 可对比', 'README 更新'],
  },
  {
    phase: 18,
    name: 'AI Coding 工作流沉淀',
    model: 'GPT-5.4 Mini',
    route: '/ai-coding',
    prompt: '按 Dining Ops Platform 项目规则，开始第 18 阶段：AI Coding 工作流沉淀。Prompt 模板、过程案例、审查清单、文档索引。',
    inputs: ['docs/06', 'docs/08', 'docs/01 §14'],
    outputs: ['/ai-coding', 'docs/09-ai-coding-workflow.md', '.cursor/prompts'],
    acceptance: ['Prompt 可复制', '方法论可面试表达', '不仅存聊天记录'],
  },
  {
    phase: 19,
    name: 'Electron 桌面端',
    model: 'Composer 2.5',
    route: null,
    prompt: '按 Dining Ops Platform 项目规则，开始第 19 阶段：Electron。Web 完成后接入，全屏大屏、本地导出、桌面通知。',
    inputs: ['完整 Web 系统', 'large-screen 路由'],
    outputs: ['electron 主进程', 'preload', '打包配置'],
    acceptance: ['不改变 Web 架构', '大屏全屏可用'],
  },
]

/** 人工约束 AI 的审查清单 */
export const AI_CODING_REVIEW_CHECKLIST = [
  { group: '范围', items: ['是否只实现当前阶段', '是否提前做了 Electron/Cesium 等后续模块', '是否改动无关文件'] },
  { group: '架构', items: ['目录与命名是否符合现有约定', 'Store 职责是否单一', '组件是否可复用'] },
  { group: '业务', items: ['是否保持餐饮连锁运营主线', 'Mock 数据是否合理', '模块间跳转是否闭环'] },
  { group: '质量', items: ['图表/Canvas dispose 是否完整', '权限与 v-permission 是否遗漏', 'build 是否通过'] },
  { group: '表达', items: ['能否用 1 分钟讲清模块价值', '能否说明技术选型原因', '是否有可演示路径'] },
]

/** 本项目真实过程案例（沉淀方法论，非 raw 聊天记录） */
export const AI_CODING_CASE_RECORDS = [
  {
    id: 'case-realtime-ref',
    phase: 12,
    category: 'bug',
    title: 'realtime store：ref 上直接 unshift',
    summary: 'WebSocket 推送时报 list.unshift is not a function。',
    humanConstraints: [
      '只修 pushToStream，不改 Mock 协议',
      '保持 stream 数据结构与其他消费者一致',
    ],
    aiOutput: '改为操作 listRef.value，非数组时重置为 []。',
    verification: '实时监测页推送正常，build 通过。',
    interview: 'Pinia 里若存 ref，取值要用 .value；Composable 返回 ref 时注意解包层级。',
  },
  {
    id: 'case-perf-17',
    phase: 17,
    category: 'refactor',
    title: '性能专题：节流与虚拟滚动',
    summary: '在已有 BaseChart 与 Canvas Demo 上叠加优化，而非重写图表库。',
    humanConstraints: [
      '最小 diff，不引入 vxe-table',
      '性能页要可交互对比，不是纯文档',
    ],
    aiOutput: 'throttle 工具、BaseChart lazyUpdate、VirtualScrollTable、manualChunks。',
    verification: '/performance-lab 高频推送对比 setOption 次数；5000 行虚拟表格滚动。',
    interview: '分报表/图表/文件/地图四类讲优化策略，每类有具体落点路径。',
  },
  {
    id: 'case-ai-agent',
    phase: 13,
    category: 'design',
    title: 'AI Agent 嵌入营销闭环',
    summary: '拒绝做成独立聊天框，必须串联审批与门店下发。',
    humanConstraints: [
      '左侧任务配置 + 中间生成区 + 右侧经营辅助',
      '生成结果结构化：小红书/美团/店员文案',
      '必须能提交审批并追踪效果',
    ],
    aiOutput: 'aiAgent store 状态机、AgentTaskForm、与 approval 联动。',
    verification: '从 Dashboard AI 建议跳转；提交后在审批中心可见。',
    interview: 'Agent 是业务工作流节点，输入经营上下文，输出可执行营销素材。',
  },
  {
    id: 'case-permission',
    phase: 15,
    category: 'review',
    title: '三角色权限验收',
    summary: 'admin / region / store 菜单与按钮权限差异化。',
    humanConstraints: [
      'region 无 visualization-lab、ai-agent、workflow-designer',
      'store 仅 dashboard、reports、approval',
      'v-permission 与菜单过滤双重保障',
    ],
    aiOutput: 'permissions.js 角色矩阵、filterMenuGroups、指令隐藏按钮。',
    verification: '切换 Mock 账号看菜单与导出按钮差异。',
    interview: 'RBAC 分菜单权限与按钮权限；路由守卫 + 指令 + Store 三层。',
  },
]

/** 相关文档链接 */
export const AI_CODING_DOC_LINKS = [
  { title: '阶段完成度自检（Phase 1–18）', path: 'docs/10-phase-completion-audit.md' },
  { title: 'AI 使用方式总览', path: 'docs/06-project-overview-and-ai-usage.md' },
  { title: '模型路由与二次确认', path: 'docs/08-model-routing-and-confirmation.md' },
  { title: 'AI Coding 工作流（本阶段文档）', path: 'docs/09-ai-coding-workflow.md' },
  { title: '开发路线图', path: 'docs/03-development-roadmap.md' },
  { title: 'Cursor Skill', path: '.cursor/skills/dining-ops-platform/SKILL.md' },
  { title: 'Cursor Rules', path: '.cursor/rules/dining-ops-platform.mdc' },
]
