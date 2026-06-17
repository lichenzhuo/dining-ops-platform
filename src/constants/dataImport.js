/** 导入类型与字段校验规则 */
export const IMPORT_TYPES = [
  {
    key: 'store_daily',
    label: '门店日结数据',
    description: '导入门店每日营业额、订单数与渠道口径',
    fileName: '门店日结导入模板.xlsx',
  },
  {
    key: 'product_sales',
    label: '商品销售明细',
    description: '导入 SKU 销量、实收与渠道分摊',
    fileName: '商品销售导入模板.xlsx',
  },
  {
    key: 'inventory_snapshot',
    label: '库存快照',
    description: '导入物料库存、安全库存与损耗数量',
    fileName: '库存快照导入模板.xlsx',
  },
]

export const IMPORT_FIELD_SCHEMAS = {
  store_daily: [
    { key: 'date', label: '日期', required: true, type: 'date', sample: '2026-06-01' },
    { key: 'store', label: '门店名称', required: true, type: 'string', sample: '上海南京路店' },
    {
      key: 'revenue',
      label: '营业额',
      required: true,
      type: 'number',
      min: 0,
      sample: 18640,
    },
    { key: 'orders', label: '订单数', required: true, type: 'integer', min: 1, sample: 286 },
    {
      key: 'channel',
      label: '主渠道',
      required: false,
      type: 'enum',
      options: ['堂食 POS', '美团外卖', '抖音团购', '饿了么'],
      sample: '堂食 POS',
    },
  ],
  product_sales: [
    { key: 'date', label: '日期', required: true, type: 'date', sample: '2026-06-01' },
    { key: 'store', label: '门店名称', required: true, type: 'string', sample: '杭州西湖店' },
    { key: 'product', label: '商品名称', required: true, type: 'string', sample: '招牌牛肉饭' },
    { key: 'quantity', label: '销量', required: true, type: 'integer', min: 1, sample: 128 },
    { key: 'amount', label: '实收金额', required: true, type: 'number', min: 0, sample: 3580 },
  ],
  inventory_snapshot: [
    { key: 'date', label: '日期', required: true, type: 'date', sample: '2026-06-01' },
    { key: 'store', label: '门店名称', required: true, type: 'string', sample: '南京新街口店' },
    { key: 'material', label: '物料名称', required: true, type: 'string', sample: '牛肉' },
    { key: 'stock', label: '当前库存', required: true, type: 'number', min: 0, sample: 42 },
    { key: 'safeStock', label: '安全库存', required: true, type: 'number', min: 0, sample: 30 },
    { key: 'loss', label: '损耗数量', required: false, type: 'number', min: 0, sample: 2 },
  ],
}

export const IMPORT_FILE_LIMIT = {
  maxSizeMB: 5,
  accept: '.xlsx,.xls',
}

export const EXPORT_TASK_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DONE: 'done',
  FAILED: 'failed',
}

export const EXPORT_STATUS_LABELS = {
  pending: '排队中',
  processing: '生成中',
  done: '已完成',
  failed: '失败',
}

export function getImportType(key) {
  return IMPORT_TYPES.find((item) => item.key === key) ?? IMPORT_TYPES[0]
}

export function getImportSchema(key) {
  return IMPORT_FIELD_SCHEMAS[key] ?? IMPORT_FIELD_SCHEMAS.store_daily
}
