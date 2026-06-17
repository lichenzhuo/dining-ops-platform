const CHANNEL_META = [
  { key: 'pos', name: '堂食 POS', color: '#13c2c2', weight: 0.42 },
  { key: 'meituan', name: '美团外卖', color: '#1677ff', weight: 0.26 },
  { key: 'douyin', name: '抖音团购', color: '#722ed1', weight: 0.18 },
  { key: 'eleme', name: '饿了么', color: '#faad14', weight: 0.14 },
]

const WEEK_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashSeed(text) {
  return text.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
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
  const activityFactor =
    query.activityType === 'all'
      ? 1
      : query.activityType === 'member'
        ? 1.08
        : query.activityType === 'discount'
          ? 0.94
          : 1.05
  return Math.round(base * channelFactor * storeFactor * activityFactor * factor)
}

function formatCurrency(value) {
  return `¥ ${value.toLocaleString('zh-CN')}`
}

function buildTrend(query) {
  const labels =
    query.trendRange === '7d'
      ? WEEK_LABELS
      : Array.from({ length: 30 }, (_, index) => `${index + 1}日`)
  const seed = hashSeed(`${query.region}-${query.store}-${query.trendRange}`)

  return labels.map((label, index) => {
    const wave = Math.sin((index + seed) * 0.65) * 0.12 + 1
    const revenue = scale(168000, query, wave * (0.88 + index * 0.018))
    const orders = scale(2480, query, wave * (0.9 + index * 0.015))
    return { label, revenue, orders }
  })
}

function buildChannels(query, totalRevenue) {
  const list = CHANNEL_META.filter((item) => query.channel === 'all' || query.channel === item.key)
  const weightSum = list.reduce((sum, item) => sum + item.weight, 0)

  return list.map((item) => {
    const percent = Math.round((item.weight / weightSum) * 1000) / 10
    return {
      name: item.name,
      percent,
      amount: Math.round(totalRevenue * (item.weight / weightSum)),
      color: item.color,
    }
  })
}

export async function mockFetchDashboard(query) {
  await delay()

  const revenue = scale(1286420, query)
  const netReceipt = scale(1152300, query)
  const orders = scale(18642, query)
  const avgOrder = Math.round((revenue / orders) * 10) / 10
  const grossMargin = 62.4 + (hashSeed(query.region) % 3) * 0.2
  const repurchase = 38.6 + (hashSeed(query.brand) % 4) * 0.3
  const trend = buildTrend(query)
  const channels = buildChannels(query, revenue)
  const alertCount = query.store === '全部门店' ? 3 : 1

  return {
    diagnosis: {
      title: '今日经营诊断',
      summary: `整体营业额较昨日增长 ${((hashSeed(query.region) % 5) + 6).toFixed(1)}%，${query.region}表现突出；${alertCount} 家门店存在库存与退款异常，建议优先处理。`,
      tags: [
        { label: `营收 +${((hashSeed(query.brand) % 4) + 6).toFixed(1)}%`, tone: 'up' },
        { label: `异常 ${alertCount} 项`, tone: 'warn' },
        { label: 'AI 建议 3 条', tone: 'ai' },
      ],
    },
    kpis: [
      {
        key: 'revenue',
        label: '今日营业额',
        value: formatCurrency(revenue),
        trend: '+8.2%',
        up: true,
        color: '#13c2c2',
        spark: trend.slice(-7).map((item) => item.revenue),
      },
      {
        key: 'netReceipt',
        label: '实收金额',
        value: formatCurrency(netReceipt),
        trend: '+6.5%',
        up: true,
        color: '#1677ff',
        spark: trend.slice(-7).map((item) => item.revenue * 0.92),
      },
      {
        key: 'orders',
        label: '订单数',
        value: orders.toLocaleString('zh-CN'),
        trend: '+4.1%',
        up: true,
        color: '#52c41a',
        spark: trend.slice(-7).map((item) => item.orders),
      },
      {
        key: 'avgOrder',
        label: '客单价',
        value: `¥ ${avgOrder.toFixed(1)}`,
        trend: '+1.2%',
        up: true,
        color: '#722ed1',
        spark: trend.slice(-7).map((item) => item.revenue / item.orders),
      },
      {
        key: 'grossMargin',
        label: '毛利率',
        value: `${grossMargin.toFixed(1)}%`,
        trend: '-0.3%',
        up: false,
        color: '#faad14',
        spark: [62, 64, 60, 63, 59, 61, grossMargin],
      },
      {
        key: 'repurchase',
        label: '会员复购率',
        value: `${repurchase.toFixed(1)}%`,
        trend: '+2.8%',
        up: true,
        color: '#eb2f96',
        spark: [30, 33, 31, 36, 34, 37, repurchase],
      },
    ],
    trend,
    channels,
    avgOrderValue: {
      value: avgOrder,
      unit: '元 / 单',
      change: '+1.2%',
      up: true,
    },
    aiSuggestions: [
      `${query.region}午市套餐转化率偏低，建议推送「双人套餐 +8 元券」。`,
      `${alertCount} 家门店库存预警，建议触发补货审批流程。`,
      '员工推广 TOP 门店可复用「转发话术模板 A」。',
    ],
    storeRank: [
      { name: '上海南京路旗舰店', value: scale(186420, query), rate: 100 },
      { name: '杭州西湖印象店', value: scale(162300, query, 0.92), rate: 87 },
      { name: '南京新街口店', value: scale(148900, query, 0.84), rate: 80 },
      { name: '苏州观前街店', value: scale(132600, query, 0.76), rate: 71 },
      { name: '宁波天一广场店', value: scale(118400, query, 0.68), rate: 63 },
    ],
    alerts:
      query.store === '全部门店'
        ? [
            {
              store: '上海南京路店',
              type: '库存预警',
              level: 'danger',
              desc: '牛肉库存低于安全值',
              time: '10:24',
            },
            {
              store: '杭州西湖店',
              type: '退款异常',
              level: 'warning',
              desc: '退款率 5.2% 超阈值',
              time: '09:58',
            },
            {
              store: '南京新街口店',
              type: '差评风险',
              level: 'warning',
              desc: '近 1 小时差评 3 条',
              time: '09:30',
            },
            {
              store: '苏州观前街店',
              type: '低效门店',
              level: 'info',
              desc: '午市客流低于预期',
              time: '09:12',
            },
          ]
        : [
            {
              store: query.store,
              type: '库存预警',
              level: 'warning',
              desc: '部分原料库存接近安全值',
              time: '10:24',
            },
          ],
    approvals: [
      { title: '双人午市套餐活动', applicant: '王晓敏', type: '营销活动', status: '待审批' },
      { title: `门店补货申请 · ${query.region}`, applicant: '李建国', type: '库存补货', status: '待审批' },
      { title: '小红书种草内容 ×5', applicant: 'AI 营销助手', type: '内容审批', status: '待审批' },
      { title: '会员日满减预算调整', applicant: '陈雪', type: '预算审批', status: '待审批' },
    ],
  }
}
