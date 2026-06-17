<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  AI_CODING_CASE_RECORDS,
  AI_CODING_DOC_LINKS,
  AI_CODING_GENERIC_PROMPTS,
  AI_CODING_PROMPT_CATEGORIES,
  AI_CODING_REVIEW_CHECKLIST,
  AI_CODING_WORKFLOW_STEPS,
  PHASE_PROMPT_TEMPLATES,
} from '@/constants/aiCodingWorkflow'

const activeTab = ref('workflow')
const promptCategory = ref('all')
const selectedPhase = ref(PHASE_PROMPT_TEMPLATES[0]?.phase ?? 1)

const categoryMap = computed(() =>
  Object.fromEntries(AI_CODING_PROMPT_CATEGORIES.map((item) => [item.key, item.label])),
)

const filteredGenericPrompts = computed(() => {
  if (promptCategory.value === 'all') {
    return AI_CODING_GENERIC_PROMPTS
  }
  return AI_CODING_GENERIC_PROMPTS.filter((item) => item.category === promptCategory.value)
})

const selectedPhaseTemplate = computed(() =>
  PHASE_PROMPT_TEMPLATES.find((item) => item.phase === selectedPhase.value),
)

const caseCategoryLabel = {
  phase: '阶段启动',
  design: '模块设计',
  code: '代码生成',
  review: '代码审查',
  bug: 'Bug 修复',
  refactor: '重构优化',
  test: '测试用例',
  doc: '文档面试',
}

async function copyText(text, label = 'Prompt') {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${label} 已复制到剪贴板`)
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

function ownerLabel(owner) {
  if (owner === 'human') return '人工'
  if (owner === 'ai') return 'AI'
  return '协作'
}

function ownerTagType(owner) {
  if (owner === 'human') return 'warning'
  if (owner === 'ai') return 'primary'
  return 'success'
}
</script>

<template>
  <div class="ai-coding">
    <header class="ai-coding__header">
      <div>
        <h2>AI Coding 工作流沉淀</h2>
        <p>
          记录本项目如何用 AI 辅助开发：不是保存聊天记录，而是沉淀可复用的需求拆分、模块设计、
          代码审查与面试表达方法论。每个阶段有明确输入、边界与验收标准。
        </p>
      </div>
      <el-tag type="info" effect="plain">Cursor · Prompt · Code Review</el-tag>
    </header>

    <el-tabs v-model="activeTab" class="ai-coding__tabs">
      <el-tab-pane label="工作流总览" name="workflow">
        <section class="ai-coding__section">
          <div class="workflow-steps">
            <article
              v-for="(step, index) in AI_CODING_WORKFLOW_STEPS"
              :key="step.key"
              class="workflow-step panel-card"
            >
              <div class="workflow-step__index">{{ index + 1 }}</div>
              <div class="workflow-step__body">
                <div class="workflow-step__title">
                  <h4>{{ step.title }}</h4>
                  <el-tag size="small" :type="ownerTagType(step.owner)">
                    {{ ownerLabel(step.owner) }}
                  </el-tag>
                </div>
                <p>{{ step.desc }}</p>
              </div>
            </article>
          </div>
        </section>

        <section class="ai-coding__section">
          <h3>相关文档</h3>
          <div class="doc-links">
            <article v-for="doc in AI_CODING_DOC_LINKS" :key="doc.path" class="panel-card doc-link">
              <h4>{{ doc.title }}</h4>
              <code>{{ doc.path }}</code>
            </article>
          </div>
        </section>
      </el-tab-pane>

      <el-tab-pane label="Prompt 模板" name="prompts">
        <section class="ai-coding__section">
          <div class="section-head">
            <h3>通用模板</h3>
            <el-radio-group v-model="promptCategory" size="small">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button
                v-for="cat in AI_CODING_PROMPT_CATEGORIES"
                :key="cat.key"
                :value="cat.key"
              >
                {{ cat.label }}
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="prompt-grid">
            <article v-for="item in filteredGenericPrompts" :key="item.key" class="panel-card prompt-card">
              <div class="prompt-card__head">
                <div>
                  <el-tag size="small">{{ categoryMap[item.category] }}</el-tag>
                  <h4>{{ item.title }}</h4>
                </div>
                <el-button size="small" type="primary" plain @click="copyText(item.prompt, item.title)">
                  复制
                </el-button>
              </div>
              <p class="prompt-card__model">推荐模型：{{ item.model }}</p>
              <pre class="prompt-card__body">{{ item.prompt }}</pre>
            </article>
          </div>
        </section>

        <section class="ai-coding__section">
          <div class="section-head">
            <h3>阶段 Prompt（路线图对齐）</h3>
            <el-select v-model="selectedPhase" style="width: 220px">
              <el-option
                v-for="item in PHASE_PROMPT_TEMPLATES"
                :key="item.phase"
                :label="`第 ${item.phase} 阶段 · ${item.name}`"
                :value="item.phase"
              />
            </el-select>
          </div>

          <article v-if="selectedPhaseTemplate" class="panel-card phase-template">
            <div class="phase-template__head">
              <div>
                <h4>
                  第 {{ selectedPhaseTemplate.phase }} 阶段 · {{ selectedPhaseTemplate.name }}
                </h4>
                <p>
                  推荐模型：{{ selectedPhaseTemplate.model }}
                  <span v-if="selectedPhaseTemplate.route">
                    · 路由 {{ selectedPhaseTemplate.route }}
                  </span>
                </p>
              </div>
              <el-button
                type="primary"
                @click="copyText(selectedPhaseTemplate.prompt, selectedPhaseTemplate.name)"
              >
                复制阶段 Prompt
              </el-button>
            </div>

            <pre class="prompt-card__body">{{ selectedPhaseTemplate.prompt }}</pre>

            <div class="phase-template__meta">
              <div>
                <h5>输入</h5>
                <ul>
                  <li v-for="line in selectedPhaseTemplate.inputs" :key="line">{{ line }}</li>
                </ul>
              </div>
              <div>
                <h5>输出</h5>
                <ul>
                  <li v-for="line in selectedPhaseTemplate.outputs" :key="line">{{ line }}</li>
                </ul>
              </div>
              <div>
                <h5>验收</h5>
                <ul>
                  <li v-for="line in selectedPhaseTemplate.acceptance" :key="line">{{ line }}</li>
                </ul>
              </div>
            </div>
          </article>
        </section>
      </el-tab-pane>

      <el-tab-pane label="过程案例" name="cases">
        <section class="ai-coding__section">
          <p class="section-desc">
            以下案例提炼「人工如何约束 AI」，便于面试表达；完整说明见
            <code>docs/09-ai-coding-workflow.md</code>。
          </p>
          <div class="case-grid">
            <article v-for="item in AI_CODING_CASE_RECORDS" :key="item.id" class="panel-card case-card">
              <div class="case-card__head">
                <el-tag size="small">Phase {{ item.phase }}</el-tag>
                <el-tag size="small" type="info">{{ caseCategoryLabel[item.category] }}</el-tag>
              </div>
              <h4>{{ item.title }}</h4>
              <p class="case-card__summary">{{ item.summary }}</p>

              <div class="case-card__block">
                <h5>人工约束</h5>
                <ul>
                  <li v-for="line in item.humanConstraints" :key="line">{{ line }}</li>
                </ul>
              </div>
              <div class="case-card__block">
                <h5>AI 产出 / 修复</h5>
                <p>{{ item.aiOutput }}</p>
              </div>
              <div class="case-card__block">
                <h5>验证</h5>
                <p>{{ item.verification }}</p>
              </div>
              <div class="case-card__block case-card__block--interview">
                <h5>面试讲法</h5>
                <p>{{ item.interview }}</p>
              </div>
            </article>
          </div>
        </section>
      </el-tab-pane>

      <el-tab-pane label="审查清单" name="checklist">
        <section class="ai-coding__section">
          <p class="section-desc">
            每次让 AI 改代码或合并前，用此清单做人工审查。也可将
            <code>.cursor/prompts/code-review.md</code> 发给 AI 做辅助审查。
          </p>
          <div class="checklist-grid">
            <article
              v-for="group in AI_CODING_REVIEW_CHECKLIST"
              :key="group.group"
              class="panel-card checklist-card"
            >
              <h4>{{ group.group }}</h4>
              <ul class="checklist-card__list">
                <li v-for="item in group.items" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>
        </section>

        <section class="ai-coding__section">
          <article class="panel-card interview-card">
            <h4>面试标准表达</h4>
            <pre class="interview-card__text">我不是简单让 AI 生成代码，而是把 AI 用在需求拆解、模块设计、初稿生成、
代码审查、重构优化和文档沉淀中。每个阶段都有明确输入、边界和验收标准，
并用 /ai-coding 与 docs 沉淀方法论，保证 AI 产物能真正落地。</pre>
            <el-button type="primary" plain @click="copyText(`我不是简单让 AI 生成代码，而是把 AI 用在需求拆解、模块设计、初稿生成、代码审查、重构优化和文档沉淀中。每个阶段都有明确输入、边界和验收标准，保证 AI 产物能真正落地。`, '面试讲法')">
              复制面试讲法
            </el-button>
          </article>
        </section>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.ai-coding {
  display: grid;
  gap: 20px;
  padding-bottom: 24px;

  &__header {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    h2 {
      margin: 0 0 8px;
      font-size: 22px;
      font-weight: 600;
      color: $text-primary;
    }

    p {
      max-width: 760px;
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: $text-secondary;
    }
  }

  &__section {
    display: grid;
    gap: 12px;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  &__tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 16px;
    }
  }
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.section-desc {
  margin: 0;
  font-size: 13px;
  color: $text-tertiary;

  code {
    font-size: 12px;
  }
}

.panel-card {
  padding: 18px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.workflow-steps {
  display: grid;
  gap: 12px;
}

.workflow-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  &__index {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: $color-primary;
    background: rgba(19, 194, 194, 0.12);
    border-radius: 50%;
  }

  &__title {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 6px;

    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: $text-secondary;
  }
}

.doc-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;

  h4 {
    margin: 0 0 8px;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }

  code {
    font-size: 12px;
    color: $text-tertiary;
    word-break: break-all;
  }
}

.prompt-grid,
.case-grid,
.checklist-grid {
  display: grid;
  gap: 16px;
}

.prompt-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.case-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.checklist-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.prompt-card {
  &__head {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 8px;

    h4 {
      margin: 6px 0 0;
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  &__model {
    margin: 0 0 8px;
    font-size: 12px;
    color: $text-tertiary;
  }

  &__body {
    margin: 0;
    padding: 12px;
    overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.55;
    color: $text-secondary;
    white-space: pre-wrap;
    background: $bg-page;
    border-radius: $radius-base;
  }
}

.phase-template {
  &__head {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;

    h4 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
    }

    p {
      margin: 0;
      font-size: 13px;
      color: $text-tertiary;
    }
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-top: 16px;

    h5 {
      margin: 0 0 8px;
      font-size: 13px;
      font-weight: 600;
      color: $text-primary;
    }

    ul {
      margin: 0;
      padding-left: 18px;
      font-size: 13px;
      line-height: 1.6;
      color: $text-secondary;
    }
  }
}

.case-card {
  &__head {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  h4 {
    margin: 0 0 8px;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }

  &__summary {
    margin: 0 0 12px;
    font-size: 13px;
    color: $text-secondary;
  }

  &__block {
    margin-bottom: 10px;

    h5 {
      margin: 0 0 4px;
      font-size: 12px;
      font-weight: 600;
      color: $text-tertiary;
    }

    p,
    ul {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      color: $text-secondary;
    }

    ul {
      padding-left: 18px;
    }

    &--interview {
      padding-top: 8px;
      border-top: 1px dashed $border-light;

      p {
        color: $color-primary;
      }
    }
  }
}

.checklist-card {
  h4 {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }

  &__list {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
    line-height: 1.65;
    color: $text-secondary;
  }
}

.interview-card {
  h4 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }

  &__text {
    margin: 0 0 12px;
    padding: 14px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.65;
    color: $text-secondary;
    white-space: pre-wrap;
    background: $bg-page;
    border-radius: $radius-base;
  }
}
</style>
