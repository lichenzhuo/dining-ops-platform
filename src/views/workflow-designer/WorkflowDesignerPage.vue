<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { WORKFLOW_TEMPLATE_LIST } from '@/visualization/constants/x6Workflows'
import X6WorkflowDesigner from '@/visualization/x6/X6WorkflowDesigner.vue'

const activeTemplate = ref('approval')
const designerRef = ref()
const selectedNode = ref(null)
const graphJson = ref(null)

const currentTemplate = computed(() =>
  WORKFLOW_TEMPLATE_LIST.find((item) => item.key === activeTemplate.value),
)

function handleNodeSelect(node) {
  selectedNode.value = node
}

function handleGraphChange(json) {
  graphJson.value = json
}

function handleTemplateChange(key) {
  activeTemplate.value = key
  selectedNode.value = null
}

function handleLabelUpdate(label) {
  if (!selectedNode.value) {
    return
  }
  designerRef.value?.updateSelectedNodeLabel(label)
  selectedNode.value = { ...selectedNode.value, label }
}

function handleExportJson() {
  const json = designerRef.value?.exportGraphJson()
  if (!json) {
    return
  }
  navigator.clipboard.writeText(JSON.stringify(json, null, 2))
  ElMessage.success('流程 JSON 已复制到剪贴板')
}
</script>

<template>
  <div class="workflow-designer-page">
    <header class="workflow-designer-page__header">
      <div>
        <h2>流程设计器</h2>
        <p>X6 画布 · 节点拖拽 · 连线编排 · 流程 JSON 导出 · 服务审批流与 AI 营销任务流</p>
      </div>
      <el-button type="primary" @click="handleExportJson">导出流程 JSON</el-button>
    </header>

    <section class="workflow-designer-page__layout">
      <aside class="panel-card workflow-designer-page__templates">
        <h3>流程模板</h3>
        <button
          v-for="item in WORKFLOW_TEMPLATE_LIST"
          :key="item.key"
          type="button"
          class="template-item"
          :class="{ 'template-item--active': activeTemplate === item.key }"
          @click="handleTemplateChange(item.key)"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.description }}</span>
        </button>
      </aside>

      <main class="workflow-designer-page__canvas">
        <div class="canvas-toolbar">
          <span>{{ currentTemplate?.label }}</span>
          <em>Ctrl / ⌘ + 滚轮缩放 · 拖拽节点 · 从连接桩连线</em>
        </div>
        <X6WorkflowDesigner
          ref="designerRef"
          :template-key="activeTemplate"
          @node-select="handleNodeSelect"
          @graph-change="handleGraphChange"
        />
      </main>

      <aside class="panel-card workflow-designer-page__sidebar">
        <h3>节点配置</h3>
        <template v-if="selectedNode">
          <el-form label-position="top">
            <el-form-item label="节点 ID">
              <el-input :model-value="selectedNode.id" disabled />
            </el-form-item>
            <el-form-item label="节点名称">
              <el-input
                :model-value="selectedNode.label"
                @update:model-value="handleLabelUpdate"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-tag size="small">{{ selectedNode.data?.status ?? 'idle' }}</el-tag>
            </el-form-item>
          </el-form>
        </template>
        <el-empty v-else description="点击画布中的节点进行配置" :image-size="72" />

        <h3 class="workflow-designer-page__json-title">流程 JSON 预览</h3>
        <pre class="json-preview">{{ graphJson ? JSON.stringify(graphJson, null, 2) : '加载中…' }}</pre>
      </aside>
    </section>
  </div>
</template>

<style scoped lang="scss">
.workflow-designer-page {
  display: grid;
  gap: 16px;

  &__header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: $text-primary;
    }

    p {
      margin: 6px 0 0;
      font-size: 13px;
      color: $text-tertiary;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr) 300px;
    gap: 16px;
    min-height: 620px;
  }

  &__templates {
    display: grid;
    gap: 10px;
    align-content: start;
  }

  &__canvas {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 10px;
    min-height: 620px;
  }

  &__sidebar {
    display: grid;
    gap: 12px;
    align-content: start;
  }

  &__json-title {
    margin: 8px 0 0;
  }
}

.panel-card {
  padding: 16px 18px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;

  h3 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

.template-item {
  display: grid;
  gap: 4px;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  background: $bg-page;
  border: 1px solid $border-light;
  border-radius: $radius-base;

  strong {
    font-size: 13px;
    color: $text-primary;
  }

  span {
    font-size: 12px;
    line-height: 1.5;
    color: $text-tertiary;
  }

  &--active {
    background: $color-primary-light;
    border-color: rgba(19, 194, 194, 0.45);
  }
}

.canvas-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 13px;
  color: $text-primary;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-base;

  em {
    font-style: normal;
    font-size: 12px;
    color: $text-tertiary;
  }
}

.json-preview {
  max-height: 260px;
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  font-size: 11px;
  line-height: 1.5;
  color: $text-secondary;
  background: $bg-page;
  border-radius: $radius-base;
}

@media (max-width: 1200px) {
  .workflow-designer-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
