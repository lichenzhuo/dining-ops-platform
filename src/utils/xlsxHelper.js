import * as XLSX from 'xlsx'
import { getImportSchema, getImportType } from '@/constants/dataImport'
import { saveFileWithDialog } from '@/utils/electron'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  return `${value}`.trim()
}

function mapRowKeys(row, schema) {
  const mapped = {}
  schema.forEach((field) => {
    mapped[field.key] = normalizeValue(row[field.label] ?? row[field.key])
  })
  return mapped
}

function validateField(field, value) {
  const errors = []
  const text = normalizeValue(value)

  if (field.required && !text) {
    errors.push(`${field.label}不能为空`)
    return errors
  }

  if (!text) {
    return errors
  }

  if (field.type === 'date' && !DATE_PATTERN.test(text)) {
    errors.push(`${field.label}格式应为 YYYY-MM-DD`)
  }

  if (field.type === 'number' || field.type === 'integer') {
    const num = Number(text)
    if (Number.isNaN(num)) {
      errors.push(`${field.label}必须为数字`)
    } else if (field.type === 'integer' && !Number.isInteger(num)) {
      errors.push(`${field.label}必须为整数`)
    } else if (field.min !== undefined && num < field.min) {
      errors.push(`${field.label}不能小于 ${field.min}`)
    }
  }

  if (field.type === 'enum' && field.options?.length && !field.options.includes(text)) {
    errors.push(`${field.label}不在允许范围：${field.options.join(' / ')}`)
  }

  return errors
}

export function validateImportRows(rows, importType) {
  const schema = getImportSchema(importType)
  const validRows = []
  const errorRows = []

  rows.forEach((rawRow, index) => {
    const rowNumber = index + 2
    const mapped = mapRowKeys(rawRow, schema)
    const messages = []

    schema.forEach((field) => {
      messages.push(...validateField(field, mapped[field.key]))
    })

    if (messages.length) {
      errorRows.push({
        rowNumber,
        raw: rawRow,
        data: mapped,
        errors: messages,
      })
      return
    }

    validRows.push({
      rowNumber,
      data: mapped,
    })
  })

  return { validRows, errorRows, schema }
}

export async function downloadImportTemplate(importType) {
  const schema = getImportSchema(importType)
  const typeMeta = getImportType(importType)
  const header = schema.map((field) => field.label)
  const sample = schema.map((field) => field.sample ?? '')
  const worksheet = XLSX.utils.aoa_to_sheet([header, sample])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '导入模板')
  await writeWorkbookToFile(workbook, typeMeta.fileName)
}

export function parseWorkbookBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
  return { rows, sheetName }
}

async function writeWorkbookToFile(workbook, filename) {
  const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
  return saveFileWithDialog(buffer, {
    defaultPath: filename,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })
}

export async function exportRowsToExcel(rows, columns, filename) {
  const header = columns.map((col) => col.label)
  const body = rows.map((row) => columns.map((col) => row[col.key] ?? ''))
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...body])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '导出数据')
  return writeWorkbookToFile(workbook, filename)
}

export function parseExcelInMainThread(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const result = parseWorkbookBuffer(event.target.result)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}

export function parseExcelWithWorker(file) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/xlsxParse.worker.js', import.meta.url), {
      type: 'module',
    })

    worker.onmessage = (event) => {
      worker.terminate()
      resolve(event.data)
    }

    worker.onerror = (error) => {
      worker.terminate()
      reject(error)
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      worker.postMessage({ buffer: event.target.result })
    }
    reader.onerror = () => {
      worker.terminate()
      reject(new Error('文件读取失败'))
    }
    reader.readAsArrayBuffer(file)
  })
}
