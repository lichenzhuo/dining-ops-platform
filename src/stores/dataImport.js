import { ref } from 'vue'
import { defineStore } from 'pinia'
import { EXPORT_TASK_STATUS } from '@/constants/dataImport'
import { confirmDataImport } from '@/services/dataImport'
import {
  downloadImportTemplate,
  parseExcelInMainThread,
  parseExcelWithWorker,
  validateImportRows,
} from '@/utils/xlsxHelper'
import { IMPORT_FILE_LIMIT } from '@/constants/dataImport'

export const useDataImportStore = defineStore('dataImport', () => {
  const importType = ref('store_daily')
  const step = ref('upload')
  const parsing = ref(false)
  const importing = ref(false)
  const fileName = ref('')
  const parsedRows = ref([])
  const validRows = ref([])
  const errorRows = ref([])
  const importResult = ref(null)
  const error = ref(null)
  const useWorker = ref(true)

  function setImportType(type) {
    importType.value = type
    resetUpload()
  }

  function resetUpload() {
    step.value = 'upload'
    parsing.value = false
    importing.value = false
    fileName.value = ''
    parsedRows.value = []
    validRows.value = []
    errorRows.value = []
    importResult.value = null
    error.value = null
  }

  async function downloadTemplate() {
    await downloadImportTemplate(importType.value)
  }

  async function parseFile(file) {
    if (!file) {
      return
    }

    const sizeMB = file.size / 1024 / 1024
    if (sizeMB > IMPORT_FILE_LIMIT.maxSizeMB) {
      error.value = `文件大小不能超过 ${IMPORT_FILE_LIMIT.maxSizeMB}MB`
      return
    }

    parsing.value = true
    error.value = null
    fileName.value = file.name

    try {
      const result = useWorker.value
        ? await parseExcelWithWorker(file)
        : await parseExcelInMainThread(file)

      if (result.error) {
        throw new Error(result.error)
      }

      parsedRows.value = result.rows ?? []
      const validation = validateImportRows(parsedRows.value, importType.value)
      validRows.value = validation.validRows
      errorRows.value = validation.errorRows
      step.value = 'preview'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Excel 解析失败'
      step.value = 'upload'
    } finally {
      parsing.value = false
    }
  }

  async function confirmImport() {
    if (!validRows.value.length) {
      error.value = '没有可导入的有效数据'
      return null
    }

    importing.value = true
    error.value = null
    try {
      const result = await confirmDataImport({
        importType: importType.value,
        validRows: validRows.value,
        errorRows: errorRows.value,
        fileName: fileName.value,
      })
      importResult.value = result
      step.value = 'done'
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : '导入失败'
      return null
    } finally {
      importing.value = false
    }
  }

  return {
    importType,
    step,
    parsing,
    importing,
    fileName,
    parsedRows,
    validRows,
    errorRows,
    importResult,
    error,
    useWorker,
    setImportType,
    resetUpload,
    downloadTemplate,
    parseFile,
    confirmImport,
  }
})
