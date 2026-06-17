import { mockCreateExportTask, mockFetchReport } from '@/mocks/reports'

export async function fetchReportData(query) {
  return mockFetchReport(query)
}

export async function createReportExportTask(query) {
  return mockCreateExportTask(query)
}
