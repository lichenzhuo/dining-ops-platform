import { mockFetchDashboard } from '@/mocks/dashboard'

export async function fetchDashboardData(query) {
  return mockFetchDashboard(query)
}
