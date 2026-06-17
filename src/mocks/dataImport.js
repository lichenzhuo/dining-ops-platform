function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockConfirmImport(payload) {
  await delay(900)
  return {
    importId: `imp-${Date.now()}`,
    importType: payload.importType,
    successCount: payload.validRows.length,
    skippedCount: payload.errorRows.length,
    importedAt: new Date().toISOString(),
    message: `已成功导入 ${payload.validRows.length} 条数据（Mock）`,
  }
}

export async function mockProcessExportTask(task) {
  await delay(1200)
  return {
    ...task,
    status: 'done',
    message: '导出文件已生成，可下载',
    fileName: `${task.reportName ?? task.reportId}-${Date.now()}.xlsx`,
    finishedAt: new Date().toISOString(),
  }
}
