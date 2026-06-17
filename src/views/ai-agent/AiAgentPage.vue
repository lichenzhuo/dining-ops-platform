<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useAiAgentStore } from '@/stores/aiAgent'
import AgentGenerateWorkspace from './components/AgentGenerateWorkspace.vue'
import AgentInsightPanel from './components/AgentInsightPanel.vue'
import AgentTaskForm from './components/AgentTaskForm.vue'
import AgentWorkflowSteps from './components/AgentWorkflowSteps.vue'

const route = useRoute()
const aiAgentStore = useAiAgentStore()

const {
  taskForm,
  workflowStatus,
  workflowStep,
  generating,
  loadingInsight,
  activeContent,
  storeInsights,
  savedMaterials,
  approvalRecord,
  dispatchRecord,
  trackingData,
  canSave,
  canSubmitApproval,
  canDispatch,
  canTrack,
} = storeToRefs(aiAgentStore)

onMounted(async () => {
  aiAgentStore.initFromOrg()
  if (route.query.suggestion) {
    aiAgentStore.applySuggestion(String(route.query.suggestion))
  }
  await aiAgentStore.loadInsights()
})

watch(
  () => aiAgentStore.query,
  () => {
    aiAgentStore.loadInsights()
  },
  { deep: true },
)

async function handleGenerate() {
  const result = await aiAgentStore.generate()
  if (result) {
    ElMessage.success('AI 营销方案已生成')
  }
}

function handleSave() {
  const material = aiAgentStore.saveMaterial()
  if (material) {
    ElMessage.success('已保存至素材库')
  }
}

async function handleSubmitApproval() {
  await aiAgentStore.submitApproval()
  ElMessage.success('已提交审批，等待区域负责人审核')
}

async function handleDispatch() {
  const record = await aiAgentStore.dispatchToStores()
  if (record) {
    ElMessage.success(`已下发至 ${record.storeCount} 家门店`)
  }
}

async function handleTrack() {
  const data = await aiAgentStore.loadTracking()
  if (data) {
    ElMessage.success('效果数据已更新')
  }
}

function handleReset() {
  aiAgentStore.resetTask(aiAgentStore.query)
  ElMessage.info('已重置当前任务')
}
</script>

<template>
  <div class="ai-agent-page">
    <header class="ai-agent-page__header">
      <div>
        <h2>AI 营销 Agent</h2>
        <p>嵌入餐饮营销流程 · 参数化 Prompt · 结构化生成 · 素材 → 审批 → 下发 → 复盘</p>
      </div>
      <div class="ai-agent-page__actions">
        <el-button @click="handleReset">重置任务</el-button>
        <el-button :disabled="!canSave" @click="handleSave">保存素材</el-button>
        <el-button
          v-if="taskForm.approvalRequired"
          type="warning"
          :disabled="!canSubmitApproval"
          @click="handleSubmitApproval"
        >
          提交审批
        </el-button>
        <el-button type="primary" :disabled="!canDispatch" @click="handleDispatch">
          下发门店
        </el-button>
        <el-button type="success" :disabled="!canTrack" @click="handleTrack">
          追踪效果
        </el-button>
      </div>
    </header>

    <AgentWorkflowSteps :active-step="workflowStep" :status="workflowStatus" />

    <div v-if="approvalRecord || dispatchRecord || trackingData" class="ai-agent-page__status-bar">
      <el-tag v-if="approvalRecord" :type="approvalRecord.status === 'approved' ? 'success' : 'warning'">
        审批：{{ approvalRecord.status === 'approved' ? '已通过' : '待审核' }} · {{ approvalRecord.title }}
      </el-tag>
      <el-tag v-if="dispatchRecord" type="primary">
        已下发 {{ dispatchRecord.storeCount }} 店 · {{ dispatchRecord.dispatchId }}
      </el-tag>
      <el-tag v-if="trackingData" type="success">
        曝光 {{ trackingData.impressions }} · 转化 {{ trackingData.conversions }} · ROI {{ trackingData.roi }}
      </el-tag>
    </div>

    <section class="ai-agent-page__layout">
      <AgentTaskForm v-model="taskForm" @generate="handleGenerate" />

      <AgentGenerateWorkspace
        :content="activeContent"
        :generating="generating"
        :estimated-effect="activeContent?.estimatedEffect"
        @update-field="aiAgentStore.updateContentField"
      />

      <AgentInsightPanel
        :insights="storeInsights"
        :loading="loadingInsight"
        :compliance="activeContent?.compliance"
        :saved-count="savedMaterials.length"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
.ai-agent-page {
  display: grid;
  gap: 16px;

  &__header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    h2 {
      margin: 0;
      font-size: 22px;
      color: $text-primary;
    }

    p {
      margin: 6px 0 0;
      font-size: 13px;
      color: $text-tertiary;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
  }

  &__status-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__layout {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr) 280px;
    gap: 16px;
    align-items: start;
  }
}

@media (max-width: 1400px) {
  .ai-agent-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
