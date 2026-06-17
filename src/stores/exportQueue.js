import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { EXPORT_STATUS_LABELS, EXPORT_TASK_STATUS } from '@/constants/dataImport'
import { processExportTask } from '@/services/dataImport'
import { exportRowsToExcel } from '@/utils/xlsxHelper'

export const useExportQueueStore = defineStore(
  'exportQueue',
  () => {
    const tasks = ref([])

    const pendingCount = computed(
      () =>
        tasks.value.filter((item) =>
          [EXPORT_TASK_STATUS.PENDING, EXPORT_TASK_STATUS.PROCESSING].includes(item.status),
        ).length,
    )

    function addTask(task) {
      const nextTask = {
        id: task.id ?? `export-${Date.now()}`,
        reportId: task.reportId,
        reportName: task.reportName ?? task.reportId,
        status: task.status ?? EXPORT_TASK_STATUS.PROCESSING,
        message: task.message ?? '导出任务已创建',
        createdAt: task.createdAt ?? new Date().toISOString(),
        source: task.source ?? 'reports',
        fileName: task.fileName ?? null,
        finishedAt: task.finishedAt ?? null,
      }
      tasks.value = [nextTask, ...tasks.value].slice(0, 30)
      return nextTask
    }

    function updateTask(taskId, patch) {
      const index = tasks.value.findIndex((item) => item.id === taskId)
      if (index === -1) {
        return null
      }
      tasks.value[index] = { ...tasks.value[index], ...patch }
      return tasks.value[index]
    }

    function markDone(taskId, patch = {}) {
      return updateTask(taskId, {
        status: EXPORT_TASK_STATUS.DONE,
        message: patch.message ?? '导出文件已生成，可下载',
        fileName: patch.fileName ?? `${taskId}.xlsx`,
        finishedAt: patch.finishedAt ?? new Date().toISOString(),
        ...patch,
      })
    }

    function markDoneByReport(reportId, patch = {}) {
      const task = tasks.value.find(
        (item) =>
          item.reportId === reportId &&
          [EXPORT_TASK_STATUS.PENDING, EXPORT_TASK_STATUS.PROCESSING].includes(item.status),
      )
      if (!task) {
        return null
      }
      return markDone(task.id, patch)
    }

    function markFailed(taskId, message) {
      return updateTask(taskId, {
        status: EXPORT_TASK_STATUS.FAILED,
        message: message ?? '导出失败',
        finishedAt: new Date().toISOString(),
      })
    }

    function removeTask(taskId) {
      tasks.value = tasks.value.filter((item) => item.id !== taskId)
    }

    function clearDoneTasks() {
      tasks.value = tasks.value.filter((item) => item.status !== EXPORT_TASK_STATUS.DONE)
    }

    async function simulateTaskComplete(taskId) {
      const task = tasks.value.find((item) => item.id === taskId)
      if (!task) {
        return null
      }
      const result = await processExportTask(task)
      return markDone(taskId, result)
    }

    function downloadTaskFile(task) {
      if (task.status !== EXPORT_TASK_STATUS.DONE) {
        return
      }
      const rows = [
        { col1: '示例门店', col2: '18640', col3: '2026-06-01' },
        { col1: '杭州西湖店', col2: '16230', col3: '2026-06-01' },
      ]
      return exportRowsToExcel(
        rows,
        [
          { key: 'col1', label: '门店' },
          { key: 'col2', label: '营业额' },
          { key: 'col3', label: '日期' },
        ],
        task.fileName ?? `${task.reportName}.xlsx`,
      )
    }

    function quickExportSample() {
      const rows = [
        { store: '上海南京路店', revenue: 18640, orders: 286, date: '2026-06-01' },
        { store: '杭州西湖店', revenue: 16230, orders: 248, date: '2026-06-01' },
        { store: '南京新街口店', revenue: 14890, orders: 221, date: '2026-06-01' },
      ]
      return exportRowsToExcel(
        rows,
        [
          { key: 'store', label: '门店' },
          { key: 'revenue', label: '营业额' },
          { key: 'orders', label: '订单数' },
          { key: 'date', label: '日期' },
        ],
        `quick-export-${Date.now()}.xlsx`,
      )
    }

    function getStatusLabel(status) {
      return EXPORT_STATUS_LABELS[status] ?? status
    }

    return {
      tasks,
      pendingCount,
      addTask,
      updateTask,
      markDone,
      markDoneByReport,
      markFailed,
      removeTask,
      clearDoneTasks,
      simulateTaskComplete,
      downloadTaskFile,
      quickExportSample,
      getStatusLabel,
    }
  },
  {
    persist: {
      key: 'dop-export-queue',
      pick: ['tasks'],
    },
  },
)
