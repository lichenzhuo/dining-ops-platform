import * as XLSX from 'xlsx'

self.onmessage = (event) => {
  try {
    const workbook = XLSX.read(event.data.buffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    self.postMessage({ rows, sheetName })
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : 'Excel 解析失败',
    })
  }
}
