import { GEO_HUB, GEO_PROVINCES, GEO_STORES } from '@/constants/geo'

function delay(ms = 300) {
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
  return `¥ ${value.toLocaleString('zh-CN')}`
}

export async function mockFetchGeoVisualization(query) {
  await delay()

  const regions = GEO_PROVINCES.map((name) => ({
    name,
    value: scale(
      name === '上海市'
        ? 980000
        : name === '浙江省'
          ? 820000
          : name === '江苏省'
            ? 760000
            : 360000,
      query,
    ),
    orders: scale(name === '上海市' ? 12800 : 9600, query),
  }))

  const stores = GEO_STORES.map((store) => ({
    name: store.name,
    lng: store.lng,
    lat: store.lat,
    province: store.province,
    revenue: formatCurrency(scale(86000 + (hashSeed(store.name) % 42000), query)),
    orders: scale(860 + (hashSeed(store.name) % 420), query),
    value: scale(540 + (hashSeed(store.name) % 420), query),
  }))

  return {
    hub: GEO_HUB,
    regions,
    stores,
    summary: {
      provinceCount: regions.length,
      storeCount: stores.length,
      totalRevenue: formatCurrency(regions.reduce((sum, item) => sum + item.value, 0)),
    },
  }
}
