import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  APPROVAL_STATUS,
  APPROVAL_TYPES,
  canTransition,
} from '@/constants/approval'
import { canApproveByRole } from '@/constants/permissions'
import { createApproval, fetchApprovals, updateApprovalStatus } from '@/services/approval'
import { useAuthStore } from '@/stores/auth'

export const useApprovalStore = defineStore('approval', () => {
  const list = ref([])
  const pendingCount = ref(0)
  const loading = ref(false)
  const error = ref(null)
  const activeTab = ref('pending')
  const filters = ref({ type: 'all', keyword: '' })
  const selectedItem = ref(null)
  const drawerOpen = ref(false)

  const query = computed(() => {
    const auth = useAuthStore()
    return {
      tab: activeTab.value,
      type: filters.value.type,
      keyword: filters.value.keyword,
      userId: auth.user?.id,
      region: auth.org.region,
      roles: auth.roles,
    }
  })

  const canReview = computed(() => canApproveByRole(query.value.roles))

  async function loadApprovals() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchApprovals(query.value)
      list.value = result.list
      pendingCount.value = result.pendingCount
    } catch (err) {
      error.value = err instanceof Error ? err.message : '审批列表加载失败'
      list.value = []
    } finally {
      loading.value = false
    }
  }

  function setTab(tab) {
    activeTab.value = tab
  }

  function setFilters(partial) {
    filters.value = { ...filters.value, ...partial }
  }

  function openDetail(item) {
    selectedItem.value = item
    drawerOpen.value = true
  }

  function closeDetail() {
    drawerOpen.value = false
  }

  async function transitionStatus(id, toStatus, extra = {}) {
    const item = list.value.find((row) => row.id === id)
    if (!item) {
      throw new Error('审批单不存在')
    }
    if (!canTransition(item.status, toStatus)) {
      throw new Error('当前状态不允许此操作')
    }

    const auth = useAuthStore()
    const updated = await updateApprovalStatus(id, {
      status: toStatus,
      approver: auth.displayName,
      ...extra,
    })

    const index = list.value.findIndex((row) => row.id === id)
    if (index !== -1) {
      list.value[index] = updated
    }
    if (selectedItem.value?.id === id) {
      selectedItem.value = updated
    }
    pendingCount.value = Math.max(0, pendingCount.value - (toStatus === APPROVAL_STATUS.APPROVED || toStatus === APPROVAL_STATUS.REJECTED ? 1 : 0))
    return updated
  }

  async function approve(id) {
    return transitionStatus(id, APPROVAL_STATUS.APPROVED)
  }

  async function reject(id, rejectReason) {
    return transitionStatus(id, APPROVAL_STATUS.REJECTED, { rejectReason })
  }

  async function dispatch(id) {
    return transitionStatus(id, APPROVAL_STATUS.DISPATCHED)
  }

  async function complete(id) {
    return transitionStatus(id, APPROVAL_STATUS.COMPLETED)
  }

  async function submitFromAiAgent(payload) {
    const item = await createApproval({
      title: payload.title,
      type: APPROVAL_TYPES.AI_CONTENT,
      applicant: payload.applicant,
      applicantId: payload.applicantId,
      region: payload.region,
      amount: 0,
      summary: payload.summary ?? 'AI 营销内容待审批',
    })
    pendingCount.value += 1
    return item
  }

  return {
    list,
    pendingCount,
    loading,
    error,
    activeTab,
    filters,
    selectedItem,
    drawerOpen,
    query,
    canReview,
    loadApprovals,
    setTab,
    setFilters,
    openDetail,
    closeDetail,
    approve,
    reject,
    dispatch,
    complete,
    submitFromAiAgent,
  }
})
