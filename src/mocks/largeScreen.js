import { GEO_HUB, GEO_PROVINCES, GEO_STORES } from '@/constants/geo'

function delay(ms = 280) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashSeed(text) {
  return `${text}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function scale(base, query, factor = 1) {
  const seed = hashSeed(`${query.brand}-${query.region}-${query.store}`)
  const regionFactor = query.region === '华东区' ? 1 : query.region === '华南区' ? 0.86 : 0.92
  const storeFactor = query.store === '全部门店' ? 1 : 0.38
  return Math.round(base * regionFactor * storeFactor * factor)
}

function formatCurrency(value) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`
  }
  return value.toLocaleString('zh-CN')
}

function formatTime(date = new Date()) {
  return date.toLocaleString('zh-CN', { hour12: false })
}

function buildGeoMapData(query) {
  const provinceValues = {
    上海市: scale(980000, query),
    浙江省: scale(820000, query),
    江苏省: scale(760000, query),
    安徽省: scale(360000, query),
  }

  return {
    hub: GEO_HUB,
    regions: GEO_PROVINCES.map((name) => ({ name, value: provinceValues[name] ?? scale(420000, query) })),
    stores: GEO_STORES.map((store) => ({
      name: store.name,
      lng: store.lng,
      lat: store.lat,
      province: store.province,
      value: scale(540 + (hashSeed(store.name) % 420), query),
    })),
    regionCards: [
      { name: '华东一区', revenue: formatCurrency(scale(1280000, query)), orders: scale(16800, query) },
      { name: '华东二区', revenue: formatCurrency(scale(980000, query)), orders: scale(12600, query) },
      { name: '华南联动', revenue: formatCurrency(scale(760000, query)), orders: scale(9800, query) },
    ],
  }
}

export async function mockFetchLargeScreen(query) {
  await delay()

  const revenue = scale(2864200, query)
  const orders = scale(38640, query)
  const customers = scale(31280, query)

  return {
    syncTime: formatTime(),
    healthStatus: 'healthy',
    alertCount: scale(12, query, 1),
    kpis: [
      { key: 'revenue', label: '营业额', value: formatCurrency(revenue), unit: '元', trend: '+8.6%', up: true },
      { key: 'net', label: '实收', value: formatCurrency(scale(2568000, query)), unit: '元', trend: '+7.2%', up: true },
      { key: 'orders', label: '订单', value: `${orders}`, unit: '单', trend: '+5.4%', up: true },
      { key: 'customers', label: '客流', value: `${customers}`, unit: '人', trend: '+3.8%', up: true },
      { key: 'avgOrder', label: '客单价', value: `${(revenue / orders).toFixed(1)}`, unit: '元', trend: '-0.6%', up: false },
      { key: 'gross', label: '毛利率', value: '58.6', unit: '%', trend: '+0.4%', up: true },
      { key: 'coupon', label: '卡券核销', value: '32.4', unit: '%', trend: '+2.1%', up: true },
      { key: 'roi', label: '活动 ROI', value: '3.8', unit: '', trend: '+0.3', up: true },
    ],
    diagnosis: {
      title: '今日经营诊断',
      summary: `${query.region}整体经营平稳，堂食 POS 与美团外卖贡献主要增量，会员复购率高于上周同期。`,
      highlights: ['高峰时段订单集中 11:30-13:30', '3 家门店达成率低于 80%', '库存损耗集中在 2 个 SKU'],
    },
    leftAlerts: {
      lowStores: [
        { name: '无锡崇安寺店', achievement: '76%', reason: '午市客流不足' },
        { name: '合肥淮河路店', achievement: '79%', reason: '活动转化偏低' },
        { name: '南京新街口店', achievement: '81%', reason: '差评率上升' },
      ],
      inventoryRisks: [
        { name: '牛肉', level: '高', stores: 3 },
        { name: '蔬菜包', level: '中', stores: 2 },
      ],
      badReviews: [
        { store: '南京新街口店', count: 4, topic: '出餐速度' },
        { store: '苏州观前街店', count: 2, topic: '服务态度' },
      ],
      refunds: [
        { store: '杭州西湖店', amount: '¥ 860', reason: '漏配' },
        { store: '上海陆家嘴店', amount: '¥ 420', reason: '超时' },
      ],
    },
    map: buildGeoMapData(query),
    trend: {
      hours: Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`),
      orders: Array.from({ length: 24 }, (_, hour) =>
        scale(120 + Math.sin((hour - 6) * 0.45) * 80 + (hour > 10 && hour < 14 ? 160 : 0), query),
      ),
      revenue: Array.from({ length: 24 }, (_, hour) =>
        scale(8600 + Math.sin((hour - 6) * 0.45) * 4200 + (hour > 10 && hour < 14 ? 8600 : 0), query),
      ),
    },
    rightPanel: {
      actions: ['华东区午市加配 2 名收银', '推送会员复购券至 3 家低效门店', '抖音团购素材更新'],
      alerts: [
        { level: 'danger', text: '南京新街口店库存牛肉低于安全线' },
        { level: 'warning', text: '美团外卖 12:00-13:00 出餐超时率 8.6%' },
        { level: 'info', text: '会员日活动核销进度 68%' },
      ],
      tasks: [
        { name: '午市备餐检查', progress: 92 },
        { name: '差评回访', progress: 68 },
        { name: '新品培训', progress: 54 },
      ],
      staffRank: [
        { name: '陈导购', store: '上海南京路店', conversion: 18 },
        { name: '林店员', store: '杭州西湖店', conversion: 16 },
        { name: '周收银', store: '南京新街口店', conversion: 14 },
      ],
      aiActions: ['建议对低效门店追加满减券', '推荐复制杭州西湖店午市动线', '生成抖音团购话术 3 条'],
    },
    pipeline: [
      { key: 'pos', label: 'POS', status: 'online' },
      { key: 'waimai', label: '外卖', status: 'online' },
      { key: 'meituan', label: '美团', status: 'online' },
      { key: 'douyin', label: '抖音', status: 'warn' },
      { key: 'crm', label: 'CRM', status: 'online' },
      { key: 'inventory', label: '库存', status: 'online' },
      { key: 'finance', label: '财务', status: 'online' },
      { key: 'materials', label: '素材库', status: 'online' },
    ],
  }
}
