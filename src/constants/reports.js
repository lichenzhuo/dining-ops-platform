export const REPORT_GROUPS = [
  {
    key: 'business',
    label: '经营分析',
    reports: [
      { id: 'daily', label: '经营日报', icon: 'DataLine' },
      { id: 'store', label: '门店经营报表', icon: 'Shop' },
    ],
  },
  {
    key: 'sales',
    label: '销售分析',
    reports: [
      { id: 'product', label: '商品销售报表', icon: 'Goods' },
      { id: 'channel', label: '渠道销售报表', icon: 'Connection' },
    ],
  },
  {
    key: 'marketing',
    label: '会员营销',
    reports: [
      { id: 'member', label: '会员复购报表', icon: 'User' },
      { id: 'coupon', label: '卡券核销报表', icon: 'Ticket' },
      { id: 'staff', label: '员工推广报表', icon: 'Promotion' },
    ],
  },
  {
    key: 'supply',
    label: '供应链',
    reports: [{ id: 'inventory', label: '库存损耗报表', icon: 'Box' }],
  },
  {
    key: 'external',
    label: '外部系统',
    reports: [{ id: 'external', label: '外部 BI 报表', icon: 'Link' }],
  },
]

export const REPORT_MAP = Object.fromEntries(
  REPORT_GROUPS.flatMap((group) => group.reports.map((report) => [report.id, report])),
)

export const REPORT_COLUMN_DEFS = {
  daily: [
    { key: 'date', label: '日期', default: true, fixed: true, width: 120 },
    { key: 'revenue', label: '营业额', default: true, align: 'right', summary: true },
    { key: 'orders', label: '订单数', default: true, align: 'right', summary: true },
    { key: 'customers', label: '客流量', default: true, align: 'right', summary: true },
    { key: 'avgOrder', label: '客单价', default: true, align: 'right' },
    { key: 'grossRate', label: '毛利率', default: true, align: 'right' },
    { key: 'couponRate', label: '卡券核销率', default: false, align: 'right' },
    { key: 'memberRate', label: '会员占比', default: false, align: 'right' },
  ],
  store: [
    {
      key: 'storeName',
      label: '门店',
      default: true,
      fixed: true,
      width: 160,
      drill: { reportId: 'product', field: 'drillStore' },
    },
    { key: 'region', label: '区域', default: true, width: 100 },
    { key: 'revenue', label: '营业额', default: true, align: 'right', summary: true },
    { key: 'orders', label: '订单数', default: true, align: 'right', summary: true },
    { key: 'achievement', label: '达成率', default: true, align: 'right' },
    { key: 'avgOrder', label: '客单价', default: true, align: 'right' },
    { key: 'refundRate', label: '退款率', default: false, align: 'right' },
    { key: 'score', label: '评分', default: false, align: 'right' },
  ],
  product: [
    { key: 'productName', label: '商品名称', default: true, fixed: true, width: 180 },
    { key: 'category', label: '品类', default: true, width: 100 },
    { key: 'salesQty', label: '销量', default: true, align: 'right', summary: true, group: '销售' },
    { key: 'salesAmount', label: '销售额', default: true, align: 'right', summary: true, group: '销售' },
    { key: 'share', label: '销售占比', default: true, align: 'right', group: '销售' },
    { key: 'grossRate', label: '毛利率', default: true, align: 'right', group: '毛利' },
    { key: 'grossAmount', label: '毛利额', default: false, align: 'right', summary: true, group: '毛利' },
  ],
  channel: [
    {
      key: 'channelName',
      label: '渠道',
      default: true,
      fixed: true,
      width: 140,
      drill: { reportId: 'daily', field: 'channel' },
    },
    { key: 'revenue', label: '营业额', default: true, align: 'right', summary: true },
    { key: 'orders', label: '订单数', default: true, align: 'right', summary: true },
    { key: 'share', label: '占比', default: true, align: 'right' },
    { key: 'avgOrder', label: '客单价', default: true, align: 'right' },
    { key: 'conversion', label: '转化率', default: false, align: 'right' },
  ],
  member: [
    { key: 'segment', label: '会员分层', default: true, fixed: true, width: 140 },
    { key: 'memberCount', label: '会员数', default: true, align: 'right', summary: true },
    { key: 'repurchaseRate', label: '复购率', default: true, align: 'right' },
    { key: 'avgSpend', label: '人均消费', default: true, align: 'right' },
    { key: 'ltv', label: 'LTV', default: true, align: 'right' },
  ],
  coupon: [
    { key: 'couponName', label: '卡券名称', default: true, fixed: true, width: 180 },
    { key: 'issued', label: '发放量', default: true, align: 'right', summary: true },
    { key: 'redeemed', label: '核销量', default: true, align: 'right', summary: true },
    { key: 'redeemRate', label: '核销率', default: true, align: 'right' },
    { key: 'driveRevenue', label: '带动营业额', default: true, align: 'right', summary: true },
  ],
  staff: [
    { key: 'staffName', label: '员工', default: true, fixed: true, width: 120 },
    { key: 'storeName', label: '所属门店', default: true, width: 160 },
    { key: 'shareCount', label: '分享次数', default: true, align: 'right', summary: true },
    { key: 'conversion', label: '转化订单', default: true, align: 'right', summary: true },
    { key: 'reward', label: '奖励金额', default: true, align: 'right', summary: true },
  ],
  inventory: [
    { key: 'materialName', label: '物料', default: true, fixed: true, width: 160 },
    { key: 'storeName', label: '门店', default: true, width: 140 },
    { key: 'lossQty', label: '损耗量', default: true, align: 'right', summary: true },
    { key: 'lossAmount', label: '损耗金额', default: true, align: 'right', summary: true },
    { key: 'lossRate', label: '损耗率', default: true, align: 'right' },
  ],
}

export function getDefaultVisibleColumns(reportId) {
  const defs = REPORT_COLUMN_DEFS[reportId] ?? []
  return defs.filter((col) => col.default).map((col) => col.key)
}

export function getReportTitle(reportId) {
  return REPORT_MAP[reportId]?.label ?? '报表中心'
}
