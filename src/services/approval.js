import {
  mockCreateApproval,
  mockFetchApprovals,
  mockUpdateApprovalStatus,
} from '@/mocks/approval'

export async function fetchApprovals(query) {
  return mockFetchApprovals(query)
}

export async function updateApprovalStatus(id, payload) {
  return mockUpdateApprovalStatus(id, payload)
}

export async function createApproval(payload) {
  return mockCreateApproval(payload)
}
