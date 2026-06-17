import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  AGENT_WORKFLOW_STATUS,
  defaultTaskForm,
  getWorkflowStepIndex,
} from '@/constants/aiAgent'
import {
  dispatchMarketingToStores,
  fetchMarketingTracking,
  fetchStoreInsights,
  generateMarketingContent,
  submitMarketingApproval,
} from '@/services/aiAgent'
import { useAuthStore } from '@/stores/auth'

export const useAiAgentStore = defineStore(
  'aiAgent',
  () => {
    const taskForm = ref(defaultTaskForm())
    const workflowStatus = ref(AGENT_WORKFLOW_STATUS.DRAFT)
    const generating = ref(false)
    const loadingInsight = ref(false)
    const generatedContent = ref(null)
    const editedContent = ref(null)
    const storeInsights = ref(null)
    const savedMaterials = ref([])
    const approvalRecord = ref(null)
    const dispatchRecord = ref(null)
    const trackingData = ref(null)
    const error = ref(null)

    const query = computed(() => {
      const auth = useAuthStore()
      return {
        brand: auth.org.brand,
        region: auth.org.region,
        store: auth.org.store,
      }
    })

    const activeContent = computed(() => editedContent.value ?? generatedContent.value)
    const workflowStep = computed(() => getWorkflowStepIndex(workflowStatus.value))

    const canGenerate = computed(
      () =>
        Boolean(taskForm.value.goal) &&
        taskForm.value.platforms.length > 0 &&
        workflowStatus.value !== AGENT_WORKFLOW_STATUS.GENERATING,
    )

    const canSave = computed(
      () =>
        Boolean(activeContent.value) &&
        [AGENT_WORKFLOW_STATUS.GENERATED, AGENT_WORKFLOW_STATUS.SAVED].includes(
          workflowStatus.value,
        ),
    )

    const canSubmitApproval = computed(
      () =>
        taskForm.value.approvalRequired &&
        workflowStatus.value === AGENT_WORKFLOW_STATUS.SAVED,
    )

    const canDispatch = computed(() => {
      if (!activeContent.value) {
        return false
      }
      if (taskForm.value.approvalRequired) {
        return workflowStatus.value === AGENT_WORKFLOW_STATUS.APPROVED
      }
      return [AGENT_WORKFLOW_STATUS.SAVED, AGENT_WORKFLOW_STATUS.DISPATCHED].includes(
        workflowStatus.value,
      )
    })

    const canTrack = computed(() => Boolean(dispatchRecord.value))

    function resetTask(org) {
      taskForm.value = defaultTaskForm(org ?? query.value)
      workflowStatus.value = AGENT_WORKFLOW_STATUS.DRAFT
      generatedContent.value = null
      editedContent.value = null
      approvalRecord.value = null
      dispatchRecord.value = null
      trackingData.value = null
      error.value = null
    }

    function initFromOrg() {
      taskForm.value = {
        ...defaultTaskForm(query.value),
        ...taskForm.value,
        storeScope:
          query.value.store !== '全部门店' ? query.value.store : query.value.region ?? '全部门店',
      }
    }

    async function loadInsights() {
      loadingInsight.value = true
      error.value = null
      try {
        storeInsights.value = await fetchStoreInsights(query.value)
      } catch (err) {
        error.value = err instanceof Error ? err.message : '经营洞察加载失败'
      } finally {
        loadingInsight.value = false
      }
    }

    async function generate() {
      if (!canGenerate.value) {
        return null
      }
      generating.value = true
      workflowStatus.value = AGENT_WORKFLOW_STATUS.GENERATING
      error.value = null
      try {
        const result = await generateMarketingContent(taskForm.value, query.value)
        generatedContent.value = result
        editedContent.value = { ...result }
        workflowStatus.value = AGENT_WORKFLOW_STATUS.GENERATED
        return result
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'AI 生成失败'
        workflowStatus.value = AGENT_WORKFLOW_STATUS.DRAFT
        return null
      } finally {
        generating.value = false
      }
    }

    function updateContentField(key, value) {
      if (!editedContent.value) {
        return
      }
      editedContent.value = { ...editedContent.value, [key]: value }
    }

    function saveMaterial() {
      if (!activeContent.value) {
        return null
      }
      const material = {
        id: `mat-${Date.now()}`,
        title: activeContent.value.xiaohongshuTitle,
        savedAt: new Date().toISOString(),
        task: { ...taskForm.value },
        content: { ...activeContent.value },
      }
      savedMaterials.value = [material, ...savedMaterials.value].slice(0, 20)
      workflowStatus.value = AGENT_WORKFLOW_STATUS.SAVED
      return material
    }

    async function submitApproval() {
      if (!activeContent.value) {
        return null
      }
      const auth = useAuthStore()
      const record = await submitMarketingApproval({
        title: activeContent.value.xiaohongshuTitle,
        applicant: auth.displayName,
        contentId: activeContent.value.id,
      })
      approvalRecord.value = record
      workflowStatus.value = AGENT_WORKFLOW_STATUS.PENDING_APPROVAL

      window.setTimeout(() => {
        if (approvalRecord.value?.approvalId === record.approvalId) {
          approvalRecord.value = { ...record, status: 'approved', approvedAt: new Date().toISOString() }
          workflowStatus.value = AGENT_WORKFLOW_STATUS.APPROVED
        }
      }, 2500)

      return record
    }

    async function dispatchToStores() {
      if (!activeContent.value) {
        return null
      }
      const record = await dispatchMarketingToStores({
        storeScope: taskForm.value.storeScope,
        platforms: taskForm.value.platforms,
        materialId: savedMaterials.value[0]?.id,
      })
      dispatchRecord.value = record
      workflowStatus.value = AGENT_WORKFLOW_STATUS.DISPATCHED
      return record
    }

    async function loadTracking() {
      if (!dispatchRecord.value?.dispatchId) {
        return null
      }
      trackingData.value = await fetchMarketingTracking(dispatchRecord.value.dispatchId)
      workflowStatus.value = AGENT_WORKFLOW_STATUS.TRACKING
      return trackingData.value
    }

    function applySuggestion(text) {
      taskForm.value = {
        ...taskForm.value,
        prompt: text,
        goal: text.includes('套餐') ? '提升午市套餐转化' : taskForm.value.goal,
      }
    }

    return {
      taskForm,
      workflowStatus,
      generating,
      loadingInsight,
      generatedContent,
      editedContent,
      storeInsights,
      savedMaterials,
      approvalRecord,
      dispatchRecord,
      trackingData,
      error,
      query,
      activeContent,
      workflowStep,
      canGenerate,
      canSave,
      canSubmitApproval,
      canDispatch,
      canTrack,
      resetTask,
      initFromOrg,
      loadInsights,
      generate,
      updateContentField,
      saveMaterial,
      submitApproval,
      dispatchToStores,
      loadTracking,
      applySuggestion,
    }
  },
  {
    persist: {
      key: 'dop-ai-agent',
      pick: ['savedMaterials'],
    },
  },
)
