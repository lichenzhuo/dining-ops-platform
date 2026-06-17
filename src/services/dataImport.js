import { mockConfirmImport, mockProcessExportTask } from '@/mocks/dataImport'

export async function confirmDataImport(payload) {
  return mockConfirmImport(payload)
}

export async function processExportTask(task) {
  return mockProcessExportTask(task)
}
