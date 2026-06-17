const STORE_NAMES = [
  '上海南京路店',
  '杭州西湖店',
  '南京新街口店',
  '苏州观前街店',
  '无锡崇安寺店',
  '宁波天一店',
  '合肥淮河路店',
  '上海陆家嘴店',
]

const PRODUCT_NAMES = [
  '招牌牛肉饭',
  '经典叉烧面',
  '鲜虾云吞',
  '黑椒牛柳',
  '番茄蛋汤',
  '时令蔬菜',
  '柠檬茶',
  '杨枝甘露',
]

const CHANNELS = [
  { key: 'pos', name: '堂食 POS' },
  { key: 'meituan', name: '美团外卖' },
  { key: 'douyin', name: '抖音团购' },
  { key: 'eleme', name: '饿了么' },
]

function delay(ms = 320) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashSeed(text) {
  return `${text}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function scale(base, query, factor = 1) {
  const seed = hashSeed(`${query.brand}-${query.region}-${query.store}-${query.channel}`)
  const channelFactor =
    query.channel === 'all'
      ? 1
      : query.channel === 'pos'
        ? 0.78
        : query.channel === 'meituan'
          ? 0.62
          : query.channel === 'douyin'
            ? 0.55
            : 0.48
  const storeFactor = query.store === '全部门店' ? 1 : 0.35 + (seed % 20) / 100
  return Math.round(base * channelFactor * storeFactor * factor)
}

function formatCurrency(value) {
  return `¥ ${value.toLocaleString('zh-CN')}`
}

function filterByKeyword(rows, keyword, keys) {
  if (!keyword?.trim()) {
    return rows
  }
  const text = keyword.trim().toLowerCase()
  return rows.filter((row) =>
    keys.some((key) => `${row[key] ?? ''}`.toLowerCase().includes(text)),
  )
}

function paginateRows(rows, page, pageSize) {
  const start = (page - 1) * pageSize
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
  }
}

function buildDailyRows(query) {
  const days = 14
  const rows = Array.from({ length: days }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - index))
    const revenue = scale(128000 + index * 4200, query)
    const orders = scale(1860 + index * 28, query)
    const customers = scale(1520 + index * 22, query)
    return {
      id: `daily-${index}`,
      date: date.toISOString().slice(0, 10),
      revenue: formatCurrency(revenue),
      revenueRaw: revenue,
      orders,
      customers,
      avgOrder: `¥ ${(revenue / orders).toFixed(1)}`,
      grossRate: `${(58 + (index % 5)).toFixed(1)}%`,
      couponRate: `${(12 + (index % 4)).toFixed(1)}%`,
      memberRate: `${(34 + (index % 6)).toFixed(1)}%`,
    }
  })
  return filterByKeyword(rows, query.keyword, ['date'])
}

function buildStoreRows(query) {
  let stores = STORE_NAMES.map((storeName, index) => {
    const revenue = scale(98000 + index * 8600, query)
    const orders = scale(1280 + index * 96, query)
    return {
      id: `store-${index}`,
      storeName,
      region: query.region,
      revenue: formatCurrency(revenue),
      revenueRaw: revenue,
      orders,
      achievement: `${(82 + (index % 12)).toFixed(1)}%`,
      avgOrder: `¥ ${(revenue / orders).toFixed(1)}`,
      refundRate: `${(1.2 + (index % 3) * 0.3).toFixed(1)}%`,
      score: (4.2 + (index % 5) * 0.1).toFixed(1),
    }
  })
  if (query.drillStore) {
    stores = stores.filter((row) => row.storeName === query.drillStore)
  }
  return filterByKeyword(stores, query.keyword, ['storeName', 'region'])
}

function buildProductRows(query) {
  const rows = PRODUCT_NAMES.map((productName, index) => {
    const salesQty = scale(420 + index * 36, query)
    const salesAmount = scale(8600 + index * 720, query)
    return {
      id: `product-${index}`,
      productName,
      category: index % 2 === 0 ? '主食' : '饮品',
      salesQty,
      salesAmount: formatCurrency(salesAmount),
      salesAmountRaw: salesAmount,
      share: `${(6 + index * 1.2).toFixed(1)}%`,
      grossRate: `${(52 + (index % 8)).toFixed(1)}%`,
      grossAmount: formatCurrency(Math.round(salesAmount * 0.54)),
      grossAmountRaw: Math.round(salesAmount * 0.54),
    }
  })
  return filterByKeyword(rows, query.keyword, ['productName', 'category'])
}

function buildChannelRows(query) {
  const list = CHANNELS.filter((item) => query.channel === 'all' || query.channel === item.key)
  const total = list.reduce((sum, item, index) => sum + scale(88000 + index * 12000, query), 0)
  return list.map((item, index) => {
    const revenue = scale(88000 + index * 12000, query)
    const orders = scale(1180 + index * 140, query)
    return {
      id: `channel-${item.key}`,
      channelName: item.name,
      channelKey: item.key,
      revenue: formatCurrency(revenue),
      revenueRaw: revenue,
      orders,
      share: `${((revenue / total) * 100).toFixed(1)}%`,
      avgOrder: `¥ ${(revenue / orders).toFixed(1)}`,
      conversion: `${(18 + index * 2.5).toFixed(1)}%`,
    }
  })
}

function buildMemberRows(query) {
  const segments = ['新会员', '活跃会员', '沉睡会员', '高价值会员', '流失预警']
  return segments.map((segment, index) => ({
    id: `member-${index}`,
    segment,
    memberCount: scale(2800 + index * 620, query),
    repurchaseRate: `${(22 + index * 6).toFixed(1)}%`,
    avgSpend: formatCurrency(scale(86 + index * 18, query)),
    ltv: formatCurrency(scale(680 + index * 220, query)),
  }))
}

function buildCouponRows(query) {
  const coupons = ['满 50 减 10', '新人 8 折券', '会员专享券', '抖音团购券', '员工内购券']
  return coupons.map((couponName, index) => {
    const issued = scale(1200 + index * 180, query)
    const redeemed = scale(680 + index * 96, query)
    return {
      id: `coupon-${index}`,
      couponName,
      issued,
      redeemed,
      redeemRate: `${((redeemed / issued) * 100).toFixed(1)}%`,
      driveRevenue: formatCurrency(scale(28000 + index * 4200, query)),
      driveRevenueRaw: scale(28000 + index * 4200, query),
    }
  })
}

function buildStaffRows(query) {
  const staff = ['陈导购', '林店员', '周收银', '吴店长', '郑推广', '黄服务员']
  return staff.map((staffName, index) => ({
    id: `staff-${index}`,
    staffName,
    storeName: STORE_NAMES[index % STORE_NAMES.length],
    shareCount: scale(48 + index * 8, query),
    conversion: scale(12 + index * 3, query),
    reward: formatCurrency(scale(320 + index * 48, query)),
    rewardRaw: scale(320 + index * 48, query),
  }))
}

function buildInventoryRows(query) {
  const materials = ['牛肉', '蔬菜包', '米饭', '酱料', '包装盒', '饮品原料']
  return materials.flatMap((materialName, index) =>
    STORE_NAMES.slice(0, 4).map((storeName, storeIndex) => ({
      id: `inv-${index}-${storeIndex}`,
      materialName,
      storeName,
      lossQty: scale(8 + index + storeIndex, query),
      lossAmount: formatCurrency(scale(120 + index * 36 + storeIndex * 12, query)),
      lossAmountRaw: scale(120 + index * 36 + storeIndex * 12, query),
      lossRate: `${(1.6 + ((index + storeIndex) % 4) * 0.4).toFixed(1)}%`,
    })),
  )
}

const ROW_BUILDERS = {
  daily: buildDailyRows,
  store: buildStoreRows,
  product: buildProductRows,
  channel: buildChannelRows,
  member: buildMemberRows,
  coupon: buildCouponRows,
  staff: buildStaffRows,
  inventory: buildInventoryRows,
}

function buildMetrics(reportId, query, rows) {
  const revenueTotal = rows.reduce((sum, row) => sum + (row.revenueRaw ?? row.salesAmountRaw ?? row.driveRevenueRaw ?? row.lossAmountRaw ?? 0), 0)
  const ordersTotal = rows.reduce((sum, row) => sum + (row.orders ?? row.salesQty ?? row.conversion ?? row.redeemed ?? 0), 0)

  const presets = {
    daily: [
      { key: 'revenue', label: '累计营业额', value: formatCurrency(revenueTotal || scale(1286420, query)), trend: '+8.2%', up: true, color: '#13c2c2', spark: [12, 16, 14, 18, 20, 22, 24] },
      { key: 'orders', label: '累计订单', value: `${ordersTotal || scale(18640, query)}`, trend: '+5.6%', up: true, color: '#1677ff', spark: [10, 12, 11, 15, 16, 18, 19] },
      { key: 'customers', label: '累计客流', value: `${scale(15280, query)}`, trend: '+3.1%', up: true, color: '#722ed1', spark: [8, 9, 10, 11, 12, 13, 14] },
      { key: 'avgOrder', label: '平均客单价', value: `¥ ${(68 + (hashSeed(query.region) % 8)).toFixed(1)}`, trend: '-1.2%', up: false, color: '#faad14', spark: [16, 15, 14, 15, 14, 13, 13] },
    ],
    store: [
      { key: 'stores', label: '统计门店', value: `${rows.length}`, trend: '全部', up: true, color: '#13c2c2', spark: [8, 8, 8, 8, 8, 8, 8] },
      { key: 'revenue', label: '门店营业额', value: formatCurrency(revenueTotal || scale(986400, query)), trend: '+6.4%', up: true, color: '#1677ff', spark: [12, 14, 13, 16, 17, 18, 20] },
      { key: 'achievement', label: '平均达成率', value: '87.6%', trend: '+2.1%', up: true, color: '#722ed1', spark: [10, 11, 12, 12, 13, 14, 15] },
      { key: 'score', label: '平均评分', value: '4.6', trend: '+0.1', up: true, color: '#faad14', spark: [4.4, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6] },
    ],
    product: [
      { key: 'sku', label: '在售 SKU', value: `${rows.length}`, trend: '全部', up: true, color: '#13c2c2', spark: [6, 6, 7, 7, 8, 8, 8] },
      { key: 'salesQty', label: '总销量', value: `${ordersTotal || scale(3680, query)}`, trend: '+9.3%', up: true, color: '#1677ff', spark: [10, 12, 13, 15, 16, 18, 20] },
      { key: 'salesAmount', label: '总销售额', value: formatCurrency(revenueTotal || scale(286400, query)), trend: '+7.8%', up: true, color: '#722ed1', spark: [11, 13, 14, 15, 17, 18, 19] },
      { key: 'grossRate', label: '综合毛利率', value: '56.8%', trend: '+0.6%', up: true, color: '#faad14', spark: [54, 55, 55, 56, 56, 57, 57] },
    ],
    channel: [
      { key: 'channels', label: '渠道数', value: `${rows.length}`, trend: '全部', up: true, color: '#13c2c2', spark: [4, 4, 4, 4, 4, 4, 4] },
      { key: 'revenue', label: '渠道营业额', value: formatCurrency(revenueTotal || scale(856200, query)), trend: '+6.9%', up: true, color: '#1677ff', spark: [12, 13, 14, 15, 16, 17, 18] },
      { key: 'orders', label: '渠道订单', value: `${ordersTotal || scale(12680, query)}`, trend: '+4.8%', up: true, color: '#722ed1', spark: [10, 11, 12, 13, 14, 15, 16] },
      { key: 'avgOrder', label: '渠道客单价', value: `¥ ${(67.5).toFixed(1)}`, trend: '+0.8%', up: true, color: '#faad14', spark: [64, 65, 66, 66, 67, 67, 68] },
    ],
  }

  return presets[reportId] ?? presets.daily
}

function buildChart(reportId, query, rows) {
  if (reportId === 'daily') {
    return {
      categories: rows.slice(-7).map((row) => row.date.slice(5)),
      series: [
        { name: '营业额', data: rows.slice(-7).map((row) => row.revenueRaw) },
        { name: '订单数', data: rows.slice(-7).map((row) => row.orders) },
      ],
    }
  }
  if (reportId === 'store' || reportId === 'product') {
    return {
      categories: rows.slice(0, 6).map((row) => row.storeName ?? row.productName),
      series: [{ name: '营业额', data: rows.slice(0, 6).map((row) => row.revenueRaw ?? row.salesAmountRaw ?? 0) }],
    }
  }
  if (reportId === 'channel') {
    return {
      categories: rows.map((row) => row.channelName),
      series: [{ name: '占比', data: rows.map((row) => Number.parseFloat(row.share)) }],
    }
  }
  return {
    categories: rows.slice(0, 6).map((row) => row.segment ?? row.couponName ?? row.staffName ?? row.materialName ?? '-'),
    series: [{ name: '指标', data: rows.slice(0, 6).map((row) => row.memberCount ?? row.redeemed ?? row.conversion ?? row.lossQty ?? 0) }],
  }
}

export async function mockFetchReport(query) {
  await delay()

  if (query.reportId === 'external') {
    return {
      external: true,
      metrics: [],
      chart: null,
      rows: [],
      total: 0,
    }
  }

  const builder = ROW_BUILDERS[query.reportId] ?? buildDailyRows
  const allRows = builder(query)
  const { rows, total } = paginateRows(allRows, query.page, query.pageSize)

  return {
    external: false,
    metrics: buildMetrics(query.reportId, query, allRows),
    chart: buildChart(query.reportId, query, allRows),
    rows,
    total,
  }
}

export async function mockCreateExportTask(query) {
  await delay(500)
  return {
    id: `export-${Date.now()}`,
    reportId: query.reportId,
    status: 'processing',
    createdAt: new Date().toISOString(),
    message: '导出任务已创建，正在生成文件…',
  }
}
