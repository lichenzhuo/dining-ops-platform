import {
  mockDispatchToStores,
  mockFetchStoreInsights,
  mockFetchTrackingEffect,
  mockGenerateMarketingContent,
  mockSubmitApproval,
} from '@/mocks/aiAgent'

/** 生产环境可替换为真实 AI API：POST /api/ai/marketing/generate */
export async function fetchStoreInsights(query) {
  return mockFetchStoreInsights(query)
}

export async function generateMarketingContent(task, query) {
  return mockGenerateMarketingContent(task, query)
}

export async function submitMarketingApproval(payload) {
  return mockSubmitApproval(payload)
}

export async function dispatchMarketingToStores(payload) {
  return mockDispatchToStores(payload)
}

export async function fetchMarketingTracking(dispatchId) {
  return mockFetchTrackingEffect(dispatchId)
}
